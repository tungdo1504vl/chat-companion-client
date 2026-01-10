import { envServer } from "@/env/server";
import { betterAuth } from "better-auth";
import { Pool } from "pg";

/**
 * Custom fetch implementation with increased timeout for OAuth callbacks
 * Default timeout is 10s, we increase it to 30s for better reliability
 */
const customFetch = async (
  url: string | URL | Request,
  init?: RequestInit
): Promise<Response> => {
  // Create an AbortController with a 30 second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  // If there's an existing signal, combine it with our timeout signal
  const existingSignal = init?.signal;
  if (existingSignal) {
    existingSignal.addEventListener("abort", () => {
      controller.abort();
      clearTimeout(timeoutId);
    });
  }

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const auth = betterAuth({
  baseURL: envServer.BETTER_AUTH_URL,
  secret: envServer.BETTER_AUTH_SECRET || "",
  database: new Pool({
    connectionString: envServer.DATABASE_URL,
  }),
  fetch: customFetch,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: envServer.GOOGLE_CLIENT_ID,
      clientSecret: envServer.GOOGLE_CLIENT_SECRET,
      scope: ["email", "profile"],
    },
  },
  user: {
    additionalFields: {
      hasCompletedOnboarding: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false, // Prevent users from setting this field during signup
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
