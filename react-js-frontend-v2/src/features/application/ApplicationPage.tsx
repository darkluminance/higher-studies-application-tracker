import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Check, FileCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dialog } from "@/components/ui/Dialog";
import { StatusPill, toneForStatus } from "@/components/ui/StatusPill";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { RowActions } from "@/components/ui/RowActions";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading, ErrorState } from "@/features/shared/PageState";
import { useFormDialog } from "@/features/shared/useFormDialog";
import { applications, universities } from "@/features/queries";
import { formatShortDate } from "@/lib/format";
import type { Application, University } from "@/types";
import { ApplicationForm } from "./ApplicationForm";

const GRID = "1.7fr .8fr 1fr .9fr 1fr 40px";

function Recommenders({ app, uni }: { app: Application; uni?: University }) {
	const filled = app.recommenders_id?.filter(Boolean).length ?? 0;
	const needed = uni?.lor_count ?? 0;
	const complete = needed > 0 && filled >= needed;
	return (
		<span className="inline-flex items-center gap-1.5 text-ink-muted">
			{needed ? `${filled} of ${needed}` : `${filled}`}
			{complete && <Check size={14} className="text-sage" />}
		</span>
	);
}

export function ApplicationPage() {
	const { data, isLoading, isError, refetch } = applications.useList();
	const { data: unis } = universities.useList();
	const remove = applications.useRemove();
	const dialog = useFormDialog<Application>();
	const navigate = useNavigate();
	const [uniFilter, setUniFilter] = useState("");

	const uniMap = useMemo(() => {
		const map = new Map<string, University>();
		(unis ?? []).forEach((u) => map.set(u.id, u));
		return map;
	}, [unis]);

	const filtered = useMemo(
		() =>
			(data ?? []).filter((a) =>
				uniFilter ? a.university_id === uniFilter : true
			),
		[data, uniFilter]
	);

	const goToLetters = (a: Application) =>
		navigate(`/recommendation_status/${a.id}`);

	const columns: Column<Application>[] = [
		{
			key: "university",
			header: "University",
			render: (a) => {
				const u = uniMap.get(a.university_id);
				return (
					<div className="min-w-0">
						<p className="truncate text-[14.5px] font-bold text-ink-strong">
							{u?.name ?? "—"}
						</p>
						{u?.location && (
							<p className="truncate text-[11.5px] text-ink-faint">
								{u.location}
							</p>
						)}
					</div>
				);
			},
		},
		{ key: "type", header: "Type", render: (a) => a.application_type || "—" },
		{
			key: "status",
			header: "Status",
			render: (a) =>
				a.application_status ? (
					<StatusPill tone={toneForStatus(a.application_status)}>
						{a.application_status}
					</StatusPill>
				) : (
					"—"
				),
		},
		{
			key: "recs",
			header: "Recommenders",
			render: (a) => <Recommenders app={a} uni={uniMap.get(a.university_id)} />,
		},
		{
			key: "deadline",
			header: "Deadline",
			render: (a) =>
				formatShortDate(uniMap.get(a.university_id)?.application_deadline),
		},
		{
			key: "actions",
			header: "",
			className: "justify-self-end",
			render: (a) => (
				<RowActions
					onEdit={() => dialog.openEdit(a)}
					onDelete={() => remove.mutate(a.id)}
					extra={[
						{
							label: "Letters",
							icon: <FileCheck size={14} />,
							onSelect: () => goToLetters(a),
						},
					]}
				/>
			),
		},
	];

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title="Applications"
				subtitle="Every application and where it stands — at a calm glance."
				actions={
					<>
						<FilterSelect
							value={uniFilter}
							onChange={setUniFilter}
							allLabel="All universities"
							options={(unis ?? []).map((u) => ({ value: u.id, label: u.name }))}
						/>
						<Button onClick={dialog.openCreate}>
							<Plus size={16} /> New application
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
						title="No applications yet"
						body="When you're ready, start your first application. Every big journey begins with one quiet step."
						action={
							<Button onClick={dialog.openCreate}>
								<Plus size={16} /> Start your first application
							</Button>
						}
					/>
				</Card>
			) : (
				<DataTable
					columns={columns}
					data={filtered}
					gridTemplate={GRID}
					rowKey={(a) => a.id}
					onRowClick={goToLetters}
					renderMobileCard={(a) => {
						const u = uniMap.get(a.university_id);
						return (
							<Card className="p-4">
								<div className="flex items-start justify-between gap-2">
									<div className="min-w-0">
										<p className="truncate text-[15px] font-bold text-ink-strong">
											{u?.name ?? "—"}
										</p>
										<p className="text-[12px] text-ink-faint">
											{a.application_type}
										</p>
									</div>
									<RowActions
										onEdit={() => dialog.openEdit(a)}
										onDelete={() => remove.mutate(a.id)}
										extra={[
											{
												label: "Letters",
												icon: <FileCheck size={14} />,
												onSelect: () => goToLetters(a),
											},
										]}
									/>
								</div>
								<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.5px]">
									{a.application_status && (
										<StatusPill tone={toneForStatus(a.application_status)}>
											{a.application_status}
										</StatusPill>
									)}
									<Recommenders app={a} uni={u} />
									<span className="text-ink-muted">
										{formatShortDate(u?.application_deadline)}
									</span>
								</div>
							</Card>
						);
					}}
				/>
			)}

			<Dialog
				open={dialog.open}
				onOpenChange={(o) => (o ? dialog.setOpen(true) : dialog.close())}
				title={dialog.editing ? "Edit application" : "New application"}
				description="Where you're applying, and how it's going."
			>
				<ApplicationForm
					initial={dialog.editing}
					onSubmitted={dialog.close}
					onCancel={dialog.close}
				/>
			</Dialog>
		</div>
	);
}
