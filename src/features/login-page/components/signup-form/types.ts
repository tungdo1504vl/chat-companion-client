export type TSignupFormProps = {
  onSubmit?: (data: TSignupFormData) => void;
  isLoading?: boolean;
};

export type TSignupFormData = {
  email: string;
  password: string;
};

