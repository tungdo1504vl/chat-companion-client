import { z } from "zod";

export const onboardingFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    gender: z.enum(["female", "male"]).refine(
      (val) => val !== undefined,
      {
        message: "Gender is required",
      }
    ),
    dob: z.string().min(1, "Date of birth is required").refine(
      (val) => {
        // Validate date format YYYY-MM-DD
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(val)) return false;
        
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Check if date is valid and not in the future
        return date instanceof Date && !isNaN(date.getTime()) && date <= today;
      },
      {
        message: "Please select a valid date that is not in the future",
      }
    ),
    country: z.string().min(1, "Country is required"),
  });

export type TOnboardingFormSchema = z.infer<typeof onboardingFormSchema>;
