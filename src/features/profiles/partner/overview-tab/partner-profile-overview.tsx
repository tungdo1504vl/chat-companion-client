import {
  GoalsSection,
  PersonalityPreferenceSection,
  LifestyleSnapshotSection,
  SocialSignalsSection,
  ChemistryInsightSection,
} from "../components";
import type { PartnerProfile } from "../types";

type PartnerProfileOverviewProps = Readonly<{
  profile: PartnerProfile;
}>;

export default function PartnerProfileOverview({
  profile,
}: PartnerProfileOverviewProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Goals Section */}
      <GoalsSection
        goals={profile.goals}
        isAiGenerated={profile.goalsIsAiGenerated}
      />

      {/* Personality & Preference Section */}
      <PersonalityPreferenceSection profile={profile} />

      {/* Lifestyle Snapshot Section */}
      <LifestyleSnapshotSection profile={profile} />

      {/* Social Signals Section */}
      <SocialSignalsSection profile={profile} />

      {/* Chemistry & Insight Section */}
      <ChemistryInsightSection profile={profile} />
    </div>
  );
}
