"use client";

import { cn } from "@/libs/tailwind/utils";

export interface TopProgressBarProps {
  progress: number; // 0-100
  className?: string;
}

export function TopProgressBar({
  progress,
  className,
}: TopProgressBarProps) {
  return (
    <div
      className={cn(
        "relative h-1 w-full bg-muted overflow-hidden",
        className
      )}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progress: ${progress}%`}
    >
      <div
        className="h-full bg-primary transition-all duration-300 ease-out motion-reduce:transition-none"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}
