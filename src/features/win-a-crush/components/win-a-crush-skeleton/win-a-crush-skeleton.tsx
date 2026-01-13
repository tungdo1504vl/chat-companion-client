"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function WinACrushSkeleton() {
  return (
    <main className="flex-1 flex flex-col">
      {/* Header Skeleton */}
      <header className="px-8 pt-2 pb-6 flex flex-col items-center text-center h-[25vh] min-h-[180px] justify-center">
        <div className="mb-3">
          <Skeleton className="h-3 w-20 mx-auto" />
        </div>
        <div className="relative mb-3">
          <Skeleton className="w-16 h-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-64 mb-2" />
        <Skeleton className="h-4 w-40" />
      </header>

      {/* Practice Card Skeleton */}
      <section className="px-6 mb-8">
        <div className="bg-white rounded-[32px] p-8 text-center soft-card-shadow border border-romantic-100/50 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-romantic-50 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 space-y-2 mb-8">
            <Skeleton className="h-7 w-48 mx-auto" />
            <Skeleton className="h-4 w-40 mx-auto" />
          </div>
          
          <Skeleton className="w-full h-12 rounded-2xl mb-4" />
          
          <div className="mt-4">
            <Skeleton className="h-3 w-24 mx-auto" />
          </div>
        </div>
      </section>

      {/* What Matters Section Skeleton */}
      <section className="px-8 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-romantic-100"></div>
          <Skeleton className="h-3 w-32" />
          <div className="h-px flex-1 bg-romantic-100"></div>
        </div>
        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <Skeleton className="w-1.5 h-1.5 rounded-full" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </section>

      {/* Alternative Actions Section Skeleton */}
      <section className="pl-8 mb-12">
        <Skeleton className="h-3 w-48 mb-4" />
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pr-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="flex-shrink-0 h-10 w-32 rounded-2xl"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
