import { cn } from "@/lib/cn";

/** A raised paper panel — borders, no shadow (per the design's calm surfaces). */
export function Card({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"rounded-card border border-line-soft bg-paper-raised",
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
}
