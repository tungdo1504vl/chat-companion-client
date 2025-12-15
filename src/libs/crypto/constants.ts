/**
 * Constants for RSA encryption/decryption
 */

// RSA Key Configuration
export const RSA_KEY_SIZE = 2048;
export const RSA_PUBLIC_EXPONENT = 0x10001; // 65537

// RSA Key Encoding
export const RSA_PUBLIC_KEY_TYPE = "spki" as const;
export const RSA_PRIVATE_KEY_TYPE = "pkcs8" as const;
export const RSA_KEY_FORMAT = "pem" as const;

// RSA Encryption Configuration
export const RSA_ENCRYPTION_ALGORITHM = "RSA-OAEP" as const;
export const RSA_HASH_ALGORITHM = "SHA-256" as const;

// PEM Headers
export const PEM_PUBLIC_KEY_HEADER = "-----BEGIN PUBLIC KEY-----";
export const PEM_PUBLIC_KEY_FOOTER = "-----END PUBLIC KEY-----";

// Environment Variables
export const ENV_RSA_PRIVATE_KEY = "RSA_PRIVATE_KEY";

// Error Messages
export const ERROR_MESSAGES = {
  DECRYPT_FAILED: "Failed to decrypt data",
  ENCRYPT_FAILED: "Failed to encrypt password",
  PUBLIC_KEY_FETCH_FAILED: "Failed to fetch public key",
  PUBLIC_KEY_NOT_FOUND: "Public key not found in response",
  PRIVATE_KEY_LOAD_FAILED:
    "Failed to load RSA private key from environment variable",
  KEY_PAIR_GENERATION_WARNING:
    "RSA_PRIVATE_KEY not found in environment. Generating new key pair. " +
    "Note: This key pair will be regenerated on server restart. " +
    "For production, set RSA_PRIVATE_KEY environment variable.",
  UNKNOWN_ERROR: "Unknown error",
} as const;

// Text Encoding
export const TEXT_ENCODING = {
  UTF8: "utf8",
  BASE64: "base64",
} as const;
