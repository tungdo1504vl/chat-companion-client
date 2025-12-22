import { TProfileFormData } from './types';

export const defaultProfileFormValues: TProfileFormData = {
  primaryLoveLanguage: 'words',
  communicationStyles: ['direct', 'visual'],
  attachmentStyle: 'secure',
  dealBreakers: ['Dishonesty', 'Smoking'],
  workSchedule: '9-5',
  dateBudget: 2,
  socialEnergy: 'balanced',
  hobbies: ['Hiking', 'Photography', 'Cooking'],
  instagramLinked: true,
  facebookLinked: false,
  threadsLinked: false,
};

export const loveLanguages = [
  { value: 'words', label: 'Words of Affirmation' },
  { value: 'acts', label: 'Acts of Service' },
  { value: 'gifts', label: 'Receiving Gifts' },
  { value: 'time', label: 'Quality Time' },
  { value: 'touch', label: 'Physical Touch' },
];

export const attachmentStyles = [
  { value: 'secure', label: 'Secure' },
  { value: 'anxious', label: 'Anxious' },
  { value: 'avoidant', label: 'Avoidant' },
  { value: 'disorganized', label: 'Disorganized' },
];

export const communicationStyles = [
  { value: 'direct', label: 'Direct' },
  { value: 'storyteller', label: 'Storyteller' },
  { value: 'listener', label: 'Listener' },
  { value: 'visual', label: 'Visual' },
];

export const workSchedules = [
  { value: '9-5', label: '9-5 Standard' },
  { value: 'flexible', label: 'Flexible / Remote' },
];

export const socialEnergyLevels = [
  { value: 'low', label: 'Low' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'high', label: 'High' },
];
