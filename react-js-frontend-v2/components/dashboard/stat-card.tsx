"use client";

import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    label: string;
    direction?: "up" | "down" | "neutral";
  };
  progress?: {
    current: number;
    total: number;
  };
  color?: "primary" | "gold" | "success" | "warning" | "destructive" | "chart-4" | "chart-5";
  className?: string;
}

const colorClasses = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    progress: "bg-primary",
  },
  gold: {
    bg: "bg-gold/10",
    text: "text-gold",
    progress: "bg-gold",
  },
  success: {
    bg: "bg-success/10",
    text: "text-success",
    progress: "bg-success",
  },
  warning: {
    bg: "bg-warning/10",
    text: "text-warning",
    progress: "bg-warning",
  },
  destructive: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    progress: "bg-destructive",
  },
  "chart-4": {
    bg: "bg-chart-4/10",
    text: "text-chart-4",
    progress: "bg-chart-4",
  },
  "chart-5": {
    bg: "bg-chart-5/10",
    text: "text-chart-5",
    progress: "bg-chart-5",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  progress,
  color = "primary",
  className,
}: StatCardProps) {
  const colors = colorClasses[color];
  const progressPercentage = progress
    ? Math.round((progress.current / progress.total) * 100)
    : null;

  const TrendIcon =
    trend?.direction === "up"
      ? TrendingUp
      : trend?.direction === "down"
      ? TrendingDown
      : Minus;

  const trendColorClass =
    trend?.direction === "up"
      ? "text-success"
      : trend?.direction === "down"
      ? "text-destructive"
      : "text-muted-foreground";

  return (
    <Card
      className={cn(
        "relative overflow-hidden group hover:shadow-lg transition-all duration-200",
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          {/* Icon */}
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110",
              colors.bg
            )}
          >
            <Icon className={cn("w-5 h-5", colors.text)} />
          </div>

          {/* Value */}
          <div className="text-right">
            <span className="text-2xl font-serif font-semibold">{value}</span>
          </div>
        </div>

        <div className="space-y-2">
          {/* Title */}
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>

          {/* Progress bar */}
          {progressPercentage !== null && (
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500 ease-out",
                  colors.progress
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}

          {/* Description or Trend */}
          {trend ? (
            <div className="flex items-center gap-1.5">
              <TrendIcon className={cn("w-3.5 h-3.5", trendColorClass)} />
              <span className={cn("text-xs", trendColorClass)}>
                {trend.value > 0 && "+"}
                {trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">{trend.label}</span>
            </div>
          ) : description ? (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-success" />
              {description}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
