"use client";

import React from "react";
import {
  Select as UISelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<React.ComponentProps<typeof UISelect>, "children"> {
  options?: SelectOption[];
  placeholder?: string;
  size?: "sm" | "default";
  children?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      placeholder,
      size = "default",
      value,
      defaultValue,
      onValueChange,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // If options are provided, render them as SelectItems
    if (options) {
      return (
        <UISelect
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          disabled={disabled}
          {...props}
        >
          <SelectTrigger size={size} disabled={disabled} ref={ref}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </UISelect>
      );
    }

    // If no options provided, render children (backward compatibility)
    return (
      <UISelect
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        {...props}
      >
        {children}
      </UISelect>
    );
  }
);

Select.displayName = "Select";
