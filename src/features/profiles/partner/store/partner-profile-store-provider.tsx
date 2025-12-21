"use client";

import { type ReactNode, createContext, useState } from "react";
import {
  type PartnerProfileStoreApi,
  createPartnerProfileStore,
  defaultInitState,
} from "./partner-profile-store";

export const PartnerProfileStoreContext = createContext<
  PartnerProfileStoreApi | undefined
>(undefined);

export interface PartnerProfileStoreProviderProps {
  children: ReactNode;
}

export const PartnerProfileStoreProvider = ({
  children,
}: PartnerProfileStoreProviderProps) => {
  // Create store once per provider instance (per request/route)
  // Using useState ensures the store is only created once and cached
  const [store] = useState(() => createPartnerProfileStore(defaultInitState));

  return (
    <PartnerProfileStoreContext.Provider value={store}>
      {children}
    </PartnerProfileStoreContext.Provider>
  );
};
