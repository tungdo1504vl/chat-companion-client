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
    genderAtBirth: z.enum(["male", "female"]),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
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
  );

export type TOnboardingFormSchema = z.infer<typeof onboardingFormSchema>;
