import {
  SpecialDaysSection,
  SmartGiftIdeasSection,
  PlanBirthdaySection,
} from "../components";
import type { PartnerProfile } from "../types";

type SpecialThingsTabProps = Readonly<{
  profile: PartnerProfile;
}>;

export default function SpecialThingsTab({ profile }: SpecialThingsTabProps) {
  const birthday = profile.specialDays?.find((day) => day.type === "Birthday");

  return (
    <div className="flex flex-col gap-8">
      {/* Special Days Section */}
      <SpecialDaysSection specialDays={profile.specialDays} />

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
