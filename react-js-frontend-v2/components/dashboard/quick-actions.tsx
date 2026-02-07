"use client";

import { LucideIcon, Plus, Building2, Users, Calendar, Mail, FileText } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuickAction {
  label: string;
  description?: string;
  icon: LucideIcon;
  href: string;
  color?: "primary" | "gold" | "success" | "warning" | "chart-4" | "chart-5";
}

const defaultActions: QuickAction[] = [
  {
    label: "Add University",
    description: "Track a new target school",
    icon: Building2,
    href: "/dashboard/universities?action=add",
    color: "gold",
  },
  {
    label: "New Application",
    description: "Start an application",
    icon: FileText,
    href: "/dashboard/applications?action=add",
    color: "primary",
  },
  {
    label: "Add Faculty",
    description: "Track a professor",
    icon: Users,
    href: "/dashboard/faculties?action=add",
    color: "chart-5",
  },
  {
    label: "Schedule Interview",
    description: "Add upcoming interview",
    icon: Calendar,
    href: "/dashboard/interviews?action=add",
    color: "warning",
  },
];

const colorClasses = {
  primary: {
    bg: "bg-primary/10 group-hover:bg-primary/15",
    text: "text-primary",
    border: "border-primary/20",
  },
  gold: {
    bg: "bg-gold/10 group-hover:bg-gold/15",
    text: "text-gold",
    border: "border-gold/20",
  },
  success: {
    bg: "bg-success/10 group-hover:bg-success/15",
    text: "text-success",
    border: "border-success/20",
  },
  warning: {
    bg: "bg-warning/10 group-hover:bg-warning/15",
    text: "text-warning",
    border: "border-warning/20",
  },
  "chart-4": {
    bg: "bg-chart-4/10 group-hover:bg-chart-4/15",
    text: "text-chart-4",
    border: "border-chart-4/20",
  },
  "chart-5": {
    bg: "bg-chart-5/10 group-hover:bg-chart-5/15",
    text: "text-chart-5",
    border: "border-chart-5/20",
  },
};

interface QuickActionsProps {
  actions?: QuickAction[];
  title?: string;
  columns?: 2 | 4;
  className?: string;
}

export function QuickActions({
  actions = defaultActions,
  title = "Quick Actions",
  columns = 4,
  className,
}: QuickActionsProps) {
  return (
    <Card className={className}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Plus className="w-5 h-5 text-muted-foreground" />
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div
          className={cn(
            "grid gap-3",
            columns === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"
          )}
        >
          {actions.map((action) => (
            <QuickActionItem key={action.href} action={action} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionItem({ action }: { action: QuickAction }) {
  const colors = colorClasses[action.color || "primary"];
  const Icon = action.icon;

  return (
    <Link
      href={action.href}
      className={cn(
        "group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200",
        "hover:shadow-md hover:-translate-y-0.5",
        colors.border,
        colors.bg
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110",
          colors.bg,
          colors.text
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">{action.label}</p>
        {action.description && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {action.description}
          </p>
        )}
      </div>
    </Link>
  );
}

// Compact inline version for smaller spaces
interface QuickActionButtonsProps {
  actions?: QuickAction[];
  className?: string;
}

export function QuickActionButtons({
  actions = defaultActions.slice(0, 3),
  className,
}: QuickActionButtonsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {actions.map((action) => {
        const colors = colorClasses[action.color || "primary"];
        const Icon = action.icon;

        return (
          <Link
            key={action.href}
            href={action.href}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200",
              "hover:shadow-sm text-sm font-medium",
              colors.border,
              colors.bg
            )}
          >
            <Icon className={cn("w-4 h-4", colors.text)} />
            {action.label}
          </Link>
        );
      })}
    </div>
  );
}
