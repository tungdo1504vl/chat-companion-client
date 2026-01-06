import { useMutation } from "@/libs/react-query";
import { userService, TCommonPayload } from "@/services";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/libs/better-auth/client";
import { PROTECTED_ROUTES } from "@/constants";
import { toast } from "sonner";
import { useProfileAnalysisStore } from "@/stores/profile-analysis.store";
import type { UserProfileAnalysisResponse } from "@/stores/types";

export const useOnboarding = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refetch: refetchSession, data: session } = useSession();
  const setProfileAnalysis = useProfileAnalysisStore(
    (state) => state.setProfileAnalysis
  );

  const onboardingMutation = useMutation({
    mutationFn: async (data: TCommonPayload) => {
      // Validate user profile data (this returns the analysis result)
      const response =
        await userService.validateUserProfile<UserProfileAnalysisResponse>(
          {
            ...data.input_args,
            user_id: session?.user?.id ?? "",
          },
          data.priority
        );

      // Then mark onboarding as complete
      const completeResponse = await fetch("/api/onboarding/complete", {
        method: "POST",
      });

      if (!completeResponse.ok) {
        throw new Error("Failed to complete onboarding");
      }

      return response;
    },
    onSuccess: async (response) => {
      // Store profile analysis result in the store
      if (response.result && response.status === "completed") {
        try {
          setProfileAnalysis(response.result);
        } catch (error) {
          console.error("Failed to store profile analysis:", error);
          // Don't fail the onboarding flow if storing fails
        }
      }

      // Refresh session to get updated user data
      await refetchSession();

      toast.success("Onboarding completed successfully");

      // Redirect to intended destination or default to conversations
      const redirectPath =
        searchParams.get("redirect") || PROTECTED_ROUTES.CONVERSATIONS;
      router.push(redirectPath);
      router.refresh();
    },
    onError: (error) => {
      console.error("Onboarding error:", error);
      toast.error("Failed to complete onboarding", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    },
  });

  return onboardingMutation;
};
