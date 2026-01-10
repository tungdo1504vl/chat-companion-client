import type {
  PartnerProfile,
  PartnerProfileApiResponse,
  SpecialDay,
  GiftIdea,
  SocialSignal,
  CycleTracking,
  AttachmentTendencyData,
  GoalType,
  LoveLanguage,
  CommunicationStyle,
  DealBreaker,
  WorkRhythm,
  SocialEnergyLevel,
  DateBudget,
  Hobby,
  InterestLevel,
  MoodTrend,
  StageType,
  SpecialDayType,
  AttachmentTendency,
} from "../types";
import { DATE_BUDGET_LABELS } from "../const";

/**
 * Convert date budget number to DateBudget enum
 * Maps: 0 -> "Low", 50 -> "Balanced", 100 -> "High"
 */
function convertDateBudget(
  value: string | number | undefined
): DateBudget | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  // If it's already a string, validate it
  if (typeof value === "string") {
    if (value === "Low" || value === "Balanced" || value === "High") {
      return value as DateBudget;
    }
    return undefined;
  }

  // If it's a number, convert it
  if (typeof value === "number") {
    if (value === 0) return "Low";
    if (value === 50) return "Balanced";
    if (value === 100) return "High";
    return undefined;
  }

  return undefined;
}

/**
 * Convert string to GoalType enum, with validation
 */
function convertGoalType(value: string): GoalType | null {
  const validTypes: GoalType[] = [
    "For Fun",
    "Long-term",
    "Date to Marry",
    "Unclear",
  ];
  return validTypes.includes(value as GoalType) ? (value as GoalType) : null;
}

/**
 * Convert string to LoveLanguage enum, with validation
 */
function convertLoveLanguage(value: string): LoveLanguage | undefined {
  const validLanguages: LoveLanguage[] = [
    "Words of Affirmation",
    "Quality Time",
    "Acts of Service",
    "Receiving Gifts",
    "Physical Touch",
  ];
  return validLanguages.includes(value as LoveLanguage)
    ? (value as LoveLanguage)
    : undefined;
}

/**
 * Convert string to CommunicationStyle enum, with validation
 */
function convertCommunicationStyle(
  value: string
): CommunicationStyle | null {
  const validStyles: CommunicationStyle[] = [
    "Direct",
    "Playful",
    "Soft & Caring",
    "Avoid Conflict",
    "Logical",
    "Emotional",
    "Deep Talks",
    "Daily Texting",
    "Calls Only",
  ];
  return validStyles.includes(value as CommunicationStyle)
    ? (value as CommunicationStyle)
    : null;
}

/**
 * Convert string to DealBreaker enum, with validation
 */
function convertDealBreaker(value: string): DealBreaker | null {
  const validDealBreakers: DealBreaker[] = [
    "Smoking",
    "Bad Hygiene",
    "Dishonesty",
    "Ghosting / prolonged silence",
    "Lack of respect",
    "Excessive jealousy",
    "Unclear relationship intentions",
    "Misaligned long-term goals",
    "Fundamentally different core values",
    "Unwillingness to commit",
    "Controlling / manipulative behavior",
    "Disrespect for personal boundaries",
  ];
  return validDealBreakers.includes(value as DealBreaker)
    ? (value as DealBreaker)
    : null;
}

/**
 * Convert string to WorkRhythm enum, with validation
 */
function convertWorkRhythm(value: string): WorkRhythm | undefined {
  const validRhythms: WorkRhythm[] = [
    "Busy / Set Hours",
    "Flexible",
    "Remote",
    "9–5",
  ];
  return validRhythms.includes(value as WorkRhythm)
    ? (value as WorkRhythm)
    : undefined;
}

/**
 * Convert string to SocialEnergyLevel enum, with validation
 */
function convertSocialEnergyLevel(
  value: string
): SocialEnergyLevel | undefined {
  const validLevels: SocialEnergyLevel[] = ["Introvert", "Ambivert", "Extrovert"];
  return validLevels.includes(value as SocialEnergyLevel)
    ? (value as SocialEnergyLevel)
    : undefined;
}

/**
 * Convert string to Hobby enum, with validation
 */
function convertHobby(value: string): Hobby | null {
  const validHobbies: Hobby[] = [
    "Travel",
    "Food & Cafe",
    "Cooking",
    "Baking",
    "Fitness",
    "Gym",
    "Yoga",
    "Hiking",
    "Outdoor",
    "Photography",
    "Music",
    "Concert",
    "Movies",
    "Netflix",
    "Reading",
    "Gaming",
  ];
  return validHobbies.includes(value as Hobby) ? (value as Hobby) : null;
}

