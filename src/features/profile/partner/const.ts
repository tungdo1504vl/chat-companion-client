import type {
  GoalType,
  LoveLanguage,
  CommunicationStyle,
  DealBreaker,
  WorkRhythm,
  SocialEnergyLevel,
  Hobby,
  PartnerProfile,
  SpecialDay,
  GiftIdea,
} from './types';

export const GOAL_OPTIONS: GoalType[] = [
  'For Fun',
  'Long-term',
  'Date to Marry',
  'Unclear',
];

export const LOVE_LANGUAGE_OPTIONS: { value: LoveLanguage; label: string }[] =
  [
    { value: 'Words of Affirmation', label: 'Words of Affirmation' },
    { value: 'Quality Time', label: 'Quality Time' },
    { value: 'Acts of Service', label: 'Acts of Service' },
    { value: 'Receiving Gifts', label: 'Receiving Gifts' },
    { value: 'Physical Touch', label: 'Physical Touch' },
  ];

export const COMMUNICATION_STYLE_OPTIONS: {
  value: CommunicationStyle;
  label: string;
}[] = [
  { value: 'Direct', label: 'Direct' },
  { value: 'Playful', label: 'Playful' },
  { value: 'Soft & Caring', label: 'Soft & Caring' },
  { value: 'Avoid Conflict', label: 'Avoid Conflict' },
  { value: 'Logical', label: 'Logical' },
  { value: 'Emotional', label: 'Emotional' },
  { value: 'Deep Talks', label: 'Deep Talks' },
  { value: 'Daily Texting', label: 'Daily Texting' },
  { value: 'Calls Only', label: 'Calls Only' },
];

export const DEAL_BREAKER_OPTIONS: DealBreaker[] = [
  'Smoking',
  'Bad Hygiene',
  'Dishonesty',
  'Ghosting / prolonged silence',
  'Lack of respect',
  'Excessive jealousy',
  'Unclear relationship intentions',
  'Misaligned long-term goals',
  'Fundamentally different core values',
  'Unwillingness to commit',
  'Controlling / manipulative behavior',
  'Disrespect for personal boundaries',
];

export const WORK_RHYTHM_OPTIONS: { value: WorkRhythm; label: string }[] = [
  { value: '9–5', label: '9–5' },
  { value: 'Busy / Set Hours', label: 'Busy / Set Hours' },
  { value: 'Flexible', label: 'Flexible' },
  { value: 'Remote', label: 'Remote' },
];

export const SOCIAL_ENERGY_OPTIONS: {
  value: SocialEnergyLevel;
  label: string;
}[] = [
  { value: 'Introvert', label: 'Introvert' },
  { value: 'Ambivert', label: 'Ambivert' },
  { value: 'Extrovert', label: 'Extrovert' },
];

export const HOBBY_OPTIONS: Hobby[] = [
  'Travel',
  'Food & Cafe',
  'Cooking',
  'Baking',
  'Fitness',
  'Gym',
  'Yoga',
  'Hiking',
  'Outdoor',
  'Photography',
  'Music',
  'Concert',
  'Movies',
  'Netflix',
  'Reading',
  'Gaming',
];

