"use client";

import { memo } from "react";
import {
  Users,
  Mail,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  Building2,
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
import { cn, getInitials, stringToColor } from "@/lib/utils";
import type { Faculty } from "@/lib/types";

interface FacultyCardProps {
  faculty: Faculty;
  universityName?: string;
  onEdit?: (faculty: Faculty) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export const FacultyCard = memo(function FacultyCard({
  faculty,
  universityName,
  onEdit,
  onDelete,
  className,
}: FacultyCardProps) {
  const avatarColor = stringToColor(faculty.name);

  return (
    <Card variant="interactive" className={className}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Avatar */}
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center font-semibold shrink-0",
                avatarColor
              )}
            >
              {getInitials(faculty.name)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate flex items-center gap-2">
                {faculty.name}
              </h3>
              {faculty.designation && (
                <p className="text-sm text-muted-foreground">
                  {faculty.designation}
                </p>
              )}
              {universityName && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {universityName}
                </p>
              )}
            </div>
          </div>

          {/* Actions Menu */}
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
                  <DropdownMenuItem onClick={() => onEdit(faculty)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {faculty.email && (
                  <DropdownMenuItem asChild>
                    <a href={`mailto:${faculty.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </a>
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(faculty.id)}
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

        {/* Research Areas */}
        {faculty.research_areas && faculty.research_areas.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">
              Research Areas
            </p>
            <div className="flex flex-wrap gap-1.5">
              {faculty.research_areas.slice(0, 3).map((area, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {area}
                </Badge>
              ))}
              {faculty.research_areas.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{faculty.research_areas.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Email */}
        {faculty.email && (
          <div className="mt-4 pt-4 border-t">
            <a
              href={`mailto:${faculty.email}`}
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              {faculty.email}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
