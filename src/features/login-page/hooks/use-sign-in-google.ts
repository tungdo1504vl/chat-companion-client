"use client";

import { signIn } from "@/libs/better-auth/client";
import { useSearchParams } from "next/navigation";
import { PROTECTED_ROUTES } from "@/constants/routes";

export const useSignInGoogle = () => {
  const searchParams = useSearchParams();

  const handleSignInWithGoogle = () => {
    const callbackUrl =
      searchParams.get("callbackUrl") || PROTECTED_ROUTES.CONVERSATIONS;

    // better-auth will handle the OAuth redirect flow
    signIn.social({
      provider: "google",
      callbackURL: callbackUrl,
    });
  };

  return {
    mutate: handleSignInWithGoogle,
    isPending: false, // OAuth redirects immediately, no pending state
  };
};
