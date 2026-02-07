// Date Utility Functions

/**
 * Calculate days between now and target date
 */
export function getDaysUntil(targetDate: Date | string): number {
  const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetNormalized = new Date(target);
  targetNormalized.setHours(0, 0, 0, 0);

  const diffTime = targetNormalized.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format date for display
 */
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(
    "en-US",
    options ?? {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

/**
 * Format date for input fields (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date | string): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0];
}

/**
 * Parse date string from input to ISO format
 */
export function toISODate(dateString: string): string {
  if (!dateString) return "";
  return new Date(dateString).toISOString();
}

/**
 * Check if date is in the past
 */
export function isPastDate(date: Date | string): boolean {
  return getDaysUntil(date) < 0;
}

/**
 * Get urgency status based on days until deadline
 */
export function getUrgencyStatus(daysUntil: number): "urgent" | "upcoming" | "normal" {
  if (daysUntil < 0) return "urgent";
  if (daysUntil <= 7) return "urgent";
  if (daysUntil <= 30) return "upcoming";
  return "normal";
}

/**
 * Format date with weekday for interview display
 */
export function formatDateWithWeekday(date: Date | string): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
