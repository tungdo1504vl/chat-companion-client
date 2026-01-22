import type { PartnerProfile } from "@/features/profile/partner/types";
import type { TPartner } from "./types";

/**
 * Centralized mock partner profile data
 * This is the single source of truth for mock partner data
 */
export const MOCK_PARTNER_PROFILE: PartnerProfile = {
  id: '62cc15de2b57420e82199606f2e86b40',
  name: 'Bao Quyen',
  nickname: 'Sar',
  age: 30,
  location: 'Vietnam',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFBu7ihKfRsIjq6dEDQDkTqn4LzycaeVwJi-A8kD9EBRvazPeVl5o7enP19JsooIn6KBCFf-gl-JkhWnsJIfsQ1vb7ie0Jz2NOWaM_jCk9v15OTwILMkpv1yMyGNWoQ2mJIxRKZ9pzLAB32lk_5W15IJubeE7TcRxF2w1OrZLPJejDL_6KU3b_74wVpY8yoj2ejsuWIsNNDEYCwSF27MqvL_RjMapch817j9wSP9qmTFL5Sog3s2uXlxVubLske_JWd_TbNqcD8w',
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
      icon: 'palette',
      isAiGenerated: true,
    },
    {
      title: 'Likes dogs (Golden Retrievers)',
      description: 'Frequent interactions with pet content.',
      icon: 'pets',
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
    'Bao Quyen responds positively to proactive planning. She values consistency in communication and appreciates when you reference small details from past conversations. Keep dates activity-based to match her "ambivert" energy.',
  specialDays: [],

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

/**
 * Convert PartnerProfile to TPartner format (store format)
 * This ensures consistency when adding partners to the store
 */
export function partnerProfileToTPartner(profile: PartnerProfile): TPartner {
  // Extract location parts
  const locationParts = profile.location.split(', ');
  const city = locationParts[0] || profile.city;
  const country = locationParts[1] || profile.countryOfBirth || '';

  return {
    partner_id: profile.id,
    avatarUrl: profile.avatarUrl,
    partner_profile: {
      basic_info: {
        name: profile.name,
        dob: profile.dob || '',
        country_of_birth: profile.countryOfBirth || country,
        city_of_birth: profile.cityOfBirth || city,
        age: profile.age,
        social_link: profile.instagramUrl,
      },
    },
  };
}

/**
 * Get mock partner in TPartner format for store
 */
export function getMockPartnerAsTPartner(): TPartner {
  return partnerProfileToTPartner(MOCK_PARTNER_PROFILE);
}
