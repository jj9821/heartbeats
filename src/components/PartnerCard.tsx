/**
 * PartnerCard — Shows partner info with glass effect
 */
"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { UserProfile, ConnectionStatusType } from "@/types";
import { motion } from "motion/react";

interface PartnerCardProps {
  partner: UserProfile;
}

const statusVariantMap: Record<ConnectionStatusType, "success" | "muted" | "warning"> = {
  online: "success",
  offline: "muted",
  "last-seen": "warning",
};

export function PartnerCard({ partner }: PartnerCardProps) {
  const { status, label } = useOnlineStatus(partner);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <Card className="flex items-center gap-4">
        <Avatar
          src={partner.photo}
          alt={partner.settings?.nickname || partner.name}
          size="lg"
          online={partner.online}
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate">
            {partner.settings?.nickname || partner.name}
          </h2>
          <Badge variant={statusVariantMap[status]}>{label}</Badge>
        </div>
      </Card>
    </motion.div>
  );
}
