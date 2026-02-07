"use client";

import { createContext, use } from "react";

/**
 * Generic form state interface
 * Following Vercel composition pattern: {state, actions, meta}
 */
export interface FormState<T> {
  /** Current form data */
  formData: T;
  /** Validation errors by field name */
  errors: Record<string, string>;
  /** Form submission state */
  isSubmitting: boolean;
}

export interface FormActions<T> {
  /** Update entire form data */
  setFormData: (data: T) => void;
  /** Update single field */
  setField: <K extends keyof T>(field: K, value: T[K]) => void;
  /** Set validation error for a field */
  setError: (field: string, error: string) => void;
  /** Clear all errors */
  clearErrors: () => void;
  /** Reset form to initial state */
  reset: () => void;
  /** Submit the form */
  submit: () => Promise<void>;
}

export interface FormMeta {
  /** Whether form has unsaved changes */
  isDirty: boolean;
  /** Whether form passes validation */
  isValid: boolean;
  /** Whether form is in edit mode vs create mode */
  isEditing: boolean;
  /** Entity ID when editing */
  editingId: string | null;
}

export interface FormContextValue<T> {
  state: FormState<T>;
  actions: FormActions<T>;
  meta: FormMeta;
}

/**
 * Generic form context factory
 * Usage: const { Context, useFormContext } = createFormContext<MyFormData>()
 */
export function createFormContext<T>() {
  const Context = createContext<FormContextValue<T> | null>(null);

  function useFormContext(): FormContextValue<T> {
    const context = use(Context);
    if (!context) {
      throw new Error("useFormContext must be used within a FormProvider");
    }
    return context;
  }

  return { Context, useFormContext };
}

/**
 * Default form context for general use
 */
export const { Context: FormContext, useFormContext } =
  createFormContext<Record<string, unknown>>();
