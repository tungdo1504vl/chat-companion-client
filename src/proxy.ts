import { NextRequest, NextResponse } from "next/server";
const STATIC_FILE_PATTERN = /\.(svg|png|jpg|jpeg|gif|webp|ico)$/;

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


export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Early return for system paths (API routes, static files, Next.js internals)
  // This includes OAuth callbacks under /api/auth which should never be intercepted
  if (isSystemPath(pathname)) {
    return NextResponse.next();
  }

  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)",
  ],
};
