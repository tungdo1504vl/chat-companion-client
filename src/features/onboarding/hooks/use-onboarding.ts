import { useMutation } from "@/libs/react-query";
import { TCommonPayload } from "@/services";
import { toast } from "sonner";
import { useProfileAnalysisStore } from "@/stores/profile-analysis.store";
import type { UserProfileAnalysisResponse } from "@/stores/types";
import type { TCommonResponse } from "@/services/types";
import { mockProfileAnalysisData } from "../mock-data";

export const useOnboarding = () => {
  const setProfileAnalysis = useProfileAnalysisStore(
    (state) => state.setProfileAnalysis
  );

  const onboardingMutation = useMutation<
    TCommonResponse<UserProfileAnalysisResponse>,
    Error,
    TCommonPayload
  >({
    mutationFn: async (data) => {
      // Mock API response - simulates 1 second delay
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            task_id: "mock-task-" + Date.now(),
            status: "completed",
            task_type: "user_profile_validate",
            result: mockProfileAnalysisData,
          });
        }, 1000);
      });
    },
    onMutate: () => {
      toast.loading("Processing your profile...");
    },
    onSuccess: async (response) => {
      toast.dismiss();

      // Set mock profile analysis data in store
      // The response.result contains the UserProfileAnalysisResponse
      setProfileAnalysis(response.result);

      toast.success("Onboarding completed successfully");
    },
    onError: (error) => {
      // Dismiss loading toast
      toast.dismiss();

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
