import { useQuery } from "@/libs/react-query";
import { useSession } from "@/libs/better-auth/client";
import userService from "@/services/user.service";
import type {
  PartnerProfile,
  PartnerProfileApiResponse,
  PartnerProfileApiWrapper,
} from "../types";
import type { TCommonResponse } from "@/services/types";
import { apiResponseToPartnerProfile } from "../utils/transform";

/**
 * Hook to fetch partner profile by ID
 * Uses react-query for caching and state management
 *
 * @param partnerId - The ID of the partner profile to fetch
 * @param userId - Optional user ID to include in the query key and request
 * @returns Partner profile data with loading and error states
 */
export const useGetPartnerProfile = (
  partnerId: string | undefined,
  userId?: string | undefined
) => {
  const { data: session } = useSession();
  const currentUserId = userId ?? session?.user?.id;

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery<
    TCommonResponse<PartnerProfileApiWrapper | PartnerProfileApiResponse>,
    Error,
    PartnerProfile | null
  >({
    queryKey: ["partner-profile", partnerId, currentUserId],
    queryFn: () =>
      userService.getPartnerProfile<
        PartnerProfileApiWrapper | PartnerProfileApiResponse
      >({ partner_id: partnerId!, user_id: currentUserId || "" }, "medium"),
    select: (data) => {
      if (!data?.result) {
        return null;
      }

      const result = data.result;

      // Handle wrapped response: { partner_id: string, partner_profile: {...} }
      let apiResponse: PartnerProfileApiResponse;
      if (
        typeof result === "object" &&
        result !== null &&
        "partner_profile" in result &&
        result.partner_profile
      ) {
        // Wrapped response: { partner_id, partner_profile }
        const wrapper = result as PartnerProfileApiWrapper;
        apiResponse = wrapper.partner_profile;
      } else {
        // Direct response: PartnerProfileApiResponse
        apiResponse = result as PartnerProfileApiResponse;
      }

      console.log("apiResponse", apiResponse);
      // Transform API response to PartnerProfile
      return apiResponseToPartnerProfile(apiResponse);
    },
    enabled: Boolean(partnerId && currentUserId),
  });

  console.log("profile", profile);

  return {
    profile,
    isLoading,
    error: error ?? null,
  };
};

/**
 * @deprecated Use useGetPartnerProfile instead
 * Kept for backward compatibility
 */
export const usePartnerProfile = useGetPartnerProfile;
