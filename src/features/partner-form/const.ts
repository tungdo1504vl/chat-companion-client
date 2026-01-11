import { TPartnerFormData } from './types';
import { GOAL_OPTIONS } from '@/features/profile/partner/const';
import { VIETNAM_CITIES } from '@/features/onboarding/const';

// Reuse date/time constants from onboarding
// Generate years from 1900 to current year
export const years = Array.from(
  { length: new Date().getFullYear() - 1899 },
  (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  }
);

// Months
export const months = Array.from({ length: 12 }, (_, i) => {
  const month = (i + 1).toString().padStart(2, '0');
  return { value: month, label: month };
});

// Days (1-31)
export const days = Array.from({ length: 31 }, (_, i) => {
  const day = (i + 1).toString().padStart(2, '0');
  return { value: day, label: day };
});

// Hours (1-12)
export const hours = Array.from({ length: 12 }, (_, i) => {
  const hour = (i + 1).toString().padStart(2, '0');
  return { value: hour, label: hour };
});

// Minutes (0-59, step 1)
export const minutes = Array.from({ length: 60 }, (_, i) => {
  const minute = i.toString().padStart(2, '0');
  return { value: minute, label: minute };
});

export const periods = [
  { value: 'AM', label: 'AM' },
  { value: 'PM', label: 'PM' },
];

export const defaultPartnerFormValues: TPartnerFormData = {
  partnerName: '',
  birthYear: '',
  birthMonth: '',
  birthDay: '',
  birthHour: '',
  birthMinute: '',
  birthPeriod: 'AM',
  birthTimeKnown: false,
  partnerGender: '',
  partnerAgeRange: '',
  country: 'VN',
  city: '',
  situationDescription: '',
  keyQuestion: '',
  goalForRelationship: '',
  partnerPersonality: '',
  majorPastEvents: '',
  currentFeelings: '',
};

// Re-export VIETNAM_CITIES for use in partner form
export { VIETNAM_CITIES };

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

// Use GOAL_OPTIONS from partner profile for consistency
export const goalForRelationshipOptions = GOAL_OPTIONS;
