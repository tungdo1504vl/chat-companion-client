import { TProfileFormData, TUserProfile } from '../types';
import { defaultProfileFormValues } from '../const';

/**
 * Transform API profile response to form data format
 * Handles null/undefined cases gracefully by falling back to defaults
 */
export function profileToFormData(
  profile: TUserProfile | null | undefined
): TProfileFormData {
  if (!profile) {
    return defaultProfileFormValues;
  }

  return {
    primaryLoveLanguage: profile.primary_love_language || defaultProfileFormValues.primaryLoveLanguage,
    communicationStyles: profile.communication_styles || defaultProfileFormValues.communicationStyles,
    attachmentStyle: profile.attachment_style || defaultProfileFormValues.attachmentStyle,
    dealBreakers: profile.deal_breakers || defaultProfileFormValues.dealBreakers,
    workSchedule: profile.work_schedule || defaultProfileFormValues.workSchedule,
    dateBudget: profile.date_budget ?? defaultProfileFormValues.dateBudget,
    socialEnergy: profile.social_energy || defaultProfileFormValues.socialEnergy,
    hobbies: profile.hobbies || defaultProfileFormValues.hobbies,
    instagramLinked: profile.instagram_linked ?? defaultProfileFormValues.instagramLinked,
    facebookLinked: profile.facebook_linked ?? defaultProfileFormValues.facebookLinked,
    threadsLinked: profile.threads_linked ?? defaultProfileFormValues.threadsLinked,
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
    instagram_linked: data.instagramLinked,
    facebook_linked: data.facebookLinked,
    threads_linked: data.threadsLinked,
  };
}

/**
 * Transform form data to task input args format
 * Converts arrays and booleans to string/number format expected by API
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
    instagram_linked: data.instagramLinked ? 1 : 0,
    facebook_linked: data.facebookLinked ? 1 : 0,
    threads_linked: data.threadsLinked ? 1 : 0,
  };
}

