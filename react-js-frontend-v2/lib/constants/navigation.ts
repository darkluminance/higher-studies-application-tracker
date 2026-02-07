// Dashboard Navigation Configuration

import {
  LayoutDashboard,
  Building2,
  Users,
  Mail,
  Calendar,
  UserCheck,
  FileText,
} from "lucide-react";

export const DASHBOARD_NAVIGATION = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Universities", href: "/dashboard/universities", icon: Building2 },
  { name: "Faculties", href: "/dashboard/faculties", icon: Users },
  { name: "Mails", href: "/dashboard/mails", icon: Mail },
  { name: "Interviews", href: "/dashboard/interviews", icon: Calendar },
  { name: "Recommenders", href: "/dashboard/recommenders", icon: UserCheck },
  { name: "Applications", href: "/dashboard/applications", icon: FileText },
] as const;

export type NavigationItem = (typeof DASHBOARD_NAVIGATION)[number];
