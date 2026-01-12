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
  SpecialDayApi,
  GiftIdeaApi,
  SocialSignalApi,
  CycleTrackingApi,
  AttachmentTendencyApi,
  BasicInfoApi,
  PersonalityApi,
  LifestyleApi,
  SocialLinksApi,
} from "../types";

/**
 * Convert date budget number or string to DateBudget enum (snake_case)
 * Maps: 0 -> "low", 50 -> "balanced", 100 -> "high"
 * Also handles string values like "48.0" -> "low" (if <= 50)
 */
function convertDateBudget(
  value: string | number | undefined
): DateBudget | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  // If it's already a string, validate it
  if (typeof value === "string") {
    const normalized = value.toLowerCase().trim();
    if (
      normalized === "low" ||
      normalized === "balanced" ||
      normalized === "high"
    ) {
      return normalized as DateBudget;
    }
    // Try to parse as number
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      if (numValue <= 50) return "low";
      if (numValue <= 100) return "balanced";
      return "high";
    }
    return undefined;
  }

  // If it's a number, convert it
  if (typeof value === "number") {
    if (value <= 50) return "low";
    if (value <= 100) return "balanced";
    return "high";
  }

  return undefined;
}

/**
 * Convert string to GoalType enum (snake_case), with validation
 */
function convertGoalType(value: string): GoalType | null {
  // Normalize to snake_case
  const normalized = value
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
  const validTypes: GoalType[] = [
    "for_fun",
    "long_term",
    "date_to_marry",
    "unclear",
  ];
  return validTypes.includes(normalized as GoalType)
    ? (normalized as GoalType)
    : null;
}

/**
 * Convert string to LoveLanguage enum (snake_case), with validation
 */
function convertLoveLanguage(value: string): LoveLanguage | undefined {
  // Normalize to snake_case
  const normalized = value.toLowerCase().replace(/\s+/g, "_");
  const validLanguages: LoveLanguage[] = [
    "words_of_affirmation",
    "quality_time",
    "acts_of_service",
    "receiving_gifts",
    "physical_touch",
  ];
  return validLanguages.includes(normalized as LoveLanguage)
    ? (normalized as LoveLanguage)
    : undefined;
}

/**
 * Convert string to CommunicationStyle enum (snake_case), with validation
 */
function convertCommunicationStyle(value: string): CommunicationStyle | null {
  // Normalize to snake_case: handle spaces, &, and special cases
  const normalized = value
    .toLowerCase()
    .replace(/\s*&\s*/g, "_")
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
  const validStyles: CommunicationStyle[] = [
    "direct",
    "playful",
    "soft_caring",
    "avoid_conflict",
    "logical",
    "emotional",
    "deep_talks",
    "daily_texting",
    "calls_only",
  ];
  return validStyles.includes(normalized as CommunicationStyle)
    ? (normalized as CommunicationStyle)
    : null;
}

/**
 * Convert string to DealBreaker enum (snake_case), with validation
 */
function convertDealBreaker(value: string): DealBreaker | null {
  // Normalize to snake_case: handle spaces, /, and special cases
  const normalized = value
    .toLowerCase()
    .replace(/\s*\/\s*/g, "_")
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
  const validDealBreakers: DealBreaker[] = [
    "smoking",
    "bad_hygiene",
    "dishonesty",
    "ghosting_prolonged_silence",
    "lack_of_respect",
    "excessive_jealousy",
    "unclear_relationship_intentions",
    "misaligned_long_term_goals",
    "fundamentally_different_core_values",
    "unwillingness_to_commit",
    "controlling_manipulative_behavior",
    "disrespect_for_personal_boundaries",
  ];
  return validDealBreakers.includes(normalized as DealBreaker)
    ? (normalized as DealBreaker)
    : null;
}

/**
 * Convert string to WorkRhythm enum (snake_case), with validation
 */
function convertWorkRhythm(value: string): WorkRhythm | undefined {
  // Normalize to snake_case: handle spaces, /, and special cases like "nine_to_five"
  const normalized = value
    .toLowerCase()
    .replace(/\s*\/\s*/g, "_")
    .replace(/\s+/g, "_")
    .replace(/-/g, "_")
    .replace(/9[–-]?5/g, "nine_to_five");
  const validRhythms: WorkRhythm[] = [
    "busy_set_hours",
    "flexible",
    "remote",
    "nine_to_five",
  ];
  return validRhythms.includes(normalized as WorkRhythm)
    ? (normalized as WorkRhythm)
    : undefined;
}

/**
 * Convert string to SocialEnergyLevel enum (snake_case), with validation
 */
