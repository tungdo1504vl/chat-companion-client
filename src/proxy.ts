import { NextRequest, NextResponse } from "next/server";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/constants";

const PUBLIC_PATHS = new Set([PUBLIC_ROUTES.LOGIN, PUBLIC_ROUTES.SIGNUP]);
const ONBOARDING_PATH = PROTECTED_ROUTES.ONBOARDING;
const STATIC_FILE_PATTERN = /\.(svg|png|jpg|jpeg|gif|webp|ico)$/;

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

function redirectToLogin(request: NextRequest, pathname: string): NextResponse {
  const url = new URL(PUBLIC_ROUTES.LOGIN, request.url);
  url.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(url);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isSystemPath(pathname)) {
    return NextResponse.next();
  }

  const hasSession = hasSessionCookie(request);

  // Public routes: redirect authenticated users away
  if (PUBLIC_PATHS.has(pathname as "/login" | "/signup")) {
    return hasSession
      ? NextResponse.redirect(new URL(PROTECTED_ROUTES.ONBOARDING, request.url))
      : NextResponse.next();
  }

  // Onboarding route: require authentication
  if (pathname === ONBOARDING_PATH) {
    return hasSession
      ? NextResponse.next()
      : redirectToLogin(request, pathname);
  }

  // Protected routes: require authentication
  return hasSession ? NextResponse.next() : redirectToLogin(request, pathname);
}

export const config = {
  matcher: [
    String.raw`/((?!api/auth|_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)).*)`,
  ],
};
