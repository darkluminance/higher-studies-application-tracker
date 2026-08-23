import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { StatusPill } from "@/components/ui/StatusPill";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { RowActions } from "@/components/ui/RowActions";
import { MicroLabel } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading, ErrorState } from "@/features/shared/PageState";
import { useFormDialog } from "@/features/shared/useFormDialog";
import { interviews, faculties } from "@/features/queries";
import { formatMonthLabel, formatDay } from "@/lib/format";
import { isYes, type Interview, type Faculty } from "@/types";
import { InterviewForm } from "./InterviewForm";
import { cn } from "@/lib/cn";

export function InterviewPage() {
	const { data, isLoading, isError, refetch } = interviews.useList();
	const { data: facultyList } = faculties.useList();
	const remove = interviews.useRemove();
	const dialog = useFormDialog<Interview>();
	const [facFilter, setFacFilter] = useState("");

	const facultyMap = useMemo(() => {
		const map = new Map<string, Faculty>();
		(facultyList ?? []).forEach((f) => map.set(f.id, f));
		return map;
	}, [facultyList]);

	const filtered = useMemo(
		() =>
			(data ?? []).filter((i) =>
				facFilter ? i.faculty_id === facFilter : true
			),
		[data, facFilter]
	);

	const upcoming = filtered.filter((i) => !isYes(i.is_completed));
	const done = filtered.filter((i) => isYes(i.is_completed));

	const renderCard = (i: Interview, isDone: boolean) => {
		const fac = facultyMap.get(i.faculty_id);
		return (
			<Card
				key={i.id}
				className={cn(
					"flex items-center gap-4 px-5 py-4",
					isDone && "bg-paper-sunken opacity-[0.82]"
				)}
			>
				<div className="flex w-[52px] shrink-0 flex-col items-center">
					<span className="text-[10px] font-semibold uppercase tracking-micro text-label-cal">
						{formatMonthLabel(i.date)}
					</span>
					<span className="font-serif text-[28px] leading-none text-ink-body">
						{formatDay(i.date)}
					</span>
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-center justify-between gap-2">
						<p className="truncate text-[15px] font-bold text-ink-strong">
							{fac?.name ?? "Interview"}
						</p>
						<div className="flex items-center gap-2">
							<StatusPill tone={isDone ? "sage" : "motion"}>
								{isDone ? "Completed" : "Upcoming"}
							</StatusPill>
							<RowActions
								onEdit={() => dialog.openEdit(i)}
								onDelete={() => remove.mutate(i.id)}
							/>
						</div>
					</div>
					<p className="truncate text-[12.5px] text-ink-soft">
						{[fac?.designation, i.remarks].filter(Boolean).join(" · ") ||
							" "}
					</p>
					<p className="text-[13px] font-semibold text-ink-muted">{i.time}</p>
				</div>
			</Card>
		);
	};

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title="Interviews"
				subtitle="The conversations ahead — you've done this before."
				actions={
					<>
						<FilterSelect
							value={facFilter}
							onChange={setFacFilter}
							allLabel="All faculties"
							options={(facultyList ?? []).map((f) => ({
								value: f.id,
								label: f.name,
							}))}
						/>
						<Button onClick={dialog.openCreate}>
							<Plus size={16} /> Add interview
						</Button>
					</>
				}
			/>

			{isLoading ? (
				<Loading />
			) : isError ? (
				<ErrorState onRetry={() => refetch()} />
			) : !data?.length ? (
				<Card className="border-dashed">
					<EmptyState
						title="No interviews yet"
						body="When a conversation gets scheduled, add it here. You'll always know what's coming next."
						action={
							<Button onClick={dialog.openCreate}>
								<Plus size={16} /> Add your first interview
							</Button>
						}
					/>
				</Card>
			) : (
				<div className="flex flex-col gap-8">
					{upcoming.length > 0 && (
						<section className="flex flex-col gap-3">
							<MicroLabel>Upcoming</MicroLabel>
							{upcoming.map((i) => renderCard(i, false))}
						</section>
					)}
					{done.length > 0 && (
						<section className="flex flex-col gap-3">
							<MicroLabel>Done</MicroLabel>
							{done.map((i) => renderCard(i, true))}
						</section>
					)}
				</div>
			)}

			<Dialog
				open={dialog.open}
				onOpenChange={(o) => (o ? dialog.setOpen(true) : dialog.close())}
				title={dialog.editing ? "Edit interview" : "Add an interview"}
				description="A conversation to look forward to."
			>
				<InterviewForm
					initial={dialog.editing}
					onSubmitted={dialog.close}
					onCancel={dialog.close}
				/>
			</Dialog>
		</div>
	);
}
