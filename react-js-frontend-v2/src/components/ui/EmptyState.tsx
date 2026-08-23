import { cn } from "@/lib/cn";

interface EmptyStateProps {
	icon?: React.ReactNode;
	title: string;
	body: string;
	action?: React.ReactNode;
	footnote?: string;
	className?: string;
}

/** The calm first-run / empty-collection pattern (screen 10). */
export function EmptyState({
	icon,
	title,
	body,
	action,
	footnote,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				"mx-auto flex max-w-[420px] flex-col items-center px-6 py-16 text-center",
				className
			)}
		>
			<div className="mb-6 flex h-[88px] w-[88px] items-center justify-center rounded-[24px] border border-[#e6d6c4] bg-clay-wash2 text-clay">
				{icon ?? <div className="h-[30px] w-[30px] rounded-full ring-2 ring-clay" />}
			</div>
			<h2 className="font-serif text-[28px] text-ink">{title}</h2>
			<p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{body}</p>
			{action && <div className="mt-7">{action}</div>}
			{footnote && (
				<p className="mt-6 text-[12px] text-label-cal">{footnote}</p>
			)}
		</div>
	);
}
