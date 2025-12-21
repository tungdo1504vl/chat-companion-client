"use client";

import { useState } from "react";
import { Settings, Star, Plus, X } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AiIndicator } from "../ai-indicator";
import { PillButtonGroup, type PillButtonOption } from "../pill-button-group";
import {
  LOVE_LANGUAGE_OPTIONS,
  COMMUNICATION_STYLE_OPTIONS,
  DEAL_BREAKER_OPTIONS,
} from "../../const";
import type {
  PartnerProfile,
  LoveLanguage,
  CommunicationStyle,
  DealBreaker,
  AttachmentTendency,
  AttachmentTendencyData,
} from "../../types";
import ContentCard from "@/features/profiles/common/content-card/content-card";

const ATTACHMENT_TENDENCY_OPTIONS: {
  value: AttachmentTendency;
  label: string;
}[] = [
  { value: "Secure", label: "Secure" },
  { value: "Anxious", label: "Anxious" },
  { value: "Avoidant", label: "Avoidant" },
  { value: "Secure-Leaning Anxious", label: "Secure-Leaning Anxious" },
  { value: "Secure-Leaning Avoidant", label: "Secure-Leaning Avoidant" },
  { value: "Anxious-Avoidant", label: "Anxious-Avoidant" },
  { value: "Not sure", label: "Not sure" },
  { value: "Exploring", label: "Exploring" },
];

interface PersonalityPreferenceSectionProps {
  profile: PartnerProfile;
  onLoveLanguageChange?: (loveLanguage: LoveLanguage) => void;
  onCommunicationStylesChange?: (styles: CommunicationStyle[]) => void;
  onAttachmentTendencyChange?: (tendency: AttachmentTendencyData) => void;
  onDealBreakersChange?: (dealBreakers: DealBreaker[]) => void;
  onAppreciatedThingsChange?: (things: string[]) => void;
  className?: string;
}

