import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Tag } from "@/components/ui/Tag";
import { Dialog } from "@/components/ui/Dialog";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { RowActions } from "@/components/ui/RowActions";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading, ErrorState } from "@/features/shared/PageState";
import { useFormDialog } from "@/features/shared/useFormDialog";
import { faculties, universities } from "@/features/queries";
import type { Faculty } from "@/types";
import { FacultyForm } from "./FacultyForm";

export function FacultyPage() {
	const { data, isLoading, isError, refetch } = faculties.useList();
	const { data: unis } = universities.useList();
	const remove = faculties.useRemove();
	const dialog = useFormDialog<Faculty>();
	const [uniFilter, setUniFilter] = useState("");

	const uniName = useMemo(() => {
		const map = new Map<string, string>();
		(unis ?? []).forEach((u) => map.set(u.id, u.name));
		return map;
	}, [unis]);

	const filtered = useMemo(
		() =>
			(data ?? []).filter((f) =>
				uniFilter ? f.university_id === uniFilter : true
			),
		[data, uniFilter]
	);

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title="Faculties"
				subtitle="People you'd love to work with."
				actions={
					<>
						<FilterSelect
							value={uniFilter}
							onChange={setUniFilter}
							allLabel="All universities"
							options={(unis ?? []).map((u) => ({ value: u.id, label: u.name }))}
						/>
						<Button onClick={dialog.openCreate}>
							<Plus size={16} /> Add faculty
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
						title="No faculties yet"
						body="Note the professors and researchers whose work excites you. You can reach out whenever you're ready."
						action={
							<Button onClick={dialog.openCreate}>
								<Plus size={16} /> Add your first faculty
							</Button>
						}
					/>
				</Card>
			) : (
				<div className="flex flex-col gap-3">
					{filtered.map((f) => (
						<Card
							key={f.id}
							className="flex items-center gap-4 px-5 py-[18px]"
						>
							<Avatar name={f.name} size={42} />
							<div className="min-w-0 flex-1">
								<div className="flex items-center justify-between gap-2">
									<p className="truncate text-[15px] font-bold text-ink-strong">
										{f.name}
									</p>
									<RowActions
										onEdit={() => dialog.openEdit(f)}
										onDelete={() => remove.mutate(f.id)}
									/>
								</div>
								<p className="truncate text-[12px] text-ink-soft">
									{[f.designation, uniName.get(f.university_id)]
										.filter(Boolean)
										.join(" · ")}
								</p>
								{f.email && (
									<p className="truncate text-[12.5px] text-ink-muted">
										{f.email}
									</p>
								)}
								{f.research_areas?.length > 0 && (
									<div className="mt-2 flex flex-wrap gap-1.5">
										{f.research_areas.filter(Boolean).map((area) => (
											<Tag key={area} tone="sage">
												{area}
											</Tag>
										))}
									</div>
								)}
							</div>
						</Card>
					))}
				</div>
			)}

			<Dialog
				open={dialog.open}
				onOpenChange={(o) => (o ? dialog.setOpen(true) : dialog.close())}
				title={dialog.editing ? "Edit faculty" : "Add a faculty"}
				description="Someone whose work you admire."
			>
				<FacultyForm
					initial={dialog.editing}
					onSubmitted={dialog.close}
					onCancel={dialog.close}
				/>
			</Dialog>
		</div>
	);
}
