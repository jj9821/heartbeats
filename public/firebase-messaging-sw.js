/**
 * Firebase Messaging Service Worker
 *
 * This file MUST be in the /public directory and named exactly
 * "firebase-messaging-sw.js" for FCM to handle background push notifications.
 *
 * It runs in a separate thread from your app and receives push events
 * even when the app/browser tab is closed.
 *
 * IMPORTANT: Update the Firebase SDK version to match your installed version.
 * Check with: npm list firebase | head -n 2
 */

// Import Firebase libraries (compat versions required for service workers)
importScripts("https://www.gstatic.com/firebasejs/11.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.8.1/firebase-messaging-compat.js");

// Initialize Firebase in the service worker
// NOTE: Only the minimum config needed for messaging is required here
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",         // Replace with your actual key
  projectId: "YOUR_PROJECT_ID",  // Replace with your actual project ID
  messagingSenderId: "YOUR_SENDER_ID",  // Replace with your sender ID
  appId: "YOUR_APP_ID",          // Replace with your app ID
});

const messaging = firebase.messaging();

// Handle background messages (when app is not in focus)
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message received:", payload);

  const notificationTitle = payload.notification?.title || "❤️ Someone misses you";
  const notificationOptions = {
    body: payload.notification?.body || "Someone is thinking about you.",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    vibrate: [200, 100, 200],
    data: { url: "/" },
    tag: "heartbeat-notification", // Replaces existing notification instead of stacking
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click — open the app
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Open the app or focus existing tab
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url.includes("/") && "focus" in client) {
            return client.focus();
          }
        }
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow("/");
        }
      })
  );
});
