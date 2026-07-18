/**
 * API Route: Send Push Notification (FCM Server-side)
 *
 * POST /api/send-notification
 */

import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { getUserDeviceTokens, deleteDeviceToken } from "@/lib/database";

// Initialize Firebase Admin SDK
function initFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return;
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin credentials are not set in environment variables."
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { senderId, receiverId, message } = await request.json();

    if (!receiverId) {
      return NextResponse.json(
        { success: false, error: "Missing receiverId parameter." },
        { status: 400 }
      );
    }

    // 1. Fetch registered device tokens for receiver
    const tokens = await getUserDeviceTokens(receiverId);
    if (!tokens || tokens.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No device tokens registered for receiver. Push skipped.",
      });
    }

    // 2. Initialize Firebase Admin SDK
    initFirebaseAdmin();

    // 3. Send multicast FCM notification
    const payload = {
      tokens,
      notification: {
        title: "❤️ Someone is thinking about you",
        body: message || "Open Heartbeat",
      },
      data: {
        senderId: senderId || "",
        receiverId: receiverId || "",
        click_action: "/home",
      },
      android: {
        priority: "high" as const,
        notification: {
          icon: "stock_ticker_update",
          color: "#f43f5e",
        },
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title: "❤️ Someone is thinking about you",
              body: message || "Open Heartbeat",
            },
            sound: "default",
            badge: 1,
          },
        },
      },
    };

    const response = await admin.messaging().sendEachForMulticast(payload);

    // 4. Handle expired or invalid tokens automatically
    const tokensToDelete: string[] = [];
    response.responses.forEach((res, idx) => {
      if (!res.success && res.error) {
        const errCode = res.error.code;
        if (
          errCode === "messaging/invalid-registration-token" ||
          errCode === "messaging/registration-token-not-registered"
        ) {
          tokensToDelete.push(tokens[idx]);
        }
      }
    });

    if (tokensToDelete.length > 0) {
      console.log(`FCM purging ${tokensToDelete.length} invalid tokens...`);
      await Promise.all(tokensToDelete.map((token) => deleteDeviceToken(token)));
    }

    return NextResponse.json({
      success: true,
      sentCount: response.successCount,
      failureCount: response.failureCount,
    });
  } catch (error: any) {
    console.error("FCM delivery exception:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
