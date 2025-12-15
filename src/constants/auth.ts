/**
 * Authentication-related constants
 */

// Auth API Endpoints
export const AUTH_ENDPOINTS = {
  PUBLIC_KEY: "/api/auth/public-key",
  SIGN_UP: "/sign-up",
  SIGN_IN: "/sign-in",
} as const;

// Auth Path Patterns
export const AUTH_PATH_PATTERNS = {
  SIGN_UP: ["/sign-up", "/signup"],
  SIGN_IN: ["/sign-in", "/signin"],
} as const;

// Request Methods
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
} as const;

// Content Types
export const CONTENT_TYPES = {
  JSON: "application/json",
} as const;

// Error Messages
export const AUTH_ERROR_MESSAGES = {
  ENCRYPTION_FAILED: "Failed to encrypt password",
  DECRYPTION_FAILED: "Password decryption failed, assuming plain text",
  DECRYPTION_ERROR: "Error decrypting password",
  UNKNOWN_ERROR: "Unknown error",
} as const;

// Success Messages
export const AUTH_SUCCESS_MESSAGES = {
  SIGN_UP: "Account created successfully",
  SIGN_IN: "Signed in successfully",
} as const;

// Failure Messages
export const AUTH_FAILURE_MESSAGES = {
  SIGN_UP: "Sign up failed",
  SIGN_IN: "Sign in failed",
  SIGN_UP_DEFAULT: "Failed to create account. Please try again.",
  SIGN_IN_DEFAULT: "Invalid email or password",
  UNEXPECTED_ERROR: "An unexpected error occurred",
} as const;

