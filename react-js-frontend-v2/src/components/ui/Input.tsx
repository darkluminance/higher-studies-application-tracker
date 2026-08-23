import { forwardRef } from "react";
import { cn } from "@/lib/cn";

const baseControl =
	"w-full rounded-control border border-line-field bg-field px-[13px] py-[11px] text-[13.5px] text-ink-strong placeholder:text-ink-faint transition-colors duration-150 ease-calm focus:border-clay focus:outline-none focus-visible:outline-none";

export const Input = forwardRef<
	HTMLInputElement,
	React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
	<input ref={ref} className={cn(baseControl, className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = forwardRef<
	HTMLTextAreaElement,
	React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, rows = 3, ...props }, ref) => (
	<textarea
		ref={ref}
		rows={rows}
		className={cn(baseControl, "resize-y leading-relaxed", className)}
		{...props}
	/>
));
Textarea.displayName = "Textarea";

export const Select = forwardRef<
	HTMLSelectElement,
	React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
	<select
		ref={ref}
		className={cn(
			baseControl,
			"cursor-pointer appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-9",
			className
		)}
		style={{
			backgroundImage:
				"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238a806f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
		}}
		{...props}
	>
		{children}
	</select>
));
Select.displayName = "Select";
