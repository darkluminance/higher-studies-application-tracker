import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/cn";
import { navGroups } from "@/lib/navigation";
import { Logo } from "@/components/brand/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/lib/auth/AuthContext";

/** Fixed 210px desktop sidebar (hidden under 720px). */
export function Sidebar() {
	const { user, logout } = useAuth();
	const name = user?.name || user?.username || "You";

	return (
		<aside className="hidden w-[210px] shrink-0 flex-col gap-[26px] border-r border-line-rail bg-rail px-[18px] py-[26px] min-[720px]:flex">
			<div className="px-1.5">
				<Logo size={26} />
			</div>

			<nav className="flex flex-1 flex-col gap-[22px]">
				{navGroups.map((group) => (
					<div key={group.label} className="flex flex-col gap-1.5">
						<p className="micro-label px-2.5">{group.label}</p>
						{group.items.map((item) => (
							<NavLink
								key={item.to}
								to={item.to}
								end={item.to === "/"}
								className={({ isActive }) =>
									cn(
										"group flex items-center gap-2.5 rounded-control px-2.5 py-[9px] text-[13.5px] transition-colors duration-150 ease-calm",
										isActive
											? "bg-clay-wash font-bold text-clay-ink"
											: "font-medium text-ink-muted hover:bg-clay-wash/50"
									)
								}
							>
								{({ isActive }) => (
									<>
										<span
											className={cn(
												"h-[5px] w-[5px] shrink-0 rounded-full transition-colors",
												isActive ? "bg-clay" : "bg-transparent"
											)}
										/>
										<item.icon
											size={16}
											className={cn(
												"shrink-0",
												isActive ? "text-clay-ink" : "text-ink-soft"
											)}
										/>
										{item.label}
									</>
								)}
							</NavLink>
						))}
					</div>
				))}
			</nav>

			<div className="mt-auto flex items-center justify-between gap-2 border-t border-line-rail pt-4">
				<div className="flex min-w-0 items-center gap-2.5">
					<Avatar name={name} size={28} variant="solid" />
					<span className="truncate text-[12px] text-ink-muted">{name}</span>
				</div>
				<button
					onClick={logout}
					className="shrink-0 rounded-full p-1.5 text-ink-faint transition-colors hover:bg-clay-wash/60 hover:text-clay-ink"
					aria-label="Sign out"
					title="Sign out"
				>
					<LogOut size={15} />
				</button>
			</div>
		</aside>
	);
}
