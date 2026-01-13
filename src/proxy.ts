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

/**
 * Check if pathname is a system path that should be excluded from proxy logic
 * Includes API auth routes (including OAuth callbacks), Next.js internals, and static files
 */
function isSystemPath(pathname: string): boolean {
  return (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    STATIC_FILE_PATTERN.exec(pathname) !== null
  );
}

/**
 * Lightweight check for better-auth session cookie existence
 * This is a fast O(1) operation that just checks if the cookie exists
 * Full session validation will be done in the layout components
 *
 * Note: Better-auth uses different cookie names in different environments:
 * - Development: better-auth.session_token
 * - Production: __Secure-better-auth.session_token
 */
function hasSessionCookie(request: NextRequest): boolean {
  // Check for production cookie (__Secure-better-auth.session_token)
  const secureCookie = request.cookies.get(
    "__Secure-better-auth.session_token"
  );
  if (secureCookie) {
    return true;
  }

  // Check for development cookie (better-auth.session_token)
  const devCookie = request.cookies.get("better-auth.session_token");
  return !!devCookie;
}

/**
 * Check if pathname is a private route that requires authentication
 */
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

/**
 * Check if a callbackUrl is safe to use (not a public route, not causing redirect loops)
 */
function isSafeCallbackUrl(
  callbackUrl: string | null,
  currentPath: string
): boolean {
  if (!callbackUrl) return false;

  // Remove leading slash for comparison
  const normalizedCallback = callbackUrl.startsWith("/")
    ? callbackUrl
    : `/${callbackUrl}`;
  const normalizedCurrent = currentPath.startsWith("/")
    ? currentPath
    : `/${currentPath}`;

  // Don't redirect to public routes (would cause loops)
  if (PUBLIC_PATHS.has(normalizedCallback as "/login" | "/signup")) {
    return false;
  }

  // Don't redirect to the same path (would cause loops)
  if (normalizedCallback === normalizedCurrent) {
    return false;
  }

  // Must be a valid path (not empty, not just query params)
  if (normalizedCallback === "/" || normalizedCallback.length === 0) {
    return false;
  }

  return true;
}

/**
 * Redirect to login with a safe callbackUrl
 * Validates callbackUrl to prevent redirect loops
 */
function redirectToLogin(request: NextRequest, pathname: string): NextResponse {
  const url = new URL(PUBLIC_ROUTES.LOGIN, request.url);

  // Only set callbackUrl if it's safe and not already a public route
  if (isSafeCallbackUrl(pathname, pathname)) {
    url.searchParams.set("callbackUrl", pathname);
  }

  return NextResponse.redirect(url);
}

/**
 * Check if we're in a redirect loop by examining the request
 * This helps prevent infinite redirects on mobile devices
 */
function isRedirectLoop(request: NextRequest, targetPath: string): boolean {
  const referer = request.headers.get("referer");
  const currentPath = request.nextUrl.pathname;

  // If referer is the same as target, we might be in a loop
  if (
    referer &&
    new URL(referer).pathname === targetPath &&
    currentPath !== targetPath
  ) {
    return true;
  }

  return false;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Early return for system paths (API routes, static files, Next.js internals)
  // This includes OAuth callbacks under /api/auth which should never be intercepted
  if (isSystemPath(pathname)) {
    return NextResponse.next();
  }

  // Lightweight cookie check - just verify if session cookie exists
  // Full session validation and onboarding checks are deferred to layout components
  const hasSession = hasSessionCookie(request);

  // Public routes: redirect authenticated users away from login/signup
  if (PUBLIC_PATHS.has(pathname as "/login" | "/signup")) {
    if (hasSession) {
      // Redirect authenticated users to onboarding
      // The onboarding layout will check if they've completed onboarding
      // and redirect to /assistant if needed (handled server-side)
      const redirectUrl = new URL(ONBOARDING_PATH, request.url);

      // Prevent redirect loops
      if (!isRedirectLoop(request, ONBOARDING_PATH)) {
        return NextResponse.redirect(redirectUrl);
      }
    }
    // Allow unauthenticated users to access login/signup
    return NextResponse.next();
  }

  // Private routes (from (private) folder): require authentication
  if (isPrivateRoute(pathname)) {
    if (hasSession) {
      // User has session cookie, allow access
      // Onboarding check will be performed in the layout component
      return NextResponse.next();
    } else {
      // User is not authenticated, redirect to login with safe callbackUrl
      return redirectToLogin(request, pathname);
    }
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
