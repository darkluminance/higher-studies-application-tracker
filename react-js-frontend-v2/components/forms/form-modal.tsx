"use client";

import { ReactNode, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFocusTrap, useScrollLock, useEscapeKey } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  maxWidth?: string;
  destructive?: boolean;
  className?: string;
}

export function FormModal({
  open,
  onClose,
  title,
  description,
  children,
  onSubmit,
  isLoading = false,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  maxWidth = "max-w-lg",
  destructive = false,
  className,
}: FormModalProps) {
  // Focus trap for accessibility
  const containerRef = useFocusTrap<HTMLDivElement>({ enabled: open });

  // Lock body scroll when modal is open
  useScrollLock(open);

  // Close on Escape key
  useEscapeKey(onClose, open && !isLoading);

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && !isLoading) {
        onClose();
      }
    },
    [onClose, isLoading]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!isLoading) {
        onSubmit(e);
      }
    },
    [onSubmit, isLoading]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal */}
      <Card
        ref={containerRef}
        className={cn(
          "relative w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in",
          maxWidth,
          className
        )}
      >
        {/* Header */}
        <CardHeader className="flex flex-row items-start justify-between sticky top-0 bg-card z-10 border-b">
          <div className="flex-1 min-w-0 pr-4">
            <CardTitle id="modal-title" className="text-lg">
              {title}
            </CardTitle>
            {description && (
              <CardDescription id="modal-description" className="mt-1">
                {description}
              </CardDescription>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            disabled={isLoading}
            className="shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {children}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-card -mb-6 pb-6 -mx-6 px-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelLabel}
              </Button>
              <Button
                type="submit"
                variant={destructive ? "destructive" : "default"}
                loading={isLoading}
                loadingText="Saving..."
              >
                {submitLabel}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
