import type { User } from "@/libs/better-auth/types";

/**
 * Profile information from user_profile_analyze response
 */
export interface UserProfileInfo {
  user_id: string;
  basic_info: {
    name: string;
    avatar_url: string;
    gender: string;
    dob: string;
    time_of_birth: string;
    country_of_birth: string;
    city_of_birth: string;
  };
  personality: {
    love_languages: string[];
    communication_styles: string[];
    attachment_style: string;
    deal_breakers: string[];
  };
  lifestyle: {
    work_schedule: string;
    date_budget: number;
    social_energy_level: string;
    hobbies: string[];
  };
  social_links: {
    instagram: string;
    facebook: string;
    threads: string;
    tiktok: string;
  };
  primary_love_language: string;
  communication_styles: string[];
  attachment_style: string;
  deal_breakers: string[];
  work_schedule: string;
  date_budget: number;
  social_energy: string;
  hobbies: string[];
  instagram_linked: boolean;
  facebook_linked: boolean;
  threads_linked: boolean;
}

/**
 * Natal chart data from user_profile_analyze response
 */
export interface NatalChart {
  formatVersion: number;
  type: string;
  chart: {
    birth: {
      utc_time: string;
      local_time: string;
    };
    location: {
      latitude: number;
      longitude: number;
    };
    meta: {
      house_system: string;
      aspect_orbs: {
        conjunction: number;
        opposition: number;
        square: number;
        trine: number;
        sextile: number;
        semisextile: number;
        quincunx: number;
      };
      ephemeris: string;
      near_cusp_tol_deg: number;
    };
    planets: Record<
      string,
      {
        sign: string;
        degree: number;
        house: number;
        longitude: number;
        ecliptic_latitude: number;
        retrograde: boolean;
        near_cusp: boolean;
        dist_to_cusp_deg: number;
      }
    >;
    aspects: Array<{
      from_: string;
      to: string;
      type: string;
      orb: number;
      from_sign: string;
      from_degree_in_sign: number;
      to_sign: string;
      to_degree_in_sign: number;
    }>;
    digest: {
      label: string;
      asc: string;
      mc: string;
      planetHints: string[];
    };
  };
}

/**
 * Insights from user_profile_analyze response
 */
export interface UserProfileInsights {
  analysis_text: string;
}

/**
 * Complete user profile analysis response structure
 */
export interface UserProfileAnalysisResponse {
  profile: UserProfileInfo;
  natal_chart: NatalChart;
  insights: UserProfileInsights;
  warnings: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Auth user store state
 */
export interface AuthUserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Profile analysis store state
 */
export interface ProfileAnalysisState {
  profileAnalysis: UserProfileAnalysisResponse | null;
  isLoading: boolean;
  setProfileAnalysis: (data: UserProfileAnalysisResponse) => void;
  clearProfileAnalysis: () => void;
  setLoading: (loading: boolean) => void;
}

