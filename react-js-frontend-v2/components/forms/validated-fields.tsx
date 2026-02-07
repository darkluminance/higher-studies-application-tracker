"use client";

import { forwardRef } from "react";
import { FieldError, UseFormRegister, Path, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FieldWrapperProps {
  label: string;
  error?: FieldError;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FieldWrapper({
  label,
  error,
  required,
  className,
  children,
}: FieldWrapperProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className={cn(error && "text-destructive")}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-destructive">{error.message}</p>
      )}
    </div>
  );
}

interface ValidatedInputProps<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
}

export function ValidatedInput<T extends FieldValues>({
  label,
  name,
  register,
  error,
  required,
  className,
  ...props
}: ValidatedInputProps<T>) {
  return (
    <FieldWrapper label={label} error={error} required={required}>
      <Input
        {...register(name)}
        {...props}
        className={cn(error && "border-destructive", className)}
      />
    </FieldWrapper>
  );
}

interface ValidatedTextareaProps<T extends FieldValues>
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
}

export function ValidatedTextarea<T extends FieldValues>({
  label,
  name,
  register,
  error,
  required,
  className,
  ...props
}: ValidatedTextareaProps<T>) {
  return (
    <FieldWrapper label={label} error={error} required={required}>
      <Textarea
        {...register(name)}
        {...props}
        className={cn(error && "border-destructive", className)}
      />
    </FieldWrapper>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface ValidatedSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: FieldError;
  required?: boolean;
  disabled?: boolean;
}

export function ValidatedSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select...",
  error,
  required,
  disabled,
}: ValidatedSelectProps) {
  return (
    <FieldWrapper label={label} error={error} required={required}>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className={cn(error && "border-destructive")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
}

interface ValidatedCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: FieldError;
  description?: string;
}

export function ValidatedCheckbox({
  label,
  checked,
  onChange,
  error,
  description,
}: ValidatedCheckboxProps) {
  return (
    <div className="flex items-start space-x-3">
      <Checkbox
        checked={checked}
        onCheckedChange={onChange}
        className={cn(error && "border-destructive")}
      />
      <div className="space-y-1 leading-none">
        <Label className={cn(error && "text-destructive")}>{label}</Label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {error && (
          <p className="text-sm text-destructive">{error.message}</p>
        )}
      </div>
    </div>
  );
}
