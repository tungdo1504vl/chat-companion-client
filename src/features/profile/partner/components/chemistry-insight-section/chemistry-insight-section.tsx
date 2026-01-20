"use client";

import { Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/libs/tailwind/utils";
import type { PartnerProfile } from "../../types";

interface ChemistryInsightSectionProps {
  profile: PartnerProfile;
  className?: string;
}

export function ChemistryInsightSection({
  profile,
  className,
}: ChemistryInsightSectionProps) {
  const getInterestLevelLabel = (level?: string) => {
    switch (level) {
      case "high":
        return "High";
      case "medium":
        return "Medium";
      case "low":
        return "Low";
      default:
        return level || "";
    }
  };

  const getInterestLevelColor = (level?: string) => {
    switch (level) {
      case "high":
        return "text-emerald-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getMoodTrendLabel = (trend?: string) => {
    switch (trend) {
      case "excited":
        return "Excited";
      case "calm":
        return "Calm";
      case "stressed":
        return "Stressed";
      case "happy":
        return "Happy";
      case "neutral":
        return "Neutral";
      default:
        return trend || "";
    }
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="size-5 text-primary" />
        <h3 className="font-display text-xl font-bold">Chemistry & Insight</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Interest Level */}
        {profile.interestLevel && (
          <div className="bg-background-light dark:bg-slate-800 p-4 rounded-2xl text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">
              Interest Level
            </p>
            <p
              className={cn(
                "font-bold text-xl mb-0",
                getInterestLevelColor(profile.interestLevel)
              )}
            >
              {getInterestLevelLabel(profile.interestLevel)}
            </p>
            {profile.interestLevelConfidence && (
              <p className="text-[10px] text-slate-400">
                {profile.interestLevelConfidence}% Confidence
              </p>
            )}
          </div>
        )}

        {/* Mood Trend */}
        {profile.moodTrend && (
          <div className="bg-background-light dark:bg-slate-800 p-4 rounded-2xl text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">
              Mood Trend
            </p>
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="text-amber-500 text-lg" />
              <p className="text-amber-600 dark:text-amber-500 font-bold text-xl">
                {getMoodTrendLabel(profile.moodTrend)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chemistry Score */}
      {profile.chemistryScore !== undefined && (
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Chemistry Score
            </span>
            <span className="text-2xl font-bold text-primary font-display">
              {profile.chemistryScore}%
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-rose-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${profile.chemistryScore}%` }}
            />
          </div>
          {profile.chemistryScoreDescription && (
            <p className="text-[11px] text-slate-400 mt-2 italic">
              {profile.chemistryScoreDescription}
            </p>
          )}
        </div>
      )}

      {/* What Works Well */}
      {profile.whatWorksWell && (
        <div className="bg-rose-50/50 dark:bg-primary/5 rounded-2xl p-5 border border-rose-100 dark:border-primary/10">
          <p className="text-[10px] uppercase font-extrabold text-primary mb-2 tracking-widest">
            What Works Well
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
            {profile.whatWorksWell}
          </p>
        </div>
      )}
    </div>
  );
}
