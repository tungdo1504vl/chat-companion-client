import { PartnerProfileClient } from "@/features/profiles/partner/partner-profile-client";
import { PartnerProfileStoreProvider } from "@/features/profiles/partner/store/partner-profile-store-provider";

export default function PartnerPage() {
  return (
    <PartnerProfileStoreProvider>
      <PartnerProfileClient />
    </PartnerProfileStoreProvider>
  );
}
