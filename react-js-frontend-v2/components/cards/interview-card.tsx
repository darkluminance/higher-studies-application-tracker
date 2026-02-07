"use client";

import { memo } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Video,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatDateWithWeekday } from "@/lib/utils/date";
import type { Interview } from "@/lib/types";

interface InterviewCardProps {
  interview: Interview;
  facultyName: string;
  onEdit?: (interview: Interview) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export const InterviewCard = memo(function InterviewCard({
  interview,
  facultyName,
  onEdit,
  onDelete,
  className,
}: InterviewCardProps) {
  const interviewDate = new Date(interview.date);
  const isUpcoming = interviewDate > new Date();
  const isCompleted = interview.is_completed;
  const isPast = !isUpcoming && !isCompleted;

  return (
    <Card
      variant="interactive"
      className={cn(isCompleted && "opacity-75", className)}
    >
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Icon & Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                isCompleted ? "bg-success/10" : isPast ? "bg-muted" : "bg-warning/10"
              )}
            >
              <Video
                className={cn(
                  "w-5 h-5",
                  isCompleted
                    ? "text-success"
                    : isPast
                    ? "text-muted-foreground"
                    : "text-warning"
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{facultyName}</h3>
              <p className="text-sm text-muted-foreground">Faculty Interview</p>
            </div>

            {/* Actions */}
            {(onEdit || onDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(interview)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(interview.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Date & Status */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {formatDateWithWeekday(interview.date)}
              </div>
              {interview.time && (
                <div className="text-sm text-muted-foreground flex items-center gap-1 justify-end mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  {interview.time}
                </div>
              )}
            </div>

            <Badge
              variant={isCompleted ? "default" : "secondary"}
              className={cn(
                isCompleted
                  ? "bg-success/10 text-success border-success/20"
                  : isUpcoming
                  ? "bg-warning/10 text-warning border-warning/20"
                  : ""
              )}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Completed
                </>
              ) : isUpcoming ? (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  Upcoming
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  Past Due
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* Remarks */}
        {interview.remarks && (
          <p className="mt-4 pt-4 border-t text-sm text-muted-foreground pl-16">
            {interview.remarks}
          </p>
        )}
      </CardContent>
    </Card>
  );
});
