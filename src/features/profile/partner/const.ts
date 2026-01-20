import type {
  GoalType,
  LoveLanguage,
  CommunicationStyle,
  DealBreaker,
  WorkRhythm,
  SocialEnergyLevel,
  Hobby,
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

// Re-export mock data from centralized store location
export { MOCK_PARTNER_PROFILE } from "@/stores/partner/mock-data";

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
