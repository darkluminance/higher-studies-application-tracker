"use client";

import { Award, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTimeBasedGreeting } from "@/lib/utils";

interface GreetingHeaderProps {
  userName: string;
  submittedApps: number;
  totalUniversities: number;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
}

export function GreetingHeader({
  userName,
  submittedApps,
  totalUniversities,
  primaryAction = { label: "View Applications", href: "/dashboard/applications" },
  secondaryAction = { label: "Add University", href: "/dashboard/universities" },
}: GreetingHeaderProps) {
  const greeting = getTimeBasedGreeting();
  const remainingApps = totalUniversities - submittedApps;

  const getProgressMessage = () => {
    if (submittedApps > 0) {
      return `You're making great progress! ${submittedApps} application${submittedApps > 1 ? "s" : ""} submitted${remainingApps > 0 ? `, ${remainingApps} more to go` : ""}.`;
    }
    if (totalUniversities > 0) {
      return `You have ${totalUniversities} universit${totalUniversities > 1 ? "ies" : "y"} tracked. Start submitting applications!`;
    }
    return "Get started by adding universities and tracking your applications.";
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground p-6 md:p-8">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/5 rounded-full" />

      <div className="relative">
        {/* Season badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold/20 text-gold text-xs font-medium">
            <Award className="w-3.5 h-3.5" />
            <span>Application Season {new Date().getFullYear()}</span>
          </div>
          {submittedApps > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>On Track</span>
            </div>
          )}
        </div>

        {/* Greeting */}
        <h1 className="text-2xl md:text-3xl font-serif font-semibold mb-2">
          {greeting}, {userName}!
        </h1>

        {/* Progress message */}
        <p className="text-primary-foreground/70 max-w-xl mb-6 text-sm md:text-base">
          {getProgressMessage()} Stay focused and keep tracking your journey.
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90 shadow-lg"
            asChild
          >
            <Link href={primaryAction.href}>
              {primaryAction.label}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 hover:text-white"
            asChild
          >
            <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
