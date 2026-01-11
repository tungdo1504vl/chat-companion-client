"use client";

import { BrainCog, Coffee, Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileFormSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Form Content Skeleton */}
      <div className="space-y-6">
        {/* Personality & Preference Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BrainCog className="h-5 w-5 text-primary" />
            <Skeleton className="h-5 w-48" />
          </div>

          {/* Primary Love Language */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Communication Style */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-36" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-26" />
            </div>
          </div>

          {/* Attachment Style */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Deal-breakers */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Lifestyle Snapshot Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-primary" />
            <Skeleton className="h-5 w-40" />
          </div>

          {/* Work Schedule */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Date Budget */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-2 w-full" />
          </div>

          {/* Social Energy */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Hobbies */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Social Signals Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            <Skeleton className="h-5 w-32" />
          </div>

          {/* Instagram */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </div>
      </div>

      {/* Footer Buttons Skeleton */}
      <div className="flex gap-2 pt-4 mt-6 border-t">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
    </div>
  );
}
