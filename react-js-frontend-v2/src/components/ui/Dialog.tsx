import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

interface DialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: string;
	children: React.ReactNode;
	className?: string;
}

/** Centered modal used for the grouped Add/Edit forms. */
export function Dialog({
	open,
	onOpenChange,
	title,
	description,
	children,
	className,
}: DialogProps) {
	return (
		<RadixDialog.Root open={open} onOpenChange={onOpenChange}>
			<RadixDialog.Portal>
				<RadixDialog.Overlay className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-[2px]" />
				<RadixDialog.Content
					className={cn(
						"calm-scroll fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100vw-32px)] max-w-[680px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-card-lg border border-line-soft bg-paper-raised p-[26px] shadow-frame sm:p-7",
						className
					)}
				>
					<div className="mb-5 flex items-start justify-between gap-4">
						<div>
							<RadixDialog.Title className="font-serif text-[22px] text-ink">
								{title}
							</RadixDialog.Title>
							{description && (
								<RadixDialog.Description className="mt-1 text-[13.5px] text-ink-soft">
									{description}
								</RadixDialog.Description>
							)}
						</div>
						<RadixDialog.Close
							className="rounded-full p-1.5 text-ink-faint transition-colors hover:bg-rail hover:text-ink-muted"
							aria-label="Close"
						>
							<X size={18} />
						</RadixDialog.Close>
					</div>
					{children}
				</RadixDialog.Content>
			</RadixDialog.Portal>
		</RadixDialog.Root>
	);
}
