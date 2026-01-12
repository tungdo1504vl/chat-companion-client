"use client";

import { signIn } from "@/libs/better-auth/client";
import { useSearchParams } from "next/navigation";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/constants/routes";

/**
 * Validate that a callbackUrl is safe to redirect to
 * Prevents redirect loops and security issues
 */
function validateCallbackUrl(callbackUrl: string | null): string {
  if (!callbackUrl) {
    return PROTECTED_ROUTES.ONBOARDING;
  }

  // Remove query params and hash for validation
  const urlPath = callbackUrl.split("?")[0].split("#")[0];
  const normalizedPath = urlPath.startsWith("/") ? urlPath : `/${urlPath}`;

  // Don't redirect to public routes (would cause redirect loops)
  const publicPaths = [PUBLIC_ROUTES.LOGIN, PUBLIC_ROUTES.SIGNUP];
  if (publicPaths.includes(normalizedPath as "/login" | "/signup")) {
    return PROTECTED_ROUTES.ONBOARDING;
  }

  // Don't redirect to empty or root path
  if (normalizedPath === "/" || normalizedPath.length === 0) {
    return PROTECTED_ROUTES.ONBOARDING;
  }

  // Return the validated callbackUrl (with original query params if any)
  return callbackUrl;
}

export const useSignInGoogle = () => {
  const searchParams = useSearchParams();

  const handleSignInWithGoogle = () => {
    const rawCallbackUrl = searchParams.get("callbackUrl");
    const safeCallbackUrl = validateCallbackUrl(rawCallbackUrl);

    // better-auth will handle the OAuth redirect flow
    signIn.social({
      provider: "google",
      callbackURL: safeCallbackUrl,
    });
  };

  return {
    mutate: handleSignInWithGoogle,
    isPending: false, // OAuth redirects immediately, no pending state
  };
};
