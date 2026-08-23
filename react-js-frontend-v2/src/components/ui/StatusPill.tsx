import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const pillVariants = cva("pill", {
	variants: {
		tone: {
			sage: "bg-sage-bg text-sage",
			motion: "bg-motion-bg text-motion",
			plum: "bg-plum-bg text-plum",
			stone: "bg-stone-bg text-stone",
			// "amber" = pending (Waiting/Draft): amber ink, no pill background
			amber: "!bg-transparent !px-0 text-amber-ink",
		},
	},
	defaultVariants: { tone: "stone" },
});

export interface StatusPillProps
	extends React.HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof pillVariants> {}

export function StatusPill({
	tone,
	className,
	children,
	...props
}: StatusPillProps) {
	return (
		<span className={cn(pillVariants({ tone }), className)} {...props}>
			{children}
		</span>
	);
}

/** Maps a free-text status label to a calm tone. */
export function toneForStatus(status: string): NonNullable<StatusPillProps["tone"]> {
	const s = status.toLowerCase();
	if (/(submit|complete|invited|warm|encourag|approved|replied|done)/.test(s))
		return "sage";
	if (/(interview)/.test(s)) return "plum";
	if (/(progress|deadline|pending|review|motion|gre)/.test(s)) return "motion";
	if (/(wait|draft)/.test(s)) return "amber";
	return "stone";
}
