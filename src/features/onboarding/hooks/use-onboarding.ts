import { useMutation, useQueryClient } from "@/libs/react-query";
import { userService, TCommonPayload } from "@/services";
import { useSession } from "@/libs/better-auth/client";
import { toast } from "sonner";
import { useProfileAnalysisStore } from "@/stores/profile-analysis.store";
import type { UserProfileAnalysisResponse } from "@/stores/types";
import type { TUserProfileResponse } from "@/features/profile/user/types";
import type { TCommonResponse } from "@/services/types";

/**
 * Transforms TUserProfileResponse to UserProfileAnalysisResponse format
 * Used to convert user profile data for the profile analysis store
 */
function transformUserProfileToAnalysis(
  userProfile: TUserProfileResponse
): UserProfileAnalysisResponse {
  return {
    profile: {
      user_id: userProfile.user_id,
      basic_info: {
        name: userProfile.profile.basic_info.name,
        avatar_url: userProfile.profile.basic_info.avatar_url,
        gender: userProfile.profile.basic_info.gender,
        dob: userProfile.profile.basic_info.dob,
        time_of_birth: userProfile.profile.basic_info.time_of_birth,
        country_of_birth: userProfile.profile.basic_info.country_of_birth,
        city_of_birth: userProfile.profile.basic_info.city_of_birth,
      },
      personality: {
        love_languages: userProfile.profile.personality.love_languages,
        communication_styles:
          userProfile.profile.personality.communication_styles,
        attachment_style: userProfile.profile.personality.attachment_style,
        deal_breakers: userProfile.profile.personality.deal_breakers,
      },
      lifestyle: {
        work_schedule: userProfile.profile.lifestyle.work_schedule,
        date_budget: userProfile.profile.lifestyle.date_budget,
        social_energy_level: userProfile.profile.lifestyle.social_energy_level,
        hobbies: userProfile.profile.lifestyle.hobbies,
      },
      social_links: {
        instagram: userProfile.profile.social_links.instagram || "",
        facebook: "",
        threads: "",
        tiktok: "",
      },
      primary_love_language: userProfile.profile.primary_love_language,
      communication_styles: userProfile.profile.communication_styles,
      attachment_style: userProfile.profile.attachment_style,
      deal_breakers: userProfile.profile.deal_breakers,
      work_schedule: userProfile.profile.work_schedule,
      date_budget: userProfile.profile.date_budget,
      social_energy: userProfile.profile.social_energy,
      hobbies: userProfile.profile.hobbies,
      instagram_linked: false,
      facebook_linked: false,
      threads_linked: false,
    },
    natal_chart:
      userProfile.natal_chart as unknown as UserProfileAnalysisResponse["natal_chart"],
    insights: {
      analysis_text: userProfile.insights.analysis_text,
    },
    warnings: [],
    created_at: userProfile.created_at,
    updated_at: userProfile.updated_at,
  };
}

export const useOnboarding = () => {
  const queryClient = useQueryClient();
  const { refetch: refetchSession, data: session } = useSession();
  const setProfileAnalysis = useProfileAnalysisStore(
    (state) => state.setProfileAnalysis
  );

  const onboardingMutation = useMutation<
    TCommonResponse<UserProfileAnalysisResponse>,
    Error,
    TCommonPayload
  >({
    mutationFn: async (data) => {
      if (!session?.user?.id) {
        throw new Error("User session is required");
      }

      // Validate user profile data (this returns the analysis result)
      const response =
        await userService.validateUserProfile<UserProfileAnalysisResponse>(
          {
            ...data.input_args,
            user_id: session.user.id,
          },
          data.priority
        );

      // Mark onboarding as complete
      const completeResponse = await fetch("/api/onboarding/complete", {
        method: "POST",
      });

      if (!completeResponse.ok) {
        throw new Error("Failed to complete onboarding");
      }

      return response;
    },
    onMutate: () => {
      toast.loading("Processing your profile...");
    },
    onSuccess: async (response) => {
      toast.dismiss();

      // Store validation response in Zustand store immediately
      // This contains natal_chart and insights needed for the astrology chart screen
      if (response.result && response.status === "completed") {
        try {
          setProfileAnalysis(response.result);
        } catch (error) {
          console.error("Failed to store profile analysis:", error);
        }
      }

      // Refresh session to get updated user data
      await refetchSession();
      const userId = session?.user?.id;

      if (userId) {
        // Invalidate user-profile query to trigger automatic refetch
        // This ensures other components using useUserProfile get fresh data
        queryClient.invalidateQueries({
          queryKey: ["user-profile", userId],
        });

        // Optionally fetch and update cache immediately for better UX
        // This avoids waiting for the automatic refetch
        try {
          const profileResponse =
            await userService.getUserProfile<TUserProfileResponse>(
              { user_id: userId },
              "high"
            );

          if (
            profileResponse.result &&
            profileResponse.status === "completed"
          ) {
            // Update React Query cache with fresh data
            queryClient.setQueryData<TCommonResponse<TUserProfileResponse>>(
              ["user-profile", userId],
              profileResponse
            );

            // Update Zustand store with transformed data
            const profileAnalysis = transformUserProfileToAnalysis(
              profileResponse.result
            );
            setProfileAnalysis(profileAnalysis);
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          // Continue with validation response data already in store
        }
      }

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
