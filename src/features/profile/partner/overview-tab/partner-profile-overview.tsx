"use client";

import { useState, useEffect } from "react";
import {
  GoalsSection,
  PersonalityPreferenceSection,
  LifestyleSnapshotSection,
  SocialSignalsSection,
  ChemistryInsightSection,
} from "../components";
import { VoiceUpload } from "@/components/ui/voice-upload";
import { useUploadPartnerVoice } from "../hooks/use-upload-partner-voice";
import type {
  PartnerProfile,
  GoalType,
  LoveLanguage,
  CommunicationStyle,
  DealBreaker,
  WorkRhythm,
  SocialEnergyLevel,
  DateBudget,
  Hobby,
  AttachmentTendencyData,
} from "../types";
import type { AudioFileInfo } from "@/utils/audio";

type PartnerProfileOverviewProps = Readonly<{
  profile: PartnerProfile;
  savedInstagramUrl?: string; // Instagram URL from API (saved profile)
  onGoalsChange?: (goals: GoalType[]) => void;
  onLoveLanguageChange?: (loveLanguage: LoveLanguage) => void;
  onCommunicationStylesChange?: (styles: CommunicationStyle[]) => void;
  onAttachmentTendencyChange?: (tendency: AttachmentTendencyData) => void;
  onDealBreakersChange?: (dealBreakers: DealBreaker[]) => void;
  onAppreciatedThingsChange?: (things: string[]) => void;
  onWorkRhythmChange?: (rhythm: WorkRhythm) => void;
  onSocialEnergyChange?: (energy: SocialEnergyLevel) => void;
  onDateBudgetChange?: (budget: DateBudget) => void;
  onHobbiesChange?: (hobbies: Hobby[]) => void;
  onFavoriteHobbiesChange?: (favorites: Hobby[]) => void;
  onInstagramUrlChange?: (url: string) => void;
}>;

export default function PartnerProfileOverview({
  profile,
  savedInstagramUrl,
  onGoalsChange,
  onLoveLanguageChange,
  onCommunicationStylesChange,
  onAttachmentTendencyChange,
  onDealBreakersChange,
  onAppreciatedThingsChange,
  onWorkRhythmChange,
  onSocialEnergyChange,
  onDateBudgetChange,
  onHobbiesChange,
  onFavoriteHobbiesChange,
  onInstagramUrlChange,
}: PartnerProfileOverviewProps) {
  // Local state for the selected audio file
  const [voiceAudio, setVoiceAudio] = useState<AudioFileInfo | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Use the upload hook
  const {
    uploadVoiceAsync,
    isUploading,
    isSuccess,
    isError,
    error,
  } = useUploadPartnerVoice(profile.id, {
    onSuccess: () => {
      setUploadSuccess(true);
      // Reset success state after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    },
  });

  // Reset upload success state when a new file is selected
  useEffect(() => {
    if (voiceAudio) {
      setUploadSuccess(false);
    }
  }, [voiceAudio]);

  const handleUpload = async (file: AudioFileInfo) => {
    try {
      await uploadVoiceAsync(file);
    } catch (err) {
      // Error is handled by the hook's onError callback
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Chemistry & Insight Section */}
      <ChemistryInsightSection profile={profile} />

      {/* Goals Section */}
      <GoalsSection
        goals={profile.goals}
        isAiGenerated={profile.goalsIsAiGenerated}
        onChange={onGoalsChange}
      />

      {/* Social Signals Section */}
      <SocialSignalsSection
        profile={profile}
        instagramUrl={profile.instagramUrl || ""}
        savedInstagramUrl={savedInstagramUrl}
        onInstagramUrlChange={onInstagramUrlChange}
      />

      {/* Personality & Preference Section */}
      <PersonalityPreferenceSection
        profile={profile}
        onLoveLanguageChange={onLoveLanguageChange}
        onAttachmentTendencyChange={onAttachmentTendencyChange}
        onDealBreakersChange={onDealBreakersChange}
      />

      {/* Lifestyle Snapshot Section */}
      <LifestyleSnapshotSection
        profile={profile}
        onWorkRhythmChange={onWorkRhythmChange}
        onSocialEnergyChange={onSocialEnergyChange}
        onDateBudgetChange={onDateBudgetChange}
      />

      {/* Voice Profile Section */}
      <div className="flex flex-col gap-2">
        <VoiceUpload
          value={voiceAudio}
          onChange={setVoiceAudio}
          onUpload={handleUpload}
          isUploading={isUploading}
          uploadError={error?.message}
          uploadSuccess={uploadSuccess}
          autoUpload={true}
          label="Voice Recording"
          description="Upload a voice recording of your partner (optional)"
        />
      </div>
    </div>
  );
}
