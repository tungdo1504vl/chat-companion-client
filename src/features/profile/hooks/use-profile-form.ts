import { useMemo } from "react";
import { useUserProfile } from "./use-user-profile";
import { useUpdateProfile } from "./use-update-profile";
import { profileToFormData } from "../utils/transform";
import { TProfileFormData } from "../types";

/**
 * Unified hook for profile form operations
 * Combines data fetching and updating with memoized transformations
 */
export const useProfileForm = () => {
  const { user, isLoading: isFetching, error: fetchError } = useUserProfile();
  const {
    updateProfileAsync,
    isLoading: isUpdating,
    error: updateError,
    isSuccess,
    reset,
  } = useUpdateProfile();

  // Transform profile data to form data format
  // Memoize to prevent unnecessary re-renders
  const formData: TProfileFormData = useMemo(() => {
    return profileToFormData(user?.profile ?? null);
  }, [user?.profile]);

  const handleSubmit = async (data: TProfileFormData) => {
    await updateProfileAsync(data);
  };

  return {
    formData,
    isLoading: isFetching || isUpdating,
    isFetching,
    isUpdating,
    error: fetchError || updateError,
    handleSubmit,
    isSuccess,
    reset,
  };
};
