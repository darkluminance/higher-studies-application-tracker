import { cn } from "@/lib/cn";

interface FieldProps {
	label?: string;
	htmlFor?: string;
	hint?: string;
	className?: string;
	children: React.ReactNode;
}

/** Label (above) + control wrapper used across the grouped forms. */
export function Field({ label, htmlFor, hint, className, children }: FieldProps) {
	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			{label && (
				<label
					htmlFor={htmlFor}
					className="text-[11.5px] font-semibold text-ink-soft"
				>
					{label}
				</label>
			)}
			{children}
			{hint && <p className="text-[11.5px] text-ink-faint">{hint}</p>}
		</div>
	);
}

/** Uppercase micro-label, used as section headers and column headers. */
export function MicroLabel({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return <p className={cn("micro-label", className)}>{children}</p>;
}
