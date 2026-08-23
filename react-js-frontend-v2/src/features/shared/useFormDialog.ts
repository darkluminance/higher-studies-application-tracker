import { useState } from "react";

/** Manages an add/edit dialog: open state + the item being edited (if any). */
export function useFormDialog<T>() {
	const [open, setOpen] = useState(false);
	const [editing, setEditing] = useState<T | null>(null);

	return {
		open,
		editing,
		setOpen,
		openCreate: () => {
			setEditing(null);
			setOpen(true);
		},
		openEdit: (item: T) => {
			setEditing(item);
			setOpen(true);
		},
		close: () => {
			setOpen(false);
			setEditing(null);
		},
	};
}
