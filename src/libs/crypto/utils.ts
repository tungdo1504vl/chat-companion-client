/**
 * Utility functions for password encryption and error handling
 */

import { encryptPassword } from "./client-encryption";
import { AUTH_ERROR_MESSAGES } from "@/constants/auth";

/**
 * Encrypts a password with error handling
 * @param password - Plain text password to encrypt
 * @returns Encrypted password
 * @throws Error if encryption fails
 */
export async function encryptPasswordSafely(
  password: string
): Promise<string> {
  try {
    return await encryptPassword(password);
  } catch (error) {
    const errorMessage = extractErrorMessage(
      error,
      AUTH_ERROR_MESSAGES.UNKNOWN_ERROR
    );
    throw new Error(`${AUTH_ERROR_MESSAGES.ENCRYPTION_FAILED}: ${errorMessage}`);
  }
}

/**
 * Extracts error message from various error types
 * @param error - Error object or unknown type
 * @param defaultMessage - Default message if error extraction fails
 * @returns Error message string
 */
export function extractErrorMessage(
  error: unknown,
  defaultMessage: string
): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return defaultMessage;
}

/**
 * Extracts error message from auth response
 * @param error - Auth error response
 * @param defaultMessage - Default message if extraction fails
 * @returns Error message string
 */
export function getAuthErrorMessage(
  error: unknown,
  defaultMessage: string
): string {
  return extractErrorMessage(error, defaultMessage);
}

