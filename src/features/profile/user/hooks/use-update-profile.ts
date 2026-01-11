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
      // All fields are nested under profile_update to match the user profile structure
      const inputArgs: Record<string, unknown> = {
        user_id: updatePayload.user_id,
      };

      // Add profile_update with all nested fields in original format
      if (updatePayload.profile_update) {
        inputArgs.profile_update = updatePayload.profile_update;
      }

      return userService.updateUserProfile<TUserProfileResponse>(
        inputArgs as unknown as TTaskInputArgs,
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
