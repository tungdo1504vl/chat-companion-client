import crypto from "node:crypto";
import {
  RSA_KEY_SIZE,
  RSA_PUBLIC_EXPONENT,
  RSA_PUBLIC_KEY_TYPE,
  RSA_PRIVATE_KEY_TYPE,
  RSA_KEY_FORMAT,
  RSA_HASH_ALGORITHM,
  ENV_RSA_PRIVATE_KEY,
  ERROR_MESSAGES,
  TEXT_ENCODING,
} from "./constants";

// Cache for the key pair
let cachedKeyPair: {
  publicKey: string;
  privateKey: string;
} | null = null;

/**
 * Generates a new RSA key pair
 * @returns Object containing public and private keys in PEM format
 */
function generateKeyPair(): {
  publicKey: string;
  privateKey: string;
} {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: RSA_KEY_SIZE,
    publicKeyEncoding: {
      type: RSA_PUBLIC_KEY_TYPE,
      format: RSA_KEY_FORMAT,
    },
    privateKeyEncoding: {
      type: RSA_PRIVATE_KEY_TYPE,
      format: RSA_KEY_FORMAT,
    },
    publicExponent: RSA_PUBLIC_EXPONENT,
  });

  return {
    publicKey,
    privateKey,
  };
}

/**
 * Gets or generates the RSA key pair
 * First checks environment variable, then generates if not found
 * @returns Object containing public and private keys
 */
export function getKeyPair(): {
  publicKey: string;
  privateKey: string;
} {
  // Return cached key pair if available
  if (cachedKeyPair) {
    return cachedKeyPair;
  }

  // Check if private key is provided via environment variable
  const envPrivateKey = process.env[ENV_RSA_PRIVATE_KEY];

  if (envPrivateKey) {
    try {
      // Extract public key from private key
      const privateKeyObj = crypto.createPrivateKey(envPrivateKey);
      const publicKeyObj = crypto.createPublicKey(privateKeyObj);
      const publicKey = publicKeyObj.export({
        type: RSA_PUBLIC_KEY_TYPE,
        format: RSA_KEY_FORMAT,
      }) as string;

      cachedKeyPair = {
        publicKey,
        privateKey: envPrivateKey,
      };

      return cachedKeyPair;
    } catch (error) {
      console.error(ERROR_MESSAGES.PRIVATE_KEY_LOAD_FAILED, error);
      // Fall through to generate new key pair
    }
  }

  // Generate new key pair
  console.warn(ERROR_MESSAGES.KEY_PAIR_GENERATION_WARNING);

  cachedKeyPair = generateKeyPair();
  return cachedKeyPair;
}

/**
 * Gets the public key in PEM format
 * @returns Public key as PEM string
 */
export function getPublicKey(): string {
  return getKeyPair().publicKey;
}

/**
 * Decrypts data using the private key
 * @param encryptedData - Base64 encoded encrypted data
 * @returns Decrypted string
 */
export function decrypt(encryptedData: string): string {
  try {
    const { privateKey } = getKeyPair();
    const buffer = Buffer.from(encryptedData, TEXT_ENCODING.BASE64);
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: RSA_HASH_ALGORITHM.toLowerCase(),
      },
      buffer
    );

    return decrypted.toString(TEXT_ENCODING.UTF8);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR;
    throw new Error(`${ERROR_MESSAGES.DECRYPT_FAILED}: ${errorMessage}`);
  }
}

/**
 * Generates a new RSA key pair and returns it as PEM strings
 * Useful for generating keys to store in environment variables
 * @returns Object with publicKey and privateKey in PEM format
 */
export function generateNewKeyPair(): {
  publicKey: string;
  privateKey: string;
} {
  return generateKeyPair();
}
