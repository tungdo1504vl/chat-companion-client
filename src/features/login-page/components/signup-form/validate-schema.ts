import { z } from "zod";

export const signupFormSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number"),
  })
  .strict();

export type TSignupFormSchema = z.infer<typeof signupFormSchema>;
