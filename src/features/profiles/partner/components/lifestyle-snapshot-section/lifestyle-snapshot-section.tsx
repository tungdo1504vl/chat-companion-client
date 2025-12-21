"use client";

import { Coffee, Droplet, Star, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AiIndicator } from "../ai-indicator";
import { PillButtonGroup, type PillButtonOption } from "../pill-button-group";
import { DateBudgetSlider } from "../date-budget-slider";
import {
  WORK_RHYTHM_OPTIONS,
  SOCIAL_ENERGY_OPTIONS,
  HOBBY_OPTIONS,
} from "../../const";
import type { PartnerProfile } from "../../types";
import { format, parseISO } from "date-fns";
import { ContentCard } from "@/features/profiles/common/content-card";

interface LifestyleSnapshotSectionProps {
  profile: PartnerProfile;
  className?: string;
}

export function LifestyleSnapshotSection({
  profile,
  className,
}: LifestyleSnapshotSectionProps) {
  const workRhythmOptions: PillButtonOption[] = WORK_RHYTHM_OPTIONS.map(
    (rhythm) => ({
      value: rhythm.value,
      label: rhythm.label,
    })
  );

  const socialEnergyOptions: PillButtonOption[] = SOCIAL_ENERGY_OPTIONS.map(
    (energy) => ({
      value: energy.value,
      label: energy.label,
    })
  );

  const hobbyOptions: PillButtonOption[] = HOBBY_OPTIONS.map((hobby) => ({
    value: hobby,
    label: hobby,
  }));

  const formatCycleDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return format(parseISO(dateString), "MMM dd");
    } catch {
      return dateString;
    }
  };

  const getCyclePredictionText = () => {
    if (
      !profile.cycleTracking?.predictedStart ||
      !profile.cycleTracking?.predictedEnd
    ) {
      return "";
    }
    const start = formatCycleDate(profile.cycleTracking.predictedStart);
    const end = formatCycleDate(profile.cycleTracking.predictedEnd);
    return `${start} - ${end} (Predicted)`;
  };

  const getDaysUntilPeriod = () => {
    if (!profile.cycleTracking?.predictedStart) return null;
    try {
      const predictedDate = parseISO(profile.cycleTracking.predictedStart);
      const today = new Date();
      const diffTime = predictedDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch {
      return null;
    }
  };

  const daysUntilPeriod = getDaysUntilPeriod();

  return (
    <ContentCard className={className}>
      <div className="flex items-center gap-2 mb-4">
        <Coffee className="size-5 text-muted-foreground" />
        <h3 className="text-base font-semibold">Lifestyle Snapshot</h3>
      </div>

      <div className="flex flex-col gap-6">
        {/* Work Rhythm */}
        {profile.workRhythm && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Work Rhythm</label>
              {profile.workRhythmIsAiGenerated && <AiIndicator size="sm" />}
            </div>
            <PillButtonGroup
              options={workRhythmOptions}
              value={profile.workRhythm}
              multiple={false}
              disabled={true}
            />
          </div>
        )}

        {/* Social Energy Battery */}
        {profile.socialEnergyLevel && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">
                Social Energy Battery
              </label>
              {profile.socialEnergyLevelIsAiGenerated && (
                <AiIndicator size="sm" />
              )}
            </div>
            <PillButtonGroup
              options={socialEnergyOptions}
              value={profile.socialEnergyLevel}
              multiple={false}
              disabled={true}
            />
          </div>
        )}

        {/* Cycle Tracking */}
        {profile.cycleTracking && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Cycle Tracking</label>
              {profile.cycleTracking.isPrivate && (
                <Badge variant="outline" className="text-xs">
                  Private
                </Badge>
              )}
            </div>
            {profile.cycleTracking.isPrivate &&
              profile.cycleTracking.predictedStart &&
              daysUntilPeriod !== null && (
                <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <Droplet className="size-5 text-red-500" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        Period likely in {daysUntilPeriod}{" "}
                        {daysUntilPeriod === 1 ? "day" : "days"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {getCyclePredictionText()}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" disabled={true}>
                    Log
                  </Button>
                </div>
              )}
          </div>
        )}

        {/* Date Budget Tendency */}
        {profile.dateBudget && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">
                Date Budget Tendency
              </label>
              {profile.dateBudgetIsAiGenerated && <AiIndicator size="sm" />}
            </div>
            <DateBudgetSlider
              value={profile.dateBudget}
              disabled={true}
              isAiGenerated={profile.dateBudgetIsAiGenerated}
            />
          </div>
        )}

        {/* Hobbies & Interests */}
        {profile.hobbies.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Hobbies & Interests</label>
              {profile.hobbiesIsAiGenerated && <AiIndicator size="sm" />}
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.hobbies.map((hobby) => {
                const isFavorite = profile.favoriteHobbies?.includes(hobby);
                return (
                  <Badge
                    key={hobby}
                    variant="default"
                    className="rounded-full flex items-center gap-1"
                  >
                    <Hash className="size-3" />
                    {hobby}
                    {isFavorite && <Star className="size-3 fill-current" />}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </ContentCard>
  );
}
