"use client";

import {
  FileText,
  Building2,
  Users,
  Mail,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatRelativeTime, getInitials, stringToColor } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  type: "application" | "university" | "faculty" | "mail" | "interview";
  action: "created" | "updated" | "submitted" | "completed" | "scheduled";
  title: string;
  subtitle?: string;
  timestamp: string;
  status?: "success" | "warning" | "default";
  href?: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
  description?: string;
  viewAllHref?: string;
  limit?: number;
  className?: string;
}

const typeConfig = {
  application: {
    icon: FileText,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  university: {
    icon: Building2,
    color: "text-gold",
    bg: "bg-gold/10",
  },
  faculty: {
    icon: Users,
    color: "text-chart-5",
    bg: "bg-chart-5/10",
  },
  mail: {
    icon: Mail,
    color: "text-success",
    bg: "bg-success/10",
  },
  interview: {
    icon: Calendar,
    color: "text-warning",
    bg: "bg-warning/10",
  },
};

const actionLabels: Record<ActivityItem["action"], string> = {
  created: "Added",
  updated: "Updated",
  submitted: "Submitted",
  completed: "Completed",
  scheduled: "Scheduled",
};

export function ActivityFeed({
  activities,
  title = "Recent Activity",
  description = "Your latest application activity",
  viewAllHref,
  limit = 5,
  className,
}: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, limit);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {viewAllHref && activities.length > 0 && (
          <Button variant="ghost" size="sm" asChild>
            <Link href={viewAllHref}>
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {displayedActivities.length > 0 ? (
          <div className="space-y-3">
            {displayedActivities.map((activity, index) => (
              <ActivityItemRow
                key={activity.id}
                activity={activity}
                isLast={index === displayedActivities.length - 1}
              />
            ))}
          </div>
        ) : (
          <EmptyActivity />
        )}
      </CardContent>
    </Card>
  );
}

function ActivityItemRow({
  activity,
  isLast,
}: {
  activity: ActivityItem;
  isLast: boolean;
}) {
  const config = typeConfig[activity.type];
  const Icon = config.icon;

  const StatusIcon =
    activity.status === "success"
      ? CheckCircle2
      : activity.status === "warning"
      ? AlertCircle
      : Clock;

  const statusClass =
    activity.status === "success"
      ? "text-success"
      : activity.status === "warning"
      ? "text-warning"
      : "text-muted-foreground";

  const content = (
    <div
      className={cn(
        "flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group",
        activity.href && "cursor-pointer"
      )}
    >
      {/* Avatar / Icon */}
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105",
          config.bg
        )}
      >
        <Icon className={cn("w-5 h-5", config.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium truncate">{activity.title}</h4>
          <Badge
            variant="secondary"
            className={cn(
              "text-xs shrink-0",
              activity.status === "success" &&
                "bg-success/10 text-success border-success/20",
              activity.status === "warning" &&
                "bg-warning/10 text-warning border-warning/20"
            )}
          >
            {activity.status && <StatusIcon className="w-3 h-3 mr-1" />}
            {actionLabels[activity.action]}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {activity.subtitle || formatRelativeTime(activity.timestamp)}
        </p>
      </div>

      {/* Timestamp */}
      <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">
        {formatRelativeTime(activity.timestamp)}
      </span>
    </div>
  );

  if (activity.href) {
    return <Link href={activity.href}>{content}</Link>;
  }

  return content;
}

function EmptyActivity() {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
      <p>No recent activity</p>
      <p className="text-sm mt-1">Start by adding universities and applications</p>
    </div>
  );
}

// Compact version for smaller spaces
interface RecentApplicationsProps {
  applications: Array<{
    id: string;
    university: string;
    status: string;
    statusType: "success" | "warning" | "default";
    program: string;
  }>;
  viewAllHref?: string;
  className?: string;
}

export function RecentApplications({
  applications,
  viewAllHref = "/dashboard/applications",
  className,
}: RecentApplicationsProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Recent Applications
          </CardTitle>
          <CardDescription>Your latest application activity</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={viewAllHref}>
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {applications.length > 0 ? (
          <div className="space-y-3">
            {applications.map((app) => {
              const colorClass = stringToColor(app.university);

              return (
                <div
                  key={app.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-semibold text-sm",
                      colorClass
                    )}
                  >
                    {getInitials(app.university)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{app.university}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {app.program}
                    </p>
                  </div>
                  <Badge
                    variant={
                      app.statusType === "success"
                        ? "default"
                        : app.statusType === "warning"
                        ? "secondary"
                        : "outline"
                    }
                    className={cn(
                      app.statusType === "success" &&
                        "bg-success/10 text-success border-success/20",
                      app.statusType === "warning" &&
                        "bg-warning/10 text-warning border-warning/20"
                    )}
                  >
                    {app.statusType === "success" && (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    )}
                    {app.statusType === "warning" && (
                      <AlertCircle className="w-3 h-3 mr-1" />
                    )}
                    {app.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No applications yet</p>
            <p className="text-sm mt-1">Start by creating your first application</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
