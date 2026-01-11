import { z } from "zod";

export const onboardingFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    birthYear: z.string().min(1, "Year is required"),
    birthMonth: z.string().min(1, "Month is required"),
    birthDay: z.string().min(1, "Day is required"),
    birthHour: z.string().optional(),
    birthMinute: z.string().optional(),
    birthPeriod: z.enum(["AM", "PM"]).optional(),
    birthTimeKnown: z.boolean(),
    genderAtBirth: z.enum(["male", "female", ""]).refine(
      (val) => val !== "",
      {
        message: "Gender at birth is required",
      }
    ),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    birthDate: z.date().optional(),
  })
  .refine(
    (data) => {
      // If birthTimeKnown is true, then birthHour, birthMinute, and birthPeriod are required
      if (data.birthTimeKnown) {
        return (
          data.birthHour &&
          data.birthHour.length > 0 &&
          data.birthMinute &&
          data.birthMinute.length > 0 &&
          data.birthPeriod
        );
      }
      return true;
    },
    {
      message: "Hour, minute, and AM/PM are required",
      path: ["birthHour"],
    }
  )
  .refine(
    (data) => {
      // Validate date is not in the future
      if (data.birthYear && data.birthMonth && data.birthDay) {
        const year = parseInt(data.birthYear, 10);
        const month = parseInt(data.birthMonth, 10) - 1; // Month is 0-indexed
        const day = parseInt(data.birthDay, 10);
        const date = new Date(year, month, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Check if date is valid
        if (
          date.getFullYear() !== year ||
          date.getMonth() !== month ||
          date.getDate() !== day
        ) {
          return false;
        }
        
        // Check if date is not in the future
        return date <= today;
      }
      return true;
    },
    {
      message: "Please select a valid date that is not in the future",
      path: ["birthDay"],
    }
  );

export type TOnboardingFormSchema = z.infer<typeof onboardingFormSchema>;
