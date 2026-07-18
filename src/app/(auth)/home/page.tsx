/**
 * Home Page — The heart of the app
 *
 * Shows:
 * - Partner info card with online status
 * - Animated pulsing heart
 * - "I Miss You" button
 * - Floating hearts background
 */

"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePartner } from "@/hooks/usePartner";
import { HeartButton } from "@/components/HeartButton";
import { HeartPulse } from "@/components/HeartPulse";
import { FloatingHearts } from "@/components/FloatingHearts";
import { PartnerCard } from "@/components/PartnerCard";
import { PageTransition } from "@/components/PageTransition";
import { Spinner } from "@/components/ui/Spinner";
import { createHeartbeat } from "@/lib/database";
import { toast } from "sonner";

export default function HomePage() {
  const { profile } = useAuth();
  const { partner, loading } = usePartner();
  const [pulsing, setPulsing] = useState(false);
  const [burst, setBurst] = useState(false);

  const handleSendSignal = useCallback(async () => {
    if (!profile || !partner) return;

    // Optimistic: trigger animations immediately
    setPulsing(true);
    setBurst(true);

    try {
      // 1. Save signal to Supabase
      await createHeartbeat(
        profile.uid,
        partner.uid,
        ""
      );

      // 2. Send push notification via API route
      await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: profile.uid,
          receiverId: partner.uid,
          message: "",
        }),
      });

      toast.success("Signal sent ❤️", {
        description: `${partner.settings?.nickname || partner.name} will know you're thinking of them.`,
      });
    } catch (err) {
      console.error("Failed to send signal:", err);
      toast.error("Couldn't send your signal", {
        description: "Please try again.",
      });
    }

    // Reset animation states
    setTimeout(() => {
      setPulsing(false);
      setBurst(false);
    }, 1500);
  }, [profile, partner]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh] px-6">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Waiting for your partner to connect...
        </p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="relative flex flex-col items-center px-6 pt-8">
        <FloatingHearts burst={burst} />

        {/* Partner info */}
        <div className="w-full max-w-sm mb-12 relative z-10">
          <PartnerCard partner={partner} />
        </div>

        {/* Animated heart */}
        <div className="mb-10">
          <HeartPulse pulsing={pulsing} />
        </div>

        {/* I Miss You button */}
        <div className="relative z-10">
          <HeartButton onPress={handleSendSignal} />
        </div>
      </div>
    </PageTransition>
  );
}
