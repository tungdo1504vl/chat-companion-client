import type { GoalType } from "@/features/profile/partner/types";

export type PartnerGender = "Male" | "Female" | "Other" | "Prefer not to say";

export type PartnerAgeRange =
  | "Teens"
  | "Early 20s"
  | "Late 20s"
  | "30s"
  | "40+"
  | "Enter manually";

export type TPartnerFormData = {
  // Step 1 - Basic Information (Required)
  partnerName: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  birthMinute: string;
  birthPeriod: "AM" | "PM";
  birthTimeKnown: boolean;
  partnerGender: PartnerGender | "";
  partnerAgeRange: PartnerAgeRange | "";
  country: string;
  city: string;

  // Step 2 - Current Situation (Required)
  situationDescription: string;

  // Step 3 - Goals & Key Question (Required)
  keyQuestion: string;
  goalForRelationship: GoalType | "";

  // Step 4 - Additional Context (Optional)
  partnerPersonality: string;
  majorPastEvents: string;
  currentFeelings: string;
};

export type TPartnerFormProps = {
  onSubmit?: (data: TPartnerFormData) => void;
  isLoading?: boolean;
  onStepChange?: (step: number) => void;
};
