export type GoalType = "For Fun" | "Long-term" | "Date to Marry" | "Unclear";

export type LoveLanguage =
  | "Words of Affirmation"
  | "Quality Time"
  | "Acts of Service"
  | "Receiving Gifts"
  | "Physical Touch";

export type CommunicationStyle =
  | "Direct"
  | "Playful"
  | "Soft & Caring"
  | "Avoid Conflict"
  | "Logical"
  | "Emotional"
  | "Deep Talks"
  | "Daily Texting"
  | "Calls Only";

export type AttachmentTendency =
  | "Secure"
  | "Anxious"
  | "Avoidant"
  | "Secure-Leaning Anxious"
  | "Secure-Leaning Avoidant"
  | "Anxious-Avoidant"
  | "Not sure"
  | "Exploring";

export type DealBreaker =
  | "Smoking"
  | "Bad Hygiene"
  | "Dishonesty"
  | "Ghosting / prolonged silence"
  | "Lack of respect"
  | "Excessive jealousy"
  | "Unclear relationship intentions"
  | "Misaligned long-term goals"
  | "Fundamentally different core values"
  | "Unwillingness to commit"
  | "Controlling / manipulative behavior"
  | "Disrespect for personal boundaries";

export type WorkRhythm = "Busy / Set Hours" | "Flexible" | "Remote" | "9–5";

export type SocialEnergyLevel = "Introvert" | "Ambivert" | "Extrovert";

export type DateBudget = "Low" | "Balanced" | "High"; // Maps to $, $$, $$$

export type Hobby =
  | "Travel"
  | "Food & Cafe"
  | "Cooking"
  | "Baking"
  | "Fitness"
  | "Gym"
  | "Yoga"
  | "Hiking"
  | "Outdoor"
  | "Photography"
  | "Music"
  | "Concert"
  | "Movies"
  | "Netflix"
  | "Reading"
  | "Gaming";

export type InterestLevel = "Low" | "Medium" | "High";

export type MoodTrend = "Excited" | "Calm" | "Stressed" | "Happy" | "Neutral";

export type StageType =
  | "Dating"
  | "Dating Exclusively"
  | "In a Relationship"
  | "Engaged"
  | "Married";

export type SpecialDayType =
  | "Birthday"
  | "Our Start Date"
  | "Christmas"
  | "Int'l Women's Day"
  | "Custom";

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
