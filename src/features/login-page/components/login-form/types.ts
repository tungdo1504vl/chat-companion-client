export type TLoginFormProps = {
  onSubmit?: (data: TLoginFormData) => void;
  isLoading?: boolean;
};

export type TLoginFormData = {
  email: string;
  password: string;
};
