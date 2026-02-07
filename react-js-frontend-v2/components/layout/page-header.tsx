"use client";

import { LucideIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PageHeaderStat {
  label: string;
  value: string | number;
  color?: "default" | "success" | "warning" | "primary" | "gold";
}

interface PageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: LucideIcon;
  stats?: PageHeaderStat[];
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  iconClassName = "text-primary",
  actionLabel,
  onAction,
  actionIcon: ActionIcon = Plus,
  stats,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-serif font-semibold flex items-center gap-2">
            <Icon className={cn("w-6 h-6", iconClassName)} />
            {title}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        </div>
        {actionLabel && onAction && (
          <Button className="gap-2 shrink-0" onClick={onAction}>
            <ActionIcon className="w-4 h-4" />
            {actionLabel}
          </Button>
        )}
      </div>

      {/* Stats row */}
      {stats && stats.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {stats.map((stat, index) => (
            <PageHeaderStatBadge key={index} stat={stat} />
          ))}
        </div>
      )}
    </div>
  );
}

function PageHeaderStatBadge({ stat }: { stat: PageHeaderStat }) {
  const colorClasses = {
    default: "",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    primary: "bg-primary/10 text-primary border-primary/20",
    gold: "bg-gold/10 text-gold border-gold/20",
  };

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 px-3 py-1", colorClasses[stat.color || "default"])}
    >
      <span className="text-xs text-muted-foreground">{stat.label}:</span>
      <span className="font-semibold">{stat.value}</span>
    </Badge>
  );
}
