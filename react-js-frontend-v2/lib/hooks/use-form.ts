"use client";

import { useState, useCallback } from "react";

export function useForm<T extends Record<string, unknown>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [originalValues, setOriginalValues] = useState<T>(initialValues);

  const setValue = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;
      const finalValue =
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? value === ""
            ? null
            : Number(value)
          : value;
      setValues((prev) => ({ ...prev, [name]: finalValue }));
    },
    []
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setOriginalValues(initialValues);
  }, [initialValues]);

  const resetToValues = useCallback((newValues: T) => {
    setValues(newValues);
    setOriginalValues(newValues);
  }, []);

  const isDirty = JSON.stringify(values) !== JSON.stringify(originalValues);

  return {
    values,
    setValues,
    setValue,
    handleChange,
    reset,
    resetToValues,
    isDirty,
  };
}
