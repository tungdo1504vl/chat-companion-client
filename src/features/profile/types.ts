export type TProfileFormData = {
  primaryLoveLanguage: string;
  communicationStyles: string[];
  attachmentStyle: string;
  dealBreakers: string[];
  workSchedule: string;
  dateBudget: number;
  socialEnergy: string;
  hobbies: string[];
  instagramLinked: boolean;
  facebookLinked: boolean;
  threadsLinked: boolean;
};

export type TProfileFormProps = {
  onSubmit?: (data: TProfileFormData) => void;
  isLoading?: boolean;
  defaultValues?: Partial<TProfileFormData>;
};