export function PersonalityPreferenceSection({
  profile,
  onLoveLanguageChange,
  onCommunicationStylesChange,
  onAttachmentTendencyChange,
  onDealBreakersChange,
  onAppreciatedThingsChange,
  className,
}: PersonalityPreferenceSectionProps) {
  const [dealBreakerPopoverOpen, setDealBreakerPopoverOpen] = useState(false);
  const [appreciatedThingInput, setAppreciatedThingInput] = useState("");

  const communicationStyleOptions: PillButtonOption<CommunicationStyle>[] =
    COMMUNICATION_STYLE_OPTIONS.map((style) => ({
      value: style.value,
      label: style.label,
    }));

  const handleRemoveDealBreaker = (dealBreaker: DealBreaker) => {
    if (!onDealBreakersChange) return;
    const updated = profile.dealBreakers.filter((db) => db !== dealBreaker);
    onDealBreakersChange(updated);
  };

  const handleAddDealBreaker = (dealBreaker: DealBreaker) => {
    if (!onDealBreakersChange) return;
    if (!profile.dealBreakers.includes(dealBreaker)) {
      onDealBreakersChange([...profile.dealBreakers, dealBreaker]);
    }
    setDealBreakerPopoverOpen(false);
  };

  const handleAddAppreciatedThing = () => {
    if (!onAppreciatedThingsChange || !appreciatedThingInput.trim()) return;
    if (!profile.appreciatedThings.includes(appreciatedThingInput.trim())) {
      onAppreciatedThingsChange([
        ...profile.appreciatedThings,
        appreciatedThingInput.trim(),
      ]);
    }
    setAppreciatedThingInput("");
  };

  const handleRemoveAppreciatedThing = (thing: string) => {
    if (!onAppreciatedThingsChange) return;
    const updated = profile.appreciatedThings.filter((t) => t !== thing);
    onAppreciatedThingsChange(updated);
  };

  const handleAttachmentTendencySelect = (tendency: AttachmentTendency) => {
    if (!onAttachmentTendencyChange || !profile.attachmentTendency) return;
    onAttachmentTendencyChange({
      ...profile.attachmentTendency,
      tendency,
      isAiGenerated: false,
    });
  };

  const availableDealBreakers = DEAL_BREAKER_OPTIONS.filter(
    (db) => !profile.dealBreakers.includes(db)
  );

  return (
    <ContentCard className={className}>
      <div className="flex items-center gap-2 mb-4">
        <Settings className="size-5 text-muted-foreground" />
        <h3 className="text-base font-semibold">Personality & Preference</h3>
      </div>

      <div className="flex flex-col gap-6">
        {/* Love Language */}
        {profile.loveLanguage && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Love Language</label>
              {profile.loveLanguageIsAiGenerated && <AiIndicator size="sm" />}
            </div>
            <Select
              value={profile.loveLanguage}
              options={LOVE_LANGUAGE_OPTIONS}
              onValueChange={(value) => {
                onLoveLanguageChange?.(value as LoveLanguage);
              }}
              disabled={!onLoveLanguageChange}
            />
          </div>
        )}

        {/* Communication Style */}
        {profile.communicationStyles.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Communication Style</label>
              {profile.communicationStylesIsAiGenerated && (
                <AiIndicator size="sm" />
              )}
            </div>
            <PillButtonGroup
              options={communicationStyleOptions}
              value={profile.communicationStyles}
              multiple={true}
              onValueChange={(value) => {
                if (Array.isArray(value)) {
                  onCommunicationStylesChange?.(value as CommunicationStyle[]);
                }
              }}
              disabled={!onCommunicationStylesChange}
            />
          </div>
        )}

        {/* Attachment Tendency */}
        {profile.attachmentTendency && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Star className="size-4 text-muted-foreground" />
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Attachment Tendency
              </h4>
              {profile.attachmentTendency.isAiGenerated && (
                <AiIndicator size="sm" />
              )}
            </div>
            {onAttachmentTendencyChange ? (
              <Select
                value={profile.attachmentTendency.tendency}
                options={ATTACHMENT_TENDENCY_OPTIONS}
                onValueChange={(value) => {
                  handleAttachmentTendencySelect(value as AttachmentTendency);
                }}
              />
            ) : (
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">
                    {profile.attachmentTendency.tendency}
                  </span>
                  {profile.attachmentTendency.label && (
                    <Badge variant="outline" className="text-xs">
                      {profile.attachmentTendency.label}
                    </Badge>
                  )}
                </div>
                {profile.attachmentTendency.description && (
                  <p className="text-sm text-muted-foreground">
                    {profile.attachmentTendency.description}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Deal-breakers */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Deal-Breakers</label>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.dealBreakers.map((dealBreaker) => (
              <Badge
                key={dealBreaker}
                variant="destructive"
                className="rounded-full flex items-center gap-1"
              >
                {dealBreaker}
                {onDealBreakersChange && (
                  <button
                    type="button"
                    onClick={() => handleRemoveDealBreaker(dealBreaker)}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </Badge>
            ))}
            {onDealBreakersChange && availableDealBreakers.length > 0 && (
              <Popover
                open={dealBreakerPopoverOpen}
                onOpenChange={setDealBreakerPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <Plus className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2">
                  <div className="flex flex-col gap-1">
                    {availableDealBreakers.map((dealBreaker) => (
                      <button
                        key={dealBreaker}
                        type="button"
                        onClick={() => handleAddDealBreaker(dealBreaker)}
                        className="text-left px-2 py-1.5 text-sm rounded hover:bg-accent"
                      >
                        {dealBreaker}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        {/* Things They Appreciate */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Star className="size-4 text-muted-foreground" />
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Things They Appreciate
            </h4>
            {profile.appreciatedThingsIsAiGenerated && (
              <AiIndicator size="sm" />
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.appreciatedThings.map((item, index) => (
              <Badge
                key={index}
                variant="outline"
                className="rounded-full bg-muted flex items-center gap-1"
              >
                {item}
                {onAppreciatedThingsChange && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAppreciatedThing(item)}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </Badge>
            ))}
            {onAppreciatedThingsChange && (
              <div className="flex items-center gap-1">
                <Input
                  value={appreciatedThingInput}
                  onChange={(e) => setAppreciatedThingInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddAppreciatedThing();
                    }
                  }}
                  placeholder="Add..."
                  className="h-8 w-24 rounded-full text-sm"
                />
                {appreciatedThingInput.trim() && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={handleAddAppreciatedThing}
                    className="h-8 w-8 rounded-full p-0"
                  >
                    <Plus className="size-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ContentCard>
  );
}
