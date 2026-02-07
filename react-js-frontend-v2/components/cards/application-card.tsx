"use client";

import { memo } from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn, getInitials, stringToColor } from "@/lib/utils";
import { getApplicationStatusConfig } from "@/lib/constants";
import type { Application } from "@/lib/types";

interface ApplicationCardProps {
  application: Application;
  universityName: string;
  lorCount?: number;
  onEdit?: (application: Application) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export const ApplicationCard = memo(function ApplicationCard({
  application,
  universityName,
  lorCount = 3,
  onEdit,
  onDelete,
  className,
}: ApplicationCardProps) {
  const statusConfig = getApplicationStatusConfig(application.application_status);
  const StatusIcon =
    application.application_status === "APPLIED" ||
    application.application_status === "ACCEPTED WITH FUND"
      ? CheckCircle2
      : application.application_status === "IN PROGRESS"
      ? Clock
      : AlertCircle;

  const recommendersCount = application.recommenders_id?.length || 0;
  const lorProgress = (recommendersCount / lorCount) * 100;
  const facultyCount = application.shortlisted_faculties_id?.length || 0;

  const avatarColor = stringToColor(universityName);

  return (
    <Card variant="interactive" className={className}>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-4">
              {/* University Avatar */}
              <div
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center font-semibold shrink-0",
                  avatarColor
                )}
              >
                {getInitials(universityName, 3)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-semibold text-lg truncate">
                    {universityName}
                  </h3>
                  <Badge
                    variant={statusConfig.variant}
                    className={statusConfig.className}
                  >
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig.label}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  {application.application_type}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {facultyCount} faculty shortlisted
                  </span>
                </div>
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
                      <DropdownMenuItem onClick={() => onEdit(application)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(application.id)}
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
          </div>

          {/* Right Side - Progress & Actions */}
          <div className="lg:w-72 space-y-4">
            {/* LOR Progress */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Recommendations</span>
                <span className="font-medium">
                  {recommendersCount}/{lorCount}
                </span>
              </div>
              <Progress value={lorProgress} className="h-2" />
            </div>

            {/* Score Submission Badges */}
            <div className="flex flex-wrap gap-2">
              <ScoreSubmissionBadge
                label="TOEFL/IELTS"
                submitted={application.language_score_submitted || false}
              />
              <ScoreSubmissionBadge
                label="GRE"
                submitted={application.gre_submitted || false}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href={`/dashboard/applications/${application.id}/lor`}>
                  LOR Status
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </Button>
              {onEdit && (
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => onEdit(application)}
                >
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        {application.remarks && (
          <p className="mt-4 pt-4 border-t text-sm text-muted-foreground line-clamp-2">
            {application.remarks}
          </p>
        )}
      </CardContent>
    </Card>
  );
});

function ScoreSubmissionBadge({
  label,
  submitted,
}: {
  label: string;
  submitted: boolean;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(submitted && "border-success/50 text-success")}
    >
      {submitted ? (
        <CheckCircle2 className="w-3 h-3 mr-1" />
      ) : (
        <Clock className="w-3 h-3 mr-1" />
      )}
      {label}
    </Badge>
  );
}
