"use client";

import { Pencil, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { TProfileInfoProps } from "./types";

export function ProfileInfo({
  name,
  avatarUrl,
  initials,
  isLoading = false,
  onAvatarEditClick,
  age,
  location,
  stage,
  isPremium = false,
}: TProfileInfoProps) {
  return (
    <div className="flex flex-col items-center space-y-3 mb-6 pt-6">
      <div className="relative">
        {isLoading ? (
          <Skeleton className="h-24 w-24 rounded-full" />
        ) : (
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage
              src={avatarUrl || "/images/placeholder-avatar.png"}
              alt={name || "Profile"}
            />
            <AvatarFallback>{initials || "?"}</AvatarFallback>
          </Avatar>
        )}
        {!isLoading && isPremium && (
          <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
            <div className="rounded-full bg-yellow-400 p-1">
              <Star className="size-3 fill-yellow-400 text-yellow-600" />
            </div>
          </div>
        )}
        {!isLoading && onAvatarEditClick && (
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
          <h2 className="text-2xl font-bold">{name}</h2>
        )}
        {!isLoading && (age !== undefined || location) && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            {age !== undefined && <span>{age}</span>}
            {age !== undefined && location && <span>•</span>}
            {location && <span>{location}</span>}
          </div>
        )}
      </div>
      {!isLoading && stage && (
        <Badge variant="default" className="rounded-full px-3 py-1">
          Stage: {stage}
        </Badge>
      )}
    </div>
  );
}