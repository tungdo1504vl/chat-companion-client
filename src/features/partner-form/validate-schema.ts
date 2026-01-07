import { z } from 'zod';
import { partnerGenders, partnerAgeRanges, ultimateGoals } from './const';

// Extract values from constants
const partnerGenderValues = partnerGenders.map((item) => item.value);
const partnerAgeRangeValues = partnerAgeRanges.map((item) => item.value);
const ultimateGoalValues = ultimateGoals.map((item) => item.value);

export const partnerFormSchema = z
  .object({
    // Step 1 - Required
    partnerName: z
      .string()
      .min(10, 'Please provide more details (at least 3 characters)'),
    partnerGender: z
      .string()
      .min(1, "Partner's gender is required")
      .refine((val) => partnerGenderValues.includes(val), {
        message: 'Please select a valid gender option',
      }),
    partnerAgeRange: z
      .string()
      .min(1, "Partner's age range is required")
      .refine((val) => partnerAgeRangeValues.includes(val), {
        message: 'Please select a valid age range option',
      }),

    // Step 2 - Required
    situationDescription: z
      .string()
      .min(10, 'Please provide more details (at least 10 characters)'),

    // Step 3 - Required
    keyQuestion: z
      .string()
      .min(
        5,
        'Please provide a more detailed question (at least 5 characters)'
      ),
    ultimateGoal: z
      .string()
      .min(1, 'Ultimate goal is required')
      .refine((val) => ultimateGoalValues.includes(val), {
        message: 'Please select a valid ultimate goal option',
      }),

    // Step 4 - Optional
    partnerPersonality: z
      .string()
      .min(10, 'Please provide more details (at least 10 characters)'),
    majorPastEvents: z
      .string()
      .min(10, 'Please provide more details (at least 10 characters)'),
    currentFeelings: z
      .string()
      .min(10, 'Please provide more details (at least 10 characters)'),
  })
  .strict();

export type TPartnerFormSchema = z.infer<typeof partnerFormSchema>;
