import {
  SpecialDaysSection,
  SmartGiftIdeasSection,
  PlanBirthdaySection,
} from "../components";
import type { PartnerProfile, SpecialDay } from "../types";

type SpecialThingsTabProps = Readonly<{
  profile: PartnerProfile;
  onSpecialDaysChange?: (days: SpecialDay[]) => void;
}>;

export default function SpecialThingsTab({
  profile,
  onSpecialDaysChange,
}: SpecialThingsTabProps) {
  const birthday = profile.specialDays?.find((day) => day.type === "birthday");

  return (
    <div className="flex flex-col gap-8">
      {/* Special Days Section */}
      <SpecialDaysSection
        specialDays={profile.specialDays}
        onChange={onSpecialDaysChange}
      />

      {/* Smart Gift Ideas Section */}
      <SmartGiftIdeasSection
        giftIdeas={profile.giftIdeas}
        hobbies={profile.hobbies}
      />

      {/* Plan for Birthday Section */}
      {birthday && <PlanBirthdaySection birthday={birthday} />}
    </div>
  );
}
