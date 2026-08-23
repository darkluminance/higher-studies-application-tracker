import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { Calendar } from "./Calendar";
import { formatMonthYear } from "@/lib/format";

describe("Calendar", () => {
	it("renders the current month name and today's date", () => {
		const now = new Date();
		const { month } = formatMonthYear(now);
		render(<Calendar eventDays={[]} />);
		expect(screen.getByText(month)).toBeInTheDocument();
		expect(
			screen.getByText(String(now.getDate()), { selector: "span" })
		).toBeInTheDocument();
	});

	it("renders event-day cells", () => {
		// Pick a day that is unlikely to be today to see the event styling path.
		const day = new Date().getDate() === 15 ? 16 : 15;
		render(<Calendar eventDays={[{ day, tone: "sage" }]} />);
		expect(screen.getByText(String(day))).toBeInTheDocument();
	});
});
