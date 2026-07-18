"use client";

import { useEffect, useState } from "react";
import { listenForHeartbeats } from "@/lib/database";
import { Signal } from "@/types";
import { useAuth } from "@/context/AuthContext";

/**
 * Subscribe to real-time signals between the user and their partner.
 */
export function useSignals(limitCount: number = 50) {
  const { profile } = useAuth();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.uid || !profile?.partnerId) {
      setSignals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = listenForHeartbeats(
      profile.uid,
      profile.partnerId,
      (sigs) => {
        setSignals(sigs);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [profile?.uid, profile?.partnerId, limitCount]);

  return { signals, loading };
}
