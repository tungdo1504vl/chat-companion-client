import { PartnerProfileStoreProvider } from "@/features/profile/partner/store/partner-profile-store-provider";
import { PartnerProfileWrapper } from "./partner-profile-wrapper";

type PartnerPageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export default async function PartnerPage({ params }: PartnerPageProps) {
  const partnerParams = await params;
  const partnerId = partnerParams.id;

  return (
    <PartnerProfileStoreProvider>
      <PartnerProfileWrapper partnerId={partnerId} />
    </PartnerProfileStoreProvider>
  );
}
