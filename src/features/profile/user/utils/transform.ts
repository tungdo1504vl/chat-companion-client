import {
  TProfileFormData,
  TUserProfile,
  TProfileUpdatePayload,
} from "../types";
import { defaultProfileFormValues } from "../const";

/**
 * Transform API profile response to form data format
 * Returns empty values for missing optional fields instead of defaults
 * to avoid assuming user preferences
 * Prioritizes nested structure (personality, lifestyle) over top-level fields
 */
export function profileToFormData(
  profile: TUserProfile | null | undefined
): TProfileFormData {
  if (!profile) {
    return defaultProfileFormValues;
  }

  // Prioritize nested structure over top-level fields
  // Use nested values if available, otherwise fall back to top-level
  const communicationStyles =
    profile.personality?.communication_styles?.length > 0
      ? profile.personality.communication_styles
      : profile.communication_styles || [];

  const attachmentStyle =
    profile.personality?.attachment_style || profile.attachment_style || "";

  const dealBreakers =
    profile.personality?.deal_breakers?.length > 0
      ? profile.personality.deal_breakers
      : profile.deal_breakers || [];

  const workSchedule =
    profile.lifestyle?.work_schedule || profile.work_schedule || "";

  const dateBudget =
    profile.lifestyle?.date_budget !== undefined
      ? profile.lifestyle.date_budget
      : profile.date_budget ?? defaultProfileFormValues.dateBudget;

  const socialEnergy =
    profile.lifestyle?.social_energy_level || profile.social_energy || "";

  const hobbies =
    profile.lifestyle?.hobbies?.length > 0
      ? profile.lifestyle.hobbies
      : profile.hobbies || [];

  return {
    // Optional fields - return empty values if missing
    primaryLoveLanguage: profile.primary_love_language || "",
    communicationStyles,
    attachmentStyle,
    workSchedule,
    socialEnergy,
    // Required fields - use defaults only for fields that need them
    dealBreakers,
    dateBudget,
    hobbies,
    instagramUrl: profile.social_links?.instagram || "",
  };
}

/**
 * Transform form data to API update payload format
 * Returns a partial TUserProfile object suitable for updates
 */
export function formDataToProfileUpdate(
  data: TProfileFormData
): Partial<TUserProfile> {
  return {
    primary_love_language: data.primaryLoveLanguage,
    communication_styles: data.communicationStyles,
    attachment_style: data.attachmentStyle,
    deal_breakers: data.dealBreakers,
    work_schedule: data.workSchedule,
    date_budget: data.dateBudget,
    social_energy: data.socialEnergy,
    hobbies: data.hobbies,
  };
}

/**
 * Transform form data to update payload format
 * Only includes fields that have changed compared to initial values
 * All fields are nested under profile_update to match the user profile structure
 */
export function formDataToUpdatePayload(
  currentData: TProfileFormData,
  initialData: TProfileFormData,
  userId: string
): TProfileUpdatePayload {
  const payload: TProfileUpdatePayload = {
    user_id: userId,
  };

  // Build profile_update object with all changed fields
  const profileUpdate: {
    personality?: {
      love_languages?: string[];
      communication_styles?: string[];
      attachment_style?: string;
      deal_breakers?: string[];
    };
    lifestyle?: {
      work_schedule?: string;
      date_budget?: number;
      social_energy_level?: string;
      hobbies?: string[];
    };
    social_links?: {
      instagram?: string;
    };
    primary_love_language?: string;
  } = {};

  // Track if any changes were made
  let hasChanges = false;

  // Check personality fields
  const personalityChanges: {
    love_languages?: string[];
    communication_styles?: string[];
    attachment_style?: string;
    deal_breakers?: string[];
  } = {};

  if (
    JSON.stringify(currentData.communicationStyles) !==
    JSON.stringify(initialData.communicationStyles)
  ) {
    personalityChanges.communication_styles = currentData.communicationStyles;
    hasChanges = true;
  }
  if (currentData.attachmentStyle !== initialData.attachmentStyle) {
    personalityChanges.attachment_style = currentData.attachmentStyle;
    hasChanges = true;
  }
  if (
    JSON.stringify(currentData.dealBreakers) !==
    JSON.stringify(initialData.dealBreakers)
  ) {
    personalityChanges.deal_breakers = currentData.dealBreakers;
    hasChanges = true;
  }
  if (Object.keys(personalityChanges).length > 0) {
    profileUpdate.personality = personalityChanges;
  }

  // Check lifestyle fields
  const lifestyleChanges: {
    work_schedule?: string;
    date_budget?: number;
    social_energy_level?: string;
    hobbies?: string[];
  } = {};

  if (currentData.workSchedule !== initialData.workSchedule) {
    lifestyleChanges.work_schedule = currentData.workSchedule;
    hasChanges = true;
  }
  if (currentData.dateBudget !== initialData.dateBudget) {
    lifestyleChanges.date_budget = currentData.dateBudget;
    hasChanges = true;
  }
  if (currentData.socialEnergy !== initialData.socialEnergy) {
    lifestyleChanges.social_energy_level = currentData.socialEnergy;
    hasChanges = true;
  }
  if (
    JSON.stringify(currentData.hobbies) !== JSON.stringify(initialData.hobbies)
  ) {
    lifestyleChanges.hobbies = currentData.hobbies;
    hasChanges = true;
  }
  if (Object.keys(lifestyleChanges).length > 0) {
    profileUpdate.lifestyle = lifestyleChanges;
  }

  // Check social links
  if (currentData.instagramUrl !== initialData.instagramUrl) {
    profileUpdate.social_links = {
      instagram: currentData.instagramUrl || "",
    };
    hasChanges = true;
  }

  // Check primary_love_language
  if (currentData.primaryLoveLanguage !== initialData.primaryLoveLanguage) {
    profileUpdate.primary_love_language = currentData.primaryLoveLanguage;
    hasChanges = true;
  }

  // Only add profile_update if there are changes
  if (hasChanges) {
    payload.profile_update = profileUpdate;
  }

  return payload;
}

/**
 * Transform form data to task input args format
 * Converts arrays and booleans to string/number format expected by API
 * @deprecated Use formDataToUpdatePayload instead for proper partial updates
 */
export function formDataToTaskInputArgs(
  data: TProfileFormData,
  userId: string
): Record<string, string | number> {
  return {
    user_id: userId,
    primary_love_language: data.primaryLoveLanguage,
    communication_styles: JSON.stringify(data.communicationStyles),
    attachment_style: data.attachmentStyle,
    deal_breakers: JSON.stringify(data.dealBreakers),
    work_schedule: data.workSchedule,
    date_budget: data.dateBudget,
    social_energy: data.socialEnergy,
    hobbies: JSON.stringify(data.hobbies),
  };
}
