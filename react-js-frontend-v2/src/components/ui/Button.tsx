import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { Spinner } from "./Spinner";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 rounded-control font-sans font-semibold transition-colors duration-150 ease-calm disabled:opacity-60 disabled:pointer-events-none select-none",
	{
		variants: {
			variant: {
				primary: "bg-clay text-paper hover:bg-clay-hover",
				secondary:
					"bg-field text-ink-muted border border-line-field hover:bg-rail",
				ghost: "text-ink-muted hover:bg-rail",
				link: "text-clay hover:text-clay-hover underline-offset-4 hover:underline px-0",
			},
			size: {
				sm: "text-[12.5px] px-3 py-1.5",
				md: "text-[13.5px] px-[15px] py-[9px]",
				lg: "text-sm px-[22px] py-[11px]",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "md",
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{ className, variant, size, loading, children, disabled, type, ...props },
		ref
	) => {
		return (
			<button
				ref={ref}
				type={type ?? "button"}
				disabled={disabled || loading}
				className={cn(buttonVariants({ variant, size }), className)}
				{...props}
			>
				{loading && <Spinner className="h-[15px] w-[15px]" />}
				{children}
			</button>
		);
	}
);
Button.displayName = "Button";

export { buttonVariants };
