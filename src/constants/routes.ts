import { BarChart3, Users, User, LucideIcon } from "lucide-react";

export interface NavigationItem {
  href: string;
  label: string;
  icon: LucideIcon;
  // If true, matches paths that start with href (e.g., /partners matches /partners/123)
  matchPrefix?: boolean;
}

// Public Routes (accessible without authentication)
export const PUBLIC_ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",
} as const;

// Protected Routes (require authentication)
export const PROTECTED_ROUTES = {
  CONVERSATIONS: "/conversations",
  ONBOARDING: "/onboarding",
  ASSISTANT: "/assistant",
} as const;

// Assistant Routes (within the assistant section)
export const ASSISTANT_ROUTES = {
  ASSISTANT: "/assistant",
  PARTNERS: "/partners",
  PARTNER_CREATE: "/partners/create",
  PARTNER_DETAIL: "/partners", // Base for dynamic routes like /partners/[id]
  PARTNER_CHAT: "/partners/chat", // Base for dynamic routes like /partners/chat/[id]
  PROFILE: "/profile",
  HISTORY: "/history",
} as const;

// Helper functions for building dynamic routes
export const buildPartnerDetailRoute = (partnerId: string): string => {
  return `${ASSISTANT_ROUTES.PARTNER_DETAIL}/${partnerId}`;
};

export const buildPartnerChatRoute = (partnerId: string): string => {
  return `${ASSISTANT_ROUTES.PARTNER_CHAT}/${partnerId}`;
};

// Navigation items for assistant layout
export const ASSISTANT_NAV_ITEMS: NavigationItem[] = [
  {
    href: ASSISTANT_ROUTES.ASSISTANT,
    label: "Analyze",
    icon: BarChart3,
    matchPrefix: false,
  },
  {
    href: ASSISTANT_ROUTES.PARTNERS,
    label: "Partners",
    icon: Users,
    matchPrefix: true, // Matches /partners, /partners/123, /partners/chat/123, etc.
  },
  {
    href: ASSISTANT_ROUTES.PROFILE,
    label: "Profile",
    icon: User,
    matchPrefix: false,
  },
] as const;

// All routes combined for easy access
export const ALL_ROUTES = {
  ...PUBLIC_ROUTES,
  ...PROTECTED_ROUTES,
  ...ASSISTANT_ROUTES,
} as const;
