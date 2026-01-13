import { Skeleton } from "@/components/ui/skeleton";

export default function PartnerChatPageSkeleton() {
  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-100 via-blue-100 to-pink-100 -z-10" />

      {/* Header Skeleton */}
      <div className="bg-transparent z-10 relative px-6 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </div>

      {/* Chat Messages Skeleton */}
      <div className="flex-1 min-h-0 overflow-hidden px-2">
        <div className="h-full px-4 py-4 space-y-4">
          {/* Assistant message skeleton */}
          <div className="flex items-start gap-3 justify-start">
            <Skeleton className="w-12 h-12 rounded-full shrink-0" />
            <Skeleton className="max-w-[80%] h-20 rounded-2xl" />
          </div>
          {/* User message skeleton */}
          <div className="flex items-start gap-3 justify-end">
            <Skeleton className="max-w-[80%] h-16 rounded-2xl" />
          </div>
          {/* Another assistant message */}
          <div className="flex items-start gap-3 justify-start">
            <Skeleton className="w-12 h-12 rounded-full shrink-0" />
            <Skeleton className="max-w-[80%] h-24 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Input Bar Skeleton */}
      <div className="px-4 pb-4 pt-2 bg-transparent z-10">
        <div className="flex items-center gap-2">
          <Skeleton className="flex-1 h-10 rounded-full" />
          <Skeleton className="w-20 h-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
