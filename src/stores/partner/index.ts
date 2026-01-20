/**
 * Centralized partner store exports
 * This is the single source of truth for partner-related data and utilities
 */

// Mock data exports
export { MOCK_PARTNER_PROFILE, partnerProfileToTPartner, getMockPartnerAsTPartner } from "./mock-data";

// Store state exports
export { initialMockPartners, defaultPartnerStoreState } from "./const";

// Store creation exports
export { createPartnerStore, type TCreatePartnerStore } from "./store";

// Type exports
export type { TPartner, TPartnerStore, TPartnerStoreState, TPartnerStoreAction } from "./types";
