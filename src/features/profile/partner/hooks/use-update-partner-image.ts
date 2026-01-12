"use client";

import { useMutation, useQueryClient } from "@/libs/react-query";
import { useSession } from "@/libs/better-auth/client";
import userService from "@/services/user.service";
import { processImageFile } from "@/utils/image";
import type { PartnerProfile } from "../types";
import type { TCommonResponse, TTaskInputArgs } from "@/services/types";
import { partnerProfileToApiFormat } from "../utils/transform";
import { toast } from "sonner";

export interface UseUpdatePartnerImageOptions {
  /**
   * The current partner profile (saved version)
   * Used to merge with image update
   */
  savedProfile: PartnerProfile;
  /**
   * Optional callback on successful upload
   */
  onSuccess?: (data: TCommonResponse) => void;
  /**
   * Optional callback on upload error
   */
  onError?: (error: Error) => void;
}

/**
 * Hook to update partner profile image
 * Updates backend API basic_info.avatar_url
 * Uses React Query mutation for state management and cache invalidation
 *
 * @param partnerId - The partner profile ID
 * @param options - Configuration including saved profile and callbacks
 * @returns Mutation object with updateImage, isUpdating, isSuccess, error
 */
export const useUpdatePartnerImage = (
  partnerId: string,
  options: UseUpdatePartnerImageOptions
) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const userId = session?.user?.id;

  const mutation = useMutation<TCommonResponse, Error, File>({
    mutationFn: async (imageFile: File) => {
      if (!userId) {
        throw new Error("User ID is required to update partner profile image");
      }

      if (!partnerId) {
        throw new Error("Partner ID is required to update partner profile image");
      }

      // Process image file to base64
      const imageInfo = await processImageFile(imageFile);

      // Create updated profile with new avatar URL
      const updatedProfile: PartnerProfile = {
        ...options.savedProfile,
        avatarUrl: imageInfo.base64, // Full data URL
      };

      // Transform to API format, merging with saved profile to preserve all fields
      const apiFormat = partnerProfileToApiFormat(
        updatedProfile,
        options.savedProfile
      );

      // Prepare input args matching the required payload structure
      const inputArgs = {
        user_id: userId,
        partner_id: partnerId,
        partner_profile: apiFormat,
      } as unknown as TTaskInputArgs;

      return userService.updatePartnerProfile<TCommonResponse>(
        inputArgs,
        "high"
      );
    },
    onSuccess: (data) => {
      // Invalidate the partner profile query cache to refetch fresh data
      if (partnerId && userId) {
        queryClient.invalidateQueries({
          queryKey: ["partner-profile", partnerId, userId],
        });
      }

      toast.success("Profile image updated", {
        description: "Partner profile image has been saved successfully.",
      });

      // Call optional success callback
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update partner profile image";

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
