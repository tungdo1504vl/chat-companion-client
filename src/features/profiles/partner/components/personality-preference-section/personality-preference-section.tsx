"use client";

import { Settings, Star, Plus } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AiIndicator } from "../ai-indicator";
import { PillButtonGroup, type PillButtonOption } from "../pill-button-group";
import {
  LOVE_LANGUAGE_OPTIONS,
  COMMUNICATION_STYLE_OPTIONS,
} from "../../const";
import type { PartnerProfile } from "../../types";
import ContentCard from "@/features/profiles/common/content-card/content-card";

interface PersonalityPreferenceSectionProps {
  profile: PartnerProfile;
  className?: string;
}

export function PersonalityPreferenceSection({
  profile,
  className,
}: PersonalityPreferenceSectionProps) {
  const communicationStyleOptions: PillButtonOption[] =
    COMMUNICATION_STYLE_OPTIONS.map((style) => ({
      value: style.value,
      label: style.label,
    }));

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
              disabled={true}
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
              disabled={true}
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
            </div>
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
                {profile.attachmentTendency.isAiGenerated && (
                  <AiIndicator size="sm" />
                )}
              </div>
              {profile.attachmentTendency.description && (
                <p className="text-sm text-muted-foreground">
                  {profile.attachmentTendency.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Deal-breakers */}
        {profile.dealBreakers.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Deal-Breakers</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.dealBreakers.map((dealBreaker) => (
                <Badge
                  key={dealBreaker}
                  variant="destructive"
                  className="rounded-full"
                >
                  {dealBreaker}
                </Badge>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-destructive text-destructive hover:bg-destructive/10"
                disabled={true}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Things They Appreciate */}
        {profile.appreciatedThings.length > 0 && (
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
                  className="rounded-full bg-muted"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </ContentCard>
  );
}
