"use client";

import { UserProfile } from "@/types";
import { ConnectionStatusType } from "@/types";
import { formatLastSeen } from "@/lib/utils";

/**
 * Derive connection status from partner profile data.
 * The partner profile is already subscribed via usePartner() in real-time.
 */
export function useOnlineStatus(partner: UserProfile | null): {
  status: ConnectionStatusType;
  label: string;
} {
  if (!partner) {
    return { status: "offline", label: "Not connected" };
  }

  if (partner.online) {
    return { status: "online", label: "Online" };
  }

  if (partner.lastSeen) {
    return {
      status: "last-seen",
      label: `Last seen ${formatLastSeen(partner.lastSeen)}`,
    };
  }

  return { status: "offline", label: "Offline" };
}
