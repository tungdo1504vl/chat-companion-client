"use client";

import { useState } from "react";
import { Coffee, Droplet, Star, Hash, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AiIndicator } from "../ai-indicator";
import { PillButtonGroup, type PillButtonOption } from "../pill-button-group";
import { DateBudgetSlider } from "../date-budget-slider";
import {
  WORK_RHYTHM_OPTIONS,
  SOCIAL_ENERGY_OPTIONS,
  HOBBY_OPTIONS,
} from "../../const";
import type {
  PartnerProfile,
  WorkRhythm,
  SocialEnergyLevel,
  DateBudget,
  Hobby,
} from "../../types";
import { format, parseISO } from "date-fns";
import { ContentCard } from "@/features/profile/common/content-card";

interface LifestyleSnapshotSectionProps {
  profile: PartnerProfile;
  onWorkRhythmChange?: (rhythm: WorkRhythm) => void;
  onSocialEnergyChange?: (energy: SocialEnergyLevel) => void;
  onDateBudgetChange?: (budget: DateBudget) => void;
  onHobbiesChange?: (hobbies: Hobby[]) => void;
  onFavoriteHobbiesChange?: (favorites: Hobby[]) => void;
  className?: string;
}

export function LifestyleSnapshotSection({
  profile,
  onWorkRhythmChange,
  onSocialEnergyChange,
  onDateBudgetChange,
  onHobbiesChange,
  onFavoriteHobbiesChange,
  className,
}: LifestyleSnapshotSectionProps) {
  const [hobbyPopoverOpen, setHobbyPopoverOpen] = useState(false);

  const workRhythmOptions: PillButtonOption<WorkRhythm>[] =
    WORK_RHYTHM_OPTIONS.map((rhythm) => ({
      value: rhythm.value,
      label: rhythm.label,
    }));

  const socialEnergyOptions: PillButtonOption<SocialEnergyLevel>[] =
    SOCIAL_ENERGY_OPTIONS.map((energy) => ({
      value: energy.value,
      label: energy.label,
    }));

  const availableHobbies = HOBBY_OPTIONS.filter(
    (hobby) => !profile.hobbies.includes(hobby)
  );

  const handleToggleFavorite = (hobby: Hobby) => {
    if (!onFavoriteHobbiesChange) return;
    const favorites = profile.favoriteHobbies || [];
    const isFavorite = favorites.includes(hobby);
    if (isFavorite) {
      onFavoriteHobbiesChange(favorites.filter((h) => h !== hobby));
    } else {
      onFavoriteHobbiesChange([...favorites, hobby]);
    }
  };

  const handleRemoveHobby = (hobby: Hobby) => {
    if (!onHobbiesChange) return;
    const updated = profile.hobbies.filter((h) => h !== hobby);
    onHobbiesChange(updated);
    // Also remove from favorites if it was a favorite
    if (onFavoriteHobbiesChange && profile.favoriteHobbies?.includes(hobby)) {
      onFavoriteHobbiesChange(
        profile.favoriteHobbies.filter((h) => h !== hobby)
      );
    }
  };

  const handleAddHobby = (hobby: Hobby) => {
    if (!onHobbiesChange) return;
    if (!profile.hobbies.includes(hobby)) {
      onHobbiesChange([...profile.hobbies, hobby]);
    }
    setHobbyPopoverOpen(false);
  };

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
              onValueChange={(value) => {
                if (!Array.isArray(value)) {
                  onWorkRhythmChange?.(value as WorkRhythm);
                }
              }}
              disabled={!onWorkRhythmChange}
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
              onValueChange={(value) => {
                if (!Array.isArray(value)) {
                  onSocialEnergyChange?.(value as SocialEnergyLevel);
                }
              }}
              disabled={!onSocialEnergyChange}
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
              onChange={onDateBudgetChange}
              disabled={!onDateBudgetChange}
              isAiGenerated={profile.dateBudgetIsAiGenerated}
            />
          </div>
        )}

        {/* Hobbies & Interests */}
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
                  {onFavoriteHobbiesChange && (
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(hobby)}
                      className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                      title={
                        isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      <Star
                        className={`size-3 ${
                          isFavorite ? "fill-current" : "fill-none"
                        }`}
                      />
                    </button>
                  )}
                  {onHobbiesChange && (
                    <button
                      type="button"
                      onClick={() => handleRemoveHobby(hobby)}
                      className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </Badge>
              );
            })}
            {onHobbiesChange && availableHobbies.length > 0 && (
              <Popover
                open={hobbyPopoverOpen}
                onOpenChange={setHobbyPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Plus className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2">
                  <div className="flex flex-col gap-1">
                    {availableHobbies.map((hobby) => (
                      <button
                        key={hobby}
                        type="button"
                        onClick={() => handleAddHobby(hobby)}
                        className="text-left px-2 py-1.5 text-sm rounded hover:bg-accent"
                      >
                        {hobby}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    </ContentCard>
  );
}
