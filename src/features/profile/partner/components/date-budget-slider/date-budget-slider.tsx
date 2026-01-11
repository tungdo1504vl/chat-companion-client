"use client";

import { useMemo } from "react";
import { cn } from "@/libs/tailwind/utils";
import { DATE_BUDGET_LABELS, DATE_BUDGET_TO_VALUE } from "../../const";
import type { DateBudget } from "../../types";

interface DateBudgetSliderProps {
  readonly value?: DateBudget;
  readonly onChange?: (value: DateBudget) => void;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly isAiGenerated?: boolean;
}

export function DateBudgetSlider({
  value = "balanced",
  onChange,
  disabled = false,
  className,
  isAiGenerated = false,
}: DateBudgetSliderProps) {
  const sliderValue = useMemo(() => {
    return DATE_BUDGET_TO_VALUE[value] ?? 50;
  }, [value]);

  const currentLabel = useMemo(() => {
    const labelEntry = DATE_BUDGET_LABELS[sliderValue];
    return labelEntry?.label ?? "$$ (Balanced)";
  }, [sliderValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !onChange) return;
    const newValue = Number(e.target.value);
    // Find closest label
    const closestKey = Object.keys(DATE_BUDGET_LABELS).reduce(
      (prev, curr) =>
        Math.abs(Number(curr) - newValue) < Math.abs(Number(prev) - newValue)
          ? curr
          : prev,
      "50"
    );
    const labelEntry = DATE_BUDGET_LABELS[Number(closestKey)];
    if (labelEntry?.value) {
      onChange(labelEntry.value as DateBudget);
    }
  };

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <input
        type="range"
        min="0"
        max="100"
        step="50"
        value={sliderValue}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          "flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer",
          "accent-primary",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer",
          "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
        )}
      />
      <span className="text-sm font-medium text-foreground min-w-fit">
        {currentLabel}
      </span>
      {isAiGenerated && (
        <span className="text-xs text-muted-foreground">(AI)</span>
      )}
    </div>
  );
}
