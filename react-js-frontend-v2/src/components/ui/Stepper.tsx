import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

interface StepperProps {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	/** Renders "{value} {unit}{s}" beside the controls. */
	unit?: string;
	className?: string;
}

/** − / + stepper (e.g. Letters of recommendation count). */
export function Stepper({
	value,
	onChange,
	min = 0,
	max = 99,
	unit,
	className,
}: StepperProps) {
	const clamp = (n: number) => Math.max(min, Math.min(max, n));
	const btn =
		"flex h-9 w-9 items-center justify-center rounded-control border border-line-field bg-field text-ink-muted transition-colors duration-150 ease-calm hover:bg-rail disabled:opacity-40 disabled:pointer-events-none";

	return (
		<div className={cn("flex items-center gap-3", className)}>
			<button
				type="button"
				className={btn}
				aria-label="Decrease"
				disabled={value <= min}
				onClick={() => onChange(clamp(value - 1))}
			>
				<Minus size={16} />
			</button>
			<span className="min-w-[64px] text-center text-[13.5px] font-semibold text-ink-strong">
				{value}
				{unit ? ` ${unit}${value === 1 ? "" : "s"}` : ""}
			</span>
			<button
				type="button"
				className={btn}
				aria-label="Increase"
				disabled={value >= max}
				onClick={() => onChange(clamp(value + 1))}
			>
				<Plus size={16} />
			</button>
		</div>
	);
}
