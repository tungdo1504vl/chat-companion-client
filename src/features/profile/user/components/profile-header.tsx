"use client";

import { useSession } from "@/libs/better-auth/client";
import { PageHeader } from "@/components/commons/page-header";
import { ProfileInfo } from "@/features/profile/common/header";

interface ProfileHeaderProps {
  readonly onBackClick?: () => void;
  readonly backHref?: string;
  readonly onMenuClick?: () => void;
  readonly onAvatarEditClick?: () => void;
  readonly isLoading?: boolean;
}

export default function ProfileHeader({
  onBackClick,
  backHref,
  onMenuClick,
  onAvatarEditClick,
  isLoading = false,
}: Readonly<ProfileHeaderProps>) {
  const { data: session } = useSession();

  const userName = session?.user?.name || "";
  const userImage = session?.user?.image || undefined;
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <>
      {/* Header */}
      <PageHeader
        title="My Profile"
        onBackClick={onBackClick}
        backHref={backHref}
        onMenuClick={onMenuClick}
      />

      {/* Profile Info */}
      <div className="px-4">
        <ProfileInfo
          name={userName}
          avatarUrl={userImage}
          initials={initials}
          isLoading={isLoading}
          onAvatarEditClick={onAvatarEditClick}
        />
      </div>
    </>
  );
}
