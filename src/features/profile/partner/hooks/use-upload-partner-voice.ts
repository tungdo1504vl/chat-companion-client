"use client";

import { useMutation, useQueryClient } from "@/libs/react-query";
import { useSession } from "@/libs/better-auth/client";
import userService from "@/services/user.service";
import type { TCommonResponse, TTaskInputArgs } from "@/services/types";
import type { AudioFileInfo } from "@/utils/audio";
import { toast } from "sonner";

export interface UseUploadPartnerVoiceOptions {
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
 * Hook to upload partner voice profile independently
 * Uses React Query mutation for state management and cache invalidation
 *
 * @param partnerId - The partner profile ID
 * @param options - Optional configuration including callbacks
 * @returns Mutation object with uploadVoice, isUploading, isSuccess, error
 */
export const useUploadPartnerVoice = (
  partnerId: string,
  options?: UseUploadPartnerVoiceOptions
) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const userId = session?.user?.id;

  const mutation = useMutation<TCommonResponse, Error, AudioFileInfo>({
    mutationFn: async (audioFile: AudioFileInfo) => {
      if (!userId) {
        throw new Error("User ID is required to upload voice profile");
      }

      if (!partnerId) {
        throw new Error("Partner ID is required to upload voice profile");
      }

      const voicePayload: TTaskInputArgs = {
        user_id: userId,
        partner_id: partnerId,
        audio_base64: audioFile.base64,
        audio_format: audioFile.format,
        metadata: { source: "upload" },
      } as unknown as TTaskInputArgs;

      return await userService.createPartnerVoiceProfile<TCommonResponse>(
        voicePayload,
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

      toast.success("Voice uploaded successfully", {
        description: "Your partner's voice recording has been saved.",
      });

      // Call optional success callback
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to upload voice recording";

      toast.error("Voice upload failed", {
        description: errorMessage,
      });

      // Call optional error callback
      options?.onError?.(error);
    },
  });

  return {
    ...mutation,
    // Convenience aliases for common state properties
    uploadVoice: mutation.mutate,
    uploadVoiceAsync: mutation.mutateAsync,
    isUploading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};
