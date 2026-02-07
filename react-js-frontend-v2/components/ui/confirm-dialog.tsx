"use client";

import { ReactNode, useCallback } from "react";
import { AlertTriangle, Trash2, X, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFocusTrap, useScrollLock, useEscapeKey } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type DialogVariant = "destructive" | "warning" | "info";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: DialogVariant;
  isLoading?: boolean;
  children?: ReactNode;
}

const variantConfig: Record<
  DialogVariant,
  {
    icon: typeof AlertTriangle;
    iconClass: string;
    bgClass: string;
    buttonVariant: "destructive" | "default";
  }
> = {
  destructive: {
    icon: Trash2,
    iconClass: "text-destructive",
    bgClass: "bg-destructive/10",
    buttonVariant: "destructive",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-warning",
    bgClass: "bg-warning/10",
    buttonVariant: "default",
  },
  info: {
    icon: Info,
    iconClass: "text-primary",
    bgClass: "bg-primary/10",
    buttonVariant: "default",
  },
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "destructive",
  isLoading = false,
  children,
}: ConfirmDialogProps) {
  const containerRef = useFocusTrap<HTMLDivElement>({ enabled: open });
  useScrollLock(open);
  useEscapeKey(onClose, open && !isLoading);

  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && !isLoading) {
        onClose();
      }
    },
    [onClose, isLoading]
  );

  const handleConfirm = useCallback(() => {
    if (!isLoading) {
      onConfirm();
    }
  }, [onConfirm, isLoading]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby={description ? "confirm-description" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Dialog */}
      <Card
        ref={containerRef}
        className="relative w-full max-w-md shadow-2xl animate-scale-in"
      >
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                config.bgClass
              )}
            >
              <Icon className={cn("w-6 h-6", config.iconClass)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <CardTitle id="confirm-title" className="text-lg">
                {title}
              </CardTitle>
              {description && (
                <CardDescription id="confirm-description" className="mt-1">
                  {description}
                </CardDescription>
              )}
            </div>

            {/* Close button */}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              disabled={isLoading}
              className="shrink-0 -mt-1 -mr-1"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {children && <CardContent className="pt-0 pb-4">{children}</CardContent>}

        <CardContent className="pt-0">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              variant={config.buttonVariant}
              onClick={handleConfirm}
              loading={isLoading}
              loadingText="Processing..."
            >
              {confirmLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Convenience hook for managing confirm dialog state
import { useState, useCallback as useCallbackReact } from "react";

interface UseConfirmDialogOptions {
  onConfirm: () => Promise<void> | void;
  onCancel?: () => void;
}

export function useConfirmDialog(options: UseConfirmDialogOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const open = useCallbackReact(() => {
    setIsOpen(true);
  }, []);

  const close = useCallbackReact(() => {
    if (!isLoading) {
      setIsOpen(false);
      options.onCancel?.();
    }
  }, [isLoading, options]);

  const confirm = useCallbackReact(async () => {
    setIsLoading(true);
    try {
      await options.onConfirm();
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  return {
    isOpen,
    isLoading,
    open,
    close,
    confirm,
  };
}
