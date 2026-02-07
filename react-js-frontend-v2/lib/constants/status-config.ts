// Status Configuration - styling and display config for application statuses

import { ApplicationStatus, ApplicationType, ReplyVibe } from "../types";

export interface StatusConfig {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

export const APPLICATION_STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  [ApplicationStatus.NOT_APPLIED]: {
    label: "Not Applied",
    variant: "outline",
    className: "border-gray-300 text-gray-600",
  },
  [ApplicationStatus.SKIPPED]: {
    label: "Skipped",
    variant: "secondary",
    className: "bg-gray-400",
  },
  [ApplicationStatus.IN_PROGRESS]: {
    label: "In Progress",
    variant: "default",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  [ApplicationStatus.PENDING_FEE]: {
    label: "Pending Fee",
    variant: "default",
    className: "bg-yellow-500",
  },
  [ApplicationStatus.APPLIED]: {
    label: "Applied",
    variant: "default",
    className: "bg-success/10 text-success border-success/20",
  },
  [ApplicationStatus.REJECTED]: {
    label: "Rejected",
    variant: "destructive",
    className: "",
  },
  [ApplicationStatus.ACCEPTED_WITH_FUND]: {
    label: "Accepted (Funded)",
    variant: "default",
    className: "bg-success/10 text-success border-success/20",
  },
  [ApplicationStatus.ACCEPTED_WITHOUT_FULL_FUND]: {
    label: "Accepted (Partial Fund)",
    variant: "secondary",
    className: "bg-success/10 text-success border-success/20",
  },
};

export const APPLICATION_TYPE_CONFIG: Record<ApplicationType, StatusConfig> = {
  [ApplicationType.PHD]: {
    label: "PhD",
    variant: "default",
    className: "bg-purple-500",
  },
  [ApplicationType.MASTERS]: {
    label: "Masters",
    variant: "default",
    className: "bg-indigo-500",
  },
};

export const REPLY_VIBE_CONFIG: Record<ReplyVibe, StatusConfig> = {
  [ReplyVibe.ENTHUSIASTIC]: {
    label: "Enthusiastic",
    variant: "default",
    className: "bg-green-500",
  },
  [ReplyVibe.GENERIC]: {
    label: "Generic",
    variant: "secondary",
    className: "",
  },
};

// Helper to get status config by string value (for backwards compatibility)
export function getApplicationStatusConfig(status: string): StatusConfig {
  const enumValue = Object.values(ApplicationStatus).find((v) => v === status);
  if (enumValue) {
    return APPLICATION_STATUS_CONFIG[enumValue];
  }
  // Fallback for unknown status
  return {
    label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace(/_/g, " "),
    variant: "secondary",
    className: "",
  };
}

// Arrays for dropdowns/selects
export const APPLICATION_STATUSES = Object.values(ApplicationStatus);
export const APPLICATION_TYPES = Object.values(ApplicationType);
export const REPLY_VIBES = Object.values(ReplyVibe);
