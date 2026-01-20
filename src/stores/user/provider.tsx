'use client'
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";
import { createUserStore, TCreateUserStore } from "./store";
import { TUserStore } from "./types";

const UserStoreContext = createContext<TCreateUserStore | undefined>(undefined);

export const UserStoreProvider = ({ children }: { children: React.ReactNode }) => {
    const userStore = useRef<TCreateUserStore>(undefined);

    userStore.current ??= createUserStore();


    return (
        <UserStoreContext.Provider value={userStore.current}>
            {children}
        </UserStoreContext.Provider>
    )
}


export const useUserStoreState = <T,>(selector: (state: TUserStore) => T): T => {
    const userStore = useContext(UserStoreContext);
    if (!userStore) {
        throw new Error("useUserStoreState must be used within UserStoreProvider");
    }
    return useStore(userStore, selector);
}