"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProgressSegment {
  label: string;
  value: number;
  color: string;
}

interface ProgressChartProps {
  title?: string;
  description?: string;
  segments: ProgressSegment[];
  total: number;
  showLegend?: boolean;
  showPercentages?: boolean;
  className?: string;
}

export function ProgressChart({
  title = "Application Progress",
  description,
  segments,
  total,
  showLegend = true,
  showPercentages = true,
  className,
}: ProgressChartProps) {
  // Calculate percentages
  const segmentsWithPercentage = segments.map((segment) => ({
    ...segment,
    percentage: total > 0 ? Math.round((segment.value / total) * 100) : 0,
  }));

  // Get total percentage filled
  const totalPercentage = segmentsWithPercentage.reduce(
    (sum, s) => sum + s.percentage,
    0
  );

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader className="pb-2">
          {title && <CardTitle className="text-lg font-semibold">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {/* Stacked progress bar */}
        <div className="relative">
          <div className="h-3 bg-muted rounded-full overflow-hidden flex">
            {segmentsWithPercentage.map((segment, index) => (
              <div
                key={segment.label}
                className={cn(
                  "h-full transition-all duration-500 ease-out",
                  segment.color,
                  index === 0 && "rounded-l-full",
                  index === segmentsWithPercentage.length - 1 &&
                    totalPercentage >= 100 &&
                    "rounded-r-full"
                )}
                style={{ width: `${segment.percentage}%` }}
              />
            ))}
          </div>
          {showPercentages && (
            <div className="absolute right-0 -top-6 text-sm font-medium">
              {totalPercentage}%
            </div>
          )}
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {segmentsWithPercentage.map((segment) => (
              <div key={segment.label} className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-full", segment.color)} />
                <span className="text-sm text-muted-foreground">
                  {segment.label}
                </span>
                <span className="text-sm font-medium">
                  {segment.value}
                  {showPercentages && (
                    <span className="text-muted-foreground ml-1">
                      ({segment.percentage}%)
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Simplified donut/ring chart variant
interface RingChartProps {
  value: number;
  total: number;
  label?: string;
  sublabel?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RingChart({
  value,
  total,
  label,
  sublabel,
  color = "stroke-gold",
  size = "md",
  className,
}: RingChartProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  const sizeClasses = {
    sm: { wrapper: "w-20 h-20", stroke: 6, text: "text-lg" },
    md: { wrapper: "w-28 h-28", stroke: 8, text: "text-2xl" },
    lg: { wrapper: "w-36 h-36", stroke: 10, text: "text-3xl" },
  };

  const { wrapper, stroke, text } = sizeClasses[size];
  const radius = 50 - stroke / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className={cn("relative", wrapper)}>
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 100 100"
          aria-label={`${percentage}% complete`}
        >
          {/* Background circle */}
          <circle
            className="stroke-muted"
            strokeWidth={stroke}
            fill="none"
            cx="50"
            cy="50"
            r={radius}
          />
          {/* Progress circle */}
          <circle
            className={cn("transition-all duration-500 ease-out", color)}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            cx="50"
            cy="50"
            r={radius}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-serif font-semibold", text)}>
            {percentage}%
          </span>
        </div>
      </div>
      {(label || sublabel) && (
        <div className="text-center">
          {label && <p className="text-sm font-medium">{label}</p>}
          {sublabel && (
            <p className="text-xs text-muted-foreground">{sublabel}</p>
          )}
        </div>
      )}
    </div>
  );
}
