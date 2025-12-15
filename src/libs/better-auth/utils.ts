/**
 * Utility functions for better-auth route handling
 */

import { AUTH_PATH_PATTERNS } from "@/constants/auth";

/**
 * Checks if the pathname is a signup request
 * @param pathname - Request pathname
 * @returns True if it's a signup request
 */
export function isSignUpRequest(pathname: string): boolean {
  return AUTH_PATH_PATTERNS.SIGN_UP.some((pattern) =>
    pathname.includes(pattern)
  );
}

/**
 * Checks if the pathname is a signin request
 * @param pathname - Request pathname
 * @returns True if it's a signin request
 */
export function isSignInRequest(pathname: string): boolean {
  return AUTH_PATH_PATTERNS.SIGN_IN.some((pattern) =>
    pathname.includes(pattern)
  );
}

/**
 * Checks if the pathname requires password decryption
 * @param pathname - Request pathname
 * @returns True if password decryption is needed
 */
export function requiresPasswordDecryption(pathname: string): boolean {
  return isSignUpRequest(pathname) || isSignInRequest(pathname);
}
