import { useMutation } from "@/libs/react-query";
import { TLoginFormData } from "../components/login-form/types";
import { signIn, useSession } from "@/libs/better-auth/client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/constants/routes";
import {
  encryptPasswordSafely,
  extractErrorMessage,
  getAuthErrorMessage,
} from "@/libs/crypto/utils";
import { AUTH_SUCCESS_MESSAGES, AUTH_FAILURE_MESSAGES } from "@/constants/auth";

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

export const useSignIn = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refetch: refetchSession } = useSession();

  const signInMutation = useMutation({
    mutationFn: async (data: TLoginFormData) => {
      const encryptedPassword = await encryptPasswordSafely(data.password);

      return await signIn.email({
        email: data.email,
        password: encryptedPassword,
      });
    },
    onMutate: () => {
      // Show loading toast when mutation starts
      toast.loading("Signing in...");
    },
    onSuccess: async (response) => {
      // Dismiss loading toast
      toast.dismiss();

      if (response && "error" in response && response.error) {
        const errorMessage = getAuthErrorMessage(
          response.error,
          AUTH_FAILURE_MESSAGES.SIGN_IN_DEFAULT
        );
        toast.error(AUTH_FAILURE_MESSAGES.SIGN_IN, {
          description: errorMessage,
        });
        return;
      }

      await refetchSession();
      toast.success(AUTH_SUCCESS_MESSAGES.SIGN_IN);

      // Validate and redirect to callbackUrl or default to onboarding
      // The proxy and server-side layouts will handle onboarding redirect if needed
      const rawCallbackUrl = searchParams.get("callbackUrl");
      const safeCallbackUrl = validateCallbackUrl(rawCallbackUrl);

      router.push(safeCallbackUrl);
      router.refresh();
    },
    onError: (error) => {
      // Dismiss loading toast
      toast.dismiss();

      toast.error(AUTH_FAILURE_MESSAGES.SIGN_IN, {
        description: extractErrorMessage(
          error,
          AUTH_FAILURE_MESSAGES.UNEXPECTED_ERROR
        ),
      });
    },
  });

  return signInMutation;
};
