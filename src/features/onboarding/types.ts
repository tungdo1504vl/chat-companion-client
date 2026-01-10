export type TOnboardingFormData = {
  name: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  birthMinute: string;
  birthPeriod: "AM" | "PM";
  birthTimeKnown: boolean;
  genderAtBirth: "Male" | "Female";
  country: string;
  city: string;
};

export type TOnboardingFormProps = {
  onSubmit?: (data: TOnboardingFormData) => void;
  isLoading?: boolean;
};










