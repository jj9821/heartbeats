"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/hooks/useSettings";
import { useTheme } from "@/context/ThemeContext";
import { unpairUsers } from "@/lib/database";
import { Card } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { PageTransition } from "@/components/PageTransition";
import { Avatar } from "@/components/ui/Avatar";
import { Bell, Moon, Clock, UserX, LogOut, Pencil } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { profile, signOut, refreshProfile } = useAuth();
  const { settings, updateSetting } = useSettings();
  const { isDark, themeMode, setThemeMode } = useTheme();
  const router = useRouter();
  const [nickname, setNickname] = useState(settings?.nickname || "");
  const [editingNickname, setEditingNickname] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);

  const saveNickname = async () => {
    await updateSetting({ nickname });
    setEditingNickname(false);
  };

  const handleDisconnect = async () => {
    if (!profile?.partnerId) return;
    try {
      await unpairUsers(profile.uid, profile.partnerId);
      await refreshProfile();
      toast.success("Partner disconnected");
      router.replace("/pair");
    } catch {
      toast.error("Failed to disconnect");
    }
    setShowDisconnect(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  return (
    <PageTransition>
      <div className="px-6 pt-8 max-w-lg mx-auto pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h1>
        </motion.div>

        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="flex items-center gap-4 mb-4">
            <Avatar src={profile?.photo || null} alt={profile?.name || "User"} size="lg" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800 dark:text-white truncate">{profile?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{profile?.email}</p>
            </div>
          </Card>
        </motion.div>

        {/* Nickname */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nickname</span>
              </div>
              {!editingNickname && (
                <button onClick={() => setEditingNickname(true)} className="text-xs text-pink-500 cursor-pointer">Edit</button>
              )}
            </div>
            {editingNickname ? (
              <div className="flex gap-2">
                <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400/50"
                  placeholder="Enter nickname" />
                <Button size="sm" onClick={saveNickname}>Save</Button>
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">{settings?.nickname || "Not set"}</p>
            )}
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="mb-4 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Bell className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Notifications</span>
            </div>
            <Toggle checked={settings?.notificationsEnabled ?? true} onChange={(v) => updateSetting({ notificationsEnabled: v })}
              label="Push Notifications" id="toggle-notifications" />
            <Toggle checked={settings?.quietHoursEnabled ?? false} onChange={(v) => updateSetting({ quietHoursEnabled: v })}
              label="Quiet Hours" id="toggle-quiet-hours" />
            {settings?.quietHoursEnabled && (
              <div className="flex items-center gap-2 pl-6">
                <Clock className="w-4 h-4 text-gray-400" />
                <input type="time" value={settings?.quietHoursStart || "22:00"}
                  onChange={(e) => updateSetting({ quietHoursStart: e.target.value })}
                  className="px-2 py-1 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-700 dark:text-gray-300" />
                <span className="text-gray-400 text-sm">to</span>
                <input type="time" value={settings?.quietHoursEnd || "07:00"}
                  onChange={(e) => updateSetting({ quietHoursEnd: e.target.value })}
                  className="px-2 py-1 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-700 dark:text-gray-300" />
              </div>
            )}
          </Card>
        </motion.div>

        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Moon className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Appearance</span>
            </div>
            <Toggle checked={isDark} onChange={(v) => setThemeMode(v)} label="Dark Mode" id="toggle-dark-mode" />
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="mb-4 space-y-3">
            {profile?.partnerId && (
              <>
                {showDisconnect ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Are you sure? This will disconnect your partner.</p>
                    <div className="flex gap-2">
                      <Button variant="danger" size="sm" onClick={handleDisconnect}>
                        <UserX className="w-4 h-4" /> Confirm
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setShowDisconnect(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="danger" size="sm" onClick={() => setShowDisconnect(true)} className="w-full">
                    <UserX className="w-4 h-4" /> Disconnect Partner
                  </Button>
                )}
              </>
            )}
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
