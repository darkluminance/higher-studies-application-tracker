"use client";

import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ label, htmlFor, required, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>
        {label}
        {required && " *"}
      </Label>
      {children}
    </div>
  );
}

interface TextInputFieldProps {
  label: string;
  name: string;
  value: string | number | null | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  min?: number;
  max?: number;
}

export function TextInputField({
  label,
  name,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
  min,
  max,
}: TextInputFieldProps) {
  return (
    <FormField label={label} htmlFor={name} required={required}>
      <Input
        id={name}
        name={name}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
      />
    </FormField>
  );
}

interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}

export function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
}: TextAreaFieldProps) {
  return (
    <FormField label={label} htmlFor={name}>
      <textarea
        id={name}
        name={name}
        className="w-full min-h-[80px] px-3 py-2 rounded-lg border bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder={placeholder}
        value={value ?? ""}
        onChange={onChange}
        rows={rows}
      />
    </FormField>
  );
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  placeholder?: string;
  options: { value: string; label: string }[];
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  required,
  placeholder = "Select...",
  options,
}: SelectFieldProps) {
  return (
    <FormField label={label} htmlFor={name} required={required}>
      <select
        id={name}
        name={name}
        className="w-full px-3 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2 focus:ring-ring"
        value={value ?? ""}
        onChange={onChange}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

interface CheckboxFieldProps {
  label: string;
  name: string;
  checked: boolean | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CheckboxField({ label, name, checked, onChange }: CheckboxFieldProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={checked ?? false}
        onChange={onChange}
        className="w-4 h-4 rounded border-border"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}
