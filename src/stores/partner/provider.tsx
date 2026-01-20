'use client'
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import { createPartnerStore, TCreatePartnerStore } from "./store";
import { TPartnerStore } from "./types";

const PartnerStoreContext = createContext<TCreatePartnerStore | undefined>(undefined);

export const PartnerStoreProvider = ({ children }: { children: React.ReactNode }) => {
    const partnerStore = useRef<TCreatePartnerStore>(undefined);

    partnerStore.current ??= createPartnerStore();


    return (
        <PartnerStoreContext.Provider value={partnerStore.current}>
            {children}
        </PartnerStoreContext.Provider>
    )
}


export const usePartnerStoreState = <T,>(selector: (state: TPartnerStore) => T): T => {
    const partnerStore = useContext(PartnerStoreContext);
    if (!partnerStore) {
        throw new Error("usePartnerStoreState must be used within PartnerStoreProvider");
    }
    return useStore(partnerStore, selector);
}