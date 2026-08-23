import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

interface ChipFieldProps {
	value: string[];
	onChange: (value: string[]) => void;
	placeholder?: string;
	id?: string;
	className?: string;
}

/** Tag input — type + Enter/comma to add a chip, click × to remove. */
export function ChipField({
	value,
	onChange,
	placeholder = "Type and press Enter",
	id,
	className,
}: ChipFieldProps) {
	const [draft, setDraft] = useState("");

	const commit = () => {
		const next = draft.trim();
		if (next && !value.includes(next)) onChange([...value, next]);
		setDraft("");
	};

	const remove = (chip: string) => onChange(value.filter((c) => c !== chip));

	const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			commit();
		} else if (e.key === "Backspace" && !draft && value.length) {
			onChange(value.slice(0, -1));
		}
	};

	return (
		<div
			className={cn(
				"flex flex-wrap items-center gap-2 rounded-control border border-line-field bg-field px-3 py-2.5 focus-within:border-clay",
				className
			)}
		>
			{value.map((chip) => (
				<span
					key={chip}
					className="inline-flex items-center gap-1.5 rounded-md bg-clay-wash2 px-2 py-1 text-[12px] font-semibold text-clay-ink"
				>
					{chip}
					<button
						type="button"
						onClick={() => remove(chip)}
						className="text-clay-ink/70 hover:text-clay-ink"
						aria-label={`Remove ${chip}`}
					>
						<X size={13} />
					</button>
				</span>
			))}
			<input
				id={id}
				value={draft}
				onChange={(e) => setDraft(e.target.value)}
				onKeyDown={onKeyDown}
				onBlur={commit}
				placeholder={value.length ? "" : placeholder}
				className="min-w-[120px] flex-1 bg-transparent text-[13.5px] text-ink-strong placeholder:text-ink-faint focus:outline-none"
			/>
		</div>
	);
}
