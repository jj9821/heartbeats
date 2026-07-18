/**
 * Heartbeat PWA — TypeScript Type Definitions
 *
 * Central type definitions for the entire application.
 * All Firestore document shapes and app-level interfaces live here.
 */

export interface Timestamp {
  toMillis: () => number;
  toDate: () => Date;
  seconds: number;
  nanoseconds: number;
}

export function createTimestamp(dateInput?: Date | string | number | null): Timestamp {
  const date = dateInput ? new Date(dateInput) : new Date();
  const ms = date.getTime();
  return {
    toMillis: () => ms,
    toDate: () => date,
    seconds: Math.floor(ms / 1000),
    nanoseconds: (ms % 1000) * 1e6,
  };
}

// =============================================================================
// User
// =============================================================================

/** User settings stored as a sub-object on the user document */
export interface UserSettings {
  notificationsEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "22:00" format
  quietHoursEnd: string; // "07:00" format
  darkMode: boolean | "system";
  nickname: string;
}

/** Default settings for new users */
export const DEFAULT_USER_SETTINGS: UserSettings = {
  notificationsEnabled: true,
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
  darkMode: "system",
  nickname: "",
};

/** Firestore /users/{uid} document shape */
export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photo: string;
  partnerId: string | null;
  fcmToken: string | null;
  inviteCode: string;
  createdAt: Timestamp;
  lastSeen: Timestamp;
  online: boolean;
  settings: UserSettings;
}

// =============================================================================
// Signals
// =============================================================================

/** The type of signal — currently only 'miss', extensible later */
export type SignalType = "miss";

/** Firestore /signals/{id} document shape */
export interface Signal {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  timestamp: Timestamp;
  message: string;
  type: SignalType;
}

/** Data sent when creating a new signal (id and timestamp are server-generated) */
export interface CreateSignalData {
  senderId: string;
  senderName: string;
  receiverId: string;
  message: string;
  type: SignalType;
}

// =============================================================================
// Pairing
// =============================================================================

/** Request body for the /api/pair endpoint */
export interface PairRequest {
  inviteCode: string;
}

/** Response from the /api/pair endpoint */
export interface PairResponse {
  success: boolean;
  partnerName?: string;
  error?: string;
}

// =============================================================================
// Notifications
// =============================================================================

/** Request body for the /api/send-notification endpoint */
export interface SendNotificationRequest {
  receiverId: string;
  senderName: string;
  message?: string;
}

/** Response from the /api/send-notification endpoint */
export interface SendNotificationResponse {
  success: boolean;
  error?: string;
}

// =============================================================================
// Statistics
// =============================================================================

export interface Stats {
  totalSent: number;
  totalReceived: number;
  longestStreak: number;
  currentStreak: number;
  todayCount: number;
  weeklyData: DayData[];
  monthlyData: DayData[];
}

export interface DayData {
  date: string; // "Mon", "Tue", etc. or "Jul 1"
  sent: number;
  received: number;
}

// =============================================================================
// UI State
// =============================================================================

export type ConnectionStatusType = "online" | "offline" | "last-seen";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message?: string;
}
