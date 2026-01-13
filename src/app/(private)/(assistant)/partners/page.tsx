import { Suspense } from "react";
import PartnersPageClient from "./partners-page-client";
import PartnersPageSkeleton from "./partners-page-skeleton";

export default function PartnersPage() {
  return (
    <Suspense fallback={<PartnersPageSkeleton />}>
      <PartnersPageClient />
    </Suspense>
  );
}
