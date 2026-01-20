"use client";

import { Flag } from "lucide-react";
import { GOAL_OPTIONS } from "../../const";
import type { GoalType } from "../../types";
import { cn } from "@/libs/tailwind/utils";

interface GoalsSectionProps {
  goals: GoalType[];
  isAiGenerated?: boolean;
  onChange?: (goals: GoalType[]) => void;
  className?: string;
}

export function GoalsSection({
  goals,
  isAiGenerated = false,
  onChange,
  className,
}: GoalsSectionProps) {
  const handleGoalClick = (goalValue: GoalType) => {
    if (!onChange) return;
    
    if (goals.includes(goalValue)) {
      // Remove if already selected
      onChange(goals.filter((g) => g !== goalValue));
    } else {
      // Add to selection
      onChange([...goals, goalValue]);
    }
  };

  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 px-2">
        <Flag className="text-primary text-xl" />
        <h3 className="font-display text-xl font-bold">Goals</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {GOAL_OPTIONS.map((option) => {
          const isSelected = goals.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleGoalClick(option.value)}
              disabled={!onChange}
              className={cn(
                "p-4 rounded-2xl text-center transition-all duration-150 ease-out",
                isSelected
                  ? "bg-primary text-white shadow-md shadow-primary/20 ring-2 ring-primary/10"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary/50",
                !onChange && "cursor-default",
                onChange && "cursor-pointer"
              )}
            >
              <span className="text-sm font-semibold">{option.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
