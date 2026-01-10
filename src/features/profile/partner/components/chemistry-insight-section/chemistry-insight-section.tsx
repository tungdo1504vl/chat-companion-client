"use client";

import { Star, TrendingUp } from "lucide-react";
import { cn } from "@/libs/tailwind/utils";
import type { PartnerProfile } from "../../types";
import { ContentCard } from "@/features/profile/common/content-card";

interface ChemistryInsightSectionProps {
  profile: PartnerProfile;
  className?: string;
}

export function ChemistryInsightSection({
  profile,
  className,
}: ChemistryInsightSectionProps) {
  const getInterestLevelColor = (level?: string) => {
    switch (level) {
      case "High":
        return "text-green-600";
      case "Medium":
        return "text-yellow-600";
      case "Low":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <ContentCard className={className}>
      <div className="flex items-center gap-2 mb-4">
        <Star className="size-5 text-muted-foreground" />
        <h3 className="text-base font-semibold">Chemistry & Insight</h3>
      </div>

      <div className="flex flex-col gap-6">
        {/* Interest Level */}
        {profile.interestLevel && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Interest Level
              </span>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="flex flex-col gap-1">
                <span
                  className={cn(
                    "text-lg font-semibold",
                    getInterestLevelColor(profile.interestLevel)
                  )}
                >
                  {profile.interestLevel}
                </span>
                {profile.interestLevelConfidence && (
                  <span className="text-sm text-muted-foreground">
                    {profile.interestLevelConfidence}% Confidence
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mood Trend */}
        {profile.moodTrend && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Mood Trend
              </span>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-5 text-primary" />
                <span className="text-lg font-semibold text-primary">
                  {profile.moodTrend}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Chemistry Score */}
        {profile.chemistryScore !== undefined && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Chemistry Score
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${profile.chemistryScore}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">
                  {profile.chemistryScore}%
                </span>
                {profile.chemistryScoreDescription && (
                  <span className="text-xs text-muted-foreground">
                    {profile.chemistryScoreDescription}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* What Works Well */}
        {profile.whatWorksWell && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                What Works Well
              </span>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm leading-relaxed text-foreground">
                {profile.whatWorksWell}
              </p>
            </div>
          </div>
        )}
      </div>
    </ContentCard>
  );
}
