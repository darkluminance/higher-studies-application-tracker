"use client";

import { cn } from "@/lib/utils";

interface SkipLinkProps {
  targetId?: string;
  className?: string;
}

/**
 * Accessibility skip link that allows keyboard users to skip
 * navigation and go directly to main content.
 *
 * This link is hidden by default and only becomes visible when focused.
 *
 * Usage:
 * 1. Add <SkipLink /> at the very top of your layout
 * 2. Add id="main-content" to your main content container
 */
export function SkipLink({
  targetId = "main-content",
  className,
}: SkipLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={cn(
        // Position and base styles
        "fixed left-4 top-4 z-[100]",
        // Hidden by default, visible on focus
        "-translate-y-full opacity-0",
        "focus:translate-y-0 focus:opacity-100",
        // Visual styles
        "rounded-lg bg-primary px-4 py-2",
        "text-primary-foreground text-sm font-medium",
        "shadow-lg",
        // Transition
        "transition-all duration-200",
        // Focus ring
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      Skip to main content
    </a>
  );
}

/**
 * Wrapper for main content that sets up the skip link target
 */
interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

export function MainContent({ children, className }: MainContentProps) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={cn(
        "outline-none", // Remove focus ring on main
        className
      )}
    >
      {children}
    </main>
  );
}
