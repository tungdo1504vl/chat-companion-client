import { createStore } from "zustand/vanilla";
import type { TUserStore } from "./types";
import { defaultUserStoreState } from "./const";
import type { UserProfileAnalysisResponse } from "@/stores/types";

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
      name: "Huy",
      avatar_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDdMVFtQ4CHYzz3feuBSCm1lt3CXPX73Mq-A-RiOlHt_HfRq3G6qtuMIMQ4mkABYWvYLWQrYAXHrgOXmbFIHTC5pk3nMux-bMkrJcCsoVBPA9Ki1ptCvrjlsrKuADoVNrgvhxgmHaPzKECTFIZCDe1kzh4zUzy8G6yG3nZuRycDqq9lP1amCBP9UOdfNLK03hXDE8n74qEcHSFTnfJz6a3viH4KjwTlSTM4S6-aDIvlX7eh1eBBRwKuLWuX0EdI4VR0MmXjXqXrufMD",
      gender: "example_Gender",
      dob: "1990-02-02",
      time_of_birth: "14:30:00",
      country_of_birth: "Viet Nam",
      city_of_birth: "",
    },
    personality: {
      love_languages: ["Words of Affirmation", "Quality Time"],
      communication_styles: ["Direct", "Expressive"],
      attachment_style: "Secure",
      deal_breakers: ["Dishonesty", "Disrespect for personal boundaries"],
    },
    lifestyle: {
      work_schedule: "nine_to_five",
      date_budget: 150,
      social_energy_level: "low",
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
        utc_time: "",
        local_time: ""
      },
      location: {
        latitude: 0,
        longitude: 0
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
          quincunx: 3
        },
        ephemeris: "swiss",
        near_cusp_tol_deg: 5
      },
      planets: {
        Sun: {
          sign: "Aquarius",
          degree: 13.09,
          house: 0,
          longitude: 313.09,
          ecliptic_latitude: 0,
          retrograde: false,
          near_cusp: false,
          dist_to_cusp_deg: 0
        },
        Moon: {
          sign: "Taurus",
          degree: 5.64,
          house: 0,
          longitude: 35.64,
          ecliptic_latitude: 0,
          retrograde: false,
          near_cusp: false,
          dist_to_cusp_deg: 0
        },
        Mercury: {
          sign: "Capricorn",
          degree: 17.98,
          house: 0,
          longitude: 287.98,
          ecliptic_latitude: 0,
          retrograde: false,
          near_cusp: false,
          dist_to_cusp_deg: 0
        },
        Venus: {
          sign: "Capricorn",
          degree: 21.71,
          house: 0,
          longitude: 291.71,
          ecliptic_latitude: 0,
          retrograde: true,
          near_cusp: false,
          dist_to_cusp_deg: 0
        },
        Mars: {
          sign: "Capricorn",
          degree: 2.61,
          house: 0,
          longitude: 272.61,
          ecliptic_latitude: 0,
          retrograde: false,
          near_cusp: false,
          dist_to_cusp_deg: 0
        },
        Jupiter: {
          sign: "Cancer",
          degree: 1.65,
          house: 0,
          longitude: 91.65,
          ecliptic_latitude: 0,
          retrograde: true,
          near_cusp: false,
          dist_to_cusp_deg: 0
        },
        Saturn: {
          sign: "Capricorn",
          degree: 19.36,
          house: 0,
          longitude: 289.36,
          ecliptic_latitude: 0,
          retrograde: false,
          near_cusp: false,
          dist_to_cusp_deg: 0
        },
        Uranus: {
          sign: "Capricorn",
          degree: 7.59,
          house: 0,
          longitude: 277.59,
          ecliptic_latitude: 0,
          retrograde: false,
          near_cusp: false,
          dist_to_cusp_deg: 0
        },
        Neptune: {
          sign: "Capricorn",
          degree: 13.19,
          house: 0,
          longitude: 283.19,
          ecliptic_latitude: 0,
          retrograde: false,
          near_cusp: false,
          dist_to_cusp_deg: 0
        },
        Pluto: {
          sign: "Scorpio",
          degree: 17.70,
          house: 0,
          longitude: 227.70,
          ecliptic_latitude: 0,
          retrograde: false,
          near_cusp: false,
          dist_to_cusp_deg: 0
        },
        Chiron: {
          sign: "Cancer",
          degree: 11.77,
          house: 0,
          longitude: 101.77,
          ecliptic_latitude: 0,
          retrograde: true,
          near_cusp: false,
          dist_to_cusp_deg: 0
        },
        Lilith: {
          sign: "Scorpio",
          degree: 10.02,
          house: 0,
          longitude: 220.02,
          ecliptic_latitude: 0,
          retrograde: false,
          near_cusp: false,
          dist_to_cusp_deg: 0
        },
        NorthNode: {
          sign: "Aquarius",
          degree: 16.76,
          house: 0,
          longitude: 316.76,
          ecliptic_latitude: 0,
          retrograde: false,
          near_cusp: false,
          dist_to_cusp_deg: 0
        }
      },
      aspects: [],
      digest: {
        label: "Natal Chart",
        asc: "Aquarius",
        mc: "Taurus",
        planetHints: [
          "Sun in Aquarius",
          "Moon in Taurus",
          "Capricorn stellium"
        ]
      }
    }
  },
  insights: {
    birth_chart_analysis_text: `With your Sun in Leo, you radiate a natural warmth and charisma that draws others toward you. You are expressive, generous, and thrive when you can share your creative spark with the world. Your confidence is magnetic, and you have a natural ability to inspire and lead others.

In relationships, your Moon in Pisces brings a profound emotional depth. You value soulful connections and are highly empathetic to the feelings of others. Your intuitive nature allows you to understand your partner's needs even before they express them, creating a nurturing and supportive bond.

Your Rising sign in Libra gives you an elegant and charming first impression. You have a natural sense of balance and harmony, and you're drawn to beauty in all its forms. People are immediately drawn to your diplomatic nature and your ability to see multiple perspectives in any situation.

Together, these three placements create a personality that is both confident and compassionate, creative and intuitive, strong and gentle. You bring warmth and understanding to every relationship, making you a truly magnetic and beloved presence in the lives of those around you.`,
    analysis_text: `When the relationship is stable
• Loyal
• Responsible
• Shows care through actions more than words
• Enjoys growing and improving together with their partner
When problems begin to appear
• Silence → reflection → self-adjustment
• Rarely complains or blames
• Waits for the partner to realize the issue on their own
4. What Huy NEEDS in a relationship
:white_check_mark: A partner who:
• Respects personal space
• Communicates emotions clearly (since he rarely expresses his own)
• Is stable, but not boring
• Values and appreciates his quiet patience
:x: Avoid:
• Excessive control
• Testing him with silence
• Making him constantly guess emotions or intentions`,
  },
  warnings: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const createUserStore = () => {
    return createStore<TUserStore>((set, get) => ({
        ...defaultUserStoreState,
        setUserInfo: (userInfo) => {
            set({ userInfo });
        },
        loadUserInfo: async () => {
            const currentState = get();
            // Don't load if already loading or data exists
            if (currentState.isLoading || currentState.userInfo) {
                return;
            }
            
            set({ isLoading: true });
            
            // Simulate loading delay between 500ms and 1000ms
            const delay = Math.floor(Math.random() * 500) + 500;
            
            await new Promise((resolve) => setTimeout(resolve, delay));
            
            set({ 
                userInfo: mockProfileAnalysisData,
                isLoading: false 
            });
        },
        clearUserInfo: () => {
            set({ userInfo: null });
        },
        setLoading: (loading) => {
            set({ isLoading: loading });
        },
    }));
}

export type TCreateUserStore = ReturnType<typeof createUserStore>;