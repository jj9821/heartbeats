"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import { signInWithGoogle, signOutUser } from "@/lib/auth";
import {
  getUserProfile,
  createUserProfile,
  updateOnlineStatus,
} from "@/lib/database";
import { requestAndSaveFCMToken } from "@/lib/messaging";
import { UserProfile } from "@/types";
import { toast } from "sonner";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => { },
  signOut: async () => { },
  refreshProfile: async () => { },
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (supabaseUser: User) => {
    let profileData = await getUserProfile(supabaseUser.id);

    if (!profileData) {
      profileData = await createUserProfile({
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.full_name ?? supabaseUser.user_metadata?.name ?? "User",
        email: supabaseUser.email ?? "",
        avatar: supabaseUser.user_metadata?.avatar_url ?? "",
      });
    }

    setProfile(profileData);

    try {
      await updateOnlineStatus(supabaseUser.id, true);
    } catch (err) {
      console.warn("Could not update online status:", err);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;

    try {
      const latest = await getUserProfile(user.id);
      setProfile(latest);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  // Auth State Listener
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then((res: any) => {
      if (!mounted) return;
      const initialUser = res.data?.session?.user ?? null;
      setUser(initialUser);
      if (initialUser) {
        loadProfile(initialUser).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        if (!mounted) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await loadProfile(currentUser);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  // Save FCM token and set up foreground message listener
  useEffect(() => {
    if (!user) return;

    requestAndSaveFCMToken(user.id).catch((err) =>
      console.warn("FCM setup failed:", err)
    );

    let unsubscribe: (() => void) | null = null;

    import("@/lib/messaging").then(({ onForegroundMessage }) => {
      onForegroundMessage((payload) => {
        toast.info(payload.title, {
          description: payload.body,
          icon: "❤️",
          duration: 5000,
        });
      }).then((unsub) => {
        unsubscribe = unsub;
      });
    }).catch((err) => {
      console.error("Failed to setup foreground listener:", err);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  // Visibility and unload handlers for online/offline status
  useEffect(() => {
    if (!user) return;

    const handleVisibility = () => {
      updateOnlineStatus(user.id, !document.hidden).catch(console.error);
    };

    const handleUnload = () => {
      updateOnlineStatus(user.id, false).catch(console.error);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
      window.removeEventListener(
        "beforeunload",
        handleUnload
      );
    };
  }, [user]);

  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Sign in failed:", err);
    }
  };

  const signOut = async () => {
    try {
      if (user) {
        await updateOnlineStatus(user.id, false);
      }

      await signOutUser();

      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}