import { useMemo } from "react";
import { cn } from "@/lib/cn";
import { formatMonthYear } from "@/lib/format";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export interface CalendarEventDay {
	day: number;
	tone: "clay" | "sage";
}

/** A quiet month calendar: today gets a clay disc, event days a small dot. */
export function Calendar({ eventDays }: { eventDays: CalendarEventDay[] }) {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth();
	const today = now.getDate();

	const { month: monthName, year: yearLabel } = formatMonthYear(now);

	const cells = useMemo(() => {
		const firstWeekday = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const list: (number | null)[] = [];
		for (let i = 0; i < firstWeekday; i++) list.push(null);
		for (let d = 1; d <= daysInMonth; d++) list.push(d);
		return list;
	}, [year, month]);

	const eventMap = useMemo(() => {
		const map = new Map<number, "clay" | "sage">();
		eventDays.forEach((e) => map.set(e.day, e.tone));
		return map;
	}, [eventDays]);

	return (
		<div>
			<div className="mb-3 flex items-baseline justify-between">
				<span className="font-serif text-[16px] text-ink">{monthName}</span>
				<span className="text-[11px] text-label-cal">{yearLabel}</span>
			</div>
			<div className="grid grid-cols-7 gap-y-1.5 text-center">
				{WEEKDAYS.map((w, i) => (
					<span key={i} className="text-[10.5px] text-[#c3b699]">
						{w}
					</span>
				))}
				{cells.map((day, i) => {
					if (day === null) return <span key={`e${i}`} />;
					const isToday = day === today;
					const tone = eventMap.get(day);
					return (
						<div
							key={day}
							className="relative flex h-6 items-center justify-center"
						>
							<span
								className={cn(
									"flex h-[22px] w-[22px] items-center justify-center rounded-full text-[10.5px]",
									isToday
										? "bg-clay font-semibold text-paper"
										: tone
											? "font-bold text-ink-body"
											: "text-ink-muted"
								)}
							>
								{day}
							</span>
							{tone && !isToday && (
								<span
									className={cn(
										"absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full",
										tone === "clay" ? "bg-clay" : "bg-sage-bar"
									)}
								/>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
