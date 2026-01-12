"use client";

import { useMutation, useQueryClient } from "@/libs/react-query";
import { useSession, updateUser } from "@/libs/better-auth/client";
import userService from "@/services/user.service";
import { processImageFile } from "@/utils/image";
import type { TCommonResponse, TTaskInputArgs } from "@/services/types";
import type { TUserProfileResponse } from "../types";
import { toast } from "sonner";

export interface UseUpdateUserImageOptions {
  /**
   * Optional callback on successful upload
   */
  onSuccess?: () => void;
  /**
   * Optional callback on upload error
   */
  onError?: (error: Error) => void;
}

/**
 * Hook to update user profile image
 * Updates both better-auth user.image and backend API profile.basic_info.avatar_url
 * Uses React Query mutation for state management and cache invalidation
 *
 * @param options - Optional configuration including callbacks
 * @returns Mutation object with updateImage, isUpdating, isSuccess, error
 */
export const useUpdateUserImage = (options?: UseUpdateUserImageOptions) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const userId = session?.user?.id;

  const mutation = useMutation<
    TCommonResponse<TUserProfileResponse>,
    Error,
    File
  >({
    mutationFn: async (imageFile: File) => {
      if (!userId) {
        throw new Error("User ID is required to update profile image");
      }

      // Process image file to base64
      const imageInfo = await processImageFile(imageFile);

      // Step 1: Update better-auth user.image
      try {
        await updateUser({
          image: imageInfo.base64, // Full data URL
        });
      } catch (error) {
        throw new Error(
          `Failed to update user image: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }

      // Step 2: Update backend API profile.basic_info.avatar_url
      const inputArgs: Record<string, unknown> = {
        user_id: userId,
        profile_update: {
          basic_info: {
            avatar_url: imageInfo.base64, // Full data URL
          },
        },
      };

      return userService.updateUserProfile<TUserProfileResponse>(
        inputArgs as unknown as TTaskInputArgs,
        "high"
      );
    },
    onSuccess: () => {
      // Invalidate user profile query cache to refetch fresh data
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: ["user-profile", userId],
        });
      }

      // Invalidate session to refresh user image
      queryClient.invalidateQueries({
        queryKey: ["session"],
      });

      toast.success("Profile image updated", {
        description: "Your profile image has been saved successfully.",
      });

      // Call optional success callback
      options?.onSuccess?.();
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update profile image";

      toast.error("Image update failed", {
        description: errorMessage,
      });

      // Call optional error callback
      options?.onError?.(error);
    },
  });

  return {
    ...mutation,
    // Convenience aliases for common state properties
    updateImage: mutation.mutate,
    updateImageAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};
