"use client";

import { cn } from "@/libs/tailwind/utils";

export interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  className?: string;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  stepTitles,
  className,
}: ProgressIndicatorProps) {
  const currentTitle = stepTitles[currentStep - 1];

  return (
    <div
      className={cn("w-full", className)}
      role="status"
      aria-live="polite"
      aria-label={`Step ${currentStep} of ${totalSteps}: ${currentTitle}`}
    >
      <div className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        {currentTitle && (
          <>
            {" · "}
            <span>{currentTitle}</span>
          </>
        )}
      </div>
    </div>
  );
}
