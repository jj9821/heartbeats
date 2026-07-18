/**
 * Supabase Database Operations
 *
 * Replaces firestore.ts completely.
 */

import { supabase } from "./supabase";
import {
  UserProfile,
  Signal,
  CreateSignalData,
  UserSettings,
  DEFAULT_USER_SETTINGS,
  createTimestamp,
} from "@/types";
import { generateInviteCode } from "./utils";

// =============================================================================
// Helper Mapper & Logging Functions
// =============================================================================

export function mapUserProfile(dbUser: any): UserProfile | null {
  if (!dbUser) return null;
  return {
    uid: dbUser.id,
    name: dbUser.name || "",
    email: dbUser.email || "",
    photo: dbUser.avatar || "",
    partnerId: dbUser.partner_id || null,
    fcmToken: dbUser.fcm_token || null,
    inviteCode: dbUser.invite_code || "",
    createdAt: createTimestamp(dbUser.created_at),
    lastSeen: createTimestamp(dbUser.last_seen),
    online: dbUser.online ?? false,
    settings: dbUser.settings || DEFAULT_USER_SETTINGS,
  };
}

function mapHeartbeat(dbHb: any): Signal {
  return {
    id: dbHb.id,
    senderId: dbHb.sender,
    senderName: dbHb.sender_profile?.name || "Partner",
    receiverId: dbHb.receiver,
    timestamp: createTimestamp(dbHb.created_at),
    message: dbHb.message || "",
    type: "miss",
  };
}

function logError(label: string, error: any) {
  console.error(`${label} (raw error):`, error);
  try {
    const stringified = JSON.stringify(error, Object.getOwnPropertyNames(error || {}), 2);
    console.error(`${label} (stringified):`, stringified);
  } catch (e: any) {
    console.error(`${label} (failed to stringify):`, e?.message);
  }
}

// =============================================================================
// User Operations
// =============================================================================

/**
 * Get a user profile by ID.
 */
export async function getUserProfile(id: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    logError("Error getting user profile", error);
    return null;
  }

  return mapUserProfile(data);
}

/**
 * Create a new user profile.
 */
export async function createUserProfile(user: {
  id: string;
  name: string;
  email: string;
  avatar: string;
}): Promise<UserProfile> {
  const profile = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    partner_id: null,
    fcm_token: null,
    invite_code: generateInviteCode(),
    created_at: new Date().toISOString(),
    last_seen: new Date().toISOString(),
    online: true,
    settings: DEFAULT_USER_SETTINGS,
  };

  const { data, error } = await supabase
    .from("users")
    .insert(profile)
    .select()
    .single();

  if (error) {
    logError("Error creating user profile", error);
    throw error;
  }

  return mapUserProfile(data)!;
}

/**
 * Update specific fields on a user profile.
 */
export async function updateUserProfile(
  id: string,
  data: Partial<UserProfile>
): Promise<void> {
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.photo !== undefined) updateData.avatar = data.photo;
  if (data.partnerId !== undefined) updateData.partner_id = data.partnerId;
  if (data.fcmToken !== undefined) updateData.fcm_token = data.fcmToken;
  if (data.inviteCode !== undefined) updateData.invite_code = data.inviteCode;
  if (data.online !== undefined) updateData.online = data.online;
  if (data.settings !== undefined) updateData.settings = data.settings;
  if (data.lastSeen !== undefined) {
    updateData.last_seen = new Date().toISOString();
  }

  const { error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", id);

  if (error) {
    logError("Error updating user profile", error);
    throw error;
  }
}

/**
 * Get a partner profile.
 */
export async function getPartner(partnerId: string): Promise<UserProfile | null> {
  return getUserProfile(partnerId);
}

/**
 * Update user settings.
 */
