"use client";

import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldMessageProps {
  children: React.ReactNode;
  variant?: "error" | "success" | "info";
  className?: string;
  animate?: boolean;
}

export function FieldMessage({
  children,
  variant = "error",
  className,
  animate = true,
}: FieldMessageProps) {
  const config = {
    error: {
      icon: AlertCircle,
      textClass: "text-destructive",
    },
    success: {
      icon: CheckCircle2,
      textClass: "text-success",
    },
    info: {
      icon: Info,
      textClass: "text-muted-foreground",
    },
  };

  const { icon: Icon, textClass } = config[variant];

  return (
    <p
      className={cn(
        "flex items-center gap-1.5 text-sm mt-1.5",
        textClass,
        animate && "animate-slide-down",
        className
      )}
      role={variant === "error" ? "alert" : undefined}
      aria-live={variant === "error" ? "polite" : undefined}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

// Alias for backwards compatibility
interface FieldErrorProps extends Omit<FieldMessageProps, "variant" | "children"> {
  message?: string;
  children?: React.ReactNode;
}

export const FieldError = ({ message, children, ...props }: FieldErrorProps) => {
  const content = message || children;
  if (!content) return null;
  return (
    <FieldMessage {...props} variant="error">
      {content}
    </FieldMessage>
  );
};

export const FieldSuccess = (props: Omit<FieldMessageProps, "variant">) => (
  <FieldMessage {...props} variant="success" />
);

export const FieldHint = (props: Omit<FieldMessageProps, "variant">) => (
  <FieldMessage {...props} variant="info" animate={false} />
);

// Field wrapper with error state
interface FieldWrapperWithErrorProps {
  children: React.ReactNode;
  error?: string;
  success?: string;
  hint?: string;
  className?: string;
}

export function FieldWrapperWithError({
  children,
  error,
  success,
  hint,
  className,
}: FieldWrapperWithErrorProps) {
  return (
    <div className={cn("space-y-1", error && "input-error-shake", className)}>
      {children}
      {error && <FieldError message={error} />}
      {success && !error && <FieldSuccess>{success}</FieldSuccess>}
      {hint && !error && !success && <FieldHint>{hint}</FieldHint>}
    </div>
  );
}
