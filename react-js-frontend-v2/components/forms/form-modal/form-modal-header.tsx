"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useFormModalContext } from "./form-modal-context";

interface FormModalHeaderProps {
  children: ReactNode;
  className?: string;
}

export function FormModalHeader({ children, className }: FormModalHeaderProps) {
  const { onClose, isLoading } = useFormModalContext();

  return (
    <CardHeader
      className={`flex flex-row items-start justify-between sticky top-0 bg-card z-10 border-b ${className ?? ""}`}
    >
      <div className="flex-1 min-w-0 pr-4">{children}</div>
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
  );
}

interface FormModalTitleProps {
  children: ReactNode;
  className?: string;
}

export function FormModalTitle({ children, className }: FormModalTitleProps) {
  return (
    <CardTitle id="modal-title" className={`text-lg ${className ?? ""}`}>
      {children}
    </CardTitle>
  );
}

interface FormModalDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function FormModalDescription({
  children,
  className,
}: FormModalDescriptionProps) {
  return (
    <CardDescription id="modal-description" className={`mt-1 ${className ?? ""}`}>
      {children}
    </CardDescription>
  );
}