function convertSocialEnergyLevel(
  value: string
): SocialEnergyLevel | undefined {
  // Normalize to snake_case
  const normalized = value.toLowerCase().trim();
  const validLevels: SocialEnergyLevel[] = [
    "introvert",
    "balanced",
    "extrovert",
  ];
  return validLevels.includes(normalized as SocialEnergyLevel)
    ? (normalized as SocialEnergyLevel)
    : undefined;
}

/**
 * Convert string to Hobby enum (snake_case), with validation
 */
function convertHobby(value: string): Hobby | null {
  // Normalize to snake_case: handle spaces, &, and special cases
  const normalized = value
    .toLowerCase()
    .replace(/\s*&\s*/g, "_")
    .replace(/\s+/g, "_");
  const validHobbies: Hobby[] = [
    "travel",
    "food_cafe",
    "cooking",
    "baking",
    "fitness",
    "gym",
    "yoga",
    "hiking",
    "outdoor",
    "photography",
    "music",
    "concert",
    "movies",
    "netflix",
    "reading",
    "gaming",
  ];
  return validHobbies.includes(normalized as Hobby)
    ? (normalized as Hobby)
    : null;
}

/**
 * Convert string to InterestLevel enum (snake_case), with validation
 */
function convertInterestLevel(value: string): InterestLevel | undefined {
  const normalized = value.toLowerCase().trim();
  const validLevels: InterestLevel[] = ["low", "medium", "high"];
  return validLevels.includes(normalized as InterestLevel)
    ? (normalized as InterestLevel)
    : undefined;
}

/**
 * Convert string to MoodTrend enum (snake_case), with validation
 */
function convertMoodTrend(value: string): MoodTrend | undefined {
  const normalized = value.toLowerCase().trim();
  const validTrends: MoodTrend[] = [
    "excited",
    "calm",
    "stressed",
    "happy",
    "neutral",
  ];
  return validTrends.includes(normalized as MoodTrend)
    ? (normalized as MoodTrend)
    : undefined;
}

/**
 * Convert string to StageType enum (snake_case), with validation
 */
function convertStageType(value: string): StageType {
  // Normalize to snake_case
  const normalized = value.toLowerCase().replace(/\s+/g, "_");
  const validStages: StageType[] = [
    "dating",
    "dating_exclusively",
    "in_a_relationship",
    "engaged",
    "married",
  ];
  return validStages.includes(normalized as StageType)
    ? (normalized as StageType)
    : "dating"; // Default fallback
}

/**
 * Convert string to SpecialDayType enum (snake_case), with validation
 */
function convertSpecialDayType(value: string): SpecialDayType {
  // Normalize to snake_case: handle spaces, apostrophes, and special cases
  const normalized = value
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/'/g, "")
    .replace(/int['']l/g, "intl");
  const validTypes: SpecialDayType[] = [
    "birthday",
    "our_start_date",
    "christmas",
    "intl_womens_day",
    "custom",
  ];
  return validTypes.includes(normalized as SpecialDayType)
    ? (normalized as SpecialDayType)
    : "custom"; // Default fallback
}

/**
 * Convert string to AttachmentTendency enum (snake_case), with validation
 */
