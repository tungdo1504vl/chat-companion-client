"use client";

import { ArrowLeft, MoreVertical, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/libs/better-auth/client";

interface ProfileHeaderProps {
  readonly onBackClick?: () => void;
  readonly onMenuClick?: () => void;
  readonly onAvatarEditClick?: () => void;
  readonly isLoading?: boolean;
}

export default function ProfileHeader({
  onBackClick,
  onMenuClick,
  onAvatarEditClick,
  isLoading = false,
}: Readonly<ProfileHeaderProps>) {
  const { data: session } = useSession();

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={onBackClick}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold">My Profile</h1>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={onMenuClick}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center space-y-3 mb-6 px-4 pt-6">
        <div className="relative">
          {isLoading ? (
            <Skeleton className="h-24 w-24 rounded-full" />
          ) : (
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage
                src={session?.user?.image || "/images/placeholder-avatar.png"}
                alt="Profile"
              />
              <AvatarFallback>{session?.user?.name}</AvatarFallback>
            </Avatar>
          )}
          {!isLoading && (
            <Button
              variant="default"
              size="icon"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary"
              onClick={onAvatarEditClick}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="text-center space-y-1">
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <h2 className="text-2xl font-bold">{session?.user?.name}</h2>
          )}
        </div>
      </div>
    </>
  );
}
