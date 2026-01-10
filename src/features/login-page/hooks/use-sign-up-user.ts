import { signUp, useSession } from "@/libs/better-auth/client";
import { TLoginFormData } from "../components/login-form/types";
import { useMutation } from "@/libs/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PROTECTED_ROUTES } from "@/constants/routes";
import {
  encryptPasswordSafely,
  extractErrorMessage,
  getAuthErrorMessage,
} from "@/libs/crypto/utils";
import { AUTH_SUCCESS_MESSAGES, AUTH_FAILURE_MESSAGES } from "@/constants/auth";

export const useSignUpUser = () => {
  const router = useRouter();
  const { refetch: refetchSession } = useSession();

  const registerUserMutation = useMutation({
    mutationFn: async (data: TLoginFormData) => {
      const encryptedPassword = await encryptPasswordSafely(data.password);

      return await signUp.email({
        name: data.email,
        email: data.email,
        password: encryptedPassword,
      });
    },
    onSuccess: async (response) => {
      if (response && "error" in response && response.error) {
        const errorMessage = getAuthErrorMessage(
          response.error,
          AUTH_FAILURE_MESSAGES.SIGN_UP_DEFAULT
        );
        toast.error(AUTH_FAILURE_MESSAGES.SIGN_UP, {
          description: errorMessage,
        });
        return;
      }

      await refetchSession();
      toast.success(AUTH_SUCCESS_MESSAGES.SIGN_UP);
      // Redirect to onboarding for new users
      router.push(PROTECTED_ROUTES.ONBOARDING);
      router.refresh();
    },
    onError: (error) => {
      toast.error(AUTH_FAILURE_MESSAGES.SIGN_UP, {
        description: extractErrorMessage(
          error,
          AUTH_FAILURE_MESSAGES.UNEXPECTED_ERROR
        ),
      });
    },
  });

  return registerUserMutation;
};
