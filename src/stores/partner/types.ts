

/**
 * Partner data structure matching the format used in partners list page
 */
export type TPartner = {
    partner_id: string;
    avatarUrl?: string;
    partner_profile: {
      basic_info: {
        name: string;
        dob: string;
        country_of_birth: string;
        city_of_birth?: string;
        age?: number;
        social_link?: string;
      };
    };
  };
  


export type TPartnerStoreState = {
    partners: TPartner[];
    isLoading: boolean;
    isInitialized: boolean;

}

import type { PartnerProfile } from "@/features/profile/partner/types";

export type TPartnerStoreAction = {
    setPartners: (partners: TPartner[]) => void;
    setLoading: (loading: boolean) => void;
    addPartner: (partner: TPartner) => void;
    addPartnerFromProfile: (profile: PartnerProfile) => void;
    initialize: () => void;
}
export type TPartnerStore = TPartnerStoreState & TPartnerStoreAction;