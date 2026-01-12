export type GoalType = "for_fun" | "long_term" | "date_to_marry" | "unclear";

export type LoveLanguage =
  | "words_of_affirmation"
  | "quality_time"
  | "acts_of_service"
  | "receiving_gifts"
  | "physical_touch";

export type CommunicationStyle =
  | "direct"
  | "playful"
  | "soft_caring"
  | "avoid_conflict"
  | "logical"
  | "emotional"
  | "deep_talks"
  | "daily_texting"
  | "calls_only";

export type AttachmentTendency =
  | "secure"
  | "anxious"
  | "avoidant"
  | "secure_leaning_anxious"
  | "secure_leaning_avoidant"
  | "anxious_avoidant"
  | "not_sure"
  | "exploring";

export type DealBreaker =
  | "smoking"
  | "bad_hygiene"
  | "dishonesty"
  | "ghosting_prolonged_silence"
  | "lack_of_respect"
  | "excessive_jealousy"
  | "unclear_relationship_intentions"
  | "misaligned_long_term_goals"
  | "fundamentally_different_core_values"
  | "unwillingness_to_commit"
  | "controlling_manipulative_behavior"
  | "disrespect_for_personal_boundaries";

export type WorkRhythm = "busy_set_hours" | "flexible" | "remote" | "nine_to_five";

export type SocialEnergyLevel = "introvert" | "balanced" | "extrovert";

export type DateBudget = "low" | "balanced" | "high"; // Maps to $, $$, $$$

export type Hobby =
  | "travel"
  | "food_cafe"
  | "cooking"
  | "baking"
  | "fitness"
  | "gym"
  | "yoga"
  | "hiking"
  | "outdoor"
  | "photography"
  | "music"
  | "concert"
  | "movies"
  | "netflix"
  | "reading"
  | "gaming";

export type InterestLevel = "low" | "medium" | "high";

export type MoodTrend = "excited" | "calm" | "stressed" | "happy" | "neutral";

export type StageType =
  | "dating"
  | "dating_exclusively"
  | "in_a_relationship"
  | "engaged"
  | "married";

export type SpecialDayType =
  | "birthday"
  | "our_start_date"
  | "christmas"
  | "intl_womens_day"
  | "custom";

export interface SpecialDay {
  id: string;
  type: SpecialDayType;
  name: string;
  date: string; // ISO date string
  icon: string; // Icon name from lucide-react
  iconColor: string; // Tailwind color class
  daysRemaining?: number; // Calculated days until the date
  notifyEnabled: boolean;
}

export interface GiftIdea {
  id: string;
  name: string;
  price: number;
  tag: string;
  icon: string; // Icon name from lucide-react
  iconColor: string; // Tailwind color class
  rationale?: string; // AI-generated rationale for the gift idea
}

export interface SocialSignal {
  title: string;
  description: string;
  icon?: string;
  isAiGenerated?: boolean;
}

export interface CycleTracking {
  periodStart?: string; // Date
  periodEnd?: string; // Date
  predictedStart?: string; // Date
  predictedEnd?: string; // Date
  isPrivate: boolean;
}

export interface AttachmentTendencyData {
  tendency: AttachmentTendency;
  label?: string; // e.g., "Soft Label"
  description?: string;
  isAiGenerated?: boolean;
}

export interface PartnerProfile {
  // Basic Info
  id: string;
  name: string;
  nickname?: string;
  age: number;
  location: string;
  avatarUrl?: string;
  stage: StageType;
  isPremium?: boolean;
  // Extended basic info fields from API
  gender?: string;
  dob?: string;
  timeOfBirth?: string;
  countryOfBirth?: string;
  cityOfBirth?: string;
  city?: string;
  timezoneOffset?: string;

  // Context fields from API
  currentSituation?: string;
  whatYouWant?: string;
  whatUltimatelyWant?: string;
  partnerPersonality?: string;
  pastEventsSummary?: string;
  currentFeelings?: string;

  // Goals
  goals: GoalType[];
  goalsIsAiGenerated?: boolean;

  // Personality & Preference
  loveLanguage?: LoveLanguage;
  loveLanguageIsAiGenerated?: boolean;
  communicationStyles: CommunicationStyle[];
  communicationStylesIsAiGenerated?: boolean;
  attachmentTendency?: AttachmentTendencyData;
  dealBreakers: DealBreaker[];
  appreciatedThings: string[];
  appreciatedThingsIsAiGenerated?: boolean;
  // Alternative field name from API
  thingsTheyAppreciate?: string[];

