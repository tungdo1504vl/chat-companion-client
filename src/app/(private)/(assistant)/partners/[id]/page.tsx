import { Suspense } from "react";
import { PartnerProfileStoreProvider } from "@/features/profile/partner/store/partner-profile-store-provider";
import { PartnerProfileWrapper } from "./partner-profile-wrapper";
import { PartnerProfileSkeleton } from "./partner-profile-skeleton";

type PartnerPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export default async function PartnerPage({ params }: PartnerPageProps) {
  const partnerParams = await params;
  const partnerId = partnerParams.id;

  return (
    <PartnerProfileStoreProvider>
      <Suspense fallback={<PartnerProfileSkeleton />}>
        <PartnerProfileWrapper partnerId={partnerId} />
      </Suspense>
    </PartnerProfileStoreProvider>
  );
}
