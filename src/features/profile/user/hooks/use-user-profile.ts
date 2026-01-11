import { useQuery } from "@/libs/react-query";
import { useSession } from "@/libs/better-auth/client";
import userService from "@/services/user.service";
import type { TUnifiedUser, TUserProfileResponse } from "../types";
import type { TCommonResponse } from "@/services/types";

/**
 * Hook to centralize user data by combining session data with backend profile data
 *
 * @returns Unified user object with session data (name, email, image) and profile data from backend
 */
export const useUserProfile = () => {
  const { data: session, isPending: isSessionLoading } = useSession();
  const userId = session?.user?.id;

  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    error,
    refetch,
  } = useQuery<TCommonResponse<TUserProfileResponse>>({
    queryKey: ["user-profile", userId],
    queryFn: () =>
      userService.getUserProfile<TUserProfileResponse>(
        { user_id: userId! },
        "medium"
      ),
    enabled: !!userId,
  });

  // Combine session data with profile data
  const user: TUnifiedUser | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? null,
        email: session.user.email ?? "",
        image: session.user.image ?? null,
        profile: profileResponse?.result?.profile ?? null,
        natal_chart: profileResponse?.result?.natal_chart ?? null,
        insights: profileResponse?.result?.insights ?? null,
        created_at: profileResponse?.result?.created_at ?? null,
        updated_at: profileResponse?.result?.updated_at ?? null,
      }
    : null;

  return {
    user,
    isLoading: isSessionLoading || isProfileLoading,
    error: error ?? null,
    refetch,
  };
};
