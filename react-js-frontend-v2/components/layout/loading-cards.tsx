"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LoadingCardsProps {
  count?: number;
  variant?: "card" | "list" | "compact";
  columns?: 1 | 2 | 3;
  className?: string;
}

export function LoadingCards({
  count = 6,
  variant = "card",
  columns = 3,
  className,
}: LoadingCardsProps) {
  const gridClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  if (variant === "list") {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <LoadingListItem key={i} />
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("grid gap-4", gridClass, className)}>
        {Array.from({ length: count }).map((_, i) => (
          <LoadingCompactCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4", gridClass, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}

function LoadingCard() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="skeleton-text w-3/4" />
            <div className="skeleton-text-sm w-1/2" />
          </div>
          <div className="skeleton-circle w-8 h-8" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="skeleton rounded h-6 w-16" />
          <div className="skeleton rounded h-6 w-20" />
          <div className="skeleton rounded h-6 w-14" />
        </div>
        <div className="skeleton rounded-lg h-12 w-full" />
        <div className="flex gap-2">
          <div className="skeleton rounded-full h-6 w-16" />
          <div className="skeleton rounded-full h-6 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingCompactCard() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="skeleton-circle w-12 h-12" />
          <div className="flex-1 space-y-2">
            <div className="skeleton-text w-2/3" />
            <div className="skeleton-text-sm w-1/2" />
          </div>
          <div className="skeleton rounded h-6 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingListItem() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className="skeleton rounded-xl w-14 h-14 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <div className="skeleton-text w-1/3" />
              <div className="skeleton rounded h-6 w-20" />
            </div>
            <div className="skeleton-text-sm w-1/2" />
            <div className="flex gap-2">
              <div className="skeleton rounded h-5 w-24" />
              <div className="skeleton rounded h-5 w-16" />
            </div>
          </div>
          <div className="hidden lg:flex flex-col gap-2 items-end">
            <div className="skeleton rounded h-2 w-32" />
            <div className="skeleton-text-sm w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Stat cards loading state
export function LoadingStatCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="skeleton rounded-lg w-10 h-10" />
              <div className="skeleton-text w-16" />
            </div>
            <div className="space-y-2">
              <div className="skeleton-text-sm w-24" />
              <div className="skeleton rounded-full h-1.5 w-full" />
              <div className="skeleton-text-sm w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Page loading skeleton
export function LoadingPage() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="skeleton-text w-48" />
          <div className="skeleton-text-sm w-64" />
        </div>
        <div className="skeleton rounded-full h-9 w-32" />
      </div>

      {/* Filter bar skeleton */}
      <div className="flex gap-3">
        <div className="skeleton rounded-full h-9 w-64" />
        <div className="skeleton rounded-full h-9 w-32" />
      </div>

      {/* Content skeleton */}
      <LoadingCards count={6} />
    </div>
  );
}
