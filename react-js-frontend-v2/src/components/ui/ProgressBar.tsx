import { cn } from "@/lib/cn";

interface ProgressBarProps {
	/** 0–1 ratio. */
	value: number;
	tone?: "clay" | "sage";
	className?: string;
}

/** A slim 7px progress bar; sage for positive, clay for active. */
export function ProgressBar({ value, tone = "clay", className }: ProgressBarProps) {
	const pct = Math.max(0, Math.min(1, value || 0)) * 100;
	return (
		<div
			className={cn("h-[7px] w-full overflow-hidden rounded-md bg-line-soft", className)}
			role="progressbar"
			aria-valuenow={Math.round(pct)}
			aria-valuemin={0}
			aria-valuemax={100}
		>
			<div
				className={cn(
					"h-full rounded-md transition-[width] duration-500 ease-calm",
					tone === "sage" ? "bg-sage-bar" : "bg-clay"
				)}
				style={{ width: `${pct}%` }}
			/>
		</div>
	);
}

/** Label row above/aside a progress bar: title (muted) + value (strong). */
export function ProgressLabel({
	label,
	value,
}: {
	label: string;
	value: string;
}) {
	return (
		<div className="flex items-center justify-between text-[12.5px]">
			<span className="text-ink-muted">{label}</span>
			<span className="font-bold text-ink-strong">{value}</span>
		</div>
	);
}
