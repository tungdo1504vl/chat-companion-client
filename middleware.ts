import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/libs/better-auth/auth";
import { PROTECTED_ROUTES } from "@/constants";

export async function middleware(request: NextRequest) {
  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/signup"];
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Allow public routes and API routes (especially auth API)
  if (isPublicRoute || request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check for protected routes (e.g., /conversations)
  const isProtectedRoute = request.nextUrl.pathname.startsWith(
    PROTECTED_ROUTES.CONVERSATIONS
  );

  if (isProtectedRoute) {
    // Get session from better-auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // If no session, redirect to login
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      // Add the attempted URL as a query parameter for redirect after login
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
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
