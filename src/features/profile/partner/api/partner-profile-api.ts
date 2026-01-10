import userService from "@/services/user.service";
import type { PartnerProfile, PartnerProfileApiResponse } from "../types";
import { apiResponseToPartnerProfile } from "../utils/transform";

export interface SavePartnerProfileResponse {
  success: boolean;
  profile: PartnerProfile;
  message?: string;
}

export interface SavePartnerProfileError {
  success: false;
  error: string;
  message: string;
}

/**
 * Saves partner profile to backend
 * @param profile - The partner profile to save
 * @returns Promise with saved profile or error
 */
export async function savePartnerProfile(
  profile: PartnerProfile
): Promise<SavePartnerProfileResponse> {
  // TODO: Replace with real API call when partner_profile_update is ready
  // For now, simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate random errors (10% chance for demo purposes)
  if (Math.random() < 0.1) {
    throw new Error("Failed to save profile. Please try again.");
  }

  // Mock successful response
  return {
    success: true,
    profile: { ...profile },
    message: "Profile saved successfully",
  };
}

/**
 * Fetches partner profile from backend
 * @param partnerId - The ID of the partner profile to fetch
 * @returns Promise with profile or error
 */
export async function fetchPartnerProfile(
  partnerId: string
): Promise<PartnerProfile> {
  try {
    const response = await userService.getPartnerProfile<PartnerProfileApiResponse>(
      { partner_id: partnerId },
      "medium"
    );

    if (!response.result) {
      throw new Error("Partner profile not found");
    }

    // Handle both cases: result directly contains partner_profile object
    // or result is wrapped in a partner_profile key
    let apiResponse: PartnerProfileApiResponse;
    if (
      typeof response.result === "object" &&
      "partner_profile" in response.result &&
      response.result.partner_profile
    ) {
      // Wrapped response
      apiResponse = response.result.partner_profile as PartnerProfileApiResponse;
    } else {
      // Direct response
      apiResponse = response.result as PartnerProfileApiResponse;
    }

    // Transform API response to PartnerProfile
    return apiResponseToPartnerProfile(apiResponse);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch partner profile";
    throw new Error(errorMessage);
  }
}

