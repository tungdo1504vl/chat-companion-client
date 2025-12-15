import { NextRequest, NextResponse } from "next/server";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/constants";
import { auth } from "@/libs/better-auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
  // Use Better Auth's getSessionCookie helper for cookie-based checks
  // This is the recommended approach for optimistic redirects at the edge
  // NOTE: This only checks for cookie presence, not validity
  // Full session validation happens in server components (Node.js runtime)
  // The conversations layout uses getSession() for actual security
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Define public routes that don't require authentication
  const publicRoutes = [PUBLIC_ROUTES.LOGIN, PUBLIC_ROUTES.SIGNUP];
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // If authenticated user tries to access login/signup, redirect to conversations
  // This prevents redirect loops
  if (isPublicRoute && session) {
    const conversationsUrl = new URL(
      PROTECTED_ROUTES.CONVERSATIONS,
      request.url
    );
    return NextResponse.redirect(conversationsUrl);
  }

  // Allow public routes and API routes (especially auth API)
  if (isPublicRoute || request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check for protected routes (e.g., /conversations)
  const isProtectedRoute = request.nextUrl.pathname.startsWith(
    PROTECTED_ROUTES.CONVERSATIONS
  );

  if (isProtectedRoute) {
    // If no session cookie, redirect to login
    // NOTE: This is an optimistic redirect for better UX
    // Real security is enforced in server components via getSession()
    // The conversations layout validates the session server-side
    if (!session) {
      const loginUrl = new URL(PUBLIC_ROUTES.LOGIN, request.url);
      // Add the attempted URL as a query parameter for redirect after login
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configure which routes the proxy should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    String.raw`/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)`,
  ],
};
