"use client";

import { PartnerProfileClient } from "@/features/profile/partner/partner-profile-client";
import { MOCK_PARTNER_PROFILE } from "@/stores/partner/mock-data";

type PartnerProfileWrapperProps = Readonly<{
  partnerId: string;
  userId?: string;
}>;

export function PartnerProfileWrapper({
  partnerId,
  userId,
}: PartnerProfileWrapperProps) {
  // Note: The store contains TPartner (simplified format with basic info only)
  // PartnerProfileClient requires full PartnerProfile with all fields (goals, personality, etc.)
  // Since TPartner cannot be converted to PartnerProfile, we use MOCK_PARTNER_PROFILE
  // 
  // Future improvement: Store full PartnerProfile in store or fetch from API when needed
  const profileToDisplay = MOCK_PARTNER_PROFILE;

  return <PartnerProfileClient profile={profileToDisplay} />;
}
