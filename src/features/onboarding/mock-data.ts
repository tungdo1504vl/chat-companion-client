"use client";

import React from "react";
import type { UserProfileAnalysisResponse } from "@/stores/types";
import { useProfileAnalysisStore } from "@/stores/profile-analysis.store";

/**
 * Mock data for testing the astrology chart screen
 * This matches the UserProfileAnalysisResponse structure
 * 
 * Big Three:
 * - Sun: Leo
 * - Moon: Pisces  
 * - Rising: Libra
 */
export const mockProfileAnalysisData: UserProfileAnalysisResponse = {
  profile: {
    user_id: "mock-user-123",
    basic_info: {
      name: "Alex Johnson",
      avatar_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuArXd0uh_b5aeki52B95_7Y0hVu8CMOzFOKd4672EK1kuN8wB7ua6QKNbd6sIOpiFQktPyamPscJM4ivNH4YMkpwNOUfH1iNAIKMJGo69sKN7UihRzGnyCLjQnJG-Naoam5ZEmrE0ejzIX-4WPAwFuK60V8W0AKtwJkIe6qRCoqNVPTXBf5IlC2YnuMFMNESJvJqeWcJJFZcfpQjoLANsoyj9Hc6VzFhyTb7zvq8UsasfRFSpuoqyNs12z78j8f2J2Y-yEts5PhnYFB",
      gender: "example_Gender",
      dob: "1995-08-15",
      time_of_birth: "14:30:00",
      country_of_birth: "United States",
      city_of_birth: "New York",
    },
    personality: {
      love_languages: ["Words of Affirmation", "Quality Time"],
      communication_styles: ["Direct", "Expressive"],
      attachment_style: "Secure",
      deal_breakers: ["Dishonesty", "Lack of ambition"],
    },
    lifestyle: {
      work_schedule: "9-5",
      date_budget: 150,
      social_energy_level: "High",
      hobbies: ["Reading", "Yoga", "Travel"],
    },
    social_links: {
      instagram: "@alexjohnson",
      facebook: "",
      threads: "",
      tiktok: "",
    },
    primary_love_language: "Words of Affirmation",
    communication_styles: ["Direct", "Expressive"],
    attachment_style: "Secure",
    deal_breakers: ["Dishonesty", "Lack of ambition"],
    work_schedule: "9-5",
    date_budget: 150,
    social_energy: "High",
    hobbies: ["Reading", "Yoga", "Travel"],
    instagram_linked: true,
    facebook_linked: false,
    threads_linked: false,
  },
  natal_chart: {
    formatVersion: 1,
    type: "natal",
    chart: {
      birth: {
        utc_time: "1995-08-15T18:30:00Z",
        local_time: "1995-08-15T14:30:00",
      },
      location: {
        latitude: 40.7128,
        longitude: -74.006,
      },
      meta: {
        house_system: "Placidus",
        aspect_orbs: {
          conjunction: 8,
          opposition: 8,
          square: 8,
          trine: 8,
          sextile: 6,
          semisextile: 3,
          quincunx: 3,
        },
        ephemeris: "swiss",
        near_cusp_tol_deg: 5,
      },
      planets: {
        Sun: {
          sign: "Leo",
          degree: 22.5,
          house: 5,
          longitude: 142.5,
          ecliptic_latitude: 0,
          retrograde: false,
          near_cusp: false,
          dist_to_cusp_deg: 0,
        },
        Moon: {
          sign: "Pisces",
          degree: 15.3,
          house: 12,
          longitude: 345.3,
          ecliptic_latitude: 0,
          retrograde: false,
          near_cusp: false,
          dist_to_cusp_deg: 0,
        },
        Mercury: {
          sign: "Virgo",
          degree: 8.2,
          house: 6,
          longitude: 158.2,
          ecliptic_latitude: 0,
          retrograde: false,
          near_cusp: false,
          dist_to_cusp_deg: 0,
        },
        Venus: {
          sign: "Cancer",
          degree: 28.7,
          house: 4,
          longitude: 118.7,
          ecliptic_latitude: 0,
          retrograde: false,
          near_cusp: false,
          dist_to_cusp_deg: 0,
        },
        Mars: {
          sign: "Aries",
          degree: 12.1,
          house: 1,
          longitude: 12.1,
          ecliptic_latitude: 0,
          retrograde: false,
          near_cusp: false,
          dist_to_cusp_deg: 0,
        },
        Jupiter: {
          sign: "Sagittarius",
          degree: 5.8,
          house: 9,
          longitude: 245.8,
          ecliptic_latitude: 0,
          retrograde: false,
          near_cusp: false,
          dist_to_cusp_deg: 0,
        },
        Saturn: {
          sign: "Pisces",
          degree: 18.4,
          house: 12,
          longitude: 348.4,
          ecliptic_latitude: 0,
          retrograde: false,
          near_cusp: false,
          dist_to_cusp_deg: 0,
        },
        Uranus: {
          sign: "Aquarius",
          degree: 22.9,
          house: 11,
          longitude: 322.9,
          ecliptic_latitude: 0,
          retrograde: false,
          near_cusp: false,
          dist_to_cusp_deg: 0,
        },
        Neptune: {
          sign: "Capricorn",
          degree: 25.6,
          house: 10,
          longitude: 295.6,
          ecliptic_latitude: 0,
          retrograde: false,
          near_cusp: false,
          dist_to_cusp_deg: 0,
        },
        Pluto: {
          sign: "Scorpio",
          degree: 2.3,
          house: 8,
          longitude: 212.3,
          ecliptic_latitude: 0,
          retrograde: false,
          near_cusp: false,
          dist_to_cusp_deg: 0,
        },
        Chiron: {
          sign: "Libra",
          degree: 10.5,
          house: 7,
          longitude: 190.5,
          ecliptic_latitude: 0,
          retrograde: false,
          near_cusp: false,
          dist_to_cusp_deg: 0,
        },
        NorthNode: {
          sign: "Capricorn",
          degree: 14.2,
          house: 10,
          longitude: 284.2,
          ecliptic_latitude: 0,
          retrograde: true,
          near_cusp: false,
          dist_to_cusp_deg: 0,
        },
      },
      aspects: [
        {
          from_: "Sun",
          to: "Moon",
          type: "trine",
          orb: 2.8,
          from_sign: "Leo",
          from_degree_in_sign: 22,
          to_sign: "Pisces",
          to_degree_in_sign: 15,
        },
        {
          from_: "Venus",
          to: "Mars",
          type: "sextile",
          orb: 1.4,
          from_sign: "Cancer",
          from_degree_in_sign: 28,
          to_sign: "Aries",
          to_degree_in_sign: 12,
        },
      ],
      digest: {
        label: "Natal Chart",
        asc: "Libra",
        mc: "Cancer",
        planetHints: ["Sun in Leo", "Moon in Pisces", "Rising in Libra"],
      },
    },
  },
  insights: {
    analysis_text: `With your Sun in Leo, you radiate a natural warmth and charisma that draws others toward you. You are expressive, generous, and thrive when you can share your creative spark with the world. Your confidence is magnetic, and you have a natural ability to inspire and lead others.

In relationships, your Moon in Pisces brings a profound emotional depth. You value soulful connections and are highly empathetic to the feelings of others. Your intuitive nature allows you to understand your partner's needs even before they express them, creating a nurturing and supportive bond.

Your Rising sign in Libra gives you an elegant and charming first impression. You have a natural sense of balance and harmony, and you're drawn to beauty in all its forms. People are immediately drawn to your diplomatic nature and your ability to see multiple perspectives in any situation.

Together, these three placements create a personality that is both confident and compassionate, creative and intuitive, strong and gentle. You bring warmth and understanding to every relationship, making you a truly magnetic and beloved presence in the lives of those around you.`,
  },
  warnings: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Utility function to inject mock data into the profile analysis store
 * Useful for testing the astrology chart screen without making API calls
 * 
 * Usage in a component:
 * ```tsx
 * import { useMockProfileAnalysis } from "@/features/onboarding/mock-data";
 * 
 * // In your component:
 * useMockProfileAnalysis();
 * ```
 */
export function useMockProfileAnalysis() {
  const setProfileAnalysis = useProfileAnalysisStore(
    (state) => state.setProfileAnalysis
  );

  // Inject mock data on mount
  React.useEffect(() => {
    setProfileAnalysis(mockProfileAnalysisData);
  }, [setProfileAnalysis]);
}
