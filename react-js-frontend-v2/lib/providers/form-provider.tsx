"use client";

import { useState, useCallback, useMemo, ReactNode, useEffect, useRef } from "react";
import {
  FormContext,
  type FormContextValue,
} from "@/lib/context";

interface FormProviderProps<T extends Record<string, unknown>> {
  children: ReactNode;
  /** Initial form data (empty form for create, populated for edit) */
  initialData: T;
  /** Entity ID when editing (null for create mode) */
  editingId?: string | null;
  /** Submit handler */
  onSubmit: (data: T) => Promise<void>;
  /** Optional validation function */
  validate?: (data: T) => Record<string, string>;
}

export function FormProvider<T extends Record<string, unknown>>({
  children,
  initialData,
  editingId = null,
  onSubmit,
  validate,
}: FormProviderProps<T>) {
  // State
  const [formData, setFormDataState] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalData, setOriginalData] = useState<T>(initialData);

  // Reset form when initialData changes (e.g., switching between edit items)
  useEffect(() => {
    setFormDataState(initialData);
    setOriginalData(initialData);
    setErrors({});
  }, [initialData]);

  // Actions
  const setFormData = useCallback((data: T) => {
    setFormDataState(data);
  }, []);

  const setField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setFormDataState((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is modified
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field as string];
      return next;
    });
  }, []);

  const setError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const reset = useCallback(() => {
    setFormDataState(initialData);
    setErrors({});
    setIsSubmitting(false);
  }, [initialData]);

  // Store formData in ref for stable callback access
  const formDataRef = useRef(formData);
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  const submit = useCallback(async () => {
    const currentData = formDataRef.current;
    // Run validation if provided
    if (validate) {
      const validationErrors = validate(currentData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(currentData);
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, validate]);

  // Meta
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  }, [formData, originalData]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // Context value
  const contextValue = useMemo<FormContextValue<T>>(
    () => ({
      state: {
        formData,
        errors,
        isSubmitting,
      },
      actions: {
        setFormData,
        setField,
        setError,
        clearErrors,
        reset,
        submit,
      },
      meta: {
        isDirty,
        isValid,
        isEditing: editingId !== null,
        editingId,
      },
    }),
    [
      formData,
      errors,
      isSubmitting,
      isDirty,
      isValid,
      editingId,
      setFormData,
      setField,
      setError,
      clearErrors,
      reset,
      submit,
    ]
  );

  return (
    <FormContext value={contextValue as FormContextValue<Record<string, unknown>>}>
      {children}
    </FormContext>
  );
}
