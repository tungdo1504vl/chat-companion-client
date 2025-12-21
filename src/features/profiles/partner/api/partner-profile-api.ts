import type { PartnerProfile } from "../types";

/**
 * Mock API service for partner profile operations
 * TODO: Replace with real API calls when backend is ready
 */

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
  // Simulate API delay
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
 * @param profileId - The ID of the profile to fetch
 * @returns Promise with profile or error
 */
export async function fetchPartnerProfile(
  profileId: string
): Promise<PartnerProfile> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock response - in real implementation, this would fetch from API
  throw new Error("fetchPartnerProfile not implemented - use initial profile");
}

