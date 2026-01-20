import { Skeleton } from "@/components/ui/skeleton";

export function PartnerCardSkeleton() {
  return (
    <div className="group relative bg-(--color-card-light) dark:bg-(--color-card-dark) p-4 rounded-2xl shadow-sm border border-transparent">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Skeleton className="size-16 rounded-full shrink-0" />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-muted border-2 border-white dark:border-(--color-card-dark) rounded-full"></div>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>

        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      </div>
    </div>
  );
}
