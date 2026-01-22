"use client";

import { Coffee, Sparkles, Zap } from "lucide-react";
import type {
  PartnerProfile,
  WorkRhythm,
  SocialEnergyLevel,
  DateBudget,
} from "../../types";
import { cn } from "@/libs/tailwind/utils";

interface LifestyleSnapshotSectionProps {
  profile: PartnerProfile;
  onWorkRhythmChange?: (rhythm: WorkRhythm) => void;
  onSocialEnergyChange?: (energy: SocialEnergyLevel) => void;
  onDateBudgetChange?: (budget: DateBudget) => void;
  className?: string;
}

const WORK_RHYTHM_OPTIONS: { value: WorkRhythm; label: string }[] = [
  { value: "busy_set_hours", label: "Busy / Set Hours" },
  { value: "flexible", label: "Flexible" },
];

const SOCIAL_ENERGY_OPTIONS: { value: SocialEnergyLevel; label: string }[] = [
  { value: "introvert", label: "Introvert" },
  { value: "balanced", label: "Ambivert" },
  { value: "extrovert", label: "Extrovert" },
];

const DATE_BUDGET_LABELS: Record<DateBudget, string> = {
  low: "$ (Low)",
  balanced: "$$ (Balanced)",
  high: "$$$ (High)",
};

const DATE_BUDGET_POSITIONS: Record<DateBudget, number> = {
  low: 0,
  balanced: 50,
  high: 100,
};

export function LifestyleSnapshotSection({
  profile,
  onWorkRhythmChange,
  onSocialEnergyChange,
  onDateBudgetChange,
  className,
}: LifestyleSnapshotSectionProps) {
  const currentWorkRhythm = profile.workRhythm || "flexible";
  const currentSocialEnergy = profile.socialEnergyLevel || "balanced";
  const currentDateBudget = profile.dateBudget || "balanced";
  const dateBudgetPosition = DATE_BUDGET_POSITIONS[currentDateBudget];

  return (
    <section className={cn("space-y-4 pb-8", className)}>
      <div className="flex items-center gap-2 px-2">
        <Coffee className="text-primary text-xl" />
        <h3 className="font-display text-xl font-bold">Lifestyle Snapshot</h3>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-8">
        {/* Work Rhythm */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase mb-3">Work Rhythm</p>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            {WORK_RHYTHM_OPTIONS.map((option) => {
              const isSelected = currentWorkRhythm === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onWorkRhythmChange?.(option.value)}
                  disabled={!onWorkRhythmChange}
                  className={cn(
                    "flex-1 py-3 text-xs font-semibold rounded-xl transition-all duration-150 ease-out",
                    isSelected
                      ? "bg-primary text-white shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
                    !onWorkRhythmChange && "cursor-default"
                  )}
                >
                  {option.label}
                  {isSelected && option.value === "flexible" && (
                    <Sparkles size={14} className="fill-current" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Social Energy Battery */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase mb-3">Social Energy Battery</p>
          <div className="grid grid-cols-3 gap-2">
            {SOCIAL_ENERGY_OPTIONS.map((option) => {
              const isSelected = currentSocialEnergy === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onSocialEnergyChange?.(option.value)}
                  disabled={!onSocialEnergyChange}
                  className={cn(
                    "p-3 text-center rounded-2xl text-[11px] transition-all duration-150 ease-out",
                    isSelected
                      ? "bg-white dark:bg-slate-800 ring-2 ring-primary/40 font-bold text-primary flex items-center justify-center gap-1 shadow-sm"
                      : "border border-slate-100 dark:border-slate-800 text-slate-400 hover:border-primary/30",
                    !onSocialEnergyChange && "cursor-default"
                  )}
                >
                  {option.label}
                  {isSelected && option.value === "balanced" && (
                    <Zap size={14} className="text-[14px]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Budget Tendency */}
        {/* <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-xs font-bold text-slate-400 uppercase">Date Budget Tendency</p>
            <span className="text-[11px] font-bold text-primary">
              {DATE_BUDGET_LABELS[currentDateBudget]}
            </span>
          </div>
          <div className="relative pt-1">
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full w-full">
              <div
                className="absolute left-0 top-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full transition-all duration-200 ease-out"
                style={{ width: `${dateBudgetPosition}%` }}
              />
              <div
                className="absolute w-6 h-6 bg-primary rounded-full border-4 border-white dark:border-slate-900 shadow-md -ml-3 transition-all duration-200 ease-out"
                style={{
                  left: `${dateBudgetPosition}%`,
                  top: "-2px",
                }}
              />
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
