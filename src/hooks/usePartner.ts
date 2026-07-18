"use client";

import { useEffect, useState } from "react";
import { subscribeToUser } from "@/lib/database";
import { UserProfile } from "@/types";
import { useAuth } from "@/context/AuthContext";

/**
 * Subscribe to the partner's real-time profile data.
 * Returns null if user has no partner.
 */
export function usePartner() {
  const { profile } = useAuth();
  const [partner, setPartner] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.partnerId) {
      setPartner(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = subscribeToUser(profile.partnerId, (p) => {
      setPartner(p);
      setLoading(false);
    });

    return () => unsub();
  }, [profile?.partnerId]);

  return { partner, loading };
}
