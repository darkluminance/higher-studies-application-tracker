import { Spinner } from "@/components/ui/Spinner";

/** Quiet loading state for a page/list. */
export function Loading({ label = "Gathering things…" }: { label?: string }) {
	return (
		<div className="flex flex-col items-center justify-center gap-3 py-20 text-ink-soft">
			<Spinner className="h-5 w-5 text-clay" />
			<p className="text-[13.5px]">{label}</p>
		</div>
	);
}

/** Gentle error state (never alarming). */
export function ErrorState({
	message = "We couldn't load this just now.",
	onRetry,
}: {
	message?: string;
	onRetry?: () => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center gap-3 py-20 text-center text-ink-soft">
			<p className="text-[14px]">{message}</p>
			{onRetry && (
				<button
					onClick={onRetry}
					className="text-[13px] font-semibold text-clay hover:text-clay-hover"
				>
					Try again
				</button>
			)}
		</div>
	);
}
