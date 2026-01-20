"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/libs/tailwind/utils";

export interface PrimaryActionButtonProps
  extends Omit<
    React.ComponentProps<typeof Button>,
    "className" | "children"
  > {
  /** Button label text */
  label: string;
  /** Optional icon element to display before the label */
  icon?: React.ReactNode;
  /** Custom className to override default styles */
  className?: string;
  /** Icon className for custom icon styling */
  iconClassName?: string;
  /** Whether to show full width (default: true) */
  fullWidth?: boolean;
}

/**
 * PrimaryActionButton - A reusable primary action button component
 * with support for custom icons and labels, styled for prominent CTAs.
 *
 * Based on the splash screen button design with rounded-full styling,
 * shadow effects, and smooth animations.
 */
export default function PrimaryActionButton({
  label,
  icon,
  className,
  iconClassName,
  fullWidth = true,
  size = "lg",
  disabled,
  ...props
}: Readonly<PrimaryActionButtonProps>) {
  return (
    <Button
      size={size}
      disabled={disabled}
      className={cn(
        // Base styles
        "bg-primary text-white font-bold py-5 px-6 rounded-full shadow-lg shadow-primary/30",
        "flex items-center justify-center space-x-2",
        "hover:opacity-90 transition-opacity duration-200 ease-out",
        "transform active:scale-95 group text-lg",
        "motion-reduce:transition-none",
        "[&_svg:not([class*='size-'])]:size-6",
        // Full width
        fullWidth && "w-full",
        // Disabled state overrides - prevent all interactive behaviors
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "disabled:bg-primary/70 disabled:hover:bg-primary/70",
        "disabled:hover:opacity-60 disabled:hover:scale-100",
        "disabled:active:scale-100 disabled:shadow-none",
        "disabled:transform-none",
        // Custom className
        className
      )}
      {...props}
    >
      {icon && (
        <span
          className={cn(
            "text-3xl group-hover:animate-pulse motion-reduce:animate-none",
            // Prevent icon animation when button is disabled
            "group-disabled:animate-none",
            iconClassName
          )}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <span>{label}</span>
    </Button>
  );
}
