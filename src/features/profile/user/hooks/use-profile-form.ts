import { useMemo, useRef, useEffect } from "react";
import { useUserStoreState } from "@/stores/user/provider";
import { useUpdateProfile } from "./use-update-profile";
import { profileToFormData } from "../utils/transform";
import { TProfileFormData, TUserProfile } from "../types";

/**
 * Unified hook for profile form operations
 * Combines data fetching and updating with memoized transformations
 * Tracks initial form values for change detection
 */
export const useProfileForm = () => {
  const userInfo = useUserStoreState((state) => state.userInfo);
  const isLoading = useUserStoreState((state) => state.isLoading);
  const loadUserInfo = useUserStoreState((state) => state.loadUserInfo);

  // Load user info on mount if not already loaded
  useEffect(() => {
    if (!userInfo && !isLoading) {
      loadUserInfo();
    }
  }, [userInfo, isLoading, loadUserInfo]);

  const {
    updateProfileAsync,
    isLoading: isUpdating,
    error: updateError,
    isSuccess,
    reset,
  } = useUpdateProfile();

  // Transform profile data to form data format
  // Memoize to prevent unnecessary re-renders
  // Cast UserProfileInfo to TUserProfile as they have compatible structures
  const formData: TProfileFormData = useMemo(() => {
    return profileToFormData((userInfo?.profile ?? null) as TUserProfile | null);
  }, [userInfo?.profile]);

  // Track initial values for change detection
  const initialValuesRef = useRef<TProfileFormData | null>(null);
  const previousFormDataRef = useRef<string>("");

  // Update initial values when formData changes (after fetch or successful update)
  useEffect(() => {
    if (formData && !isLoading) {
      const currentFormDataString = JSON.stringify(formData);
      // Update initial values when data changes (first load or after successful update)
      if (previousFormDataRef.current !== currentFormDataString) {
        initialValuesRef.current = { ...formData };
        previousFormDataRef.current = currentFormDataString;
      }
    }
  }, [formData, isLoading]);

  // Reset initial values after successful update
  useEffect(() => {
    if (isSuccess && formData) {
      initialValuesRef.current = { ...formData };
      previousFormDataRef.current = JSON.stringify(formData);
    }
  }, [isSuccess, formData]);

  const handleSubmit = async (data: TProfileFormData) => {
    // Pass both current and initial values for change detection
    await updateProfileAsync(data, initialValuesRef.current);
  };

  return {
    formData,
    initialValues: initialValuesRef.current,
    isLoading: isLoading || isUpdating,
    isFetching: isLoading,
    isUpdating,
    error: updateError ?? null,
    handleSubmit,
    isSuccess,
    reset,
    refetch: loadUserInfo,
  };
};
