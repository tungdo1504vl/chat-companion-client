import {
  GoalsSection,
  PersonalityPreferenceSection,
  LifestyleSnapshotSection,
  SocialSignalsSection,
  ChemistryInsightSection,
} from "../components";
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
  SocialSignal,
  AttachmentTendencyData,
} from "../types";

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
  onSocialSignalsChange?: (signals: SocialSignal[]) => void;
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
  onSocialSignalsChange,
}: PartnerProfileOverviewProps) {
  return (
    <div className="flex flex-col gap-8">
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
        profile={profile}
        onSocialSignalsChange={onSocialSignalsChange}
      />

      {/* Chemistry & Insight Section */}
      <ChemistryInsightSection profile={profile} />
    </div>
  );
}