/**
 * Convert string to InterestLevel enum, with validation
 */
function convertInterestLevel(value: string): InterestLevel | undefined {
  const validLevels: InterestLevel[] = ["Low", "Medium", "High"];
  return validLevels.includes(value as InterestLevel)
    ? (value as InterestLevel)
    : undefined;
}

/**
 * Convert string to MoodTrend enum, with validation
 */
function convertMoodTrend(value: string): MoodTrend | undefined {
  const validTrends: MoodTrend[] = ["Excited", "Calm", "Stressed", "Happy", "Neutral"];
  return validTrends.includes(value as MoodTrend) ? (value as MoodTrend) : undefined;
}

/**
 * Convert string to StageType enum, with validation
 */
function convertStageType(value: string): StageType {
  const validStages: StageType[] = [
    "Dating",
    "Dating Exclusively",
    "In a Relationship",
    "Engaged",
    "Married",
  ];
  return validStages.includes(value as StageType)
    ? (value as StageType)
    : "Dating"; // Default fallback
}

/**
 * Convert string to SpecialDayType enum, with validation
 */
function convertSpecialDayType(value: string): SpecialDayType {
  const validTypes: SpecialDayType[] = [
    "Birthday",
    "Our Start Date",
    "Christmas",
    "Int'l Women's Day",
    "Custom",
  ];
  return validTypes.includes(value as SpecialDayType)
    ? (value as SpecialDayType)
    : "Custom"; // Default fallback
}

/**
 * Convert string to AttachmentTendency enum, with validation
 */
function convertAttachmentTendency(value: string): AttachmentTendency | undefined {
  const validTendencies: AttachmentTendency[] = [
    "Secure",
    "Anxious",
    "Avoidant",
    "Secure-Leaning Anxious",
    "Secure-Leaning Avoidant",
    "Anxious-Avoidant",
    "Not sure",
    "Exploring",
  ];
  return validTendencies.includes(value as AttachmentTendency)
    ? (value as AttachmentTendency)
    : undefined;
}

/**
 * Transform API response to PartnerProfile
 * Maps snake_case API response to camelCase PartnerProfile type
 * Provides fallbacks for all fields
 */
