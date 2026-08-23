import { cn } from "@/lib/cn";
import { Logo } from "@/components/brand/Logo";

interface AuthLayoutProps {
	/** Which side the clay brand panel sits on. */
	brandSide: "left" | "right";
	brandWidth?: number;
	pitch: string;
	footnote: string;
	children: React.ReactNode;
}

/** Split brand-panel + form card used by Sign in / Register. */
export function AuthLayout({
	brandSide,
	brandWidth = 240,
	pitch,
	footnote,
	children,
}: AuthLayoutProps) {
	const brand = (
		<div
			className={cn(
				"hidden flex-col justify-between bg-clay-wash2 p-8 min-[640px]:flex",
				brandSide === "left"
					? "border-r border-[#e6d6c4]"
					: "border-l border-[#e6d6c4]"
			)}
			style={{ width: brandWidth }}
		>
			<Logo size={30} />
			<p className="font-serif text-[23px] leading-snug text-ink">{pitch}</p>
			<p className="text-[11.5px] text-[#a98d70]">{footnote}</p>
		</div>
	);

	return (
		<div className="flex min-h-screen items-center justify-center bg-canvas p-4">
			<div className="flex w-full max-w-[600px] overflow-hidden rounded-card-lg border border-line bg-paper-raised shadow-frame">
				{brandSide === "left" && brand}
				<div className="flex flex-1 flex-col justify-center p-8 sm:p-10">
					{/* Compact logo shown when brand panel is hidden (mobile) */}
					<div className="mb-6 min-[640px]:hidden">
						<Logo size={28} />
					</div>
					{children}
				</div>
				{brandSide === "right" && brand}
			</div>
		</div>
	);
}