export async function updateUserSettings(
  uid: string,
  settings: Partial<UserSettings>
): Promise<void> {
  const { data: dbUser, error: getErr } = await supabase
    .from("users")
    .select("settings")
    .eq("id", uid)
    .single();

  if (getErr) {
    logError("Error reading user settings", getErr);
    throw getErr;
  }

  const currentSettings = dbUser.settings || DEFAULT_USER_SETTINGS;
  const mergedSettings = { ...currentSettings, ...settings };

  const { error } = await supabase
    .from("users")
    .update({ settings: mergedSettings })
    .eq("id", uid);

  if (error) {
    logError("Error updating user settings", error);
    throw error;
  }
}

/**
 * Find a user by their invite code (for pairing).
 */
export async function findUserByInviteCode(
  code: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("invite_code", code.toUpperCase())
    .maybeSingle();

  if (error) {
    logError("Error finding user by invite code", error);
    return null;
  }

  return mapUserProfile(data);
}

/**
 * Pair two users together.
 */
export async function pairUsers(
  userId: string,
  partnerId: string
): Promise<void> {
  const { error: err1 } = await supabase
    .from("users")
    .update({ partner_id: partnerId })
    .eq("id", userId);

  if (err1) throw err1;

  const { error: err2 } = await supabase
    .from("users")
    .update({ partner_id: userId })
    .eq("id", partnerId);

  if (err2) throw err2;
}

/**
 * Unpair two users.
 */
export async function unpairUsers(
  userId: string,
  partnerId: string
): Promise<void> {
  const { error: err1 } = await supabase
    .from("users")
    .update({ partner_id: null })
    .eq("id", userId);

  if (err1) throw err1;

  const { error: err2 } = await supabase
    .from("users")
    .update({ partner_id: null })
    .eq("id", partnerId);

  if (err2) throw err2;
}

/**
 * Update online/offline status and lastSeen timestamp.
 */
export async function updateOnlineStatus(
  uid: string,
  online: boolean
): Promise<void> {
  const { error } = await supabase
    .from("users")
    .update({
      online,
      last_seen: new Date().toISOString(),
    })
    .eq("id", uid);

  if (error) {
    logError("Error updating online status", error);
    throw error;
  }
}

/**
 * Subscribe to a user's real-time profile changes.
 */
export function subscribeToUser(
  uid: string,
  callback: (user: UserProfile | null) => void
): () => void {
  getUserProfile(uid).then(callback).catch(console.error);

  const channel = supabase
    .channel(`user-profile-${uid}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "users",
        filter: `id=eq.${uid}`,
      },
      (payload: any) => {
        callback(mapUserProfile(payload.new));
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// =============================================================================
// Heartbeat Operations
// =============================================================================

/**
 * Create a new heartbeat signal.
 */
export async function createHeartbeat(
  sender: string,
  receiver: string,
  message: string
): Promise<string> {
  const { data, error } = await supabase
    .from("heartbeats")
    .insert({
      sender,
      receiver,
      message,
      seen: false,
      created_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    logError("Error creating heartbeat", error);
    throw error;
  }

  return data.id;
}

/**
 * Subscribe to heartbeats between two users.
 */
export function listenForHeartbeats(
  userId: string,
  partnerId: string,
  callback: (heartbeats: any[]) => void
): () => void {
  const fetchAndEmit = async () => {
    const { data, error } = await supabase
      .from("heartbeats")
      .select("*, sender_profile:users!sender(name)")
      .or(`sender.eq.${userId},sender.eq.${partnerId}`)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      logError("Error fetching heartbeats", error);
      return;
    }

    if (data) {
      const filtered = data
        .filter(
          (d: any) =>
            (d.sender === userId && d.receiver === partnerId) ||
            (d.sender === partnerId && d.receiver === userId)
        )
        .map(mapHeartbeat);
      callback(filtered);
    }
  };

  fetchAndEmit();

  const channel = supabase
    .channel(`heartbeats-${userId}-${partnerId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "heartbeats",
      },
      (payload: any) => {
        const newHb = payload.new;
        const isRelevant =
          (newHb.sender === userId && newHb.receiver === partnerId) ||
          (newHb.sender === partnerId && newHb.receiver === userId);
        if (isRelevant) {
          fetchAndEmit();
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
