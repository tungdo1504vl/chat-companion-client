import { z } from 'zod';

export const profileFormSchema = z
  .object({
    primaryLoveLanguage: z.string().min(1, 'Primary love language is required'),
    communicationStyles: z
      .array(z.string())
      .min(1, 'At least one communication style is required'),
    attachmentStyle: z.string().min(1, 'Attachment style is required'),
    dealBreakers: z
      .array(z.string().min(1, 'Deal-breaker cannot be empty'))
      .min(1, 'At least one deal-breaker is required'),
    workSchedule: z.string().min(1, 'Work schedule is required'),
    dateBudget: z.number().min(10).max(1000),
    socialEnergy: z.string().min(1, 'Social energy level is required'),
    hobbies: z
      .array(z.string().min(1, 'Hobby cannot be empty'))
      .min(1, 'At least one hobby is required'),
    instagramLinked: z.boolean(),
    facebookLinked: z.boolean(),
    threadsLinked: z.boolean(),
  })
  .strict();

export type TProfileFormSchema = z.infer<typeof profileFormSchema>;

