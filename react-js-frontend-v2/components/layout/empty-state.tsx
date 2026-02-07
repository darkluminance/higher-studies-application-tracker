"use client";

import { LucideIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  showAction?: boolean;
  actionIcon?: LucideIcon;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  showAction = true,
  actionIcon: ActionIcon = Plus,
  size = "default",
  className,
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      wrapper: "py-8",
      icon: "w-10 h-10 mb-3",
      title: "text-base",
      description: "text-sm mb-3",
      button: "sm",
    },
    default: {
      wrapper: "py-12",
      icon: "w-12 h-12 mb-4",
      title: "text-lg",
      description: "text-sm mb-4",
      button: "default",
    },
    lg: {
      wrapper: "py-16",
      icon: "w-16 h-16 mb-6",
      title: "text-xl",
      description: "mb-6",
      button: "lg",
    },
  };

  const classes = sizeClasses[size];

  return (
    <div
      className={cn(
        "text-center flex flex-col items-center",
        classes.wrapper,
        className
      )}
    >
      <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        <Icon
          className={cn(
            "text-muted-foreground/50",
            size === "sm" ? "w-8 h-8" : size === "lg" ? "w-10 h-10" : "w-9 h-9"
          )}
        />
      </div>
      <h3 className={cn("font-semibold mb-2", classes.title)}>{title}</h3>
      <p
        className={cn(
          "text-muted-foreground max-w-sm",
          classes.description
        )}
      >
        {description}
      </p>
      {showAction && actionLabel && onAction && (
        <Button
          onClick={onAction}
          size={classes.button as "sm" | "default" | "lg"}
        >
          <ActionIcon className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
