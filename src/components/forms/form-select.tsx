"use client";

import * as React from "react";
import { Select, type SelectProps } from "@/components/commons/select";
import { cn } from "@/libs/tailwind/utils";
import type { FieldApi } from "@tanstack/react-form";

export interface FormSelectProps
  extends Omit<SelectProps, "value" | "onValueChange" | "triggerClassName"> {
  field?: FieldApi<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>;
  error?: boolean;
  triggerClassName?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

/**
 * FormSelect - Consistent styled select component for forms
 * Integrates with TanStack Form and handles error states automatically
 */
export const FormSelect = React.forwardRef<HTMLButtonElement, FormSelectProps>(
  ({ field, error, options, triggerClassName, disabled, ...props }, ref) => {
    const hasError =
      error ||
      Boolean(field?.state.meta.errors?.length) ||
      Boolean(field?.state.meta.isTouched && field?.state.meta.errors?.length);

    const value = field?.state.value ?? props.value ?? "";
    const handleValueChange = (newValue: string) => {
      if (field) {
        field.handleChange(newValue);
        field.handleBlur();
      } else if (props.onValueChange) {
        props.onValueChange(newValue);
      }
    };

    return (
      <Select
        {...props}
        ref={ref}
        options={options}
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
        triggerClassName={cn(
          // Base styles - consistent across all forms
          "w-full !h-full",
          "bg-[#FFFFFF] dark:bg-[#3D3131]",
          "border-gray-200 dark:border-gray-700",
          "focus-visible:border-[#FF6B6B] focus-visible:ring-1 focus-visible:ring-[#FF6B6B]/20",
          "rounded-xl py-4 px-4",
          "text-[#2D2424] dark:text-[#F9FAFB]",
          "data-[placeholder]:text-gray-400 dark:data-[placeholder]:text-gray-500",
          "transition-all text-base",
          "outline-none ring-0",
          "justify-between",
          // Error state
          hasError && "border-red-500 dark:border-red-500",
          // Disabled state
          disabled && "opacity-50 cursor-not-allowed",
          triggerClassName
        )}
      />
    );
  }
);

FormSelect.displayName = "FormSelect";
