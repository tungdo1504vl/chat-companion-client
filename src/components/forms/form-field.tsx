"use client";

import * as React from "react";
import { cn } from "@/libs/tailwind/utils";
import { FieldError } from "@/components/ui/field";

export interface FormFieldProps {
  label?: string;
  labelClassName?: string;
  htmlFor?: string;
  helperText?: string;
  helperTextClassName?: string;
  error?: Array<{ message?: string } | string | undefined> | string;
  errorClassName?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * FormField - Container component for consistent form field layout
 * Handles label, helper text, error display, and spacing
 */
export function FormField({
  label,
  labelClassName,
  htmlFor,
  helperText,
  helperTextClassName,
  error,
  errorClassName,
  required,
  children,
  className,
}: Readonly<FormFieldProps>) {
  // Normalize errors to the format expected by FieldError
  const normalizedErrors = React.useMemo(() => {
    if (!error) return undefined;
    if (typeof error === "string") {
      return [{ message: error }];
    }
    if (Array.isArray(error)) {
      return error
        .filter(Boolean)
        .map((e) => (typeof e === "string" ? { message: e } : e));
    }
    return undefined;
  }, [error]);

  const hasError = Boolean(normalizedErrors && normalizedErrors.length > 0);

  return (
    <div className={cn("flex flex-col", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className={cn(
            "block text-xs font-semibold uppercase tracking-wider text-text-soft mb-2 ml-1",
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {children}
      {helperText && !hasError && (
        <p
          className={cn(
            "text-[11px] text-text-placeholder mt-2 ml-1 ",
            helperTextClassName
          )}
        >
          {helperText}
        </p>
      )}
      {hasError && normalizedErrors && (
        <FieldError
          errors={normalizedErrors}
          className={cn("mt-1 ml-1", errorClassName)}
        />
      )}
    </div>
  );
}
