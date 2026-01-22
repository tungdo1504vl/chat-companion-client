"use client";

import { Pencil, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { TProfileInfoProps } from "./types";

const STAGE_LABELS: Record<string, string> = {
  dating: "Dating",
  dating_exclusively: "Dating Exclusively",
  in_a_relationship: "In a Relationship",
  engaged: "Engaged",
  married: "Married",
};

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
  nickname,
}: TProfileInfoProps & { nickname?: string }) {
  const stageLabel = stage ? STAGE_LABELS[stage] || stage : undefined;

  return (
    <section className="flex flex-col items-center pt-4 pb-2">
      <div className="relative mb-4">
        {isLoading ? (
          <Skeleton className="h-28 w-28 rounded-full" />
        ) : (
          <div className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden shadow-xl ring-2 ring-primary/20">
            <Avatar className="h-full w-full">
              <AvatarImage
                src={avatarUrl || "/images/placeholder-avatar.png"}
                alt={name || "Profile"}
                className="object-cover"
              />
              <AvatarFallback className="text-lg">{initials || "?"}</AvatarFallback>
            </Avatar>
          </div>
        )}
        {!isLoading && isPremium && (
          <div className="absolute bottom-1 right-1 bg-yellow-400 text-white p-1 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
            <Star className="size-[14px] fill-white text-white" />
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
      <div className="text-center">
        {isLoading ? (
          <>
            <Skeleton className="h-9 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-32 mx-auto mb-3" />
            <Skeleton className="h-6 w-40 mx-auto" />
          </>
        ) : (
          <>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              {name}
              {/* {nickname && (
                <span className="text-slate-400 font-normal text-xl ">
                  {" "}"{nickname}"
                </span>
              )} */}
            </h2>
            {(age !== undefined || location) && (
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                {age !== undefined && age}
                {age !== undefined && location && " • "}
                {location}
              </p>
            )}
            {stageLabel && (
              <div className="mt-3 inline-block bg-primary/10 dark:bg-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                Stage: {stageLabel}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}