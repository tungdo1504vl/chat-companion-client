export type TProfileFormData = {
  primaryLoveLanguage: string;
  communicationStyles: string[];
  attachmentStyle: string;
  dealBreakers: string[];
  workSchedule: string;
  dateBudget: number;
  socialEnergy: string;
  hobbies: string[];
  instagramUrl: string;
};

export type TProfileFormProps = {
  onSubmit?: (data: TProfileFormData) => void;
  isLoading?: boolean;
  isSuccess?: boolean;
  defaultValues?: Partial<TProfileFormData>;
};

/**
 * Backend API response types for user profile
 */
export type TGender = "example_Gender";

export interface TBasicInfo {
  name: string;
  avatar_url: string;
  gender: TGender;
  dob: string;
  time_of_birth: string;
  country_of_birth: string;
  city_of_birth: string;
}

export interface TPersonality {
  love_languages: string[];
  communication_styles: string[];
  attachment_style: string;
  deal_breakers: string[];
}

export interface TLifestyle {
  work_schedule: string;
  date_budget: number;
  social_energy_level: string;
  hobbies: string[];
}

export interface TSocialLinks {
  instagram: string;
}

export interface TUserProfile {
  user_id: string;
  basic_info: TBasicInfo;
  personality: TPersonality;
  lifestyle: TLifestyle;
  social_links: TSocialLinks;
  primary_love_language: string;
  communication_styles: string[];
  attachment_style: string;
  deal_breakers: string[];
  work_schedule: string;
  date_budget: number;
  social_energy: string;
  hobbies: string[];
}

export interface TNatalChartMeta {
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
}

export interface TPlanetPosition {
  sign: string;
  degree: number;
  house: number;
  longitude: number;
  ecliptic_latitude: number;
  retrograde: boolean;
  near_cusp: boolean;
  dist_to_cusp_deg: number;
}

export interface TAspect {
  from_: string;
  to: string;
  type: string;
  orb: number;
  from_sign: string;
  from_degree_in_sign: number;
  to_sign: string;
  to_degree_in_sign: number;
}

export interface TChartDigest {
  label: string;
  asc: string;
  mc: string;
  planetHints: string[];
}

export interface TNatalChart {
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
    meta: TNatalChartMeta;
    planets: Record<string, TPlanetPosition>;
    aspects: TAspect[];
    digest: TChartDigest;
  };
}

export interface TInsights {
  analysis_text: string;
}

/**
 * Complete backend API response for user profile
 */
export interface TUserProfileResponse {
  user_id: string;
  profile: TUserProfile;
  natal_chart: TNatalChart;
  insights: TInsights;
  created_at: string;
  updated_at: string;
}

/**
 * Session user data from authentication
 */
export interface TSessionUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

/**
 * Unified user object combining session data with profile data
 */
export interface TUnifiedUser {
  // Session data (always available when authenticated)
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  // Profile data (from backend API)
  profile: TUserProfile | null;
  natal_chart: TNatalChart | null;
  insights: TInsights | null;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Profile update payload structure matching API expectations
 * All fields are nested under profile_update to match the user profile structure
 * Only includes fields that have changed
 */
export interface TProfileUpdatePayload {
  user_id: string;
  profile_update?: {
    basic_info?: {
      name?: string;
      avatar_url?: string;
      gender?: TGender;
      dob?: string;
      time_of_birth?: string;
      country_of_birth?: string;
      city_of_birth?: string;
    };
    personality?: {
      love_languages?: string[];
      communication_styles?: string[];
      attachment_style?: string;
      deal_breakers?: string[];
    };
    lifestyle?: {
      work_schedule?: string;
      date_budget?: number;
      social_energy_level?: string;
      hobbies?: string[];
    };
    social_links?: {
      instagram?: string;
    };
    primary_love_language?: string;
  };
}
