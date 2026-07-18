/**
 * Firebase Cloud Messaging (FCM) — Client-side utilities
 */

import { messaging, getToken, onMessage } from "./firebase";
import { saveDeviceToken } from "./database";

/**
 * Check if Firebase Cloud Messaging is supported.
 */
async function isMessagingSupported(): Promise<boolean> {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window)
  ) {
    return false;
  }

  try {
    const { isSupported } = await import("firebase/messaging");
    return await isSupported();
  } catch {
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

    if (!supported) {
      console.warn("FCM is not supported in this browser.");
      return null;
    }

    if (!messaging) {
      console.error("Firebase Messaging is not initialized.");
      return null;
    }

    // Request notification permission
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("Notification permission denied.");
      return null;
    }

    // Register Firebase Messaging Service Worker
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    // Wait until the service worker becomes active
    await navigator.serviceWorker.ready;

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

    if (!vapidKey) {
      console.error("Missing NEXT_PUBLIC_FIREBASE_VAPID_KEY");
      return null;
    }

    // Generate FCM Token
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.warn("No FCM token returned.");
      return null;
    }

    // Detect platform
    let platform = "web";

    const ua = navigator.userAgent;

    if (/Android/i.test(ua)) {
      platform = "android";
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
      platform = "ios";
    }

    // Save token in Supabase
    await saveDeviceToken(uid, token, platform);

    console.log("FCM Token:", token);

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

    if (!supported || !messaging) {
      return null;
    }

    return onMessage(messaging, (payload) => {
      callback({
        title: payload.notification?.title ?? "❤️ Someone misses you",
        body: payload.notification?.body ?? "Open Heartbeat",
      });
    });
  } catch (error) {
    console.error("Failed to register foreground listener:", error);
    return null;
  }
}