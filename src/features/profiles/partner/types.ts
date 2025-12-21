export type GoalType = 'For Fun' | 'Long-term' | 'Date to Marry' | 'Unclear';

export type LoveLanguage =
  | 'Words of Affirmation'
  | 'Quality Time'
  | 'Acts of Service'
  | 'Receiving Gifts'
  | 'Physical Touch';

export type CommunicationStyle =
  | 'Direct'
  | 'Playful'
  | 'Soft & Caring'
  | 'Avoid Conflict'
  | 'Logical'
  | 'Emotional'
  | 'Deep Talks'
  | 'Daily Texting'
  | 'Calls Only';

export type AttachmentTendency =
  | 'Secure'
  | 'Anxious'
  | 'Avoidant'
  | 'Secure-Leaning Anxious'
  | 'Secure-Leaning Avoidant'
  | 'Anxious-Avoidant'
  | 'Not sure'
  | 'Exploring';

export type DealBreaker =
  | 'Smoking'
  | 'Bad Hygiene'
  | 'Dishonesty'
  | 'Ghosting / prolonged silence'
  | 'Lack of respect'
  | 'Excessive jealousy'
  | 'Unclear relationship intentions'
  | 'Misaligned long-term goals'
  | 'Fundamentally different core values'
  | 'Unwillingness to commit'
  | 'Controlling / manipulative behavior'
  | 'Disrespect for personal boundaries';

export type WorkRhythm = 'Busy / Set Hours' | 'Flexible' | 'Remote' | '9–5';

export type SocialEnergyLevel = 'Introvert' | 'Ambivert' | 'Extrovert';

export type DateBudget = 'Low' | 'Balanced' | 'High'; // Maps to $, $$, $$$

export type Hobby =
  | 'Travel'
  | 'Food & Cafe'
  | 'Cooking'
  | 'Baking'
  | 'Fitness'
  | 'Gym'
  | 'Yoga'
  | 'Hiking'
  | 'Outdoor'
  | 'Photography'
  | 'Music'
  | 'Concert'
  | 'Movies'
  | 'Netflix'
  | 'Reading'
  | 'Gaming';

export type InterestLevel = 'Low' | 'Medium' | 'High';

export type MoodTrend = 'Excited' | 'Calm' | 'Stressed' | 'Happy' | 'Neutral';

export type StageType =
  | 'Dating'
  | 'Dating Exclusively'
  | 'In a Relationship'
  | 'Engaged'
  | 'Married';

export type SpecialDayType =
  | 'Birthday'
  | 'Our Start Date'
  | 'Christmas'
  | "Int'l Women's Day"
  | 'Custom';

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

