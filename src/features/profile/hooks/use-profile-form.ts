import { useMemo, useRef, useEffect } from "react";
import { useUserProfile } from "./use-user-profile";
import { useUpdateProfile } from "./use-update-profile";
import { profileToFormData } from "../utils/transform";
import { TProfileFormData } from "../types";

/**
 * Unified hook for profile form operations
 * Combines data fetching and updating with memoized transformations
 * Tracks initial form values for change detection
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

  // Track initial values for change detection
  const initialValuesRef = useRef<TProfileFormData | null>(null);
  const previousFormDataRef = useRef<string>("");

  // Update initial values when formData changes (after fetch or successful update)
  useEffect(() => {
    if (formData && !isFetching) {
      const currentFormDataString = JSON.stringify(formData);
      // Update initial values when data changes (first load or after successful update)
      if (previousFormDataRef.current !== currentFormDataString) {
        initialValuesRef.current = { ...formData };
        previousFormDataRef.current = currentFormDataString;
      }
    }
  }, [formData, isFetching]);

  const handleSubmit = async (data: TProfileFormData) => {
    // Pass both current and initial values for change detection
    await updateProfileAsync(data, initialValuesRef.current);
  };

  return {
    formData,
    initialValues: initialValuesRef.current,
    isLoading: isFetching || isUpdating,
    isFetching,
    isUpdating,
    error: fetchError || updateError,
    handleSubmit,
    isSuccess,
    reset,
  };
};
