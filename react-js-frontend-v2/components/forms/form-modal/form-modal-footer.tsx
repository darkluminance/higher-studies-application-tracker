"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useFormModalContext } from "./form-modal-context";

interface FormModalFooterProps {
  children: ReactNode;
  className?: string;
}

export function FormModalFooter({ children, className }: FormModalFooterProps) {
  return (
    <div
      className={`flex justify-end gap-3 pt-4 border-t bg-card ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

interface FormModalCancelProps {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function FormModalCancel({
  children = "Cancel",
  className,
  onClick,
}: FormModalCancelProps) {
  const { onClose, isLoading } = useFormModalContext();

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      disabled={isLoading}
      onClick={() => {
        onClick?.();
        onClose();
      }}
    >
      {children}
    </Button>
  );
}

interface FormModalSubmitProps {
  children?: ReactNode;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  destructive?: boolean;
  loadingText?: string;
}

export function FormModalSubmit({
  children = "Save",
  className,
  isLoading = false,
  disabled = false,
  onClick,
  type = "submit",
  destructive = false,
  loadingText = "Saving...",
}: FormModalSubmitProps) {
  const context = useFormModalContext();
  const loading = isLoading || context.isLoading;

  return (
    <Button
      type={type}
      className={className}
      disabled={loading || disabled}
      onClick={onClick}
      variant={destructive ? "destructive" : "default"}
      loading={loading}
      loadingText={loadingText}
    >
      {children}
    </Button>
  );
}
