/**
 * Client-side Firebase Initialization (FCM Only)
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, type Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let messagingInstance: Messaging | null = null;

if (typeof window !== "undefined") {
  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    messagingInstance = getMessaging(app);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

export const messaging = messagingInstance;
export { getToken, onMessage } from "firebase/messaging";
