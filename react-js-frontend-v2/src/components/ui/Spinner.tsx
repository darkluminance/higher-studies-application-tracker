import { cn } from "@/lib/cn";

/** A quiet, slow spinner in keeping with the calm tone. */
export function Spinner({ className }: { className?: string }) {
	return (
		<span
			role="status"
			aria-label="Loading"
			className={cn(
				"inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70",
				className
			)}
		/>
	);
}
