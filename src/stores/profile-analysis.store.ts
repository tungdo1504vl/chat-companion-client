"use client";

import { create } from "zustand";
import type { ProfileAnalysisState } from "./types";

/**
 * Profile analysis store factory function
 * Following Zustand Next.js best practices to avoid SSR hydration issues
 */
const createProfileAnalysisStore = () =>
  create<ProfileAnalysisState>((set) => ({
    profileAnalysis: null,
    isLoading: false,
    setProfileAnalysis: (data) => set({ profileAnalysis: data }),
    clearProfileAnalysis: () => set({ profileAnalysis: null }),
    setLoading: (loading) => set({ isLoading: loading }),
  }));

/**
 * Profile analysis store instance
 * Use this hook in components to access profile analysis state
 */
export const useProfileAnalysisStore = createProfileAnalysisStore();
