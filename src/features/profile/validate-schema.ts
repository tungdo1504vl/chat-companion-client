import { z } from "zod";

// URL validation helper - validates URL format when provided
// Empty strings are allowed, but if a value is provided, it must be a valid URL
const urlSchema = z.string().refine(
  (val) => {
    const trimmed = val.trim();
    if (trimmed === "") return true;
    try {
      new URL(trimmed);
      return true;
    } catch {
      return false;
    }
  },
  {
    message: "Must be a valid URL",
  }
);

export const profileFormSchema = z
  .object({
    primaryLoveLanguage: z.string().min(1, "Primary love language is required"),
    communicationStyles: z
      .array(z.string())
      .min(1, "At least one communication style is required"),
    attachmentStyle: z.string().min(1, "Attachment style is required"),
    dealBreakers: z
      .array(z.string().min(1, "Deal-breaker cannot be empty"))
      .min(1, "At least one deal-breaker is required"),
    workSchedule: z.string().min(1, "Work schedule is required"),
    dateBudget: z.number().min(10).max(1000),
    socialEnergy: z.string().min(1, "Social energy level is required"),
    hobbies: z
      .array(z.string().min(1, "Hobby cannot be empty"))
      .min(1, "At least one hobby is required"),
    instagramUrl: urlSchema,
  })
  .strict();

export type TProfileFormSchema = z.infer<typeof profileFormSchema>;
