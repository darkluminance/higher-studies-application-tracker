import * as RadixSwitch from "@radix-ui/react-switch";
import { cn } from "@/lib/cn";

interface SwitchProps {
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
	/** Sage track when on (positive) instead of clay. */
	tone?: "clay" | "sage";
	id?: string;
	disabled?: boolean;
	"aria-label"?: string;
}

/** 44×26 toggle; clay/sage track when on, warm neutral when off. */
export function Switch({
	checked,
	onCheckedChange,
	tone = "clay",
	id,
	disabled,
	...aria
}: SwitchProps) {
	return (
		<RadixSwitch.Root
			id={id}
			checked={checked}
			onCheckedChange={onCheckedChange}
			disabled={disabled}
			className={cn(
				"relative h-[26px] w-[44px] shrink-0 rounded-full transition-colors duration-150 ease-calm",
				"data-[state=unchecked]:bg-[#e2d6c2]",
				tone === "sage"
					? "data-[state=checked]:bg-sage-bar"
					: "data-[state=checked]:bg-clay"
			)}
			{...aria}
		>
			<RadixSwitch.Thumb
				className={cn(
					"block h-5 w-5 translate-x-[3px] rounded-full bg-paper-raised shadow-sm transition-transform duration-150 ease-calm",
					"data-[state=checked]:translate-x-[21px]"
				)}
			/>
		</RadixSwitch.Root>
	);
}

/** A labeled toggle row as used in the forms' Requirements section. */
export function SwitchRow({
	label,
	description,
	checked,
	onCheckedChange,
	tone,
	id,
}: SwitchProps & { label: string; description?: string }) {
	return (
		<div className="flex items-center justify-between gap-4 py-2">
			<div>
				<label htmlFor={id} className="text-[13.5px] font-medium text-ink-strong">
					{label}
				</label>
				{description && (
					<p className="text-[12px] text-ink-soft">{description}</p>
				)}
			</div>
			<Switch
				id={id}
				checked={checked}
				onCheckedChange={onCheckedChange}
				tone={tone}
				aria-label={label}
			/>
		</div>
	);
}
