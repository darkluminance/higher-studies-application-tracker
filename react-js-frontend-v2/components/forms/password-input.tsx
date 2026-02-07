"use client";

import * as React from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

function calculatePasswordStrength(password: string): PasswordStrength {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;

  const strengthLevels: Array<{ label: string; color: string }> = [
    { label: "Very weak", color: "bg-destructive" },
    { label: "Weak", color: "bg-destructive/70" },
    { label: "Fair", color: "bg-warning" },
    { label: "Good", color: "bg-success/70" },
    { label: "Strong", color: "bg-success" },
  ];

  // Score based on passed checks
  let score = 0;
  if (password.length > 0) {
    score = Math.min(passedChecks, 4);
  }

  return {
    score,
    ...strengthLevels[score],
    checks,
  };
}

interface PasswordInputProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  showStrength?: boolean;
  showRequirements?: boolean;
  onStrengthChange?: (strength: PasswordStrength) => void;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      showStrength = false,
      showRequirements = false,
      onStrengthChange,
      onChange,
      value,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState("");
    const [isFocused, setIsFocused] = React.useState(false);

    const currentValue = (value as string) ?? internalValue;
    const strength = React.useMemo(
      () => calculatePasswordStrength(currentValue),
      [currentValue]
    );

    React.useEffect(() => {
      onStrengthChange?.(strength);
    }, [strength, onStrengthChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    const requirements = [
      { key: "length", label: "At least 8 characters", met: strength.checks.length },
      { key: "uppercase", label: "Uppercase letter", met: strength.checks.uppercase },
      { key: "lowercase", label: "Lowercase letter", met: strength.checks.lowercase },
      { key: "number", label: "Number", met: strength.checks.number },
      { key: "special", label: "Special character", met: strength.checks.special },
    ];

    const showIndicators = (showStrength || showRequirements) && currentValue.length > 0;

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={cn("pr-10", className)}
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>

        {showIndicators && (
          <div
            className={cn(
              "space-y-3 overflow-hidden transition-all duration-200",
              isFocused || showStrength ? "opacity-100" : "opacity-0 h-0"
            )}
          >
            {/* Strength indicator bar */}
            {showStrength && (
              <div className="space-y-1.5">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-all duration-300",
                        index <= strength.score - 1
                          ? strength.color
                          : "bg-muted"
                      )}
                    />
                  ))}
                </div>
                <p
                  className={cn(
                    "text-xs font-medium transition-colors",
                    strength.score === 0
                      ? "text-muted-foreground"
                      : strength.score <= 1
                      ? "text-destructive"
                      : strength.score === 2
                      ? "text-warning"
                      : "text-success"
                  )}
                >
                  {currentValue.length > 0 ? strength.label : "Enter a password"}
                </p>
              </div>
            )}

            {/* Requirements checklist */}
            {showRequirements && (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                {requirements.map((req) => (
                  <li
                    key={req.key}
                    className={cn(
                      "flex items-center gap-1.5 text-xs transition-colors",
                      req.met ? "text-success" : "text-muted-foreground"
                    )}
                  >
                    {req.met ? (
                      <Check className="h-3 w-3 shrink-0" />
                    ) : (
                      <X className="h-3 w-3 shrink-0" />
                    )}
                    <span>{req.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput, calculatePasswordStrength };
export type { PasswordInputProps, PasswordStrength };