function convertAttachmentTendency(
  value: string
): AttachmentTendency | undefined {
  // Normalize to snake_case: handle spaces, hyphens, and special cases
  const normalized = value
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_");
  const validTendencies: AttachmentTendency[] = [
    "secure",
    "anxious",
    "avoidant",
    "secure_leaning_anxious",
    "secure_leaning_avoidant",
    "anxious_avoidant",
    "not_sure",
    "exploring",
  ];
  return validTendencies.includes(normalized as AttachmentTendency)
    ? (normalized as AttachmentTendency)
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
  // Check both direct field and nested personality.communication_styles
  const communicationStyles: CommunicationStyle[] = (
    apiResponse.communication_styles ||
    personality?.communication_styles ||
    []
  )
    .map(convertCommunicationStyle)
    .filter((s): s is CommunicationStyle => s !== null);

  // Transform deal breakers array with validation
  // Check both direct field and nested personality.deal_breakers
  const dealBreakers: DealBreaker[] = (
    apiResponse.deal_breakers ||
    personality?.deal_breakers ||
    []
  )
    .map(convertDealBreaker)
    .filter((d): d is DealBreaker => d !== null);

  // Transform hobbies array with validation
  // Check both direct field and nested lifestyle.hobbies
  const hobbies: Hobby[] = (apiResponse.hobbies || lifestyle?.hobbies || [])
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
    ? apiResponse.special_days.map(
        (day): SpecialDay => ({
          id: day.id || "",
          type: convertSpecialDayType(day.type || "Custom"),
          name: day.name || "",
          date: day.date || "",
          icon: day.icon || "",
          iconColor: day.icon_color || "",
          notifyEnabled: day.notifications_enabled ?? false,
        })
      )
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
          rationale: gift.rationale,
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
  const attachmentTendencyTransformed: AttachmentTendencyData | undefined =
    attachmentTendency
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
    apiResponse.appreciated_things || apiResponse.things_they_appreciate || [];

  // Transform date budget (can be number or string)
  // Check both direct field and nested lifestyle.date_budget
  const dateBudget = convertDateBudget(
    apiResponse.date_budget ?? lifestyle?.date_budget
  );

  // Extract social links
  const socialLinks = apiResponse.social_links;
  const instagramUrl = socialLinks?.instagram;
  const facebookUrl = socialLinks?.facebook;
  const threadsUrl = socialLinks?.threads;
  const tiktokUrl = socialLinks?.tiktok;

  // Build the transformed profile
  const profile: PartnerProfile = {
    // Basic Info
    id: apiResponse.partner_id || "",
    name: basicInfo.name || "",
    nickname: basicInfo.nickname,
    age: basicInfo.age ?? 0,
    location:
      basicInfo.location ||
      (basicInfo.city_of_birth && basicInfo.country_of_birth
        ? `${basicInfo.city_of_birth}, ${basicInfo.country_of_birth}`
        : basicInfo.city || ""),
    avatarUrl: basicInfo.avatar_url,
    stage: convertStageType(
      basicInfo.relationship_stage ||
        apiResponse.partner_personality ||
        "Dating"
    ),
    isPremium: apiResponse.is_premium ?? false,
    // Extended basic info fields
    gender: basicInfo.gender,
    dob: basicInfo.dob,
    timeOfBirth: basicInfo.time_of_birth,
    countryOfBirth: basicInfo.country_of_birth,
    cityOfBirth: basicInfo.city_of_birth,
    city: basicInfo.city,
    timezoneOffset: basicInfo.timezone_offset,

    // Context fields
    currentSituation: apiResponse.current_situation,
    whatYouWant: apiResponse.what_you_want,
    whatUltimatelyWant: apiResponse.what_ultimately_want,
    partnerPersonality: apiResponse.partner_personality,
    pastEventsSummary: apiResponse.past_events_summary,
    currentFeelings: apiResponse.current_feelings,

    // Goals
    goals,
    goalsIsAiGenerated: apiResponse.goals_is_ai_generated ?? false,

    // Personality & Preference
    // Check both direct field and nested personality.love_languages array
    loveLanguage: apiResponse.love_language
      ? convertLoveLanguage(apiResponse.love_language)
      : personality?.love_languages?.[0]
      ? convertLoveLanguage(personality.love_languages[0])
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
    thingsTheyAppreciate: apiResponse.things_they_appreciate,

    // Lifestyle Snapshot
    // Check both direct field and nested lifestyle.work_schedule
    workRhythm: apiResponse.work_rhythm
      ? convertWorkRhythm(apiResponse.work_rhythm)
      : lifestyle?.work_schedule
      ? convertWorkRhythm(lifestyle.work_schedule)
      : undefined,
    workRhythmIsAiGenerated: apiResponse.work_rhythm_is_ai_generated ?? false,
    socialEnergyLevel: apiResponse.social_energy_level
      ? convertSocialEnergyLevel(apiResponse.social_energy_level)
      : lifestyle?.social_energy_level
      ? convertSocialEnergyLevel(lifestyle.social_energy_level)
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
    instagramUrl,
    facebookUrl,
    threadsUrl,
    tiktokUrl,

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

/**
 * Convert DateBudget enum to number for API
 * Maps: "low" -> 0, "balanced" -> 50, "high" -> 100
 */
function convertDateBudgetToNumber(
  value: DateBudget | undefined
): number | undefined {
  if (value === undefined) return undefined;
  const mapping: Record<DateBudget, number> = {
    low: 0,
    balanced: 50,
    high: 100,
  };
  return mapping[value];
}

/**
 * Transform PartnerProfile to API response format
 * Maps camelCase PartnerProfile to snake_case PartnerProfileApiResponse
 * This is the reverse transformation of apiResponseToPartnerProfile
 * 
 * @param profile - The draft profile with form values
 * @param savedProfile - Optional saved profile from API to merge fields that aren't in draft
 */
export function partnerProfileToApiFormat(
  profile: PartnerProfile,
  savedProfile?: PartnerProfile
): PartnerProfileApiResponse {
  // Merge saved profile fields with draft profile (draft takes precedence)
  // Fields from form (draft) override saved values, but if draft doesn't have a field,
  // we preserve the saved value to ensure all API fields are included
  const mergedProfile: PartnerProfile = savedProfile
    ? {
        ...savedProfile,
        ...profile,
        // For arrays, use draft if it has values, otherwise preserve saved
        goals:
          profile.goals && profile.goals.length > 0
            ? profile.goals
            : savedProfile.goals,
        communicationStyles:
          profile.communicationStyles && profile.communicationStyles.length > 0
            ? profile.communicationStyles
            : savedProfile.communicationStyles,
        dealBreakers:
          profile.dealBreakers && profile.dealBreakers.length > 0
            ? profile.dealBreakers
            : savedProfile.dealBreakers,
        appreciatedThings:
          profile.appreciatedThings && profile.appreciatedThings.length > 0
            ? profile.appreciatedThings
            : savedProfile.appreciatedThings,
        hobbies:
          profile.hobbies && profile.hobbies.length > 0
            ? profile.hobbies
            : savedProfile.hobbies,
        socialSignals:
          profile.socialSignals && profile.socialSignals.length > 0
            ? profile.socialSignals
            : savedProfile.socialSignals,
        // For optional arrays/objects, use draft if defined, otherwise use saved
        favoriteHobbies:
          profile.favoriteHobbies !== undefined
            ? profile.favoriteHobbies
            : savedProfile.favoriteHobbies,
        specialDays:
          profile.specialDays !== undefined
            ? profile.specialDays
            : savedProfile.specialDays,
        giftIdeas:
          profile.giftIdeas !== undefined
            ? profile.giftIdeas
            : savedProfile.giftIdeas,
        thingsTheyAppreciate:
          profile.thingsTheyAppreciate !== undefined
            ? profile.thingsTheyAppreciate
            : savedProfile.thingsTheyAppreciate,
        // For social URLs, use draft if defined (including empty string to clear),
        // otherwise preserve saved value
        instagramUrl:
          profile.instagramUrl !== undefined
            ? profile.instagramUrl
            : savedProfile.instagramUrl,
        facebookUrl:
          profile.facebookUrl !== undefined
            ? profile.facebookUrl
            : savedProfile.facebookUrl,
        threadsUrl:
          profile.threadsUrl !== undefined
            ? profile.threadsUrl
            : savedProfile.threadsUrl,
        tiktokUrl:
          profile.tiktokUrl !== undefined
            ? profile.tiktokUrl
            : savedProfile.tiktokUrl,
      }
    : profile;

  // Transform basic info with all fields
  const basicInfo: BasicInfoApi = {
    name: mergedProfile.name,
    nickname: mergedProfile.nickname,
    avatar_url: mergedProfile.avatarUrl,
    age: mergedProfile.age,
    location: mergedProfile.location,
    relationship_stage: mergedProfile.stage,
    gender: mergedProfile.gender,
    dob: mergedProfile.dob,
    time_of_birth: mergedProfile.timeOfBirth,
    country_of_birth: mergedProfile.countryOfBirth,
    city_of_birth: mergedProfile.cityOfBirth,
    city: mergedProfile.city,
    timezone_offset: mergedProfile.timezoneOffset,
  };

  // Transform special days
  const specialDays: SpecialDayApi[] | undefined = mergedProfile.specialDays
    ? mergedProfile.specialDays.map((day) => ({
        id: day.id,
        name: day.name,
        date: day.date,
        type: day.type,
        icon: day.icon,
        icon_color: day.iconColor,
        notifications_enabled: day.notifyEnabled,
      }))
    : undefined;

  // Transform gift ideas
  const giftIdeas: GiftIdeaApi[] | undefined = mergedProfile.giftIdeas
    ? mergedProfile.giftIdeas.map((gift) => ({
        id: gift.id,
        name: gift.name,
        price: gift.price,
        tag: gift.tag,
        icon: gift.icon,
        icon_color: gift.iconColor,
        ai_curated: false, // Default value, can be enhanced if needed
        rationale: gift.rationale,
      }))
    : undefined;

  // Transform social signals
  const socialSignals: SocialSignalApi[] | undefined =
    mergedProfile.socialSignals && mergedProfile.socialSignals.length > 0
      ? mergedProfile.socialSignals.map((signal) => ({
          title: signal.title,
          description: signal.description,
          icon: signal.icon,
          is_ai_generated: signal.isAiGenerated ?? false,
        }))
      : undefined;

  // Transform cycle tracking
  const cycleTracking: CycleTrackingApi | undefined = mergedProfile.cycleTracking
    ? {
        is_private: mergedProfile.cycleTracking.isPrivate,
        predicted_start: mergedProfile.cycleTracking.predictedStart,
        predicted_end: mergedProfile.cycleTracking.predictedEnd,
      }
    : undefined;

  // Transform attachment tendency
  const attachmentTendency: AttachmentTendencyApi | undefined =
    mergedProfile.attachmentTendency
      ? {
          tendency: mergedProfile.attachmentTendency.tendency,
          label: mergedProfile.attachmentTendency.label,
          description: mergedProfile.attachmentTendency.description,
          is_ai_generated: mergedProfile.attachmentTendency.isAiGenerated ?? false,
        }
      : undefined;

  // Transform social links (include all social media platforms)
  // Only include URLs that are truthy (non-empty strings) AND were changed from saved value
  // This ensures we send social_links only when there's at least one URL that was modified
  const socialLinks: SocialLinksApi | undefined = (() => {
    // Check if Instagram URL was changed (draft differs from saved, or draft has value and saved doesn't)
    const instagramChanged =
      savedProfile === undefined ||
      profile.instagramUrl !== savedProfile.instagramUrl;
    const hasInstagram =
      instagramChanged &&
      mergedProfile.instagramUrl &&
      mergedProfile.instagramUrl.trim() !== "";

    // Check if Facebook URL was changed
    const facebookChanged =
      savedProfile === undefined ||
      profile.facebookUrl !== savedProfile.facebookUrl;
    const hasFacebook =
      facebookChanged &&
      mergedProfile.facebookUrl &&
      mergedProfile.facebookUrl.trim() !== "";

    // Check if Threads URL was changed
    const threadsChanged =
      savedProfile === undefined ||
      profile.threadsUrl !== savedProfile.threadsUrl;
    const hasThreads =
      threadsChanged &&
      mergedProfile.threadsUrl &&
      mergedProfile.threadsUrl.trim() !== "";

    // Check if TikTok URL was changed
    const tiktokChanged =
      savedProfile === undefined ||
      profile.tiktokUrl !== savedProfile.tiktokUrl;
    const hasTiktok =
      tiktokChanged &&
      mergedProfile.tiktokUrl &&
      mergedProfile.tiktokUrl.trim() !== "";

    if (hasInstagram || hasFacebook || hasThreads || hasTiktok) {
      return {
        ...(hasInstagram && { instagram: mergedProfile.instagramUrl }),
        ...(hasFacebook && { facebook: mergedProfile.facebookUrl }),
        ...(hasThreads && { threads: mergedProfile.threadsUrl }),
        ...(hasTiktok && { tiktok: mergedProfile.tiktokUrl }),
      };
    }
    return undefined;
  })();

  // Transform personality (optional nested structure)
  const personality: PersonalityApi | undefined =
    profile.loveLanguage ||
    profile.communicationStyles.length > 0 ||
    profile.dealBreakers.length > 0
      ? {
          love_languages: profile.loveLanguage
            ? [profile.loveLanguage]
            : undefined,
          communication_styles:
            profile.communicationStyles.length > 0
              ? profile.communicationStyles
              : undefined,
          deal_breakers:
            profile.dealBreakers.length > 0 ? profile.dealBreakers : undefined,
        }
      : undefined;

  // Transform lifestyle (optional nested structure)
  const lifestyle: LifestyleApi | undefined =
    profile.workRhythm ||
    profile.dateBudget ||
    profile.socialEnergyLevel ||
    profile.hobbies.length > 0
      ? {
          work_schedule: profile.workRhythm,
          date_budget: convertDateBudgetToNumber(profile.dateBudget),
          social_energy_level: profile.socialEnergyLevel,
          hobbies: profile.hobbies.length > 0 ? profile.hobbies : undefined,
        }
      : undefined;

  // Build the API response with all required fields
  const apiResponse: PartnerProfileApiResponse = {
    partner_id: mergedProfile.id,
    basic_info: basicInfo,
    // Context fields
    current_situation: mergedProfile.currentSituation,
    what_you_want: mergedProfile.whatYouWant,
    what_ultimately_want: mergedProfile.whatUltimatelyWant,
    partner_personality: mergedProfile.partnerPersonality,
    past_events_summary: mergedProfile.pastEventsSummary,
    current_feelings: mergedProfile.currentFeelings,
    // Goals
    goals: mergedProfile.goals,
    goals_is_ai_generated: mergedProfile.goalsIsAiGenerated ?? false,
    // Premium status
    is_premium: mergedProfile.isPremium ?? false,
    // Personality & Preference
    love_language: mergedProfile.loveLanguage,
    love_language_is_ai_generated:
      mergedProfile.loveLanguageIsAiGenerated ?? false,
    communication_styles:
      mergedProfile.communicationStyles.length > 0
        ? mergedProfile.communicationStyles
        : undefined,
    communication_styles_is_ai_generated:
      mergedProfile.communicationStylesIsAiGenerated ?? false,
    attachment_tendency: attachmentTendency,
    deal_breakers:
      mergedProfile.dealBreakers.length > 0
        ? mergedProfile.dealBreakers
        : undefined,
    appreciated_things:
      mergedProfile.appreciatedThings.length > 0
        ? mergedProfile.appreciatedThings
        : undefined,
    appreciated_things_is_ai_generated:
      mergedProfile.appreciatedThingsIsAiGenerated ?? false,
    things_they_appreciate: mergedProfile.thingsTheyAppreciate,
    // Lifestyle
    work_rhythm: mergedProfile.workRhythm,
    work_rhythm_is_ai_generated: mergedProfile.workRhythmIsAiGenerated ?? false,
    cycle_tracking: cycleTracking,
    date_budget: convertDateBudgetToNumber(mergedProfile.dateBudget),
    date_budget_is_ai_generated: mergedProfile.dateBudgetIsAiGenerated ?? false,
    hobbies:
      mergedProfile.hobbies.length > 0 ? mergedProfile.hobbies : undefined,
    hobbies_is_ai_generated: mergedProfile.hobbiesIsAiGenerated ?? false,
    favorite_hobbies:
      mergedProfile.favoriteHobbies && mergedProfile.favoriteHobbies.length > 0
        ? mergedProfile.favoriteHobbies
        : undefined,
    social_energy_level: mergedProfile.socialEnergyLevel,
    social_energy_level_is_ai_generated:
      mergedProfile.socialEnergyLevelIsAiGenerated ?? false,
    // Social Signals
    social_signals: socialSignals,
    social_signal_tags: mergedProfile.socialSignalTags,
    social_links: socialLinks,
    // Chemistry & Insights
    interest_level: mergedProfile.interestLevel,
    interest_level_confidence: mergedProfile.interestLevelConfidence,
    mood_trend: mergedProfile.moodTrend,
    chemistry_score: mergedProfile.chemistryScore,
    chemistry_score_description: mergedProfile.chemistryScoreDescription,
    what_works_well: mergedProfile.whatWorksWell,
    // Special Things
    special_days: specialDays,
    gift_ideas: giftIdeas,
    // Nested structures
    personality,
    lifestyle,
  };

  return apiResponse;
}

/**
 * Deep equality check for two values
 */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => deepEqual(item, b[index]));
  }

  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a as Record<string, unknown>);
    const keysB = Object.keys(b as Record<string, unknown>);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) =>
      deepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
    );
  }

  return false;
}

