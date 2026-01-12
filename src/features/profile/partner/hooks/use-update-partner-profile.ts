"use client";

import { useMutation, useQueryClient } from "@/libs/react-query";
import { useSession } from "@/libs/better-auth/client";
import userService from "@/services/user.service";
import type { PartnerProfile, PartnerProfileApiResponse } from "../types";
import type { TCommonResponse, TTaskInputArgs } from "@/services/types";
import {
  partnerProfileToApiFormat,
  computeProfileDiff,
  partnerProfileDiffToApiFormat,
} from "../utils/transform";
import type { z } from "zod";
import type { AudioFileInfo } from "@/utils/audio";
import { toast } from "sonner";

/**
 * Feature flag: Enable partial updates (send only changed fields)
 * Set to true to enable diff computation and send only changed fields
 * Set to false to always send full profile payload
 */
const ENABLE_PARTIAL_UPDATES = false;

export interface UseUpdatePartnerProfileOptions {
  /**
   * Optional Zod schema for validation
   * If provided, the profile will be validated before mutation
   */
  schema?: z.ZodSchema<PartnerProfile>;
  /**
   * Optional callback on successful mutation
   */
  onSuccess?: (data: TCommonResponse) => void;
  /**
   * Optional callback on mutation error
   */
  onError?: (error: Error) => void;
}

/**
 * Hook to update partner profile
 * Uses React Query mutation for state management and cache invalidation
 *
 * @param options - Optional configuration including Zod schema and callbacks
 * @returns Mutation object with mutate, mutateAsync, and state properties
 */
export const useUpdatePartnerProfile = (
  options?: UseUpdatePartnerProfileOptions
) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const userId = session?.user?.id;

  type MutationVariables =
    | PartnerProfile
    | Partial<PartnerProfile>
    | {
        draft: PartnerProfile;
        saved: PartnerProfile;
        voiceAudio?: AudioFileInfo | null;
      };

  const mutation = useMutation<TCommonResponse, Error, MutationVariables>({
    mutationFn: async (
      profileOrDiff:
        | PartnerProfile
        | Partial<PartnerProfile>
        | {
            draft: PartnerProfile;
            saved: PartnerProfile;
            voiceAudio?: AudioFileInfo | null;
          }
    ) => {
      if (!userId) {
        throw new Error("User ID is required to update partner profile");
      }

      let draftProfile: PartnerProfile;
      let apiFormat: PartnerProfileApiResponse;

      // Extract draft profile and voice audio from input
      let voiceAudio: AudioFileInfo | null | undefined;

      if (
        typeof profileOrDiff === "object" &&
        "draft" in profileOrDiff &&
        "saved" in profileOrDiff
      ) {
        // If diff object is provided, extract draft profile and voice audio
        draftProfile = profileOrDiff.draft;
        voiceAudio = profileOrDiff.voiceAudio;

        // TODO: Enable partial updates when ENABLE_PARTIAL_UPDATES is true
        // if (ENABLE_PARTIAL_UPDATES) {
        //   const savedProfile = profileOrDiff.saved;
        //   // Compute diff to send only changed fields
        //   const diff = computeProfileDiff(draftProfile, savedProfile);
        //   apiFormat = partnerProfileDiffToApiFormat(diff, draftProfile);
        // } else {
        //   // Send full profile
        //   apiFormat = partnerProfileToApiFormat(draftProfile);
        // }

        // Temporarily: Always send full profile (diff computation disabled)
        apiFormat = partnerProfileToApiFormat(draftProfile);
      } else {
        // Fallback to full profile update (backward compatibility)
        if (!profileOrDiff.id) {
          throw new Error("Partner ID is required to update partner profile");
        }

        draftProfile = profileOrDiff as PartnerProfile;
        // Transform full PartnerProfile to API format
        apiFormat = partnerProfileToApiFormat(draftProfile);
      }

      // Optional Zod validation
      let finalDraftProfile = draftProfile;
      if (options?.schema) {
        const validationResult = options.schema.safeParse(draftProfile);
        if (!validationResult.success) {
          throw new Error(
            `Validation failed: ${validationResult.error.issues
              .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
              .join(", ")}`
          );
        }
        finalDraftProfile = validationResult.data;
        // Always send full profile after validation (diff computation disabled)
        apiFormat = partnerProfileToApiFormat(finalDraftProfile);

        // TODO: Enable partial updates when ENABLE_PARTIAL_UPDATES is true
        // if (ENABLE_PARTIAL_UPDATES && savedProfile) {
        //   const diff = computeProfileDiff(finalDraftProfile, savedProfile);
        //   apiFormat = partnerProfileDiffToApiFormat(diff, finalDraftProfile);
        // } else {
        //   apiFormat = partnerProfileToApiFormat(finalDraftProfile);
        // }
      }

      // Store partnerId for cache invalidation
      const partnerId = finalDraftProfile.id;

      // Prepare input args matching the required payload structure
      // Note: TTaskInputArgs type is restrictive, but API accepts nested objects
      const inputArgs = {
        user_id: userId,
        partner_id: partnerId,
        partner_profile: apiFormat,
      } as unknown as TTaskInputArgs;

      // Call the service with high priority as specified
      const profileResponse =
        await userService.updatePartnerProfile<TCommonResponse>(
          inputArgs,
          "high"
        );

      // Handle voice audio upload if provided
      if (voiceAudio) {
        try {
          const voicePayload: TTaskInputArgs = {
            user_id: userId,
            partner_id: partnerId,
            audio_base64: voiceAudio.base64,
            audio_format: voiceAudio.format,
            metadata: JSON.stringify({ source: "upload" }),
          } as unknown as TTaskInputArgs;

          await userService.createPartnerVoiceProfile(voicePayload, "high");
        } catch (voiceError) {
          console.error("Failed to upload voice:", voiceError);
          // Don't fail the entire update if voice upload fails
          toast.error("Profile updated, but voice upload failed", {
            description:
              voiceError instanceof Error
                ? voiceError.message
                : "Could not upload voice recording",
          });
        }
      }

      return profileResponse;
    },
    onSuccess: (data, variables) => {
      // Invalidate the partner profile query cache to refetch fresh data
      let partnerId: string | undefined;
      if (
        typeof variables === "object" &&
        variables !== null &&
        "draft" in variables
      ) {
        partnerId = variables.draft.id;
      } else if ("id" in variables) {
        partnerId = variables.id;
      }

      if (partnerId && userId) {
        queryClient.invalidateQueries({
          queryKey: ["partner-profile", partnerId, userId],
        });
      }

      // Call optional success callback
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      // Call optional error callback
      options?.onError?.(error);
    },
  });

  return {
    ...mutation,
    // Convenience aliases for common state properties
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};
