"use client";

import { Calendar, Clock, Users, AlertCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatRelativeTime } from "@/lib/utils";

export interface TimelineEvent {
  id: string;
  type: "deadline" | "interview";
  title: string;
  date: string;
  university?: string;
  designation?: string;
  daysLeft: number;
  status: "urgent" | "upcoming" | "normal";
}

interface UpcomingTimelineProps {
  events: TimelineEvent[];
  viewAllHref?: string;
  emptyMessage?: string;
  className?: string;
}

export function UpcomingTimeline({
  events,
  viewAllHref = "/dashboard/interviews",
  emptyMessage = "No upcoming events",
  className,
}: UpcomingTimelineProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-gold" />
            Upcoming Events
          </CardTitle>
          <CardDescription>Deadlines and interviews coming up</CardDescription>
        </div>
        {events.length > 0 && (
          <Button variant="ghost" size="sm" asChild>
            <Link href={viewAllHref}>
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length > 0 ? (
          events.map((event, index) => (
            <TimelineItem
              key={event.id}
              event={event}
              isLast={index === events.length - 1}
            />
          ))
        ) : (
          <EmptyTimeline message={emptyMessage} />
        )}
      </CardContent>
    </Card>
  );
}

function TimelineItem({
  event,
  isLast,
}: {
  event: TimelineEvent;
  isLast: boolean;
}) {
  const isDeadline = event.type === "deadline";
  const isUrgent = event.status === "urgent";

  const iconBgClass = isDeadline
    ? isUrgent
      ? "bg-destructive/10"
      : "bg-gold/10"
    : "bg-primary/10";

  const iconClass = isDeadline
    ? isUrgent
      ? "text-destructive"
      : "text-gold"
    : "text-primary";

  const Icon = isDeadline ? Calendar : Users;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysLabel = (daysLeft: number) => {
    if (daysLeft === 0) return "Today";
    if (daysLeft === 1) return "Tomorrow";
    return `${daysLeft} days`;
  };

  const badgeVariant =
    event.status === "urgent"
      ? "destructive"
      : event.status === "upcoming"
      ? "default"
      : "secondary";

  return (
    <div
      className={cn(
        "relative flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group",
        isUrgent && "ring-1 ring-destructive/20"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
          iconBgClass
        )}
      >
        <Icon className={cn("w-5 h-5", iconClass)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate flex items-center gap-2">
          {event.title}
          {isUrgent && (
            <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
          )}
        </h4>
        <p className="text-sm text-muted-foreground">
          {formatDate(event.date)}
          {event.university && ` • ${event.university}`}
        </p>
      </div>

      {/* Badge */}
      <Badge variant={badgeVariant} className="shrink-0">
        {getDaysLabel(event.daysLeft)}
      </Badge>
    </div>
  );
}

function EmptyTimeline({ message }: { message: string }) {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
      <p>{message}</p>
      <p className="text-sm mt-1">
        Add universities with deadlines or schedule interviews
      </p>
    </div>
  );
}
