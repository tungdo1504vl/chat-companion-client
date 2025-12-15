import { getPublicKey } from "@/libs/crypto/rsa-keys";
import { NextResponse } from "next/server";
import { CONTENT_TYPES } from "@/constants/auth";
import { ERROR_MESSAGES } from "@/libs/crypto/constants";

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Cache Headers
const CACHE_HEADERS = {
  CACHE_CONTROL: "public, max-age=3600, stale-while-revalidate=86400",
} as const;

/**
 * GET /api/auth/public-key
 * Returns the RSA public key for client-side password encryption
 */
export async function GET() {
  try {
    const publicKey = getPublicKey();

    return NextResponse.json(
      { publicKey },
      {
        status: HTTP_STATUS.OK,
        headers: {
          "Cache-Control": CACHE_HEADERS.CACHE_CONTROL,
          "Content-Type": CONTENT_TYPES.JSON,
        },
      }
    );
  } catch (error) {
    console.error(ERROR_MESSAGES.PUBLIC_KEY_FETCH_FAILED, error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.PUBLIC_KEY_FETCH_FAILED },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

