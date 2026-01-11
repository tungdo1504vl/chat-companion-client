export type TOnboardingFormData = {
  name: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  birthMinute: string;
  birthPeriod: 'AM' | 'PM';
  birthTimeKnown: boolean;
  genderAtBirth: 'male' | 'female' | '';
  country: string;
  city: string;
  birthDate?: Date; // Internal use for date picker
};

export type TOnboardingFormProps = {
  onSubmit?: (data: TOnboardingFormData) => void;
  isLoading?: boolean;
  onStepChange?: (step: number) => void;
};
