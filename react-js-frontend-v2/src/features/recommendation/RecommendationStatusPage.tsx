import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MicroLabel } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading, ErrorState } from "@/features/shared/PageState";
import { recommendationStatusService } from "@/lib/api";
import { toast } from "@/lib/toast";
import { isYes, type RecommendationStatus } from "@/types";

export function RecommendationStatusPage() {
	const { applicationId = "" } = useParams();
	const qc = useQueryClient();
	const listKey = ["recstatus", applicationId] as const;

	const list = useQuery({
		queryKey: listKey,
		queryFn: () => recommendationStatusService.listByApplication(applicationId),
		enabled: Boolean(applicationId),
	});

	const nameQuery = useQuery({
		queryKey: ["recstatus-uni", applicationId],
		queryFn: () => recommendationStatusService.universityName(applicationId),
		enabled: Boolean(applicationId),
	});

	const toggle = useMutation({
		mutationFn: ({ id, value }: { id: string; value: boolean }) =>
			recommendationStatusService.setSubmitted(id, value),
		onMutate: async ({ id, value }) => {
			await qc.cancelQueries({ queryKey: listKey });
			const prev = qc.getQueryData<RecommendationStatus[]>(listKey);
			qc.setQueryData<RecommendationStatus[]>(listKey, (old) =>
				(old ?? []).map((r) =>
					r.id === id ? { ...r, is_lor_submitted: value } : r
				)
			);
			return { prev };
		},
		onError: (_e, _v, ctx) => {
			if (ctx?.prev) qc.setQueryData(listKey, ctx.prev);
			toast.error("Couldn't update that just now.");
		},
		onSettled: () => qc.invalidateQueries({ queryKey: listKey }),
	});

	const rows = list.data ?? [];
	const submitted = useMemo(
		() => rows.filter((r) => isYes(r.is_lor_submitted)).length,
		[rows]
	);
	const total = rows.length;
	const ratio = total ? submitted / total : 0;

	return (
		<div className="mx-auto flex max-w-[640px] flex-col gap-6">
			<Link
				to="/application"
				className="inline-flex items-center gap-1 text-[12.5px] text-clay hover:text-clay-hover"
			>
				<ChevronLeft size={15} /> Back to applications
			</Link>

			<div>
				<MicroLabel className="text-clay-ink">Recommendation letters</MicroLabel>
				<h1 className="mt-1 font-serif text-[27px] text-ink">
					{nameQuery.data || "This application"}
				</h1>
			</div>

			{list.isLoading ? (
				<Loading />
			) : list.isError ? (
				<ErrorState onRetry={() => list.refetch()} />
			) : total === 0 ? (
				<Card className="border-dashed">
					<EmptyState
						title="No letters to track yet"
						body="Add recommenders to this application and their letters will appear here to check off, one calm step at a time."
					/>
				</Card>
			) : (
				<>
					<div className="flex items-center gap-4">
						<ProgressBar value={ratio} tone="sage" className="flex-1" />
						<span className="shrink-0 text-[12.5px] font-semibold text-ink-muted">
							{submitted} of {total} submitted
						</span>
					</div>

					<Card>
						{rows.map((r) => {
							const on = isYes(r.is_lor_submitted);
							return (
								<div
									key={r.id}
									className="flex items-center justify-between gap-4 border-b border-line-hair px-[22px] py-[18px] last:border-b-0"
								>
									<div className="min-w-0">
										<p className="truncate text-[15px] font-bold text-ink-strong">
											{r.name}
										</p>
										<p className="text-[12px] text-ink-faint">
											Recommendation letter
										</p>
									</div>
									<div className="flex items-center gap-3">
										<span
											className={
												"text-[12.5px] " +
												(on ? "text-sage" : "text-amber-ink")
											}
										>
											{on ? "Submitted" : "Awaiting"}
										</span>
										<Switch
											tone="sage"
											checked={on}
											onCheckedChange={(v) => toggle.mutate({ id: r.id, value: v })}
											aria-label={`Mark ${r.name}'s letter submitted`}
										/>
									</div>
								</div>
							);
						})}
					</Card>

					<p className="text-center text-[12.5px] text-ink-faint">
						A quiet nudge: there's still time. No need to chase yet.
					</p>
				</>
			)}
		</div>
	);
}
