import { cn } from "@/lib/cn";

interface AvatarProps {
	name: string;
	/** Diameter in px. */
	size?: number;
	/** Visual style: solid clay-avatar (user) or clay-wash tile (entities). */
	variant?: "solid" | "wash";
	className?: string;
}

export function initialsOf(name: string, max = 2): string {
	const parts = name
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.filter((p) => !/^(prof\.?|dr\.?|mr\.?|ms\.?|mrs\.?)$/i.test(p));
	const source = parts.length ? parts : name.trim().split(/\s+/);
	return source
		.slice(0, max)
		.map((p) => p[0]?.toUpperCase() ?? "")
		.join("");
}

/** Round avatar showing a person's initials in Newsreader. */
export function Avatar({ name, size = 42, variant = "wash", className }: AvatarProps) {
	return (
		<span
			className={cn(
				"inline-flex shrink-0 items-center justify-center rounded-full font-serif",
				variant === "solid"
					? "bg-clay-avatar text-clay-ink"
					: "bg-clay-wash2 text-clay",
				className
			)}
			style={{
				width: size,
				height: size,
				fontSize: Math.round(size * 0.42),
			}}
			aria-hidden="true"
		>
			{initialsOf(name) || "•"}
		</span>
	);
}
