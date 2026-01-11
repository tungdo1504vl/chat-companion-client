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
    // Optional fields - allow empty strings/arrays
    primaryLoveLanguage: z.string().optional(),
    communicationStyles: z.array(z.string()).min(0).optional(),
    attachmentStyle: z.string().optional(),
    // Required fields
    dealBreakers: z
      .array(z.string().min(1, "Deal-breaker cannot be empty"))
      .optional(),
    workSchedule: z.string().optional(),
    dateBudget: z.number().min(10).max(1000),
    socialEnergy: z.string().optional(),
    hobbies: z.array(z.string().min(1, "Hobby cannot be empty")).optional(),
    instagramUrl: urlSchema,
  })
  .strict();

export type TProfileFormSchema = z.infer<typeof profileFormSchema>;
