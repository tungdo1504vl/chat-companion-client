export type TOnboardingFormData = {
  name: string;
  gender: 'female' | 'male' | '';
  dob: string; // Date string in YYYY-MM-DD format
  country: string;
};

export type TOnboardingFormProps = {
  onSubmit?: (data: TOnboardingFormData) => void;
  isLoading?: boolean;
};



