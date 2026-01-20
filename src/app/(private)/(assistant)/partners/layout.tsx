import { PartnerStoreProvider } from "@/stores/partner/provider";


export default function PartnersLayout({ children }: { children: React.ReactNode }) {
    return (
        <PartnerStoreProvider>
            {children}
        </PartnerStoreProvider>
    );
}