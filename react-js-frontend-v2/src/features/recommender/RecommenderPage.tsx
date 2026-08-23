import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Dialog } from "@/components/ui/Dialog";
import { RowActions } from "@/components/ui/RowActions";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading, ErrorState } from "@/features/shared/PageState";
import { useFormDialog } from "@/features/shared/useFormDialog";
import { recommenders } from "@/features/queries";
import type { Recommender } from "@/types";
import { RecommenderForm } from "./RecommenderForm";

export function RecommenderPage() {
	const { data, isLoading, isError, refetch } = recommenders.useList();
	const remove = recommenders.useRemove();
	const dialog = useFormDialog<Recommender>();

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title="Recommenders"
				subtitle="The people vouching for you. Keep their details close."
				actions={
					<Button onClick={dialog.openCreate}>
						<Plus size={16} /> Add recommender
					</Button>
				}
			/>

			{isLoading ? (
				<Loading />
			) : isError ? (
				<ErrorState onRetry={() => refetch()} />
			) : !data?.length ? (
				<Card className="border-dashed">
					<EmptyState
						title="No recommenders yet"
						body="Add the mentors and advisors who'll speak for you. There's no rush — one at a time is perfect."
						action={
							<Button onClick={dialog.openCreate}>
								<Plus size={16} /> Add your first recommender
							</Button>
						}
					/>
				</Card>
			) : (
				<div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
					{data.map((r) => (
						<Card key={r.id} className="flex flex-col p-[22px]">
							<div className="flex items-start justify-between gap-2">
								<div className="flex items-center gap-3">
									<Avatar name={r.name} size={46} />
									<div className="min-w-0">
										<p className="truncate text-[15.5px] font-bold text-ink-strong">
											{r.name}
										</p>
										<p className="truncate text-[12.5px] text-ink-soft">
											{[r.designation, r.institution]
												.filter(Boolean)
												.join(" · ")}
										</p>
									</div>
								</div>
								<RowActions
									onEdit={() => dialog.openEdit(r)}
									onDelete={() => remove.mutate(r.id)}
								/>
							</div>
							<div className="mt-4 border-t border-line-hair pt-3">
								{r.email && (
									<p className="truncate text-[12px] text-ink-muted">{r.email}</p>
								)}
								{r.relationship && (
									<p className="mt-1.5 flex items-center gap-2 text-[11.5px] text-ink-faint">
										<span className="h-[5px] w-[5px] rounded-full bg-clay" />
										{r.relationship}
									</p>
								)}
							</div>
						</Card>
					))}
				</div>
			)}

			<Dialog
				open={dialog.open}
				onOpenChange={(o) => (o ? dialog.setOpen(true) : dialog.close())}
				title={dialog.editing ? "Edit recommender" : "Add a recommender"}
				description="The people who'll write your letters."
			>
				<RecommenderForm
					initial={dialog.editing}
					onSubmitted={dialog.close}
					onCancel={dialog.close}
				/>
			</Dialog>
		</div>
	);
}
