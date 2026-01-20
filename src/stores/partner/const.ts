import { TPartner, TPartnerStoreState } from "./types";
import { getMockPartnerAsTPartner } from "./mock-data";

/**
 * Initial mock partners for the store
 * Uses centralized mock data to ensure consistency
 */
export const initialMockPartners: TPartner[] = [
  getMockPartnerAsTPartner(),
];

export const defaultPartnerStoreState: TPartnerStoreState = {
  partners: initialMockPartners,
  isLoading: false,
  isInitialized: false,
};