/**
 * Compute the diff between draft and saved profiles
 * Returns only the fields that have changed
 */
export function computeProfileDiff(
  draft: PartnerProfile,
  saved: PartnerProfile
): Partial<PartnerProfile> {
  const diff: Partial<PartnerProfile> = {};

  // List of fields to check for changes
  const fieldsToCheck: (keyof PartnerProfile)[] = [
    "name",
    "nickname",
    "age",
    "location",
    "avatarUrl",
    "stage",
    "isPremium",
    "goals",
    "goalsIsAiGenerated",
    "loveLanguage",
    "loveLanguageIsAiGenerated",
    "communicationStyles",
    "communicationStylesIsAiGenerated",
    "attachmentTendency",
    "dealBreakers",
    "appreciatedThings",
    "appreciatedThingsIsAiGenerated",
    "workRhythm",
    "workRhythmIsAiGenerated",
    "socialEnergyLevel",
    "socialEnergyLevelIsAiGenerated",
    "cycleTracking",
    "dateBudget",
    "dateBudgetIsAiGenerated",
    "hobbies",
    "hobbiesIsAiGenerated",
    "favoriteHobbies",
    "socialSignals",
    "socialSignalTags",
    "instagramUrl",
    "interestLevel",
    "interestLevelConfidence",
    "moodTrend",
    "chemistryScore",
    "chemistryScoreDescription",
    "whatWorksWell",
    "specialDays",
    "giftIdeas",
  ];

  for (const field of fieldsToCheck) {
    const draftValue = draft[field];
    const savedValue = saved[field];

    if (!deepEqual(draftValue, savedValue)) {
      (diff as Record<string, unknown>)[field] = draftValue;
    }
  }

  return diff;
}

