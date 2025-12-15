import { auth } from "@/libs/better-auth/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { decrypt } from "@/libs/crypto/rsa-keys";
import { NextRequest } from "next/server";
import { requiresPasswordDecryption } from "@/libs/better-auth/utils";
import { AUTH_ERROR_MESSAGES } from "@/constants/auth";
import { extractErrorMessage } from "@/libs/crypto/utils";

/**
 * Decrypts password in request body if present
 * @param body - Request body object
 * @returns Modified body with decrypted password
 */
function decryptPasswordInBody(body: Record<string, unknown>): void {
  if (body.password && typeof body.password === "string") {
    try {
      body.password = decrypt(body.password);
    } catch (decryptError) {
      // If decryption fails, assume plain text (backward compatibility)
      console.warn(
        AUTH_ERROR_MESSAGES.DECRYPTION_FAILED,
        extractErrorMessage(decryptError, AUTH_ERROR_MESSAGES.UNKNOWN_ERROR)
      );
    }
  }
}

/**
 * Creates a modified request with decrypted password
 * @param request - Original request
 * @param body - Request body with potentially decrypted password
 * @returns New Request object
 */
function createModifiedRequest(
  request: NextRequest,
  body: Record<string, unknown>
): Request {
  return new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body: JSON.stringify(body),
  });
}

/**
 * Intercepts POST requests to decrypt encrypted passwords
 * before passing to better-auth
 */
async function handlePostWithDecryption(
  request: NextRequest
): Promise<Response> {
  const { POST } = toNextJsHandler(auth);
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (!requiresPasswordDecryption(pathname)) {
    return POST(request);
  }

  try {
    const clonedRequest = request.clone();
    const body = (await clonedRequest.json()) as Record<string, unknown>;

    decryptPasswordInBody(body);

    const modifiedRequest = createModifiedRequest(request, body);
    return POST(modifiedRequest as NextRequest);
  } catch (error) {
    console.error(
      AUTH_ERROR_MESSAGES.DECRYPTION_ERROR,
      extractErrorMessage(error, AUTH_ERROR_MESSAGES.UNKNOWN_ERROR)
    );
    return POST(request);
  }
}

// Export handlers
export async function POST(request: NextRequest): Promise<Response> {
  return handlePostWithDecryption(request);
}

export async function GET(request: NextRequest): Promise<Response> {
  const { GET } = toNextJsHandler(auth);
  return GET(request);
}
