// String/Number Formatting Utilities

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Capitalize first letter of each word
 */
export function toTitleCase(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .split(/[\s_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get initials from a name (max 2 characters)
 */
export function getInitials(name: string): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format currency (USD)
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

/**
 * Parse comma-separated string to array
 */
export function parseCommaSeparated(value: string): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Join array to comma-separated string
 */
export function joinWithCommas(arr: string[] | undefined): string {
  if (!arr || arr.length === 0) return "";
  return arr.join(", ");
}
