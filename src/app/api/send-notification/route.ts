/**
 * API Route: Send Push Notification (FCM)
 *
 * POST /api/send-notification
 */

import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import {
  getUserDeviceTokens,
  deleteDeviceToken,
} from "@/lib/database";

function initFirebaseAdmin() {
  if (admin.apps.length > 0) return;

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin credentials are missing."
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
        {
          success: false,
          error: "receiverId is required",
        },
        { status: 400 }
      );
    }

    initFirebaseAdmin();

    const tokens = await getUserDeviceTokens(receiverId);

    console.log("Receiver:", receiverId);
    console.log("Tokens:", tokens);

    if (!tokens || tokens.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Receiver has no registered device tokens.",
      });
    }

    const payload: admin.messaging.MulticastMessage = {
      tokens,

      notification: {
        title: "❤️ Someone is thinking about you",
        body: message || "Open Heartbeat",
      },

      data: {
        senderId: senderId ?? "",
        receiverId: receiverId ?? "",
        url: "/home",
      },

      webpush: {
        headers: {
          Urgency: "high",
        },

        notification: {
          title: "❤️ Someone is thinking about you",
          body: message || "Open Heartbeat",

          icon: "/icons/icon-192.png",
          badge: "/icons/badge-72.png",

          requireInteraction: true,

          vibrate: [200, 100, 200],

          data: {
            url: "/home",
          },
        },

        fcmOptions: {
          link: "/home",
        },
      },

      android: {
        priority: "high",

        notification: {
          channelId: "default",
          color: "#f43f5e",
          sound: "default",
          defaultSound: true,
          defaultVibrateTimings: true,
        },
      },

      apns: {
        headers: {
          "apns-push-type": "alert",
          "apns-priority": "10",
        },

        payload: {
          aps: {
            alert: {
              title: "❤️ Someone is thinking about you",
              body: message || "Open Heartbeat",
            },

            badge: 1,

            sound: "default",

            mutableContent: true,

            contentAvailable: true,
          },
        },
      },
    };

    const response =
      await admin.messaging().sendEachForMulticast(payload);

    console.log("FCM Response");
    console.log("Success:", response.successCount);
    console.log("Failure:", response.failureCount);

    const invalidTokens: string[] = [];

    response.responses.forEach((result, index) => {
      if (!result.success) {
        console.error(
          "FCM Error:",
          result.error?.code,
          result.error?.message
        );

        if (
          result.error?.code ===
          "messaging/invalid-registration-token" ||
          result.error?.code ===
          "messaging/registration-token-not-registered"
        ) {
          invalidTokens.push(tokens[index]);
        }
      }
    });

    if (invalidTokens.length > 0) {
      console.log("Removing invalid tokens...");

      await Promise.all(
        invalidTokens.map((token) =>
          deleteDeviceToken(token)
        )
      );
    }

    return NextResponse.json({
      success: true,
      sentCount: response.successCount,
      failureCount: response.failureCount,
      invalidTokensRemoved: invalidTokens.length,
    });
  } catch (err: any) {
    console.error("Push notification error:", err);

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}