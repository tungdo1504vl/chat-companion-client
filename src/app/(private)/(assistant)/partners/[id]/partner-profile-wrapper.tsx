"use client";

import { PartnerProfileClient } from "@/features/profile/partner/partner-profile-client";
import { usePartnerProfile } from "@/features/profile/partner/hooks/use-partner-profile";
import { MOCK_PARTNER_PROFILE } from "@/features/profile/partner/const";

type PartnerProfileWrapperProps = Readonly<{
  partnerId: string;
  userId?: string;
}>;

export function PartnerProfileWrapper({
  partnerId,
  userId,
}: PartnerProfileWrapperProps) {
  const { profile, isLoading, error } = usePartnerProfile(partnerId, userId);

  // Show loading state (optional - you might want a proper loading component)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading partner profile...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive mb-2">
            Failed to load partner profile
          </p>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "An error occurred"}
          </p>
        </div>
      </div>
    );
  }

  // Use fetched profile or fallback to mock (for development)
  const profileToDisplay = profile ?? MOCK_PARTNER_PROFILE;

  return <PartnerProfileClient profile={profileToDisplay} />;
}