/**
 * Transform only changed fields from PartnerProfile to API format
 * This creates a partial API response with only the changed fields
 */
export function partnerProfileDiffToApiFormat(
  diff: Partial<PartnerProfile>,
  fullProfile: PartnerProfile
): Partial<PartnerProfileApiResponse> {
  const apiDiff: Partial<PartnerProfileApiResponse> = {};

  // Always include partner_id
  apiDiff.partner_id = fullProfile.id;

  // Transform basic_info fields if any basic info changed
  if (
    diff.name !== undefined ||
    diff.nickname !== undefined ||
    diff.avatarUrl !== undefined ||
    diff.age !== undefined ||
    diff.location !== undefined ||
    diff.stage !== undefined
  ) {
    apiDiff.basic_info = {
      name: diff.name ?? fullProfile.name,
      nickname: diff.nickname ?? fullProfile.nickname,
      avatar_url: diff.avatarUrl ?? fullProfile.avatarUrl,
      age: diff.age ?? fullProfile.age,
      location: diff.location ?? fullProfile.location,
      relationship_stage: diff.stage ?? fullProfile.stage,
    };
  }

  // Transform goals
  if (diff.goals !== undefined) {
    apiDiff.goals = diff.goals;
  }
  if (diff.goalsIsAiGenerated !== undefined) {
    apiDiff.goals_is_ai_generated = diff.goalsIsAiGenerated;
  }

  // Transform is_premium
  if (diff.isPremium !== undefined) {
    apiDiff.is_premium = diff.isPremium;
  }

  // Transform love language
  if (diff.loveLanguage !== undefined) {
    apiDiff.love_language = diff.loveLanguage;
  }
  if (diff.loveLanguageIsAiGenerated !== undefined) {
    apiDiff.love_language_is_ai_generated = diff.loveLanguageIsAiGenerated;
  }

  // Transform communication styles
  if (diff.communicationStyles !== undefined) {
    apiDiff.communication_styles =
      diff.communicationStyles.length > 0
        ? diff.communicationStyles
        : undefined;
  }
  if (diff.communicationStylesIsAiGenerated !== undefined) {
    apiDiff.communication_styles_is_ai_generated =
      diff.communicationStylesIsAiGenerated;
  }

  // Transform attachment tendency
  if (diff.attachmentTendency !== undefined) {
    apiDiff.attachment_tendency = diff.attachmentTendency
      ? {
          tendency: diff.attachmentTendency.tendency,
          label: diff.attachmentTendency.label,
          description: diff.attachmentTendency.description,
          is_ai_generated: diff.attachmentTendency.isAiGenerated ?? false,
        }
      : undefined;
  }

  // Transform deal breakers
  if (diff.dealBreakers !== undefined) {
    apiDiff.deal_breakers =
      diff.dealBreakers.length > 0 ? diff.dealBreakers : undefined;
  }

  // Transform appreciated things
  if (diff.appreciatedThings !== undefined) {
    apiDiff.appreciated_things =
      diff.appreciatedThings.length > 0 ? diff.appreciatedThings : undefined;
  }
  if (diff.appreciatedThingsIsAiGenerated !== undefined) {
    apiDiff.appreciated_things_is_ai_generated =
      diff.appreciatedThingsIsAiGenerated;
  }

  // Transform work rhythm
  if (diff.workRhythm !== undefined) {
    apiDiff.work_rhythm = diff.workRhythm;
  }
  if (diff.workRhythmIsAiGenerated !== undefined) {
    apiDiff.work_rhythm_is_ai_generated = diff.workRhythmIsAiGenerated;
  }

  // Transform cycle tracking
  if (diff.cycleTracking !== undefined) {
    apiDiff.cycle_tracking = diff.cycleTracking
      ? {
          is_private: diff.cycleTracking.isPrivate,
          predicted_start: diff.cycleTracking.predictedStart,
          predicted_end: diff.cycleTracking.predictedEnd,
        }
      : undefined;
  }

  // Transform date budget
  if (diff.dateBudget !== undefined) {
    apiDiff.date_budget = convertDateBudgetToNumber(diff.dateBudget);
  }
  if (diff.dateBudgetIsAiGenerated !== undefined) {
    apiDiff.date_budget_is_ai_generated = diff.dateBudgetIsAiGenerated;
  }

  // Transform hobbies
  if (diff.hobbies !== undefined) {
    apiDiff.hobbies = diff.hobbies.length > 0 ? diff.hobbies : undefined;
  }
  if (diff.hobbiesIsAiGenerated !== undefined) {
    apiDiff.hobbies_is_ai_generated = diff.hobbiesIsAiGenerated;
  }

  // Transform favorite hobbies
  if (diff.favoriteHobbies !== undefined) {
    apiDiff.favorite_hobbies =
      diff.favoriteHobbies && diff.favoriteHobbies.length > 0
        ? diff.favoriteHobbies
        : undefined;
  }

  // Transform social signals
  if (diff.socialSignals !== undefined) {
    apiDiff.social_signals =
      diff.socialSignals && diff.socialSignals.length > 0
        ? diff.socialSignals.map((signal) => ({
            title: signal.title,
            description: signal.description,
            icon: signal.icon,
            is_ai_generated: signal.isAiGenerated ?? false,
          }))
        : undefined;
  }

  // Transform social signal tags
  if (diff.socialSignalTags !== undefined) {
    apiDiff.social_signal_tags = diff.socialSignalTags;
  }

  // Transform instagram URL (social links)
  if (diff.instagramUrl !== undefined) {
    apiDiff.social_links = diff.instagramUrl
      ? {
          instagram: diff.instagramUrl,
        }
      : undefined;
  }

  // Transform interest level
  if (diff.interestLevel !== undefined) {
    apiDiff.interest_level = diff.interestLevel;
  }

  // Transform interest level confidence
  if (diff.interestLevelConfidence !== undefined) {
    apiDiff.interest_level_confidence = diff.interestLevelConfidence;
  }

  // Transform mood trend
  if (diff.moodTrend !== undefined) {
    apiDiff.mood_trend = diff.moodTrend;
  }

  // Transform chemistry score
  if (diff.chemistryScore !== undefined) {
    apiDiff.chemistry_score = diff.chemistryScore;
  }

  // Transform chemistry score description
  if (diff.chemistryScoreDescription !== undefined) {
    apiDiff.chemistry_score_description = diff.chemistryScoreDescription;
  }

  // Transform what works well
  if (diff.whatWorksWell !== undefined) {
    apiDiff.what_works_well = diff.whatWorksWell;
  }

  // Transform special days
  if (diff.specialDays !== undefined) {
    apiDiff.special_days = diff.specialDays
      ? diff.specialDays.map((day) => ({
          id: day.id,
          name: day.name,
          date: day.date,
          type: day.type,
          icon: day.icon,
          icon_color: day.iconColor,
          notifications_enabled: day.notifyEnabled,
        }))
      : undefined;
  }

  // Transform gift ideas
  if (diff.giftIdeas !== undefined) {
    apiDiff.gift_ideas = diff.giftIdeas
      ? diff.giftIdeas.map((gift) => ({
          id: gift.id,
          name: gift.name,
          price: gift.price,
          tag: gift.tag,
          icon: gift.icon,
          icon_color: gift.iconColor,
          ai_curated: false,
        }))
      : undefined;
  }

  // Transform social energy level
  if (diff.socialEnergyLevel !== undefined) {
    apiDiff.social_energy_level = diff.socialEnergyLevel;
  }
  if (diff.socialEnergyLevelIsAiGenerated !== undefined) {
    apiDiff.social_energy_level_is_ai_generated =
      diff.socialEnergyLevelIsAiGenerated;
  }

  // Build personality object if any personality fields changed
  if (
    diff.loveLanguage !== undefined ||
    diff.communicationStyles !== undefined ||
    diff.dealBreakers !== undefined
  ) {
    apiDiff.personality = {
      love_languages:
        diff.loveLanguage ?? fullProfile.loveLanguage
          ? [diff.loveLanguage ?? fullProfile.loveLanguage!]
          : undefined,
      communication_styles:
        (diff.communicationStyles ?? fullProfile.communicationStyles).length > 0
          ? diff.communicationStyles ?? fullProfile.communicationStyles
          : undefined,
      deal_breakers:
        (diff.dealBreakers ?? fullProfile.dealBreakers).length > 0
          ? diff.dealBreakers ?? fullProfile.dealBreakers
          : undefined,
    };
  }

  // Build lifestyle object if any lifestyle fields changed
  if (
    diff.workRhythm !== undefined ||
    diff.dateBudget !== undefined ||
    diff.socialEnergyLevel !== undefined ||
    diff.hobbies !== undefined
  ) {
    apiDiff.lifestyle = {
      work_schedule: diff.workRhythm ?? fullProfile.workRhythm,
      date_budget: convertDateBudgetToNumber(
        diff.dateBudget ?? fullProfile.dateBudget
      ),
      social_energy_level:
        diff.socialEnergyLevel ?? fullProfile.socialEnergyLevel,
      hobbies:
        (diff.hobbies ?? fullProfile.hobbies).length > 0
          ? diff.hobbies ?? fullProfile.hobbies
          : undefined,
    };
  }

  return apiDiff;
}
