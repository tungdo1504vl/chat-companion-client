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
import { RadioGroup, RadioGroupItem } from "@/components/commons/radio-group";
import { Slider } from "@/components/ui/slider";
import { HOBBY_OPTIONS } from "../../const";
import type {
  PartnerProfile,
  WorkRhythm,
  SocialEnergyLevel,
  DateBudget,
  Hobby,
} from "../../types";
import { format, parseISO } from "date-fns";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";

interface LifestyleSnapshotSectionProps {
  profile: PartnerProfile;
  onWorkRhythmChange?: (rhythm: WorkRhythm) => void;
  onSocialEnergyChange?: (energy: SocialEnergyLevel) => void;
  onDateBudgetChange?: (budget: DateBudget) => void;
  onHobbiesChange?: (hobbies: Hobby[]) => void;
  onFavoriteHobbiesChange?: (favorites: Hobby[]) => void;
  className?: string;
}

// Work Schedule options matching User Profile
const WORK_SCHEDULE_OPTIONS = [
  { value: "nine_to_five", label: "9-5 Standard" },
  { value: "flexible_remote", label: "Flexible / Remote" },
] as const;

// Social Energy options matching User Profile
const SOCIAL_ENERGY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "balanced", label: "Balanced" },
  { value: "high", label: "High" },
] as const;

// Helper to convert partner profile work rhythm to user profile format
const convertWorkRhythmToUserFormat = (value?: WorkRhythm): string => {
  if (!value) return "";
  // Map partner profile values (snake_case) to user profile values
  const mapping: Record<string, string> = {
    nine_to_five: "nine_to_five",
    busy_set_hours: "nine_to_five",
    flexible: "flexible_remote",
    remote: "flexible_remote",
  };
  return mapping[value] || value;
};

// Helper to convert user profile work schedule to partner profile format
const convertWorkScheduleToPartnerFormat = (
  value: string
): WorkRhythm | undefined => {
  const mapping: Record<string, WorkRhythm> = {
    nine_to_five: "nine_to_five",
    flexible_remote: "flexible",
  };
  return mapping[value];
};

// Helper to convert partner profile social energy to user profile format
const convertSocialEnergyToUserFormat = (value?: SocialEnergyLevel): string => {
  if (!value) return "";
  // Map partner profile values (snake_case) to user profile values
  const mapping: Record<string, string> = {
    introvert: "low",
    balanced: "balanced",
    extrovert: "high",
  };
  return mapping[value] || value;
};

// Helper to convert user profile social energy to partner profile format
const convertSocialEnergyToPartnerFormat = (
  value: string
): SocialEnergyLevel | undefined => {
  const mapping: Record<string, SocialEnergyLevel> = {
    low: "introvert",
    balanced: "balanced",
    high: "extrovert",
  };
  return mapping[value];
};

// Helper to convert date budget string to number (for display)
const convertDateBudgetToNumber = (budget?: DateBudget): number => {
  if (!budget) return 50; // Default to middle
  const mapping: Record<DateBudget, number> = {
    low: 50,
    balanced: 150,
    high: 500,
  };
  return mapping[budget] || 150;
};

