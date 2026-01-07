import { useMutation, useQueryClient } from "@/libs/react-query";
import { useSession } from "@/libs/better-auth/client";
import userService from "@/services/user.service";
import { formDataToTaskInputArgs } from "../utils/transform";
import { TProfileFormData } from "../types";
import type { TCommonResponse, TTaskInputArgs } from "@/services/types";
import type { TUserProfileResponse } from "../types";

/**
 * Hook for updating user profile
 * Handles mutation, query invalidation, and error states
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const mutation = useMutation<
    TCommonResponse<TUserProfileResponse>,
    Error,
    TProfileFormData
  >({
    mutationFn: async (formData: TProfileFormData) => {
      if (!userId) {
        throw new Error("User ID is required to update profile");
      }

      // Transform form data to task input args format
      const inputArgs = formDataToTaskInputArgs(
        formData,
        userId
      ) as TTaskInputArgs;

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
    updateProfile: mutation.mutate,
    updateProfileAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};