  // Lifestyle Snapshot
  workRhythm?: WorkRhythm;
  workRhythmIsAiGenerated?: boolean;
  socialEnergyLevel?: SocialEnergyLevel;
  socialEnergyLevelIsAiGenerated?: boolean;
  cycleTracking?: CycleTracking;
  dateBudget?: DateBudget;
  dateBudgetIsAiGenerated?: boolean;
  hobbies: Hobby[];
  hobbiesIsAiGenerated?: boolean;
  favoriteHobbies?: Hobby[]; // Hobbies with star icon

  // Social Signals
  socialSignals: SocialSignal[];
  socialSignalTags?: string[]; // Additional tags like "WEEKEND HIKER", "CAMERA SHY"
  instagramUrl?: string; // Instagram profile URL
  facebookUrl?: string;
  threadsUrl?: string;
  tiktokUrl?: string;

  // Chemistry & Insights
  interestLevel?: InterestLevel;
  interestLevelConfidence?: number; // 0-100
  moodTrend?: MoodTrend;
  chemistryScore?: number; // 0-100
  chemistryScoreDescription?: string;
  whatWorksWell?: string;

  // Special Things
  specialDays?: SpecialDay[];
  giftIdeas?: GiftIdea[];

  // Voice Profile
  voiceAudioUrl?: string; // URL to stored audio if already uploaded
}

// ============================================
// API Response Types (snake_case)
// ============================================

export interface BasicInfoApi {
  name: string;
  nickname?: string;
  avatar_url?: string;
  gender?: string;
  age: number;
  city?: string;
  location: string;
  relationship_stage: string;
  dob?: string;
  time_of_birth?: string;
  country_of_birth?: string;
  city_of_birth?: string;
  timezone_offset?: string;
}

export interface PersonalityApi {
  love_languages?: string[];
  communication_styles?: string[];
  attachment_style?: string;
  deal_breakers?: string[];
}

export interface LifestyleApi {
  work_schedule?: string;
  date_budget?: number;
  social_energy_level?: string;
  hobbies?: string[];
}

export interface SocialLinksApi {
  instagram?: string;
  facebook?: string;
  threads?: string;
  tiktok?: string;
}

export interface SpecialDayApi {
  id: string;
  name: string;
  date: string;
  type: string;
  icon: string;
  icon_color: string;
  notifications_enabled: boolean;
}

export interface GiftIdeaApi {
  id: string;
  name: string;
  price: number;
  tag: string;
  icon: string;
  icon_color: string;
  ai_curated: boolean;
  rationale?: string;
}

export interface SocialSignalApi {
  title: string;
  description: string;
  icon?: string;
  is_ai_generated?: boolean;
}

export interface CycleTrackingApi {
  is_private: boolean;
  predicted_start?: string;
  predicted_end?: string;
}

export interface AttachmentTendencyApi {
  tendency: string;
  label?: string;
  description?: string;
  is_ai_generated?: boolean;
}

/**
 * API response type matching the actual backend structure
 * This represents the exact structure returned from the API
 * Note: This is the nested partner_profile object structure
 */
export interface PartnerProfileApiResponse {
  partner_id: string;
  basic_info: BasicInfoApi;
  current_situation?: string;
  what_you_want?: string;
  what_ultimately_want?: string;
  partner_personality?: string;
  past_events_summary?: string;
  current_feelings?: string;
  goals: string[];
  goals_is_ai_generated?: boolean;
  personality?: PersonalityApi;
  lifestyle?: LifestyleApi;
  social_links?: SocialLinksApi;
  things_they_appreciate?: string[];
  special_days?: SpecialDayApi[];
  is_premium?: boolean;
  love_language?: string;
  love_language_is_ai_generated?: boolean;
  communication_styles?: string[];
  communication_styles_is_ai_generated?: boolean;
  attachment_tendency?: AttachmentTendencyApi;
  deal_breakers?: string[];
  appreciated_things?: string[];
  appreciated_things_is_ai_generated?: boolean;
  work_rhythm?: string;
  work_rhythm_is_ai_generated?: boolean;
  cycle_tracking?: CycleTrackingApi;
  date_budget?: string | number;
  date_budget_is_ai_generated?: boolean;
  hobbies?: string[];
  hobbies_is_ai_generated?: boolean;
  favorite_hobbies?: string[];
  social_signals?: SocialSignalApi[];
  social_signal_tags?: string[];
  interest_level?: string;
  interest_level_confidence?: number;
  mood_trend?: string;
  chemistry_score?: number;
  chemistry_score_description?: string;
  what_works_well?: string;
  gift_ideas?: GiftIdeaApi[];
  social_energy_level?: string;
  social_energy_level_is_ai_generated?: boolean;
}

/**
 * Wrapper type for the full API response
 * The API returns: { partner_id: string, partner_profile: PartnerProfileApiResponse }
 */
export interface PartnerProfileApiWrapper {
  partner_id: string;
  partner_profile: PartnerProfileApiResponse;
}
