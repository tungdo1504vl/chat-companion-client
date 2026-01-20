import { createStore } from "zustand/vanilla";
import { TPartner, TPartnerStore } from "./types";
import { defaultPartnerStoreState } from "./const";

export const createPartnerStore = () => {
    return createStore<TPartnerStore>((set, get) => ({
        ...defaultPartnerStoreState,
        setPartners: (partners: TPartner[]) => set({ partners }),
        setLoading: (loading: boolean) => set({ isLoading: loading }),
        initialize: () => set({ isInitialized: true }),
        addPartner: (partner: TPartner) => set((state) => ({ partners: [...state.partners, partner] })),
    }));
}

export type TCreatePartnerStore = ReturnType<typeof createPartnerStore>;