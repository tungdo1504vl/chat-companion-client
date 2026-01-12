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

export const GOAL_OPTIONS: { value: GoalType; label: string }[] = [
  { value: 'for_fun', label: 'For Fun' },
  { value: 'long_term', label: 'Long-term' },
  { value: 'date_to_marry', label: 'Date to Marry' },
  { value: 'unclear', label: 'Unclear' },
];

export const LOVE_LANGUAGE_OPTIONS: { value: LoveLanguage; label: string }[] = [
  { value: 'words_of_affirmation', label: 'Words of Affirmation' },
  { value: 'quality_time', label: 'Quality Time' },
  { value: 'acts_of_service', label: 'Acts of Service' },
  { value: 'receiving_gifts', label: 'Receiving Gifts' },
  { value: 'physical_touch', label: 'Physical Touch' },
];

export const COMMUNICATION_STYLE_OPTIONS: {
  value: CommunicationStyle;
  label: string;
}[] = [
  { value: 'direct', label: 'Direct' },
  { value: 'playful', label: 'Playful' },
  { value: 'soft_caring', label: 'Soft & Caring' },
  { value: 'avoid_conflict', label: 'Avoid Conflict' },
  { value: 'logical', label: 'Logical' },
  { value: 'emotional', label: 'Emotional' },
  { value: 'deep_talks', label: 'Deep Talks' },
  { value: 'daily_texting', label: 'Daily Texting' },
  { value: 'calls_only', label: 'Calls Only' },
];

export const DEAL_BREAKER_OPTIONS: { value: DealBreaker; label: string }[] = [
  { value: 'smoking', label: 'Smoking' },
  { value: 'bad_hygiene', label: 'Bad Hygiene' },
  { value: 'dishonesty', label: 'Dishonesty' },
  {
    value: 'ghosting_prolonged_silence',
    label: 'Ghosting / prolonged silence',
  },
  { value: 'lack_of_respect', label: 'Lack of respect' },
  { value: 'excessive_jealousy', label: 'Excessive jealousy' },
  {
    value: 'unclear_relationship_intentions',
    label: 'Unclear relationship intentions',
  },
  { value: 'misaligned_long_term_goals', label: 'Misaligned long-term goals' },
  {
    value: 'fundamentally_different_core_values',
    label: 'Fundamentally different core values',
  },
  { value: 'unwillingness_to_commit', label: 'Unwillingness to commit' },
  {
    value: 'controlling_manipulative_behavior',
    label: 'Controlling / manipulative behavior',
  },
  {
    value: 'disrespect_for_personal_boundaries',
    label: 'Disrespect for personal boundaries',
  },
];

export const WORK_RHYTHM_OPTIONS: { value: WorkRhythm; label: string }[] = [
  { value: 'nine_to_five', label: '9–5' },
  { value: 'busy_set_hours', label: 'Busy / Set Hours' },
  { value: 'flexible', label: 'Flexible' },
  { value: 'remote', label: 'Remote' },
];

export const SOCIAL_ENERGY_OPTIONS: {
  value: SocialEnergyLevel;
  label: string;
}[] = [
  { value: 'introvert', label: 'Introvert' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'extrovert', label: 'Extrovert' },
];

export const HOBBY_OPTIONS: { value: Hobby; label: string }[] = [
  { value: 'travel', label: 'Travel' },
  { value: 'food_cafe', label: 'Food & Cafe' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'baking', label: 'Baking' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'gym', label: 'Gym' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'hiking', label: 'Hiking' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'photography', label: 'Photography' },
  { value: 'music', label: 'Music' },
  { value: 'concert', label: 'Concert' },
  { value: 'movies', label: 'Movies' },
  { value: 'netflix', label: 'Netflix' },
  { value: 'reading', label: 'Reading' },
  { value: 'gaming', label: 'Gaming' },
];

// Mock data for development
export const MOCK_PARTNER_PROFILE: PartnerProfile = {
  id: '1',
  name: 'Sarah Jenkins',
  nickname: 'Sar',
  age: 28,
  location: 'San Francisco, CA',
  avatarUrl: '/mascot/mascot-removebg-preview.png',
  stage: 'dating_exclusively',
  isPremium: true,

  goals: ['long_term'],
  goalsIsAiGenerated: false,

  loveLanguage: 'quality_time',
  loveLanguageIsAiGenerated: true,

  communicationStyles: ['deep_talks', 'daily_texting'],
  communicationStylesIsAiGenerated: true,

  attachmentTendency: {
    tendency: 'secure_leaning_anxious',
    label: 'Soft Label',
    description: 'Inferred from response times & reassurance seeking.',
    isAiGenerated: true,
  },

  dealBreakers: ['smoking', 'bad_hygiene'],

  appreciatedThings: ['Good morning texts', 'Remembering details'],
  appreciatedThingsIsAiGenerated: true,

  workRhythm: 'flexible',
  workRhythmIsAiGenerated: true,

  socialEnergyLevel: 'balanced',
  socialEnergyLevelIsAiGenerated: true,

  cycleTracking: {
    isPrivate: true,
    predictedStart: '2024-09-28',
    predictedEnd: '2024-10-02',
  },

  dateBudget: 'balanced',
  dateBudgetIsAiGenerated: true,

  hobbies: ['hiking', 'photography', 'cooking'],
  hobbiesIsAiGenerated: true,
  favoriteHobbies: ['photography'],

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

  interestLevel: 'high',
  interestLevelConfidence: 90,
  moodTrend: 'excited',
  chemistryScore: 92,
  chemistryScoreDescription: 'Based on conversation depth & date feedback.',
  whatWorksWell:
    'Sarah responds positively to proactive planning. She values consistency in communication and appreciates when you reference small details from past conversations. Keep dates activity-based to match her "ambivert" energy.',
  specialDays: [],
  // specialDays: [
  //   {
  //     id: "1",
  //     type: "birthday",
  //     name: "Birthday",
  //     date: "2024-10-24",
  //     icon: "Cake",
  //     iconColor: "bg-pink-100",
  //     notifyEnabled: false,
  //   },
  //   {
  //     id: "2",
  //     type: "our_start_date",
  //     name: "Our Start Date",
  //     date: "2024-02-14",
  //     icon: "Heart",
  //     iconColor: "bg-red-100",
  //     notifyEnabled: true,
  //   },
  //   {
  //     id: "3",
  //     type: "christmas",
  //     name: "Christmas",
  //     date: "2024-12-25",
  //     icon: "TreePine",
  //     iconColor: "bg-green-100",
  //     notifyEnabled: true,
  //   },
  //   {
  //     id: "4",
  //     type: "intl_womens_day",
  //     name: "Int'l Women's Day",
  //     date: "2025-03-08",
  //     icon: "Venus",
  //     iconColor: "bg-purple-100",
  //     notifyEnabled: false,
  //   },
  // ],

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

export const DATE_BUDGET_LABELS: Record<
  number,
  { value: string; label: string }
> = {
  0: { value: 'low', label: '$ (Low)' },
  50: { value: 'balanced', label: '$$ (Balanced)' },
  100: { value: 'high', label: '$$$ (High)' },
};

export const DATE_BUDGET_TO_VALUE: Record<string, number> = {
  low: 0,
  balanced: 50,
  high: 100,
};
