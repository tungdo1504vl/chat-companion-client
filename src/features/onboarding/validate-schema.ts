import { z } from "zod";

export const onboardingFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    gender: z.enum(["female", "male", ""]).refine(
      (val) => val !== undefined,
      {
        message: "Gender is required",
      }
    ),
    dob: z.string().refine(
      (val) => val !== undefined, {
        message: "Date of birth is required",
      }
    ),
    country: z.string()
  });

export type TOnboardingFormSchema = z.infer<typeof onboardingFormSchema>;
