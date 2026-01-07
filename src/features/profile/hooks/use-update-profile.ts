import { useMutation, useQueryClient } from "@/libs/react-query";
import { useSession } from "@/libs/better-auth/client";
import userService from "@/services/user.service";
import { formDataToUpdatePayload } from "../utils/transform";
import { TProfileFormData } from "../types";
import type { TCommonResponse, TTaskInputArgs } from "@/services/types";
import type { TUserProfileResponse } from "../types";
import { defaultProfileFormValues } from "../const";

/**
 * Hook for updating user profile
 * Handles mutation, query invalidation, and error states
 * Supports partial updates by only sending changed fields
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const mutation = useMutation<
    TCommonResponse<TUserProfileResponse>,
    Error,
    { formData: TProfileFormData; initialValues?: TProfileFormData | null }
  >({
    mutationFn: async ({ formData, initialValues }) => {
      if (!userId) {
        throw new Error("User ID is required to update profile");
      }

      // Use initial values if provided, otherwise use defaults
      const baseValues = initialValues || defaultProfileFormValues;

      // Transform form data to update payload (only changed fields)
      const updatePayload = formDataToUpdatePayload(
        formData,
        baseValues,
        userId
      );

      // Convert payload to task input args format
      // The API expects a flat structure, so we need to serialize nested objects
      const inputArgs: TTaskInputArgs = {
        user_id: updatePayload.user_id,
      };

      // Add nested objects as JSON strings if they exist
      if (updatePayload.profile_update) {
        inputArgs.profile_update = JSON.stringify(updatePayload.profile_update);
      }
      if (updatePayload.personality) {
        inputArgs.personality = JSON.stringify(updatePayload.personality);
      }
      if (updatePayload.lifestyle) {
        inputArgs.lifestyle = JSON.stringify(updatePayload.lifestyle);
      }
      if (updatePayload.social_links) {
        inputArgs.social_links = JSON.stringify(updatePayload.social_links);
      }

      // Add top-level fields if they exist
      if (updatePayload.primary_love_language !== undefined) {
        inputArgs.primary_love_language = updatePayload.primary_love_language;
      }
      if (updatePayload.communication_styles !== undefined) {
        inputArgs.communication_styles = JSON.stringify(
          updatePayload.communication_styles
        );
      }
      if (updatePayload.attachment_style !== undefined) {
        inputArgs.attachment_style = updatePayload.attachment_style;
      }
      if (updatePayload.deal_breakers !== undefined) {
        inputArgs.deal_breakers = JSON.stringify(updatePayload.deal_breakers);
      }
      if (updatePayload.work_schedule !== undefined) {
        inputArgs.work_schedule = updatePayload.work_schedule;
      }
      if (updatePayload.date_budget !== undefined) {
        inputArgs.date_budget = updatePayload.date_budget;
      }
      if (updatePayload.social_energy !== undefined) {
        inputArgs.social_energy = updatePayload.social_energy;
      }
      if (updatePayload.hobbies !== undefined) {
        inputArgs.hobbies = JSON.stringify(updatePayload.hobbies);
      }

      return userService.updateUserProfile<TUserProfileResponse>(
        inputArgs,
        "medium"
      );
    },
    onSuccess: () => {
      // Invalidate and refetch user profile query on success
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: ["user-profile", userId],
        });
      }
    },
  });

  return {
    updateProfile: (
      formData: TProfileFormData,
      initialValues?: TProfileFormData | null
    ) => mutation.mutate({ formData, initialValues }),
    updateProfileAsync: async (
      formData: TProfileFormData,
      initialValues?: TProfileFormData | null
    ) => mutation.mutateAsync({ formData, initialValues }),
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};
