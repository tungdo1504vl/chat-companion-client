"use client";

import { cn } from "@/libs/tailwind/utils";
import type { PartnerProfile } from "../../types";
import { MobileHeader } from "@/components/commons/mobile-header";
import ProfileHeader from "@/features/profiles/common/header/profile-header";

interface PartnerProfileHeaderProps {
  profile: PartnerProfile;
  className?: string;
}

export function PartnerProfileHeader({
  profile,
  className,
}: PartnerProfileHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Top bar with back button, title, and menu */}
      <MobileHeader title="Partner Profile" isHaveBackButton />

      {/* Profile info */}
      <ProfileHeader profile={profile} />
    </div>
  );
}
