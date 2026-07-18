/**
 * Firebase Messaging Service Worker
 */

// Import Firebase compat versions
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyCNqkh0TLQXURfGZHyJV9HcZYoNTlh8WeI",
  projectId: "heartbeat-7bbaa",
  messagingSenderId: "702029538345",
  appId: "1:702029538345:web:8be7fa5d9992206e6f6838",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message received:", payload);

  const notificationTitle = payload.notification?.title || "❤️ Someone misses you";
  const notificationOptions = {
    body: payload.notification?.body || "Open Heartbeat",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    vibrate: [200, 100, 200],
    data: { 
      url: "/home",
      heartbeatId: payload.data?.heartbeatId 
    },
    tag: "heartbeat-notification", // Avoid stacking multiple notifications
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click — focus or open app
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If app is already open, focus it and redirect to /home
        for (const client of clientList) {
          const clientUrl = new URL(client.url);
          // Check if same origin
          if (clientUrl.origin === self.location.origin && "focus" in client) {
            if ("navigate" in client) {
              client.navigate("/home");
            }
            return client.focus();
          }
        }
        // Otherwise, open a new window to root
        if (clients.openWindow) {
          return clients.openWindow("/");
        }
      })
  );
});
