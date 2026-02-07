"use client";

import { ReactNode, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { useFocusTrap, useScrollLock, useEscapeKey } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { FormModalContext } from "./form-modal-context";
import {
  FormModalHeader,
  FormModalTitle,
  FormModalDescription,
} from "./form-modal-header";
import { FormModalBody } from "./form-modal-body";
import {
  FormModalFooter,
  FormModalCancel,
  FormModalSubmit,
} from "./form-modal-footer";

interface FormModalRootProps {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  onSubmit?: (e: React.FormEvent) => void;
  isLoading?: boolean;
  maxWidth?: string;
  className?: string;
}

function FormModalRoot({
  children,
  open,
  onClose,
  onSubmit,
  isLoading = false,
  maxWidth = "max-w-lg",
  className,
}: FormModalRootProps) {
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
      if (!isLoading && onSubmit) {
        onSubmit(e);
      }
    },
    [onSubmit, isLoading]
  );

  if (!open) return null;

  const content = (
    <Card
      ref={containerRef}
      className={cn(
        "relative w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in",
        maxWidth,
        className
      )}
    >
      {children}
    </Card>
  );

  return (
    <FormModalContext value={{ open, onClose, isLoading }}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 animate-fade-in"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />

        {/* Modal - wrap in form if onSubmit provided */}
        {onSubmit ? (
          <form onSubmit={handleSubmit} className={cn("relative w-full", maxWidth)}>
            {content}
          </form>
        ) : (
          content
        )}
      </div>
    </FormModalContext>
  );
}

/**
 * Compound FormModal component
 *
 * Usage:
 * ```tsx
 * <FormModal.Root open={isOpen} onClose={handleClose} onSubmit={handleSubmit}>
 *   <FormModal.Header>
 *     <FormModal.Title>Edit Item</FormModal.Title>
 *     <FormModal.Description>Update the item details</FormModal.Description>
 *   </FormModal.Header>
 *   <FormModal.Body>
 *     {form fields}
 *   </FormModal.Body>
 *   <FormModal.Footer>
 *     <FormModal.Cancel />
 *     <FormModal.Submit>Save</FormModal.Submit>
 *   </FormModal.Footer>
 * </FormModal.Root>
 * ```
 */
export const FormModal = {
  Root: FormModalRoot,
  Header: FormModalHeader,
  Title: FormModalTitle,
  Description: FormModalDescription,
  Body: FormModalBody,
  Footer: FormModalFooter,
  Cancel: FormModalCancel,
  Submit: FormModalSubmit,
};

// Re-export context hook for advanced usage
export { useFormModalContext } from "./form-modal-context";
