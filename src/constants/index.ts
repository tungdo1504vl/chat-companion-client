export const PUBLIC_ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",
} as const;

export const PROTECTED_ROUTES = {
  CONVERSATIONS: "/conversations",
  ONBOARDING: "/onboarding",
} as const;

export const ALL_ROUTES = {
  ...PUBLIC_ROUTES,
  ...PROTECTED_ROUTES,
} as const;

export * from "./auth";
export * from "./http-status";
