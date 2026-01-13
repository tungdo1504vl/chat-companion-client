import { Skeleton } from "@/components/ui/skeleton";

export function PartnerProfileSkeleton() {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header Skeleton */}
      <div className="px-6 pt-4 pb-2 flex items-center justify-between">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <div className="space-y-6 py-6">
          {/* Profile Header Skeleton */}
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="w-24 h-24 rounded-full" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Content Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-6 w-full mt-6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
