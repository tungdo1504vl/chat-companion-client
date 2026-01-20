
import type { UserProfileAnalysisResponse } from "@/stores/types";

export type TUserInfo = UserProfileAnalysisResponse;

export type TUserStoreState = { 
    userInfo: TUserInfo | null;
    isLoading: boolean;
}

export type TUserStoreAction = {
    setUserInfo: (userInfo: TUserInfo | null) => void;
    loadUserInfo: () => Promise<void>;
    clearUserInfo: () => void;
    setLoading: (loading: boolean) => void;
}

export type TUserStore = TUserStoreState & TUserStoreAction;