import { NextRequest, NextResponse } from "next/server";
import {
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
  ASSISTANT_ROUTES,
} from "@/constants/routes";

const PUBLIC_PATHS = new Set([PUBLIC_ROUTES.LOGIN, PUBLIC_ROUTES.SIGNUP]);
const ONBOARDING_PATH = PROTECTED_ROUTES.ONBOARDING;
const STATIC_FILE_PATTERN = /\.(svg|png|jpg|jpeg|gif|webp|ico)$/;

// Private routes - all routes under (private) folder
// These include onboarding, assistant routes, and any future private routes
const PRIVATE_ROUTE_PATTERNS = [
  PROTECTED_ROUTES.ONBOARDING,
  PROTECTED_ROUTES.ASSISTANT,
  ASSISTANT_ROUTES.PARTNERS, // Matches /partners and /partners/*
  ASSISTANT_ROUTES.PROFILE,
  ASSISTANT_ROUTES.HISTORY,
  PROTECTED_ROUTES.CONVERSATIONS, // Future route
] as const;

function isSystemPath(pathname: string): boolean {
  return (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    STATIC_FILE_PATTERN.exec(pathname) !== null
  );
}

function hasSessionCookie(request: NextRequest): boolean {
  return request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("better-auth"));
}

function isPrivateRoute(pathname: string): boolean {
  // Check if pathname matches any private route pattern
  return PRIVATE_ROUTE_PATTERNS.some((pattern) => {
    // Exact match for routes like /assistant, /profile, /history, /onboarding
    if (pathname === pattern) {
      return true;
    }
    // Prefix match for routes like /partners/* (e.g., /partners/create, /partners/123, /partners/chat/123)
    if (
      pattern === ASSISTANT_ROUTES.PARTNERS &&
      pathname.startsWith(`${pattern}/`)
    ) {
      return true;
    }
    return false;
  });
}

function redirectToLogin(request: NextRequest, pathname: string): NextResponse {
  const url = new URL(PUBLIC_ROUTES.LOGIN, request.url);
  url.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(url);
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isSystemPath(pathname)) {
    return NextResponse.next();
  }

  const hasSession = hasSessionCookie(request);

  // Public routes: redirect authenticated users to onboarding
  if (PUBLIC_PATHS.has(pathname as "/login" | "/signup")) {
    return hasSession
      ? NextResponse.redirect(new URL(ONBOARDING_PATH, request.url))
      : NextResponse.next();
  }

  // Private routes (from (private) folder): require authentication
  if (isPrivateRoute(pathname)) {
    return hasSession
      ? NextResponse.next()
      : redirectToLogin(request, pathname);
  }

  // For any other routes (e.g., root "/"), allow access
  // You can change this to redirect to login if you want stricter control
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)",
  ],
};
