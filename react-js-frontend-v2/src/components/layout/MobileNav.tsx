import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import * as RadixDialog from "@radix-ui/react-dialog";
import { Home, GraduationCap, Users, Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/cn";
import { navGroups, allNavItems } from "@/lib/navigation";
import { Logo } from "@/components/brand/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/lib/auth/AuthContext";

const clusterHome: Record<string, string> = {
	overview: "/",
	schools: "/university",
	people: "/faculty",
};

/** Mobile bottom bar + full-screen "More" menu (shown under 720px). */
export function MobileNav() {
	const [menuOpen, setMenuOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const name = user?.name || user?.username || "You";

	const activeCluster =
		allNavItems.find((i) =>
			i.to === "/" ? location.pathname === "/" : location.pathname.startsWith(i.to)
		)?.cluster ?? "overview";

	const tabs = [
		{ key: "overview", label: "Home", icon: Home },
		{ key: "schools", label: "Schools", icon: GraduationCap },
		{ key: "people", label: "People", icon: Users },
	] as const;

	return (
		<>
			<nav className="fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t border-line-rail bg-rail px-2 py-2 min-[720px]:hidden">
				{tabs.map((tab) => {
					const active = activeCluster === tab.key;
					return (
						<button
							key={tab.key}
							onClick={() => navigate(clusterHome[tab.key])}
							className="flex flex-1 flex-col items-center gap-1.5 py-1.5"
						>
							<span
								className={cn(
									"h-1.5 w-1.5 rounded-full",
									active ? "bg-clay" : "bg-[#c9bda5]"
								)}
							/>
							<span
								className={cn(
									"text-[10px]",
									active ? "font-bold text-clay" : "text-ink-faint"
								)}
							>
								{tab.label}
							</span>
						</button>
					);
				})}
				<button
					onClick={() => setMenuOpen(true)}
					className="flex flex-1 flex-col items-center gap-1 py-1"
					aria-label="More"
				>
					<Menu size={18} className="text-ink-muted" />
					<span className="text-[10px] text-ink-faint">More</span>
				</button>
			</nav>

			<RadixDialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
				<RadixDialog.Portal>
					<RadixDialog.Content className="fixed inset-0 z-50 flex flex-col bg-rail p-6 min-[720px]:hidden">
						<div className="flex items-center justify-between">
							<Logo size={28} />
							<RadixDialog.Close
								className="rounded-full p-2 text-ink-muted hover:bg-clay-wash/60"
								aria-label="Close menu"
							>
								<X size={20} />
							</RadixDialog.Close>
						</div>
						<RadixDialog.Title className="sr-only">Menu</RadixDialog.Title>

						<div className="mt-8 flex flex-1 flex-col gap-6 overflow-y-auto">
							{navGroups.map((group) => (
								<div key={group.label} className="flex flex-col gap-1">
									<p className="micro-label mb-1">{group.label}</p>
									{group.items.map((item) => (
										<NavLink
											key={item.to}
											to={item.to}
											end={item.to === "/"}
											onClick={() => setMenuOpen(false)}
											className={({ isActive }) =>
												cn(
													"flex items-center gap-3 rounded-control px-2 py-2.5 text-[17px]",
													isActive
														? "font-bold text-clay-ink"
														: "text-ink-muted"
												)
											}
										>
											<item.icon size={18} className="text-ink-soft" />
											{item.label}
										</NavLink>
									))}
								</div>
							))}
						</div>

						<div className="mt-4 flex items-center justify-between border-t border-line-rail pt-4">
							<div className="flex items-center gap-2.5">
								<Avatar name={name} size={32} variant="solid" />
								<span className="text-[14px] text-ink-muted">{name}</span>
							</div>
							<button
								onClick={() => {
									setMenuOpen(false);
									logout();
								}}
								className="flex items-center gap-2 text-[14px] font-semibold text-clay"
							>
								<LogOut size={16} />
								Sign out
							</button>
						</div>
					</RadixDialog.Content>
				</RadixDialog.Portal>
			</RadixDialog.Root>
		</>
	);
}
