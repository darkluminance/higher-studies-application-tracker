"use client";

import { memo } from "react";
import {
  Mail,
  CheckCircle2,
  Clock,
  Calendar,
  MoreHorizontal,
  Pencil,
  Trash2,
  Send,
  Reply,
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
import type { Mail as MailType } from "@/lib/types";

interface MailCardProps {
  mail: MailType;
  onEdit?: (mail: MailType) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export const MailCard = memo(function MailCard({
  mail,
  onEdit,
  onDelete,
  className,
}: MailCardProps) {
  const facultyName = mail.faculty_name || "Unknown Faculty";
  const avatarColor = stringToColor(facultyName);
  const hasReply = mail.is_mail_replied;
  const interviewRequested = mail.is_interview_requested;

  // Get vibe color
  const getVibeClass = (vibe?: string) => {
    switch (vibe) {
      case "ENTHUSIASTIC":
        return "border-success/50 text-success bg-success/10";
      case "POSITIVE":
        return "border-gold/50 text-gold bg-gold/10";
      case "NEUTRAL":
        return "";
      case "NEGATIVE":
        return "border-destructive/50 text-destructive bg-destructive/10";
      default:
        return "";
    }
  };

  return (
    <Card variant="interactive" className={className}>
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Avatar & Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-semibold",
                avatarColor
              )}
            >
              {getInitials(facultyName)}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{facultyName}</h3>
              <p className="text-sm text-muted-foreground">Faculty Contact</p>
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
                    <DropdownMenuItem onClick={() => onEdit(mail)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(mail.id)}
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

          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Mail Status */}
            <Badge
              variant={hasReply ? "default" : "secondary"}
              className={cn(
                hasReply
                  ? "bg-success/10 text-success border-success/20"
                  : ""
              )}
            >
              {hasReply ? (
                <>
                  <Reply className="w-3 h-3 mr-1" />
                  Replied
                </>
              ) : mail.is_mailed ? (
                <>
                  <Send className="w-3 h-3 mr-1" />
                  Sent
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  Draft
                </>
              )}
            </Badge>

            {/* Reply Vibe */}
            {mail.reply_vibe && (
              <Badge
                variant="outline"
                className={getVibeClass(mail.reply_vibe)}
              >
                {mail.reply_vibe.toLowerCase()}
              </Badge>
            )}

            {/* Interview Requested */}
            {interviewRequested && (
              <Badge className="bg-gold/10 text-gold border-gold/20">
                <Calendar className="w-3 h-3 mr-1" />
                Interview
              </Badge>
            )}
          </div>
        </div>

        {/* Remarks */}
        {mail.remarks && (
          <p className="mt-4 pt-4 border-t text-sm text-muted-foreground pl-16">
            {mail.remarks}
          </p>
        )}
      </CardContent>
    </Card>
  );
});
