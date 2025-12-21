"use client";

import { Share2, PawPrint, Coffee as CoffeeIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AiIndicator } from "../ai-indicator";
import type { PartnerProfile, SocialSignal } from "../../types";
import { ContentCard } from "@/features/profiles/common/content-card";

interface SocialSignalsSectionProps {
  profile: PartnerProfile;
  onSocialSignalsChange?: (signals: SocialSignal[]) => void;
  className?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  paw: PawPrint,
  coffee: CoffeeIcon,
};

export function SocialSignalsSection({
  profile,
  onSocialSignalsChange,
  className,
}: SocialSignalsSectionProps) {
  const handleRemoveSignal = (index: number) => {
    if (!onSocialSignalsChange) return;
    const updated = profile.socialSignals.filter((_, i) => i !== index);
    onSocialSignalsChange(updated);
  };

  return (
    <ContentCard className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Share2 className="size-5 text-muted-foreground" />
          <h3 className="text-base font-semibold">Social Signals</h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Social media icons placeholder */}
          <div className="size-6 rounded-full bg-primary/20" />
          <div className="size-6 rounded-full bg-muted" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {profile.socialSignals.map((signal, index) => {
          const IconComponent = signal.icon
            ? iconMap[signal.icon] || null
            : null;

          return (
            <div key={index} className="flex items-start gap-3">
              {IconComponent && (
                <IconComponent className="size-5 text-muted-foreground mt-0.5 shrink-0" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium">{signal.title}</h4>
                  {signal.isAiGenerated && <AiIndicator size="sm" />}
                </div>
                <p className="text-sm text-muted-foreground">
                  {signal.description}
                </p>
              </div>
              {onSocialSignalsChange && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSignal(index)}
                  className="h-6 w-6 p-0 shrink-0"
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
          );
        })}

        {/* Additional tags */}
        {profile.socialSignalTags && profile.socialSignalTags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {profile.socialSignalTags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="rounded-full uppercase text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </ContentCard>
  );
}
