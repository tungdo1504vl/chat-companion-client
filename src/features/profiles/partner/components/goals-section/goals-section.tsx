"use client";

import { Flag } from "lucide-react";
import { PillButtonGroup, type PillButtonOption } from "../pill-button-group";
import { GOAL_OPTIONS } from "../../const";
import type { GoalType } from "../../types";
import ContentCard from "@/features/profiles/common/content-card/content-card";

interface GoalsSectionProps {
  goals: GoalType[];
  isAiGenerated?: boolean;
  className?: string;
}

export function GoalsSection({
  goals,
  isAiGenerated = false,
  className,
}: GoalsSectionProps) {
  const options: PillButtonOption<GoalType>[] = GOAL_OPTIONS.map((goal) => ({
    value: goal,
    label: goal,
  }));

  return (
    <ContentCard className={className}>
      <div className="flex items-center gap-2 mb-4">
        <Flag className="size-5 text-muted-foreground text-purple-400 bg-pur" />
        <h3 className="text-base font-bold">Goals</h3>
        {isAiGenerated && (
          <span className="text-xs text-muted-foreground">(AI)</span>
        )}
      </div>
      <PillButtonGroup
        options={options}
        value={goals}
        multiple={true}
        disabled={true}
      />
    </ContentCard>
  );
}
