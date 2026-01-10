"use client";

import { useStore } from "zustand";
import type { PartnerProfileStore } from "./partner-profile-store";
import { useContext } from "react";
import { PartnerProfileStoreContext } from "./partner-profile-store-provider";
// Hook to use the store with a selector
// Uses useSyncExternalStore with cached getServerSnapshot for SSR compatibility
export const usePartnerProfileStore = <T>(
  selector: (store: PartnerProfileStore) => T
): T => {
  const storeContext = useContext(PartnerProfileStoreContext);
  if (!storeContext) {
    throw new Error(
      `usePartnerProfileStore must be used within PartnerProfileStoreProvider`
    );
  }

  return useStore(storeContext, selector);
};
