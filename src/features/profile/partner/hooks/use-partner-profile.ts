import { useQuery } from "@/libs/react-query";
import { useSession } from "@/libs/better-auth/client";
import userService from "@/services/user.service";
import type { PartnerProfile, PartnerProfileApiResponse } from "../types";
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
export const usePartnerProfile = (
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
    TCommonResponse<PartnerProfileApiResponse>,
    Error,
    PartnerProfile | null
  >({
    queryKey: ["partner-profile", partnerId, currentUserId],
    queryFn: () =>
      userService.getPartnerProfile<PartnerProfileApiResponse>(
        { partner_id: partnerId!, user_id: currentUserId || "" },
        "medium"
      ),
    select: (data) => {
      if (!data?.result) {
        return null;
      }

      // Handle both cases: result directly contains partner_profile object
      // or result is wrapped in a partner_profile key
      const result = data.result as
        | PartnerProfileApiResponse
        | { partner_profile: PartnerProfileApiResponse };

      let apiResponse: PartnerProfileApiResponse;
      if (
        typeof result === "object" &&
        result !== null &&
        "partner_profile" in result &&
        result.partner_profile
      ) {
        // Wrapped response
        apiResponse = result.partner_profile;
      } else {
        // Direct response
        apiResponse = result as PartnerProfileApiResponse;
      }

      // Transform API response to PartnerProfile
      return apiResponseToPartnerProfile(apiResponse);
    },
    enabled: Boolean(partnerId && currentUserId),
  });

  return {
    profile,
    isLoading,
    error: error ?? null,
  };
};
