import { Link } from "react-router-dom";
import { Logo } from "@/components/brand/Logo";
import { buttonVariants } from "@/components/ui/Button";

export function NotFoundPage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas p-6 text-center">
			<Logo size={34} />
			<div>
				<h1 className="font-serif text-[30px] text-ink">This page wandered off</h1>
				<p className="mt-2 max-w-[380px] text-[14px] text-ink-soft">
					No harm done — let's get you back to somewhere familiar.
				</p>
			</div>
			<Link to="/" className={buttonVariants({ variant: "primary" })}>
				Back home
			</Link>
		</div>
	);
}
