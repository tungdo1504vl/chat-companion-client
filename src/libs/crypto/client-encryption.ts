"use client";

/**
 * Client-side password encryption using Web Crypto API
 * Uses RSA-OAEP encryption with SHA-256
 */

import {
  PEM_PUBLIC_KEY_HEADER,
  PEM_PUBLIC_KEY_FOOTER,
  RSA_ENCRYPTION_ALGORITHM,
  RSA_HASH_ALGORITHM,
  RSA_PUBLIC_KEY_TYPE,
  ERROR_MESSAGES,
} from "./constants";
import { AUTH_ENDPOINTS, HTTP_METHODS, CONTENT_TYPES } from "@/constants/auth";

// Cache for the public key
let cachedPublicKey: CryptoKey | null = null;
let publicKeyPromise: Promise<CryptoKey> | null = null;

/**
 * Converts PEM format public key to CryptoKey
 * @param pem - Public key in PEM format
 * @returns CryptoKey object
 */
async function importPublicKey(pem: string): Promise<CryptoKey> {
  // Remove PEM headers and whitespace
  const pemContents = pem
    .replaceAll(PEM_PUBLIC_KEY_HEADER, "")
    .replaceAll(PEM_PUBLIC_KEY_FOOTER, "")
    .replace(/\s/g, "");

  // Convert base64 to ArrayBuffer
  const binaryDer = Uint8Array.from(
    atob(pemContents),
    (c) => c.codePointAt(0) ?? 0
  );

  // Import the key
  return await crypto.subtle.importKey(
    RSA_PUBLIC_KEY_TYPE,
    binaryDer.buffer,
    {
      name: RSA_ENCRYPTION_ALGORITHM,
      hash: RSA_HASH_ALGORITHM,
    },
    false,
    ["encrypt"]
  );
}

/**
 * Fetches the public key from the server
 * @returns CryptoKey object
 */
async function fetchPublicKey(): Promise<CryptoKey> {
  const baseURL =
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    (typeof globalThis !== "undefined" &&
    "location" in globalThis &&
    globalThis.location
      ? globalThis.location.origin
      : "");

  const response = await fetch(`${baseURL}${AUTH_ENDPOINTS.PUBLIC_KEY}`, {
    method: HTTP_METHODS.GET,
    headers: {
      "Content-Type": CONTENT_TYPES.JSON,
    },
    cache: "default",
  });

  if (!response.ok) {
    throw new Error(
      `${ERROR_MESSAGES.PUBLIC_KEY_FETCH_FAILED}: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  if (!data.publicKey) {
    throw new Error(ERROR_MESSAGES.PUBLIC_KEY_NOT_FOUND);
  }

  return await importPublicKey(data.publicKey);
}

/**
 * Gets the public key, using cache if available
 * @returns CryptoKey object
 */
async function getPublicKey(): Promise<CryptoKey> {
  // Return cached key if available
  if (cachedPublicKey) {
    return cachedPublicKey;
  }

  // If a fetch is already in progress, wait for it
  if (publicKeyPromise) {
    cachedPublicKey = await publicKeyPromise;
    return cachedPublicKey;
  }

  // Start fetching the public key
  publicKeyPromise = fetchPublicKey();
  try {
    cachedPublicKey = await publicKeyPromise;
    return cachedPublicKey;
  } catch (error) {
    // Clear the promise on error so we can retry
    publicKeyPromise = null;
    throw error;
  } finally {
    // Clear the promise after completion
    publicKeyPromise = null;
  }
}

/**
 * Encrypts a password using RSA-OAEP encryption
 * @param password - Plain text password to encrypt
 * @returns Base64 encoded encrypted password
 */
export async function encryptPassword(password: string): Promise<string> {
  try {
    // Get the public key
    const publicKey = await getPublicKey();

    // Convert password to ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // Encrypt the password
    const encrypted = await crypto.subtle.encrypt(
      {
        name: RSA_ENCRYPTION_ALGORITHM,
      },
      publicKey,
      data
    );

    // Convert ArrayBuffer to base64 string
    const base64 = btoa(String.fromCodePoint(...new Uint8Array(encrypted)));

    return base64;
  } catch (error) {
    // Clear cache on error to allow retry
    cachedPublicKey = null;
    publicKeyPromise = null;

    const errorMessage =
      error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR;
    throw new Error(`${ERROR_MESSAGES.ENCRYPT_FAILED}: ${errorMessage}`);
  }
}

/**
 * Clears the cached public key
 * Useful for testing or key rotation scenarios
 */
export function clearPublicKeyCache(): void {
  cachedPublicKey = null;
  publicKeyPromise = null;
}
