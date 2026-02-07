import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckCircle2, AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-4xl border px-3 py-1 text-base transition-all file:h-7 file:text-sm file:font-medium focus-visible:ring-[3px] md:text-sm file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      state: {
        default: "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 aria-invalid:ring-[3px]",
        error: "border-destructive ring-destructive/20 ring-[3px] dark:border-destructive/50 dark:ring-destructive/40",
        success: "border-success ring-success/20 ring-[3px]",
      },
      inputSize: {
        default: "h-9 px-3",
        sm: "h-8 px-2.5 text-sm",
        lg: "h-11 px-4 text-base",
      },
    },
    defaultVariants: {
      state: "default",
      inputSize: "default",
    },
  }
)

interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  state?: "default" | "error" | "success"
  showStateIcon?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      state = "default",
      inputSize,
      leftIcon,
      rightIcon,
      showStateIcon = false,
      ...props
    },
    ref
  ) => {
    const hasLeftIcon = !!leftIcon
    const hasRightIcon = !!rightIcon || (showStateIcon && state !== "default")

    // Determine right icon to show
    let effectiveRightIcon = rightIcon
    if (showStateIcon && state === "success" && !rightIcon) {
      effectiveRightIcon = <CheckCircle2 className="size-4 text-success" />
    } else if (showStateIcon && state === "error" && !rightIcon) {
      effectiveRightIcon = <AlertCircle className="size-4 text-destructive" />
    }

    if (!hasLeftIcon && !hasRightIcon) {
      return (
        <input
          type={type}
          ref={ref}
          data-slot="input"
          data-state={state}
          className={cn(inputVariants({ state, inputSize, className }))}
          {...props}
        />
      )
    }

    return (
      <div className="relative w-full">
        {hasLeftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          data-slot="input"
          data-state={state}
          className={cn(
            inputVariants({ state, inputSize }),
            hasLeftIcon && "pl-10",
            hasRightIcon && "pr-10",
            className
          )}
          {...props}
        />
        {hasRightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {effectiveRightIcon}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input, inputVariants }
export type { InputProps }