export function apiResponseToPartnerProfile(
  apiResponse: PartnerProfileApiResponse
): PartnerProfile {
  const basicInfo = apiResponse.basic_info || {};
  const personality = apiResponse.personality;
  const lifestyle = apiResponse.lifestyle;
  const cycleTracking = apiResponse.cycle_tracking;
  const attachmentTendency = apiResponse.attachment_tendency;

  // Transform goals array with validation
  const goals: GoalType[] = (apiResponse.goals || [])
    .map(convertGoalType)
    .filter((g): g is GoalType => g !== null);

  // Transform communication styles array with validation
  const communicationStyles: CommunicationStyle[] = (
    apiResponse.communication_styles || []
  )
    .map(convertCommunicationStyle)
    .filter((s): s is CommunicationStyle => s !== null);

  // Transform deal breakers array with validation
  const dealBreakers: DealBreaker[] = (apiResponse.deal_breakers || [])
    .map(convertDealBreaker)
    .filter((d): d is DealBreaker => d !== null);

  // Transform hobbies array with validation
  const hobbies: Hobby[] = (apiResponse.hobbies || [])
    .map(convertHobby)
    .filter((h): h is Hobby => h !== null);

  // Transform favorite hobbies array with validation
  const favoriteHobbies: Hobby[] | undefined = apiResponse.favorite_hobbies
    ? apiResponse.favorite_hobbies
        .map(convertHobby)
        .filter((h): h is Hobby => h !== null)
    : undefined;

  // Transform special days
  const specialDays: SpecialDay[] | undefined = apiResponse.special_days
    ? apiResponse.special_days.map((day): SpecialDay => ({
        id: day.id || "",
        type: convertSpecialDayType(day.type || "Custom"),
        name: day.name || "",
        date: day.date || "",
        icon: day.icon || "",
        iconColor: day.icon_color || "",
        notifyEnabled: day.notifications_enabled ?? false,
      }))
    : undefined;

  // Transform gift ideas
  const giftIdeas: GiftIdea[] | undefined = apiResponse.gift_ideas
    ? apiResponse.gift_ideas.map(
        (gift): GiftIdea => ({
          id: gift.id || "",
          name: gift.name || "",
          price: gift.price ?? 0,
          tag: gift.tag || "",
          icon: gift.icon || "",
          iconColor: gift.icon_color || "",
        })
      )
    : undefined;

  // Transform social signals
  const socialSignals: SocialSignal[] =
    apiResponse.social_signals?.map(
      (signal): SocialSignal => ({
        title: signal.title || "",
        description: signal.description || "",
        icon: signal.icon,
        isAiGenerated: signal.is_ai_generated ?? false,
      })
    ) || [];

  // Transform cycle tracking
  const cycleTrackingTransformed: CycleTracking | undefined = cycleTracking
    ? {
        isPrivate: cycleTracking.is_private ?? false,
        predictedStart: cycleTracking.predicted_start,
        predictedEnd: cycleTracking.predicted_end,
      }
    : undefined;

  // Transform attachment tendency
  const attachmentTendencyTransformed:
    | AttachmentTendencyData
    | undefined = attachmentTendency
    ? {
        tendency: convertAttachmentTendency(
          attachmentTendency.tendency
        ) as AttachmentTendency,
        label: attachmentTendency.label,
        description: attachmentTendency.description,
        isAiGenerated: attachmentTendency.is_ai_generated ?? false,
      }
    : undefined;

  // Transform appreciated things (can come from things_they_appreciate or appreciated_things)
  const appreciatedThings: string[] =
    apiResponse.appreciated_things ||
    apiResponse.things_they_appreciate ||
    [];

  // Transform date budget (can be number or string)
  const dateBudget = convertDateBudget(apiResponse.date_budget);

  // Build the transformed profile
  const profile: PartnerProfile = {
    // Basic Info
    id: apiResponse.partner_id || "",
    name: basicInfo.name || "",
    nickname: basicInfo.nickname,
    age: basicInfo.age ?? 0,
    location: basicInfo.location || "",
    avatarUrl: basicInfo.avatar_url,
    stage: convertStageType(
      basicInfo.relationship_stage || apiResponse.partner_personality || "Dating"
    ),
    isPremium: apiResponse.is_premium ?? false,

    // Goals
    goals,
    goalsIsAiGenerated: apiResponse.goals_is_ai_generated ?? false,

    // Personality & Preference
    loveLanguage: apiResponse.love_language
      ? convertLoveLanguage(apiResponse.love_language)
      : undefined,
    loveLanguageIsAiGenerated:
      apiResponse.love_language_is_ai_generated ?? false,
    communicationStyles,
    communicationStylesIsAiGenerated:
      apiResponse.communication_styles_is_ai_generated ?? false,
    attachmentTendency: attachmentTendencyTransformed,
    dealBreakers,
    appreciatedThings,
    appreciatedThingsIsAiGenerated:
      apiResponse.appreciated_things_is_ai_generated ?? false,

    // Lifestyle Snapshot
    workRhythm: apiResponse.work_rhythm
      ? convertWorkRhythm(apiResponse.work_rhythm)
      : undefined,
    workRhythmIsAiGenerated: apiResponse.work_rhythm_is_ai_generated ?? false,
    socialEnergyLevel: apiResponse.social_energy_level
      ? convertSocialEnergyLevel(apiResponse.social_energy_level)
      : undefined,
    socialEnergyLevelIsAiGenerated:
      apiResponse.social_energy_level_is_ai_generated ?? false,
    cycleTracking: cycleTrackingTransformed,
    dateBudget,
    dateBudgetIsAiGenerated: apiResponse.date_budget_is_ai_generated ?? false,
    hobbies,
    hobbiesIsAiGenerated: apiResponse.hobbies_is_ai_generated ?? false,
    favoriteHobbies,

    // Social Signals
    socialSignals,
    socialSignalTags: apiResponse.social_signal_tags,

    // Chemistry & Insights
    interestLevel: apiResponse.interest_level
      ? convertInterestLevel(apiResponse.interest_level)
      : undefined,
    interestLevelConfidence: apiResponse.interest_level_confidence,
    moodTrend: apiResponse.mood_trend
      ? convertMoodTrend(apiResponse.mood_trend)
      : undefined,
    chemistryScore: apiResponse.chemistry_score,
    chemistryScoreDescription: apiResponse.chemistry_score_description,
    whatWorksWell: apiResponse.what_works_well,

    // Special Things
    specialDays,
    giftIdeas,
  };

  return profile;
}