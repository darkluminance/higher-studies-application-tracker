import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface FilterOption {
	value: string;
	label: string;
}

interface FilterSelectProps {
	value: string;
	options: FilterOption[];
	onChange: (value: string) => void;
	/** Label shown when the "all" option (value === "") is selected. */
	allLabel?: string;
	className?: string;
}

/** Calm dropdown filter — active state uses the clay-wash chip treatment. */
export function FilterSelect({
	value,
	options,
	onChange,
	allLabel = "All",
	className,
}: FilterSelectProps) {
	const active = value !== "";
	const current = options.find((o) => o.value === value)?.label ?? allLabel;

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				className={cn(
					"inline-flex items-center gap-2 rounded-control border px-[13px] py-2 text-[12.5px] transition-colors duration-150 ease-calm",
					active
						? "border-transparent bg-clay-wash2 font-semibold text-clay-ink"
						: "border-line-field bg-field text-ink-soft hover:bg-rail",
					className
				)}
			>
				{current}
				<ChevronDown size={14} className="opacity-70" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content
					align="end"
					sideOffset={6}
					className="calm-scroll z-50 max-h-[300px] min-w-[180px] overflow-y-auto rounded-control border border-line-soft bg-paper-raised p-1.5 shadow-frame"
				>
					<FilterItem
						label={allLabel}
						selected={value === ""}
						onSelect={() => onChange("")}
					/>
					{options.map((opt) => (
						<FilterItem
							key={opt.value}
							label={opt.label}
							selected={opt.value === value}
							onSelect={() => onChange(opt.value)}
						/>
					))}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}

function FilterItem({
	label,
	selected,
	onSelect,
}: {
	label: string;
	selected: boolean;
	onSelect: () => void;
}) {
	return (
		<DropdownMenu.Item
			onSelect={onSelect}
			className={cn(
				"flex cursor-pointer items-center justify-between gap-3 rounded-[7px] px-2.5 py-2 text-[13px] outline-none transition-colors",
				"data-[highlighted]:bg-rail",
				selected ? "font-semibold text-clay-ink" : "text-ink-muted"
			)}
		>
			{label}
			{selected && <Check size={14} className="text-clay" />}
		</DropdownMenu.Item>
	);
}