// Mock data for development
export const MOCK_PARTNER_PROFILE: PartnerProfile = {
  id: '1',
  name: 'Sarah Jenkins',
  nickname: 'Sar',
  age: 28,
  location: 'San Francisco, CA',
  avatarUrl: '/mascot/mascot-removebg-preview.png',
  stage: 'Dating Exclusively',
  isPremium: true,

  goals: ['Long-term'],
  goalsIsAiGenerated: false,

  loveLanguage: 'Quality Time',
  loveLanguageIsAiGenerated: true,

  communicationStyles: ['Deep Talks', 'Daily Texting'],
  communicationStylesIsAiGenerated: true,

  attachmentTendency: {
    tendency: 'Secure-Leaning Anxious',
    label: 'Soft Label',
    description: 'Inferred from response times & reassurance seeking.',
    isAiGenerated: true,
  },

  dealBreakers: ['Smoking', 'Bad Hygiene'],

  appreciatedThings: ['Good morning texts', 'Remembering details'],
  appreciatedThingsIsAiGenerated: true,

  workRhythm: 'Flexible',
  workRhythmIsAiGenerated: true,

  socialEnergyLevel: 'Ambivert',
  socialEnergyLevelIsAiGenerated: true,

  cycleTracking: {
    isPrivate: true,
    predictedStart: '2024-09-28',
    predictedEnd: '2024-10-02',
  },

  dateBudget: 'Balanced',
  dateBudgetIsAiGenerated: true,

  hobbies: ['Hiking', 'Photography', 'Cooking'],
  hobbiesIsAiGenerated: true,
  favoriteHobbies: ['Photography'],

  socialSignals: [
    {
      title: 'Minimal & Neutral Aesthetic',
      description: 'Inferred from photos & follows.',
      icon: 'paw',
      isAiGenerated: true,
    },
    {
      title: 'Likes dogs (Golden Retrievers)',
      description: 'Frequent interactions with pet content.',
      icon: 'paw',
      isAiGenerated: true,
    },
    {
      title: 'Specialty Coffee Lover',
      description: 'Posts from local cafes.',
      icon: 'coffee',
      isAiGenerated: true,
    },
  ],

  socialSignalTags: ['WEEKEND HIKER', 'CAMERA SHY'],

  interestLevel: 'High',
  interestLevelConfidence: 90,
  moodTrend: 'Excited',
  chemistryScore: 92,
  chemistryScoreDescription:
    'Based on conversation depth & date feedback.',
  whatWorksWell:
    'Sarah responds positively to proactive planning. She values consistency in communication and appreciates when you reference small details from past conversations. Keep dates activity-based to match her "ambivert" energy.',

  specialDays: [
    {
      id: '1',
      type: 'Birthday',
      name: 'Birthday',
      date: '2024-10-24',
      icon: 'Cake',
      iconColor: 'bg-pink-100',
      notifyEnabled: false,
    },
    {
      id: '2',
      type: 'Our Start Date',
      name: 'Our Start Date',
      date: '2024-02-14',
      icon: 'Heart',
      iconColor: 'bg-red-100',
      notifyEnabled: true,
    },
    {
      id: '3',
      type: 'Christmas',
      name: 'Christmas',
      date: '2024-12-25',
      icon: 'TreePine',
      iconColor: 'bg-green-100',
      notifyEnabled: true,
    },
    {
      id: '4',
      type: "Int'l Women's Day",
      name: "Int'l Women's Day",
      date: '2025-03-08',
      icon: 'Venus',
      iconColor: 'bg-purple-100',
      notifyEnabled: false,
    },
  ],

  giftIdeas: [
    {
      id: '1',
      name: 'Vintage Camera...',
      price: 35.0,
      tag: 'Aesthetic',
      icon: 'Camera',
      iconColor: 'bg-orange-100',
    },
    {
      id: '2',
      name: 'Annual Park Pass',
      price: 80.0,
      tag: 'Active',
      icon: 'Mountain',
      iconColor: 'bg-green-100',
    },
    {
      id: '3',
      name: 'AeroPress Go',
      price: 45.0,
      tag: 'Coffee',
      icon: 'Coffee',
      iconColor: 'bg-amber-100',
    },
    {
      id: '4',
      name: 'Art of Hiking Bo...',
      price: 28.0,
      tag: 'Roads',
      icon: 'BookOpen',
      iconColor: 'bg-purple-100',
    },
  ],
};

export const DATE_BUDGET_LABELS: Record<number, { value: string; label: string }> = {
  0: { value: 'Low', label: '$ (Low)' },
  50: { value: 'Balanced', label: '$$ (Balanced)' },
  100: { value: 'High', label: '$$$ (High)' },
};

export const DATE_BUDGET_TO_VALUE: Record<string, number> = {
  Low: 0,
  Balanced: 50,
  High: 100,
};