// Helper to convert number to date budget string
const convertNumberToDateBudget = (value: number): DateBudget => {
  if (value <= 50) return "low";
  if (value <= 150) return "balanced";
  return "high";
};

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

  const availableHobbies = HOBBY_OPTIONS.filter(
    (hobby) => !profile.hobbies.includes(hobby.value)
  );

  const getHobbyLabel = (value: Hobby): string => {
    const option = HOBBY_OPTIONS.find((opt) => opt.value === value);
    return option?.label || value;
  };

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
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Coffee className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold">Lifestyle Snapshot</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Your daily rhythms and preferences
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Work Schedule */}
        <Field className="flex flex-col gap-2">
          <FieldLabel className="flex items-center gap-2">
            Work Schedule
            {profile.workRhythmIsAiGenerated && <AiIndicator size="sm" />}
          </FieldLabel>
          <RadioGroup
            value={convertWorkRhythmToUserFormat(profile.workRhythm)}
            onValueChange={(value) => {
              const converted = convertWorkScheduleToPartnerFormat(value);
              if (converted) {
                onWorkRhythmChange?.(converted);
              }
            }}
            disabled={!onWorkRhythmChange}
            className="flex gap-2"
          >
            {WORK_SCHEDULE_OPTIONS.map((schedule) => (
              <RadioGroupItem key={schedule.value} value={schedule.value}>
                {schedule.label}
              </RadioGroupItem>
            ))}
          </RadioGroup>
        </Field>

        {/* Social Energy Battery */}
        <Field className="flex flex-col gap-2">
          <FieldLabel className="flex items-center gap-2">
            Social Energy Battery
            {profile.socialEnergyLevelIsAiGenerated && (
              <AiIndicator size="sm" />
            )}
          </FieldLabel>
          <p className="text-sm text-muted-foreground">
            Your preference for social interaction frequency
          </p>
          <RadioGroup
            value={convertSocialEnergyToUserFormat(profile.socialEnergyLevel)}
            onValueChange={(value) => {
              const converted = convertSocialEnergyToPartnerFormat(value);
              if (converted) {
                onSocialEnergyChange?.(converted);
              }
            }}
            disabled={!onSocialEnergyChange}
            className="flex gap-2"
          >
            {SOCIAL_ENERGY_OPTIONS.map((level) => (
              <RadioGroupItem key={level.value} value={level.value}>
                {level.label}
              </RadioGroupItem>
            ))}
          </RadioGroup>
        </Field>

        {/* Cycle Tracking */}
        {profile.cycleTracking && (
          <Field className="flex flex-col gap-2">
            <FieldLabel className="flex items-center gap-2">
              Cycle Tracking
              {profile.cycleTracking.isPrivate && (
                <Badge variant="outline" className="text-xs">
                  Private
                </Badge>
              )}
            </FieldLabel>
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
          </Field>
        )}

        {/* Date Budget */}
        <Field className="flex flex-col gap-2">
          <FieldLabel className="flex items-center gap-2">
            Date Budget
            {profile.dateBudgetIsAiGenerated && <AiIndicator size="sm" />}
          </FieldLabel>
          <p className="text-sm text-muted-foreground">
            Typical amount you're comfortable spending per date
          </p>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Low</span>
              <span className="text-base font-semibold">
                ${convertDateBudgetToNumber(profile.dateBudget)}
              </span>
              <span className="text-xs text-muted-foreground">High</span>
            </div>
            <Slider
              min={10}
              max={1000}
              step={10}
              value={[convertDateBudgetToNumber(profile.dateBudget)]}
              onValueChange={(values) => {
                if (onDateBudgetChange) {
                  const converted = convertNumberToDateBudget(values[0]);
                  onDateBudgetChange(converted);
                }
              }}
              disabled={!onDateBudgetChange}
            />
            <div className="flex justify-between text-xs text-muted-foreground/80">
              <span>Budget-friendly: $20-50</span>
              <span>Moderate: $50-150</span>
              <span>Premium: $150+</span>
            </div>
          </div>
        </Field>

        {/* Hobbies & Interests */}
        <Field className="flex flex-col gap-2">
          <FieldLabel className="flex items-center gap-2">
            Hobbies & Interests
            {profile.hobbiesIsAiGenerated && <AiIndicator size="sm" />}
          </FieldLabel>
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
                  {getHobbyLabel(hobby)}
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
                        key={hobby.value}
                        type="button"
                        onClick={() => handleAddHobby(hobby.value)}
                        className="text-left px-2 py-1.5 text-sm rounded hover:bg-accent"
                      >
                        {hobby.label}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </Field>
      </CardContent>
    </Card>
  );
}
