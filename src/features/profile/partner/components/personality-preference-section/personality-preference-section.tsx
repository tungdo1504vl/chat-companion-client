"use client";

import { useState } from "react";
import { Brain, ChevronDown, Plus, Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  LOVE_LANGUAGE_OPTIONS,
  DEAL_BREAKER_OPTIONS,
} from "../../const";
import type {
  PartnerProfile,
  LoveLanguage,
  DealBreaker,
  AttachmentTendencyData,
} from "../../types";
import { cn } from "@/libs/tailwind/utils";


interface PersonalityPreferenceSectionProps {
  profile: PartnerProfile;
  onLoveLanguageChange?: (loveLanguage: LoveLanguage) => void;
  onAttachmentTendencyChange?: (tendency: AttachmentTendencyData) => void;
  onDealBreakersChange?: (dealBreakers: DealBreaker[]) => void;
  className?: string;
}

export function PersonalityPreferenceSection({
  profile,
  onLoveLanguageChange,
  onAttachmentTendencyChange,
  onDealBreakersChange,
  className,
}: PersonalityPreferenceSectionProps) {
  const [dealBreakerPopoverOpen, setDealBreakerPopoverOpen] = useState(false);
  const [loveLanguagePopoverOpen, setLoveLanguagePopoverOpen] = useState(false);

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

  const availableDealBreakers = DEAL_BREAKER_OPTIONS.filter(
    (db) => !profile.dealBreakers.includes(db.value)
  );

  const getDealBreakerLabel = (value: DealBreaker): string => {
    const option = DEAL_BREAKER_OPTIONS.find((opt) => opt.value === value);
    return option?.label || value;
  };

  const getLoveLanguageLabel = (value?: LoveLanguage): string => {
    if (!value) return "";
    const option = LOVE_LANGUAGE_OPTIONS.find((opt) => opt.value === value);
    return option?.label || value;
  };

  const getAttachmentTendencyLabel = (tendency?: string): string => {
    if (!tendency) return "";
    const labels: Record<string, string> = {
      secure: "Secure",
      anxious: "Anxious",
      avoidant: "Avoidant",
      secure_leaning_anxious: "Secure-Leaning Anxious",
      secure_leaning_avoidant: "Secure-Leaning Avoidant",
      anxious_avoidant: "Anxious-Avoidant",
      not_sure: "Not sure",
      exploring: "Exploring",
    };
    return labels[tendency] || tendency;
  };

  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 px-2">
        <Brain className="text-primary text-xl" />
        <h3 className="font-display text-xl font-bold">Personality & Preference</h3>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm space-y-6">
        {/* Love Language */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase mb-3">Love Language</p>
          {onLoveLanguageChange ? (
            <Popover open={loveLanguagePopoverOpen} onOpenChange={setLoveLanguagePopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-full flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="text-sm font-medium">
                    {getLoveLanguageLabel(profile.loveLanguage) || "Select..."}
                  </span>
                  <ChevronDown className="text-slate-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <div className="flex flex-col gap-1">
                  {LOVE_LANGUAGE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onLoveLanguageChange(option.value);
                        setLoveLanguagePopoverOpen(false);
                      }}
                      className="text-left px-2 py-1.5 text-sm rounded hover:bg-accent"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
              <span className="text-sm font-medium">
                {getLoveLanguageLabel(profile.loveLanguage)}
              </span>
              <ChevronDown className="text-slate-400" />
            </div>
          )}
        </div>

        {/* Attachment Tendency */}
        {profile.attachmentTendency && (
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border-l-4 border-purple-400">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Settings className="text-[18px]" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Attachment Tendency
                </span>
              </div>
              {profile.attachmentTendency.label && (
                <span className="text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded uppercase font-bold">
                  {profile.attachmentTendency.label}
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold mb-1">
              {getAttachmentTendencyLabel(profile.attachmentTendency.tendency)}
            </h4>
            {profile.attachmentTendency.description && (
              <p className="text-[11px] text-slate-500 leading-tight">
                {profile.attachmentTendency.description}
              </p>
            )}
          </div>
        )}

        {/* Deal-Breakers */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase mb-3">Deal-Breakers</p>
          <div className="flex gap-2 flex-wrap">
            {profile.dealBreakers.map((dealBreaker) => (
              <span
                key={dealBreaker}
                className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800 px-4 py-1.5 rounded-full text-xs font-medium"
              >
                {getDealBreakerLabel(dealBreaker)}
              </span>
            ))}
            {onDealBreakersChange && availableDealBreakers.length > 0 && (
              <Popover
                open={dealBreakerPopoverOpen}
                onOpenChange={setDealBreakerPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Plus className="size-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2">
                  <div className="flex flex-col gap-1">
                    {availableDealBreakers.map((dealBreaker) => (
                      <button
                        key={dealBreaker.value}
                        type="button"
                        onClick={() => handleAddDealBreaker(dealBreaker.value)}
                        className="text-left px-2 py-1.5 text-sm rounded hover:bg-accent"
                      >
                        {dealBreaker.label}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
