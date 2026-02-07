"use client";

import { memo } from "react";
import {
  Building2,
  Calendar,
  DollarSign,
  FileText,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  MapPin,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { formatDate, getDaysUntil } from "@/lib/utils/date";
import type { University } from "@/lib/types";

interface UniversityCardProps {
  university: University;
  onEdit?: (university: University) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export const UniversityCard = memo(function UniversityCard({
  university,
  onEdit,
  onDelete,
  className,
}: UniversityCardProps) {
  const daysLeft = university.application_deadline
    ? getDaysUntil(university.application_deadline)
    : null;
  const isUrgent = daysLeft !== null && daysLeft <= 7 && daysLeft > 0;
  const isPast = daysLeft !== null && daysLeft < 0;

  return (
    <Card
      variant="interactive"
      className={cn(
        isUrgent && "ring-1 ring-warning/30",
        isPast && "opacity-75",
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold truncate flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gold shrink-0" />
              {university.name}
            </CardTitle>
            {university.location && (
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {university.location}
              </p>
            )}
          </div>
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
                  <DropdownMenuItem onClick={() => onEdit(university)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {university.website && (
                  <DropdownMenuItem asChild>
                    <a
                      href={university.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </a>
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(university.id)}
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
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="flex items-center gap-3 text-sm flex-wrap">
          {university.main_ranking && (
            <Badge variant="secondary" className="font-normal gap-1">
              <Award className="w-3 h-3" />
              #{university.main_ranking}
            </Badge>
          )}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <DollarSign className="w-3.5 h-3.5" />
            <span>${university.application_fee || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <FileText className="w-3.5 h-3.5" />
            <span>{university.lor_count || 3} LORs</span>
          </div>
        </div>

        {/* Deadline */}
        {university.application_deadline && (
          <div
            className={cn(
              "flex items-center justify-between p-3 rounded-lg",
              isPast
                ? "bg-destructive/10"
                : isUrgent
                ? "bg-warning/10"
                : "bg-muted/50"
            )}
          >
            <div className="flex items-center gap-2">
              <Calendar
                className={cn(
                  "w-4 h-4",
                  isPast
                    ? "text-destructive"
                    : isUrgent
                    ? "text-warning"
                    : "text-muted-foreground"
                )}
              />
              <span className="text-sm">
                {formatDate(university.application_deadline)}
              </span>
            </div>
            {daysLeft !== null && (
              <Badge
                variant={isPast ? "destructive" : isUrgent ? "default" : "secondary"}
                className={cn(isUrgent && !isPast && "bg-warning text-warning-foreground")}
              >
                {isPast
                  ? "Passed"
                  : daysLeft === 0
                  ? "Today"
                  : daysLeft === 1
                  ? "Tomorrow"
                  : `${daysLeft} days`}
              </Badge>
            )}
          </div>
        )}

        {/* Requirements */}
        <div className="flex flex-wrap gap-2">
          <RequirementBadge
            label="GRE"
            met={university.is_gre_must || false}
          />
          <RequirementBadge
            label="Official Transcript"
            met={university.is_official_transcript_required || false}
          />
          {university.is_transcript_needs_evaluation && (
            <Badge variant="outline" className="text-xs">
              Eval Required
            </Badge>
          )}
        </div>

        {/* Notes */}
        {university.remarks && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {university.remarks}
          </p>
        )}
      </CardContent>
    </Card>
  );
});

function RequirementBadge({ label, met }: { label: string; met: boolean }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs",
        met ? "border-success/50 text-success" : "border-muted-foreground/30"
      )}
    >
      {met ? (
        <CheckCircle2 className="w-3 h-3 mr-1" />
      ) : (
        <XCircle className="w-3 h-3 mr-1" />
      )}
      {label}
    </Badge>
  );
}
