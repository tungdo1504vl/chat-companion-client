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
 */
export function profileToFormData(
  profile: TUserProfile | null | undefined
): TProfileFormData {
  if (!profile) {
    return defaultProfileFormValues;
  }

  return {
    // Optional fields - return empty values if missing
    primaryLoveLanguage: profile.primary_love_language || "",
    communicationStyles: profile.communication_styles || [],
    attachmentStyle: profile.attachment_style || "",
    workSchedule: profile.work_schedule || "",
    socialEnergy: profile.social_energy || "",
    // Required fields - use defaults only for fields that need them
    dealBreakers: profile.deal_breakers || [],
    dateBudget: profile.date_budget ?? defaultProfileFormValues.dateBudget,
    hobbies: profile.hobbies || [],
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
 * Builds payload according to API spec with nested structures
 */
export function formDataToUpdatePayload(
  currentData: TProfileFormData,
  initialData: TProfileFormData,
  userId: string
): TProfileUpdatePayload {
  const payload: TProfileUpdatePayload = {
    user_id: userId,
  };

  // Track if any fields in each section changed
  let hasPersonalityChanges = false;
  let hasLifestyleChanges = false;
  let hasSocialLinksChanges = false;
  let hasTopLevelChanges = false;

  // Check personality fields
  const personalityChanges: TProfileUpdatePayload["personality"] = {};
  if (
    JSON.stringify(currentData.communicationStyles) !==
    JSON.stringify(initialData.communicationStyles)
  ) {
    personalityChanges.communication_styles = currentData.communicationStyles;
    hasPersonalityChanges = true;
    hasTopLevelChanges = true;
  }
  if (currentData.attachmentStyle !== initialData.attachmentStyle) {
    personalityChanges.attachment_style = currentData.attachmentStyle;
    hasPersonalityChanges = true;
    hasTopLevelChanges = true;
  }
  if (
    JSON.stringify(currentData.dealBreakers) !==
    JSON.stringify(initialData.dealBreakers)
  ) {
    personalityChanges.deal_breakers = currentData.dealBreakers;
    hasPersonalityChanges = true;
    hasTopLevelChanges = true;
  }
  if (hasPersonalityChanges) {
    payload.personality = personalityChanges;
  }

  // Check lifestyle fields
  const lifestyleChanges: TProfileUpdatePayload["lifestyle"] = {};
  if (currentData.workSchedule !== initialData.workSchedule) {
    lifestyleChanges.work_schedule = currentData.workSchedule;
    hasLifestyleChanges = true;
    hasTopLevelChanges = true;
  }
  if (currentData.dateBudget !== initialData.dateBudget) {
    lifestyleChanges.date_budget = currentData.dateBudget;
    hasLifestyleChanges = true;
    hasTopLevelChanges = true;
  }
  if (currentData.socialEnergy !== initialData.socialEnergy) {
    lifestyleChanges.social_energy_level = currentData.socialEnergy;
    hasLifestyleChanges = true;
    hasTopLevelChanges = true;
  }
  if (
    JSON.stringify(currentData.hobbies) !== JSON.stringify(initialData.hobbies)
  ) {
    lifestyleChanges.hobbies = currentData.hobbies;
    hasLifestyleChanges = true;
    hasTopLevelChanges = true;
  }
  if (hasLifestyleChanges) {
    payload.lifestyle = lifestyleChanges;
  }

  // Check social links
  const socialLinksChanges: TProfileUpdatePayload["social_links"] = {};
  if (currentData.instagramUrl !== initialData.instagramUrl) {
    socialLinksChanges.instagram = currentData.instagramUrl || "";
    hasSocialLinksChanges = true;
  }
  if (hasSocialLinksChanges) {
    payload.social_links = socialLinksChanges;
  }

  // Check top-level fields (primary_love_language)
  if (currentData.primaryLoveLanguage !== initialData.primaryLoveLanguage) {
    payload.primary_love_language = currentData.primaryLoveLanguage;
    hasTopLevelChanges = true;
  }

  // Add top-level fields if they changed (for backward compatibility)
  if (hasTopLevelChanges) {
    if (
      JSON.stringify(currentData.communicationStyles) !==
      JSON.stringify(initialData.communicationStyles)
    ) {
      payload.communication_styles = currentData.communicationStyles;
    }
    if (currentData.attachmentStyle !== initialData.attachmentStyle) {
      payload.attachment_style = currentData.attachmentStyle;
    }
    if (
      JSON.stringify(currentData.dealBreakers) !==
      JSON.stringify(initialData.dealBreakers)
    ) {
      payload.deal_breakers = currentData.dealBreakers;
    }
    if (currentData.workSchedule !== initialData.workSchedule) {
      payload.work_schedule = currentData.workSchedule;
    }
    if (currentData.dateBudget !== initialData.dateBudget) {
      payload.date_budget = currentData.dateBudget;
    }
    if (currentData.socialEnergy !== initialData.socialEnergy) {
      payload.social_energy = currentData.socialEnergy;
    }
    if (
      JSON.stringify(currentData.hobbies) !==
      JSON.stringify(initialData.hobbies)
    ) {
      payload.hobbies = currentData.hobbies;
    }
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
