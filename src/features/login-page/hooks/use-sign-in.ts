import { useMutation } from "@/libs/react-query";
import { TLoginFormData } from "../components/login-form/types";
import { signIn, useSession } from "@/libs/better-auth/client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { PROTECTED_ROUTES } from "@/constants";
import {
  encryptPasswordSafely,
  extractErrorMessage,
  getAuthErrorMessage,
} from "@/libs/crypto/utils";
import { AUTH_SUCCESS_MESSAGES, AUTH_FAILURE_MESSAGES } from "@/constants/auth";

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
    onSuccess: async (response) => {
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

      const callbackUrl =
        searchParams.get("callbackUrl") || PROTECTED_ROUTES.CONVERSATIONS;
      router.push(callbackUrl);
      router.refresh();
    },
    onError: (error) => {
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
