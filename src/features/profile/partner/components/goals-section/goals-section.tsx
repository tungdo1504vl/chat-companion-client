"use client";

import { Flag } from "lucide-react";
import { PillButtonGroup, type PillButtonOption } from "../pill-button-group";
import { AiIndicator } from "../ai-indicator";
import { GOAL_OPTIONS } from "../../const";
import type { GoalType } from "../../types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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
  const options: PillButtonOption<GoalType>[] = GOAL_OPTIONS.map((goal) => ({
    value: goal.value,
    label: goal.label,
  }));

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Flag className="h-5 w-5 text-muted-foreground" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Goals</h3>
              {isAiGenerated && <AiIndicator size="sm" />}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Relationship goals and intentions
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <PillButtonGroup
          options={options}
          value={goals}
          multiple={true}
          onValueChange={(value) => {
            if (Array.isArray(value)) {
              onChange?.(value as GoalType[]);
            }
          }}
          disabled={!onChange}
        />
      </CardContent>
    </Card>
  );
}
