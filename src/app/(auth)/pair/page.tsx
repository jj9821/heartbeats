/**
 * Pair Page — Connect with your partner
 *
 * Two sections:
 * 1. Your unique invite code (share this with your partner)
 * 2. Enter your partner's code to pair
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Heart, Copy, Check, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageTransition } from "@/components/PageTransition";
import { toast } from "sonner";

export default function PairPage() {
  const { profile, refreshProfile } = useAuth();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    if (!profile?.inviteCode) return;
    try {
      await navigator.clipboard.writeText(profile.inviteCode);
      setCopied(true);
      toast.success("Code copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy code");
    }
  };

  const handlePair = async () => {
    if (!code.trim() || code.trim().length < 6) {
      toast.error("Please enter a valid 6-character code");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/pair", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-uid": profile?.uid || "",
        },
        body: JSON.stringify({ inviteCode: code.trim().toUpperCase() }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Connected! ❤️", {
          description: `You're now paired with ${data.partnerName}`,
        });
        await refreshProfile();
        router.replace("/home");
      } else {
        toast.error(data.error || "Pairing failed");
      }
    } catch (err) {
      console.error("Pairing error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col items-center px-6 pt-12 max-w-sm mx-auto">
        {/* Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center shadow-lg shadow-pink-500/25 mb-6"
        >
          <UserPlus className="w-8 h-8 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-gray-800 dark:text-white mb-2"
        >
          Connect Your Hearts
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8"
        >
          Share your code with your partner, or enter theirs to connect.
        </motion.p>

        {/* Your Invite Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full mb-6"
        >
          <Card className="text-center">
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
              Your Invite Code
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-mono font-bold tracking-[0.25em] text-gray-800 dark:text-white">
                {profile?.inviteCode || "------"}
              </span>
              <button
                onClick={copyCode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Copy invite code"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
              Send this code to your partner
            </p>
          </Card>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full mb-6">
          <div className="flex-1 h-px bg-gray-300/50 dark:bg-gray-700/50" />
          <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
          <div className="flex-1 h-px bg-gray-300/50 dark:bg-gray-700/50" />
        </div>

        {/* Enter Partner's Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full"
        >
          <Card>
            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 text-center">
              Enter Partner&apos;s Code
            </p>
            <input
              type="text"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))
              }
              placeholder="XXXXXX"
              maxLength={6}
              className="w-full text-center text-2xl font-mono font-bold tracking-[0.25em] py-3 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all"
              id="partner-code-input"
            />
            <Button
              onClick={handlePair}
              loading={loading}
              disabled={code.length < 6}
              size="lg"
              className="w-full mt-4"
              id="pair-button"
            >
              <Heart className="w-5 h-5 fill-white" />
              Connect Hearts
            </Button>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
