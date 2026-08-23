import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

interface RowActionsProps {
	onEdit?: () => void;
	onDelete?: () => void;
	extra?: { label: string; icon?: React.ReactNode; onSelect: () => void }[];
}

/** Subtle ⋯ menu for per-row edit/delete — keeps the quiet rows uncluttered. */
export function RowActions({ onEdit, onDelete, extra }: RowActionsProps) {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				className="flex h-8 w-8 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-rail hover:text-ink-muted"
				aria-label="Row actions"
				onClick={(e) => e.stopPropagation()}
			>
				<MoreHorizontal size={18} />
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content
					align="end"
					sideOffset={4}
					className="z-50 min-w-[150px] rounded-control border border-line-soft bg-paper-raised p-1.5 shadow-frame"
				>
					{extra?.map((item) => (
						<Item
							key={item.label}
							icon={item.icon}
							label={item.label}
							onSelect={item.onSelect}
						/>
					))}
					{onEdit && (
						<Item
							icon={<Pencil size={14} />}
							label="Edit"
							onSelect={onEdit}
						/>
					)}
					{onDelete && (
						<Item
							icon={<Trash2 size={14} />}
							label="Delete"
							onSelect={onDelete}
							tone="danger"
						/>
					)}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}

function Item({
	icon,
	label,
	onSelect,
	tone = "default",
}: {
	icon?: React.ReactNode;
	label: string;
	onSelect: () => void;
	tone?: "default" | "danger";
}) {
	return (
		<DropdownMenu.Item
			onSelect={onSelect}
			className={
				"flex cursor-pointer items-center gap-2.5 rounded-[7px] px-2.5 py-2 text-[13px] outline-none transition-colors data-[highlighted]:bg-rail " +
				(tone === "danger" ? "text-motion" : "text-ink-muted")
			}
		>
			{icon}
			{label}
		</DropdownMenu.Item>
	);
}
