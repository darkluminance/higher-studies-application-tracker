import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Dialog } from "@/components/ui/Dialog";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { RowActions } from "@/components/ui/RowActions";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading, ErrorState } from "@/features/shared/PageState";
import { useFormDialog } from "@/features/shared/useFormDialog";
import { universities } from "@/features/queries";
import { formatShortDate } from "@/lib/format";
import { isYes } from "@/types";
import type { University } from "@/types";
import { UniversityForm } from "./UniversityForm";

const GRID = "1.9fr .7fr 1fr .9fr 1.1fr .6fr 40px";

function Tests({ u }: { u: University }) {
	const tags: string[] = [];
	if (isYes(u.is_gre_must)) tags.push("GRE");
	if (isYes(u.is_gmat_must)) tags.push("GMAT");
	if (!tags.length) return <span className="text-ink-faint">—</span>;
	return (
		<div className="flex flex-wrap gap-1.5">
			{tags.map((t) => (
				<Tag key={t} tone="clay">
					{t}
				</Tag>
			))}
		</div>
	);
}

export function UniversityPage() {
	const { data, isLoading, isError, refetch } = universities.useList();
	const remove = universities.useRemove();
	const dialog = useFormDialog<University>();
	const [query, setQuery] = useState("");

	const filtered = useMemo(() => {
		const list = data ?? [];
		const q = query.trim().toLowerCase();
		if (!q) return list;
		return list.filter(
			(u) =>
				u.name.toLowerCase().includes(q) ||
				u.location?.toLowerCase().includes(q)
		);
	}, [data, query]);

	const columns: Column<University>[] = [
		{
			key: "name",
			header: "University",
			render: (u) => (
				<div className="min-w-0">
					<p className="truncate text-[14.5px] font-bold text-ink-strong">
						{u.name}
					</p>
					{u.location && (
						<p className="truncate text-[11.5px] text-ink-faint">{u.location}</p>
					)}
				</div>
			),
		},
		{
			key: "rank",
			header: "Rank",
			render: (u) =>
				u.main_ranking ? (
					<span className="text-ink-body">#{u.main_ranking}</span>
				) : (
					<span className="text-ink-faint">—</span>
				),
		},
		{
			key: "deadline",
			header: "Deadline",
			render: (u) => formatShortDate(u.application_deadline),
		},
		{
			key: "fee",
			header: "Fee",
			render: (u) =>
				u.application_fee ? (
					<span>{u.application_fee}</span>
				) : (
					<span className="text-ink-faint">—</span>
				),
		},
		{ key: "tests", header: "Tests", render: (u) => <Tests u={u} /> },
		{ key: "lor", header: "LOR", render: (u) => u.lor_count },
		{
			key: "actions",
			header: "",
			className: "justify-self-end",
			render: (u) => (
				<RowActions
					onEdit={() => dialog.openEdit(u)}
					onDelete={() => remove.mutate(u.id)}
				/>
			),
		},
	];

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title="Universities"
				subtitle="The schools on your list. A calm place to keep the essentials."
				actions={
					<>
						<div className="relative">
							<Search
								size={15}
								className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
							/>
							<input
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search"
								className="w-40 rounded-control border border-line-field bg-field py-2 pl-9 pr-3 text-[12.5px] text-ink-strong placeholder:text-ink-faint focus:border-clay focus:outline-none"
							/>
						</div>
						<Button onClick={dialog.openCreate}>
							<Plus size={16} /> Add university
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
						title="Let's begin the journey"
						body="Your list is a blank page for now. Add the first university you're dreaming about — one is plenty to start."
						action={
							<Button onClick={dialog.openCreate}>
								<Plus size={16} /> Add your first university
							</Button>
						}
						footnote="Take your time. There's no clock here."
					/>
				</Card>
			) : (
				<DataTable
					columns={columns}
					data={filtered}
					gridTemplate={GRID}
					rowKey={(u) => u.id}
					renderMobileCard={(u) => (
						<Card className="p-4">
							<div className="flex items-start justify-between gap-2">
								<div className="min-w-0">
									<p className="truncate text-[15px] font-bold text-ink-strong">
										{u.name}
									</p>
									{u.location && (
										<p className="text-[12px] text-ink-faint">{u.location}</p>
									)}
								</div>
								<RowActions
									onEdit={() => dialog.openEdit(u)}
									onDelete={() => remove.mutate(u.id)}
								/>
							</div>
							<div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-ink-muted">
								<span>{u.main_ranking ? `#${u.main_ranking}` : "—"}</span>
								<span>{formatShortDate(u.application_deadline)}</span>
								{u.application_fee ? <span>{u.application_fee}</span> : null}
								<span>{u.lor_count} LOR</span>
								<Tests u={u} />
							</div>
						</Card>
					)}
				/>
			)}

			<Dialog
				open={dialog.open}
				onOpenChange={(o) => (o ? dialog.setOpen(true) : dialog.close())}
				title={dialog.editing ? "Edit university" : "Add a university"}
				description="Just the essentials — you can always come back and add more."
			>
				<UniversityForm
					initial={dialog.editing}
					onSubmitted={dialog.close}
					onCancel={dialog.close}
				/>
			</Dialog>
		</div>
	);
}
