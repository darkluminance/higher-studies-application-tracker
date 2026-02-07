"use client";

import { memo } from "react";
import {
  Mail,
  Building2,
  Pencil,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils/format";
import type { Recommender } from "@/lib/types";

interface RecommenderCardProps {
  recommender: Recommender;
  onEdit: (recommender: Recommender) => void;
  onDelete: (id: string) => void;
}

export const RecommenderCard = memo(function RecommenderCard({
  recommender,
  onEdit,
  onDelete,
}: RecommenderCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-chart-4/10 flex items-center justify-center text-chart-4 font-semibold shrink-0">
              {getInitials(recommender.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{recommender.name}</h3>
              <p className="text-sm text-muted-foreground">
                {recommender.designation}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(recommender)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(recommender.id)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span className="truncate">{recommender.institution}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <a
              href={`mailto:${recommender.email}`}
              className="text-primary hover:underline truncate"
            >
              {recommender.email}
            </a>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <Badge variant="secondary">{recommender.relationship}</Badge>
        </div>
      </CardContent>
    </Card>
  );
});
