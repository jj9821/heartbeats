"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BottomNav } from "@/components/BottomNav";
import { Spinner } from "@/components/ui/Spinner";
import { onForegroundMessage } from "@/lib/messaging";
import { toast } from "sonner";
import { Heart } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [ready, setReady] = useState(false);

  // Authentication guard
  useEffect(() => {
    if (loading) return;

    if (!user) {
      window.location.replace("/");
      return;
    }

    if (profile && !profile.partnerId && pathname !== "/pair") {
      window.location.replace("/pair");
      return;
    }

    setReady(true);
  }, [loading, user, profile, pathname]);

  // Foreground notifications
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    (async () => {
      unsubscribe = await onForegroundMessage((payload) => {
        toast(payload.title, {
          description: payload.body,
          icon: (
            <Heart className="w-5 h-5 fill-pink-500 text-pink-500" />
          ),
          duration: 5000,
        });
      });
    })();

    return () => {
      unsubscribe?.();
    };
  }, []);

  if (loading || !ready) {
    return (
      <div className="flex min-h-dvh flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading your heartbeat...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="safe-area-top flex-1 pb-20">
        {children}
      </main>

      {profile?.partnerId && <BottomNav />}
    </div>
  );
}