import {
	Home,
	GraduationCap,
	FileText,
	Users,
	UserCheck,
	Mail,
	CalendarClock,
	type LucideIcon,
} from "lucide-react";

export interface NavItem {
	label: string;
	to: string;
	icon: LucideIcon;
	/** Which mobile bottom-bar cluster this belongs to. */
	cluster: "overview" | "schools" | "people" | "outreach";
}

export interface NavGroup {
	label: string;
	items: NavItem[];
}

/** Grouped sidebar navigation (Overview / Schools / People / Outreach). */
export const navGroups: NavGroup[] = [
	{
		label: "Overview",
		items: [{ label: "Home", to: "/", icon: Home, cluster: "overview" }],
	},
	{
		label: "Schools",
		items: [
			{ label: "Universities", to: "/university", icon: GraduationCap, cluster: "schools" },
			{ label: "Applications", to: "/application", icon: FileText, cluster: "schools" },
		],
	},
	{
		label: "People",
		items: [
			{ label: "Faculties", to: "/faculty", icon: Users, cluster: "people" },
			{ label: "Recommenders", to: "/recommender", icon: UserCheck, cluster: "people" },
		],
	},
	{
		label: "Outreach",
		items: [
			{ label: "Mails", to: "/mail", icon: Mail, cluster: "outreach" },
			{ label: "Interviews", to: "/interview", icon: CalendarClock, cluster: "outreach" },
		],
	},
];

export const allNavItems: NavItem[] = navGroups.flatMap((g) => g.items);
