"use client";

import { createContext, use } from "react";

interface FormModalContextValue {
  /** Whether the modal is open */
  open: boolean;
  /** Handler to close the modal */
  onClose: () => void;
  /** Whether a form submission is in progress */
  isLoading: boolean;
}

export const FormModalContext = createContext<FormModalContextValue | null>(
  null
);

export function useFormModalContext(): FormModalContextValue {
  const context = use(FormModalContext);
  if (!context) {
    throw new Error("FormModal components must be used within FormModal.Root");
  }
  return context;
}
