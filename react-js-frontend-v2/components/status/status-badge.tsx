"use client";

import { Badge } from "@/components/ui/badge";
import { LucideIcon, CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getApplicationStatusConfig } from "@/lib/constants";
import { ApplicationStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: string;
  showIcon?: boolean;
  className?: string;
}

const STATUS_ICONS: Record<string, LucideIcon> = {
  [ApplicationStatus.APPLIED]: CheckCircle2,
  [ApplicationStatus.ACCEPTED_WITH_FUND]: CheckCircle2,
  [ApplicationStatus.ACCEPTED_WITHOUT_FULL_FUND]: CheckCircle2,
  [ApplicationStatus.IN_PROGRESS]: Clock,
  [ApplicationStatus.PENDING_FEE]: Clock,
  [ApplicationStatus.NOT_APPLIED]: AlertCircle,
  [ApplicationStatus.SKIPPED]: XCircle,
  [ApplicationStatus.REJECTED]: XCircle,
};

export function StatusBadge({
  status,
  showIcon = true,
  className,
}: StatusBadgeProps) {
  const config = getApplicationStatusConfig(status);
  const Icon = STATUS_ICONS[status] || Clock;

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {config.label}
    </Badge>
  );
}
