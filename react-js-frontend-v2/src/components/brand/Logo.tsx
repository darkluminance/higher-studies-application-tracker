import { cn } from "@/lib/cn";

/** The graduation-cap mark in a single color (inherits `currentColor`). */
export function LogoMark({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 64 64"
			fill="none"
			stroke="currentColor"
			strokeWidth={3.4}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden="true"
		>
			<path d="M32 17 55 27 32 37 9 27z" fill="currentColor" stroke="none" />
			<path d="M16 31v9.5c0 3.6 7.2 6.5 16 6.5s16-2.9 16-6.5V31" />
			<path d="M55 27v11.5" />
			<circle cx="55" cy="42" r="3" fill="currentColor" stroke="none" />
		</svg>
	);
}

/** Clay app-tile with the cream mark — the favicon/app-icon lockup. */
export function LogoTile({
	size = 28,
	className,
}: {
	size?: number;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"inline-flex shrink-0 items-center justify-center rounded-mark bg-clay text-paper",
				className
			)}
			style={{ width: size, height: size }}
			aria-hidden="true"
		>
			<LogoMark className="h-1/2 w-1/2" />
		</span>
	);
}

interface LogoProps {
	size?: number;
	/** Show the "trackgrad" wordmark beside the tile. */
	showWordmark?: boolean;
	wordmarkClassName?: string;
	className?: string;
}

/** Full lockup: clay tile + "trackgrad" wordmark in Newsreader. */
export function Logo({
	size = 28,
	showWordmark = true,
	wordmarkClassName,
	className,
}: LogoProps) {
	return (
		<span className={cn("inline-flex items-center gap-2.5", className)}>
			<LogoTile size={size} />
			{showWordmark && (
				<span
					className={cn(
						"font-serif text-[19px] font-medium tracking-tight text-ink",
						wordmarkClassName
					)}
				>
					trackgrad
				</span>
			)}
		</span>
	);
}
