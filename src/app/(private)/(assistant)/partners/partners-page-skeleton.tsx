import { Skeleton } from "@/components/ui/skeleton";
import { Smile } from "lucide-react";

export default function PartnersPageSkeleton() {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header Skeleton */}
      <div className="px-6 pt-4 pb-2 flex items-center justify-between">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 overflow-x-hidden">
        {/* Title Section */}
        <div className="relative mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64 pr-20" />

          {/* Gradient Circle with Smiley */}
          <div className="absolute top-0 right-0 w-40 h-40 -mt-8 -mr-8">
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-blue-200 via-green-200 to-pink-200 blur-3xl opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Smile className="size-16 text-foreground/30" />
            </div>
          </div>
        </div>

        {/* Partner Cards Skeleton */}
        <div className="space-y-3 z-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-lg p-4 flex items-center gap-4"
            >
              <Skeleton className="size-12 rounded-full shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="w-8 h-8 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
