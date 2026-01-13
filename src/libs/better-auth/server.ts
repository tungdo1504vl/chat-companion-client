import { auth } from "./auth";
import { headers } from "next/headers";
import { cache } from "react";

/**
 * Get the current session on the server side
 * Use this in Server Components, Server Actions, and API Routes
 *
 * Uses React's cache() to memoize the session within a single request,
 * preventing multiple database queries when getSession() is called multiple times.
 */
export const getSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
});

/**
 * Get the current user on the server side
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Require authentication - throws if not authenticated
 * Use this when you need to ensure a user is logged in
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

/**
 * Get onboarding status for the current user
 * Returns null if not authenticated, false if not completed, true if completed
 */
export async function getOnboardingStatus(): Promise<boolean | null> {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  return user.hasCompletedOnboarding ?? false;
}

/**
 * Require both authentication and completed onboarding
 * Throws if not authenticated or onboarding not completed
 */
export async function requireOnboarding() {
  const session = await requireAuth();
  const user = session.user;
  if (!user?.hasCompletedOnboarding) {
    throw new Error("Onboarding not completed");
  }
  return session;
}
