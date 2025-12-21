"use client";

import { Button } from "@/components/ui/button";
import { parseISO, differenceInDays } from "date-fns";
import { cn } from "@/libs/tailwind/utils";
import type { SpecialDay } from "../../types";

interface PlanBirthdaySectionProps {
  birthday?: SpecialDay;
  className?: string;
}

function getDaysRemaining(dateString: string): number | null {
  try {
    const date = parseISO(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    // If the date has passed this year, check next year
    if (date < today) {
      date.setFullYear(date.getFullYear() + 1);
    }
    
    const diffDays = differenceInDays(date, today);
    return diffDays >= 0 ? diffDays : null;
  } catch {
    return null;
  }
}

export function PlanBirthdaySection({
  birthday,
  className,
}: PlanBirthdaySectionProps) {
  if (!birthday) return null;

  const daysRemaining = getDaysRemaining(birthday.date);

  if (daysRemaining === null || daysRemaining === undefined) return null;

  return (
    <div
      className={cn(
        "rounded-lg p-4 border-2 border-primary bg-background",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold">Plan for Birthday?</h3>
          <p className="text-sm text-muted-foreground">
            It's {daysRemaining} {daysRemaining === 1 ? "day" : "days"} away. Good time to book.
          </p>
        </div>
        <Button
          className="bg-pink-500 hover:bg-pink-600 text-white shrink-0"
          disabled={true}
        >
          Start Planning
        </Button>
      </div>
    </div>
  );
}

