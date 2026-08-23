import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { ProgressBar, ProgressLabel } from "@/components/ui/ProgressBar";
import { MicroLabel } from "@/components/ui/Field";
import { Loading, ErrorState } from "@/features/shared/PageState";
import { useAuth } from "@/lib/auth/AuthContext";
import { useTimeline } from "@/features/queries";
import { formatMonthLabel, formatDay } from "@/lib/format";
import type { TimelineEvent } from "@/types";
import { Calendar, type CalendarEventDay } from "./Calendar";

function greeting() {
	const h = new Date().getHours();
	if (h < 12) return "Good morning";
	if (h < 18) return "Good afternoon";
	return "Good evening";
}

const isDeadline = (e: TimelineEvent) => e.type === "University";

function eventSubtitle(e: TimelineEvent) {
	if (isDeadline(e)) return "A deadline on the horizon. Plenty of room to breathe.";
	return [e.designation, e.university_name].filter(Boolean).join(" · ");
}

export function DashboardPage() {
	const { user } = useAuth();
	const { data, isLoading, isError, refetch } = useTimeline();
	const firstName = (user?.name || user?.username || "there").split(" ")[0];

	const eventDays: CalendarEventDay[] = useMemo(() => {
		const now = new Date();
		return (data?.events ?? [])
			.map((e) => {
				const d = new Date(e.date);
				if (Number.isNaN(d.getTime())) return null;
				if (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear())
					return null;
				return {
					day: d.getDate(),
					tone: isDeadline(e) ? ("clay" as const) : ("sage" as const),
				};
			})
			.filter(Boolean) as CalendarEventDay[];
	}, [data]);

	if (isLoading) return <Loading label="Setting up your calm view…" />;
	if (isError) return <ErrorState onRetry={() => refetch()} />;

	const events = data?.events ?? [];
	const pct = (n: number) => `${Math.round((n ?? 0) * 100)}%`;

	return (
		<div className="flex flex-col">
			<h1 className="font-serif text-[30px] leading-tight text-ink">
				{greeting()}, {firstName}.
			</h1>
			<p className="mt-1 max-w-[520px] text-[14.5px] text-ink-soft">
				You're on a steady path. Nothing here needs rushing today — just a calm
				look at the weeks ahead.
			</p>

			<div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.65fr_1fr]">
				{/* On the horizon */}
				<section>
					<MicroLabel className="mb-2">On the horizon</MicroLabel>
					{events.length === 0 ? (
						<p className="py-8 text-[14px] text-ink-faint">
							Nothing on the horizon yet. Enjoy the quiet.
						</p>
					) : (
						<div>
							{events.map((e, i) => (
								<div
									key={`${e.name}-${i}`}
									className="flex items-center gap-[18px] border-b border-line-soft px-1 py-4 last:border-b-0"
								>
									<div className="flex w-[46px] shrink-0 flex-col items-center">
										<span className="text-[10px] uppercase tracking-micro text-label-cal">
											{formatMonthLabel(e.date)}
										</span>
										<span className="font-serif text-[26px] leading-none text-ink-body">
											{formatDay(e.date)}
										</span>
									</div>
									<div className="min-w-0 flex-1">
										<p className="truncate text-[15px] font-bold text-ink-strong">
											{e.name}
										</p>
										<p className="truncate text-[12.5px] text-ink-soft">
											{eventSubtitle(e)}
										</p>
									</div>
									<StatusPill tone={isDeadline(e) ? "motion" : "sage"}>
										{isDeadline(e) ? "Deadline" : "Interview"}
									</StatusPill>
								</div>
							))}
						</div>
					)}
				</section>

				{/* Right column */}
				<div className="flex flex-col gap-5">
					<Card className="p-5">
						<MicroLabel className="mb-4">Where you are</MicroLabel>
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-2">
								<ProgressLabel
									label="Applications sent"
									value={pct(data?.appliedUniversityRatio ?? 0)}
								/>
								<ProgressBar value={data?.appliedUniversityRatio ?? 0} tone="clay" />
							</div>
							<div className="flex flex-col gap-2">
								<ProgressLabel
									label="Recommendations in"
									value={pct(data?.recommendationRatio ?? 0)}
								/>
								<ProgressBar value={data?.recommendationRatio ?? 0} tone="sage" />
							</div>
							<div className="flex flex-col gap-2">
								<ProgressLabel
									label="Faculty replies"
									value={pct(data?.repliedMailsRatio ?? 0)}
								/>
								<ProgressBar value={data?.repliedMailsRatio ?? 0} tone="clay" />
							</div>
						</div>
						<p className="mt-4 border-t border-line-hair pt-3 text-[12.5px] text-ink-faint">
							{data?.applicationCount ?? 0} application
							{data?.applicationCount === 1 ? "" : "s"} created so far.
						</p>
					</Card>

					<Card className="p-5">
						<Calendar eventDays={eventDays} />
					</Card>
				</div>
			</div>
		</div>
	);
}
