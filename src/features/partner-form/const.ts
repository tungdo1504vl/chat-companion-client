import { TPartnerFormData } from './types';

export const defaultPartnerFormValues: TPartnerFormData = {
  partnerGender: '',
  partnerAgeRange: '',
  situationDescription: '',
  keyQuestion: '',
  ultimateGoal: '',
  partnerPersonality: '',
  majorPastEvents: '',
  currentFeelings: '',
};

export const partnerGenders = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
  { value: 'Prefer not to say', label: 'Prefer not to say' },
];

export const partnerAgeRanges = [
  { value: 'Teens', label: 'Teens' },
  { value: 'Early 20s', label: 'Early 20s' },
  { value: 'Late 20s', label: 'Late 20s' },
  { value: '30s', label: '30s' },
  { value: '40+', label: '40+' },
  { value: 'Enter manually', label: 'Enter manually' },
];

export const ultimateGoals = [
  { value: 'Improve relationship', label: 'Improve relationship' },
  { value: 'Get back together', label: 'Get back together' },
  { value: 'Decide to break up', label: 'Decide to break up' },
  {
    value: "Understand partner's feelings",
    label: "Understand partner's feelings",
  },
  { value: 'Enter manually', label: 'Enter manually' },
];

