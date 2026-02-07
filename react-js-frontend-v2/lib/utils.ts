import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Animation delay for staggered list items
 * @param index - The index of the item in the list
 * @param baseDelay - Base delay in milliseconds (default: 50ms)
 * @param maxDelay - Maximum delay cap in milliseconds (default: 500ms)
 */
export function staggerDelay(
  index: number,
  baseDelay: number = 50,
  maxDelay: number = 500
): { animationDelay: string } {
  const delay = Math.min(index * baseDelay, maxDelay)
  return { animationDelay: `${delay}ms` }
}

/**
 * CSS custom property for stagger animation
 * @param index - The index of the item
 */
export function staggerIndex(index: number): React.CSSProperties {
  return { "--stagger-index": index } as React.CSSProperties
}

/**
 * Get animation class with optional stagger delay
 * @param animation - Base animation class name
 * @param index - Optional index for stagger delay
 */
export function getAnimationClass(
  animation: "fade-up" | "fade-in" | "scale-in" | "slide-in-right" | "slide-up" | "slide-down",
  index?: number
): string {
  const baseClass = `animate-${animation}`
  if (index !== undefined && index > 0 && index <= 6) {
    return `${baseClass} stagger-${index}`
  }
  return baseClass
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const target = new Date(date)
  const diffMs = target.getTime() - now.getTime()
  const diffSecs = Math.round(diffMs / 1000)
  const diffMins = Math.round(diffSecs / 60)
  const diffHours = Math.round(diffMins / 60)
  const diffDays = Math.round(diffHours / 24)

  if (diffDays === 0) {
    if (diffHours === 0) {
      if (diffMins === 0) return "just now"
      if (diffMins > 0) return `in ${diffMins} min${diffMins > 1 ? "s" : ""}`
      return `${Math.abs(diffMins)} min${Math.abs(diffMins) > 1 ? "s" : ""} ago`
    }
    if (diffHours > 0) return `in ${diffHours} hour${diffHours > 1 ? "s" : ""}`
    return `${Math.abs(diffHours)} hour${Math.abs(diffHours) > 1 ? "s" : ""} ago`
  }

  if (diffDays > 0) {
    if (diffDays === 1) return "tomorrow"
    if (diffDays <= 7) return `in ${diffDays} days`
    return target.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  if (diffDays === -1) return "yesterday"
  if (diffDays >= -7) return `${Math.abs(diffDays)} days ago`
  return target.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

/**
 * Get greeting based on time of day
 */
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + "..."
}

/**
 * Get initials from a name
 */
export function getInitials(name: string, maxLength: number = 2): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, maxLength)
    .join("")
    .toUpperCase()
}

/**
 * Generate a color based on a string (for consistent avatar colors)
 */
export function stringToColor(str: string): string {
  const colors = [
    "bg-primary/10 text-primary",
    "bg-gold/10 text-gold",
    "bg-success/10 text-success",
    "bg-chart-4/10 text-chart-4",
    "bg-chart-5/10 text-chart-5",
    "bg-warning/10 text-warning",
  ]

  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}
