import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const tagVariants = cva(
	"inline-flex items-center rounded-md font-sans font-semibold leading-none",
	{
		variants: {
			tone: {
				sage: "bg-sage-bg text-sage",
				clay: "bg-motion-bg text-motion",
				stone: "bg-stone-bg text-stone",
			},
			size: {
				sm: "text-[10.5px] px-2 py-1",
				md: "text-[11.5px] px-2.5 py-1.5",
			},
		},
		defaultVariants: { tone: "sage", size: "sm" },
	}
);

export interface TagProps
	extends React.HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof tagVariants> {}

/** Small rounded tag — research areas (sage), test requirements (clay). */
export function Tag({ tone, size, className, children, ...props }: TagProps) {
	return (
		<span className={cn(tagVariants({ tone, size }), className)} {...props}>
			{children}
		</span>
	);
}
