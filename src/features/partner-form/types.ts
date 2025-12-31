export type PartnerGender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export type PartnerAgeRange =
  | 'Teens'
  | 'Early 20s'
  | 'Late 20s'
  | '30s'
  | '40+'
  | 'Enter manually';

export type UltimateGoal =
  | 'Improve relationship'
  | 'Get back together'
  | 'Decide to break up'
  | "Understand partner's feelings"
  | 'Enter manually';

export type TPartnerFormData = {
  // Step 1
  partnerGender: PartnerGender | '';
  partnerAgeRange: PartnerAgeRange | '';

  // Step 2
  situationDescription: string;

  // Step 3
  keyQuestion: string;
  ultimateGoal: UltimateGoal | '';

  // Step 4 (Optional)
  partnerPersonality: string;
  majorPastEvents: string;
  currentFeelings: string;
};

export type TPartnerFormProps = {
  onSubmit?: (data: TPartnerFormData) => void;
  isLoading?: boolean;
};

