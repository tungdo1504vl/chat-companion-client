import { createStore } from "zustand/vanilla";
import { TPartner, TPartnerStore } from "./types";
import { defaultPartnerStoreState } from "./const";
import { partnerProfileToTPartner } from "./mock-data";
import type { PartnerProfile } from "@/features/profile/partner/types";

export const createPartnerStore = () => {
    return createStore<TPartnerStore>((set, get) => ({
        ...defaultPartnerStoreState,
        setPartners: (partners: TPartner[]) => set({ partners }),
        setLoading: (loading: boolean) => set({ isLoading: loading }),
        initialize: () => set({ isInitialized: true }),
        addPartner: (partner: TPartner) => set((state) => ({ partners: [...state.partners, partner] })),
        /**
         * Add a partner from PartnerProfile format
         * Converts PartnerProfile to TPartner format automatically
         * This ensures consistency when creating new partners
         */
        addPartnerFromProfile: (profile: PartnerProfile) => {
            const partner = partnerProfileToTPartner(profile);
            set((state) => ({ partners: [...state.partners, partner] }));
        },
        getPartnerById: (partnerId: string) => {
            const state = get();
            return state.partners.find((p) => p.partner_id === partnerId);
        },
    }));
}

export type TCreatePartnerStore = ReturnType<typeof createPartnerStore>;