import { z } from "zod";
import {
  partnerGenders,
  partnerAgeRanges,
  goalForRelationshipOptions,
} from "./const";
import type { GoalType } from "@/features/profile/partner/types";

// Extract values from constants
const partnerGenderValues = partnerGenders.map((item) => item.value);
const partnerAgeRangeValues = partnerAgeRanges.map((item) => item.value);
const goalForRelationshipValues = goalForRelationshipOptions.map(
  (item) => item.value
) as GoalType[];

export const partnerFormSchema = z
  .object({
    // Step 1 - Basic Information (Required)
    partnerName: z.string().min(1, "Name is required"),
    birthYear: z.string().min(1, "Year is required"),
    birthMonth: z.string().min(1, "Month is required"),
    birthDay: z.string().min(1, "Day is required"),
    birthHour: z.string().optional(),
    birthMinute: z.string().optional(),
    birthPeriod: z.enum(["AM", "PM"]).optional(),
    birthTimeKnown: z.boolean(),
    partnerGender: z
      .string()
      .min(1, "Partner's gender is required")
      .refine((val) => partnerGenderValues.includes(val), {
        message: "Please select a valid gender option",
      }),
    partnerAgeRange: z.string().optional(), // Optional field
    country: z.string().optional(), // Optional field
    city: z.string().optional(), // Optional field

    // Step 2 - Current Situation (Required)
    situationDescription: z
      .string()
      .min(10, "Please provide more details (at least 10 characters)"),

    // Step 3 - Goals & Key Question (Required)
    keyQuestion: z
      .string()
      .min(
        5,
        "Please provide a more detailed question (at least 5 characters)"
      ),
    goalForRelationship: z
      .string()
      .min(1, "Goal for relationship is required")
      .refine((val) => goalForRelationshipValues.includes(val as GoalType), {
        message: "Please select a valid goal option",
      }),

    // Step 4 - Additional Context (Optional)
    partnerPersonality: z.string().optional(),
    majorPastEvents: z.string().optional(),
    currentFeelings: z.string().optional(),
    voiceAudio: z
      .object({
        base64: z.string(),
        format: z.string(),
        fileName: z.string(),
        fileSize: z.number(),
      })
      .optional(),
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
      message: "Hour, minute, and AM/PM are required when time is known",
      path: ["birthHour"],
    }
  )
  .strict();

export type TPartnerFormSchema = z.infer<typeof partnerFormSchema>;
