"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/libs/tailwind/utils";
import type { FieldApi } from "@tanstack/react-form";

export interface FormInputProps
  extends Omit<React.ComponentProps<typeof Input>, "value" | "onChange" | "onBlur"> {
  field?: FieldApi<any, any, any, any>;
  error?: boolean;
  className?: string;
}

/**
 * FormInput - Consistent styled input component for forms
 * Integrates with TanStack Form and handles error states automatically
 */
export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ field, error, className, disabled, ...props }, ref) => {
    const hasError =
      error ||
      Boolean(field?.state.meta.errors?.length) ||
      Boolean(field?.state.meta.isTouched && field?.state.meta.errors?.length);

    const value = field?.state.value ?? props.value ?? "";
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (field) {
        field.handleChange(e.target.value);
      } else if (props.onChange) {
        props.onChange(e);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (field) {
        field.handleBlur();
      } else if (props.onBlur) {
        props.onBlur(e);
      }
    };

    return (
      <Input
        {...props}
        ref={ref}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled ?? field?.state.meta.isDisabled}
        aria-invalid={hasError}
        className={cn(
          // Base styles - consistent across all forms
          "w-full h-full",
          "bg-[#FFFFFF] dark:bg-[#3D3131]",
          "border-gray-200 dark:border-gray-700",
          "focus:border-[#FF6B6B] focus:ring-1 focus:ring-[#FF6B6B]/20",
          "rounded-xl py-4 px-4",
          "text-[#2D2424] dark:text-[#F9FAFB]",
          "placeholder-gray-400 dark:placeholder-gray-500",
          "transition-all text-base",
          "outline-none ring-0",
          // Error state
          hasError && "border-red-500 dark:border-red-500",
          // Disabled state
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      />
    );
  }
);

FormInput.displayName = "FormInput";
