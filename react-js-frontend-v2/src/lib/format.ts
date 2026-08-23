/** Formatting helpers for the calm, reassuring copy in lists & the dashboard. */

const MONTHS = [
	"Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function safeDate(value: string | undefined | null): Date | null {
	if (!value) return null;
	const d = new Date(value);
	return Number.isNaN(d.getTime()) ? null : d;
}

/** "Dec 1" — short date for deadlines/rows. */
export function formatShortDate(value?: string | null): string {
	const d = safeDate(value);
	if (!d) return "—";
	return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/** Uppercase month label for date cells, e.g. "NOV". */
export function formatMonthLabel(value?: string | null): string {
	const d = safeDate(value);
	return d ? MONTHS[d.getMonth()].toUpperCase() : "";
}

/** Day-of-month numeral for date cells. */
export function formatDay(value?: string | null): string {
	const d = safeDate(value);
	return d ? String(d.getDate()) : "";
}

/** "November 2025" style long month + year. */
export function formatMonthYear(d: Date): { month: string; year: string } {
	const full = d.toLocaleString("default", { month: "long" });
	return { month: full, year: String(d.getFullYear()) };
}

/** Convert an ISO/date string to a value for <input type="date"> (YYYY-MM-DD). */
export function toDateInputValue(value?: string | null): string {
	const d = safeDate(value);
	if (!d) return new Date().toISOString().split("T")[0];
	return d.toISOString().split("T")[0];
}

/** Convert a date-input string back to a full ISO timestamp for the API. */
export function fromDateInputValue(value: string): string {
	return new Date(value).toISOString();
}
