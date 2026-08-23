import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { MicroLabel } from "@/components/ui/Field";

/** A form section led by a clay micro-label, divided by a hairline top border. */
export function FormSection({
	label,
	first,
	children,
}: {
	label: string;
	first?: boolean;
	children: React.ReactNode;
}) {
	return (
		<section
			className={cn(
				"flex flex-col gap-4",
				!first && "border-t border-line-hair pt-6"
			)}
		>
			<MicroLabel className="text-clay-ink">{label}</MicroLabel>
			{children}
		</section>
	);
}

/** Right-aligned Cancel + Save footer with a hairline top border. */
export function FormFooter({
	saving,
	saveLabel,
	onCancel,
}: {
	saving: boolean;
	saveLabel: string;
	onCancel: () => void;
}) {
	return (
		<div className="flex items-center justify-end gap-3 border-t border-line-hair pt-5">
			<Button variant="ghost" onClick={onCancel} disabled={saving}>
				Cancel
			</Button>
			<Button type="submit" loading={saving}>
				{saveLabel}
			</Button>
		</div>
	);
}
