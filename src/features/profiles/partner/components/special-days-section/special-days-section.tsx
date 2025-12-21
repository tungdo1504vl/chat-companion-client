"use client";

import { CheckSquare, Plus, Cake, Heart, TreePine, Venus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { format, parseISO, differenceInDays } from "date-fns";
import ContentCard from "@/features/profiles/common/content-card/content-card";
import type { SpecialDay } from "../../types";
import { cn } from "@/libs/tailwind/utils";

interface SpecialDaysSectionProps {
  specialDays?: SpecialDay[];
  className?: string;
}

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Cake,
  Heart,
  TreePine,
  Venus,
  Calendar,
};

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

function formatSpecialDate(dateString: string): string {
  try {
    return format(parseISO(dateString), "MMMM d");
  } catch {
    return dateString;
  }
}

export function SpecialDaysSection({
  specialDays = [],
  className,
}: SpecialDaysSectionProps) {
  return (
    <ContentCard className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="size-5 text-muted-foreground" />
          <h3 className="text-base font-bold">Special Days</h3>
        </div>
        <Button variant="ghost" size="sm" disabled={true}>
          <Plus className="size-4 mr-1" />
          Add Custom
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {specialDays.map((day) => {
          const IconComponent = iconMap[day.icon] || Calendar;
          const daysRemaining = getDaysRemaining(day.date);
          
          return (
            <div
              key={day.id}
              className="flex items-center justify-between gap-4 py-2"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className={cn(
                    "size-10 rounded-full flex items-center justify-center shrink-0",
                    day.iconColor
                  )}
                >
                  <IconComponent className="size-5 text-foreground" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-medium truncate">
                    {day.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatSpecialDate(day.date)}
                    </span>
                    {daysRemaining !== null && daysRemaining !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {daysRemaining} {daysRemaining === 1 ? "day" : "days"} left
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  Notify me
                </span>
                <Switch checked={day.notifyEnabled} disabled={true} />
              </div>
            </div>
          );
        })}
      </div>
    </ContentCard>
  );
}

