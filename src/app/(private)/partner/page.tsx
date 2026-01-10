import { PartnerProfileClient } from "@/features/profile/partner/partner-profile-client";
import { PartnerProfileStoreProvider } from "@/features/profile/partner/store/partner-profile-store-provider";

export default function PartnerPage() {
  return (
    <PartnerProfileStoreProvider>
      <PartnerProfileClient />
    </PartnerProfileStoreProvider>
  );
}
