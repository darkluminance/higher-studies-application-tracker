import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

/**
 * Two-column app frame: paper surface on canvas, outer border + soft shadow +
 * 18px radius. Sidebar on the left (desktop), fluid main area on the right.
 */
export function AppShell() {
	return (
		<div className="min-h-screen bg-canvas p-0 min-[720px]:p-5">
			<div className="mx-auto flex min-h-screen w-full max-w-content overflow-hidden bg-paper min-[720px]:min-h-[calc(100vh-40px)] min-[720px]:rounded-frame min-[720px]:border min-[720px]:border-line min-[720px]:shadow-frame">
				<Sidebar />
				<main className="calm-scroll flex-1 overflow-y-auto px-5 pb-24 pt-6 min-[720px]:px-10 min-[720px]:pb-10 min-[720px]:pt-[34px]">
					<Outlet />
				</main>
			</div>
			<MobileNav />
		</div>
	);
}
