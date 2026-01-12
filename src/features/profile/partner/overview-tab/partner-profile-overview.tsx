import {
  GoalsSection,
  PersonalityPreferenceSection,
  LifestyleSnapshotSection,
  SocialSignalsSection,
} from "../components";
import { VoiceUpload } from "@/components/ui/voice-upload";
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
  onVoiceAudioChange?: (audio: AudioFileInfo | null) => void;
}>;

export default function PartnerProfileOverview({
  profile,
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
  onVoiceAudioChange,
}: PartnerProfileOverviewProps) {
  // Convert voiceAudioUrl to AudioFileInfo format if needed
  // For now, we'll handle it as a new upload since we don't have the full file info
  const voiceAudioValue = profile.voiceAudioUrl
    ? null // If URL exists, we'd need to fetch the file, so for now treat as null
    : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Goals Section */}
      <GoalsSection
        goals={profile.goals}
        isAiGenerated={profile.goalsIsAiGenerated}
        onChange={onGoalsChange}
      />

      {/* Personality & Preference Section */}
      <PersonalityPreferenceSection
        profile={profile}
        onLoveLanguageChange={onLoveLanguageChange}
        onCommunicationStylesChange={onCommunicationStylesChange}
        onAttachmentTendencyChange={onAttachmentTendencyChange}
        onDealBreakersChange={onDealBreakersChange}
        onAppreciatedThingsChange={onAppreciatedThingsChange}
      />

      {/* Lifestyle Snapshot Section */}
      <LifestyleSnapshotSection
        profile={profile}
        onWorkRhythmChange={onWorkRhythmChange}
        onSocialEnergyChange={onSocialEnergyChange}
        onDateBudgetChange={onDateBudgetChange}
        onHobbiesChange={onHobbiesChange}
        onFavoriteHobbiesChange={onFavoriteHobbiesChange}
      />

      {/* Social Signals Section */}
      <SocialSignalsSection
        instagramUrl={profile.instagramUrl || ""}
        onInstagramUrlChange={onInstagramUrlChange}
      />

      {/* Voice Profile Section */}
      {onVoiceAudioChange && (
        <div className="flex flex-col gap-2">
          <VoiceUpload
            value={voiceAudioValue}
            onChange={onVoiceAudioChange}
            label="Voice Recording"
            description="Upload a voice recording of your partner (optional)"
          />
        </div>
      )}
    </div>
  );
}
