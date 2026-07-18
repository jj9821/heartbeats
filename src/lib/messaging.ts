/**
 * Firebase Cloud Messaging (FCM) — Client-side utilities
 */

import { messaging, getToken, onMessage } from "./firebase";
import { saveDeviceToken } from "./database";

/**
 * Check if the browser supports Firebase Cloud Messaging.
 */
async function isMessagingSupported(): Promise<boolean> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    return false;
  }
  try {
    const { isSupported } = await import("firebase/messaging");
    return await isSupported();
  } catch (err) {
    return false;
  }
}

/**
 * Request notification permission and save the FCM token.
 */
export async function requestAndSaveFCMToken(
  uid: string
): Promise<string | null> {
  try {
    const supported = await isMessagingSupported();
    if (!supported || !messaging) {
      console.warn("FCM Push Notifications are not supported in this browser/environment.");
      return null;
    }

    // 1. Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Push notification permission denied.");
      return null;
    }

    // 2. Register FCM service worker
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      { scope: "/firebase-cloud-messaging-push-scope" }
    );

    // 3. Get FCM registration token
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error("Missing NEXT_PUBLIC_FIREBASE_VAPID_KEY environment variable.");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.warn("No FCM token generated.");
      return null;
    }

    // 4. Detect platform
    let platform = "web";
    if (navigator.userAgent.match(/Android/i)) {
      platform = "android";
    } else if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      platform = "ios";
    }

    // 5. Save/upsert token in Supabase
    await saveDeviceToken(uid, token, platform);
    return token;
  } catch (error) {
    console.error("Failed to request/save FCM token:", error);
    return null;
  }
}

/**
 * Listen for foreground notifications.
 */
export async function onForegroundMessage(
  callback: (payload: { title: string; body: string }) => void
): Promise<(() => void) | null> {
  try {
    const supported = await isMessagingSupported();
    if (!supported || !messaging) return null;

    return onMessage(messaging, (payload) => {
      const title = payload.notification?.title || "❤️ Someone misses you";
      const body = payload.notification?.body || "Open Heartbeat";
      callback({ title, body });
    });
  } catch (error) {
    console.error("Failed to register foreground message listener:", error);
    return null;
  }
}