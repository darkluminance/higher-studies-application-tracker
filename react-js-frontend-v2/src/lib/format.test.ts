import { describe, it, expect } from "vitest";
import {
	formatShortDate,
	formatMonthLabel,
	formatDay,
	formatMonthYear,
	toDateInputValue,
	fromDateInputValue,
} from "./format";

// Local-time strings (no Z) keep display formatting timezone-independent.
const DEC15 = "2025-12-15T12:00:00";
const JAN02 = "2026-01-02T09:30:00";

describe("formatShortDate", () => {
	it("formats a date as 'Mon D'", () => {
		expect(formatShortDate(DEC15)).toBe("Dec 15");
		expect(formatShortDate(JAN02)).toBe("Jan 2");
	});

	it("returns an em dash for missing or invalid input", () => {
		expect(formatShortDate(undefined)).toBe("—");
		expect(formatShortDate(null)).toBe("—");
		expect(formatShortDate("not-a-date")).toBe("—");
		expect(formatShortDate("")).toBe("—");
	});
});

describe("formatMonthLabel", () => {
	it("returns the uppercase 3-letter month", () => {
		expect(formatMonthLabel(DEC15)).toBe("DEC");
		expect(formatMonthLabel(JAN02)).toBe("JAN");
	});
	it("returns an empty string for invalid input", () => {
		expect(formatMonthLabel(undefined)).toBe("");
		expect(formatMonthLabel("nope")).toBe("");
	});
});

describe("formatDay", () => {
	it("returns the day of month as a string", () => {
		expect(formatDay(DEC15)).toBe("15");
		expect(formatDay(JAN02)).toBe("2");
	});
	it("returns an empty string for invalid input", () => {
		expect(formatDay(null)).toBe("");
	});
});

describe("formatMonthYear", () => {
	it("splits a date into long month name and year", () => {
		const result = formatMonthYear(new Date(2025, 10, 1)); // November 2025
		expect(result.month).toBe("November");
		expect(result.year).toBe("2025");
	});
});

describe("toDateInputValue", () => {
	it("converts an ISO timestamp to YYYY-MM-DD", () => {
		expect(toDateInputValue("2025-12-15T12:00:00Z")).toBe("2025-12-15");
	});
	it("falls back to today for invalid input", () => {
		const today = new Date().toISOString().split("T")[0];
		expect(toDateInputValue(undefined)).toBe(today);
		expect(toDateInputValue("garbage")).toBe(today);
	});
});

describe("fromDateInputValue", () => {
	it("converts a date-input value to a full ISO timestamp", () => {
		expect(fromDateInputValue("2025-12-15")).toBe("2025-12-15T00:00:00.000Z");
	});
});
