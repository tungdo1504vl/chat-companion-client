import {
  BarChart3,
  Users,
  User,
  Home,
  Compass,
  MessageCircle,
  Plus,
  LucideIcon,
} from "lucide-react";

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
  FORGOT_PASSWORD: "/forgot-password",
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

export const buildWinACrushRoute = (partnerId: string): string => {
  return `${ASSISTANT_ROUTES.PARTNER_DETAIL}/${partnerId}/win-a-crush`;
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

// Navigation items for footer layout v2 (5 items: Home, Compass, Plus, Chat, User)
export const FOOTER_V2_NAV_ITEMS: NavigationItem[] = [
  {
    href: ASSISTANT_ROUTES.ASSISTANT,
    label: "Home",
    icon: Home,
    matchPrefix: false,
  },
  {
    href: ASSISTANT_ROUTES.PARTNERS,
    label: "Partners",
    icon: Compass,
    matchPrefix: true, // Matches /partners, /partners/123, /partners/chat/123, etc.
  },
  {
    href: ASSISTANT_ROUTES.PARTNER_CREATE,
    label: "Create",
    icon: Plus,
    matchPrefix: false,
  },
  {
    href: ASSISTANT_ROUTES.HISTORY,
    label: "History",
    icon: MessageCircle,
    matchPrefix: false,
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
