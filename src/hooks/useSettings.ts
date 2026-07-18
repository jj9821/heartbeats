"use client";

import { useAuth } from "@/context/AuthContext";
import { updateUserSettings } from "@/lib/database";
import { UserSettings } from "@/types";
import { toast } from "sonner";

/**
 * Hook for reading and updating user settings.
 * Settings are stored on the Firestore user profile document.
 */
export function useSettings() {
  const { profile, refreshProfile } = useAuth();

  const settings = profile?.settings;

  const updateSetting = async (update: Partial<UserSettings>) => {
    if (!profile) return;
    try {
      await updateUserSettings(profile.uid, update);
      await refreshProfile();
      toast.success("Settings updated");
    } catch (err) {
      console.error("Failed to update settings:", err);
      toast.error("Failed to update settings");
    }
  };

  return { settings, updateSetting };
}
