# Better Auth Setup

This directory contains the Better Auth configuration and utilities for the application.

## Files

- `auth.ts` - Main Better Auth server configuration
- `client.ts` - Client-side auth utilities and hooks
- `server.ts` - Server-side auth utilities (for Server Components and API routes)
- `index.ts` - Main export file

## Setup

1. Install better-auth:
   ```bash
   pnpm install better-auth
   ```

2. Set up environment variables in your `.env` file:
   - `BETTER_AUTH_SECRET` - A secure random string (generate with `openssl rand -base64 32`)
   - `BETTER_AUTH_URL` - Your app's base URL (e.g., `http://localhost:3000`)
   - `NEXT_PUBLIC_BETTER_AUTH_URL` - Same as above, for client-side access

3. Set up database tables (if using a database):

   **Option 1: Using dotenv-cli (Recommended)**
   
   First install dotenv-cli:
   ```bash
   pnpm add -D dotenv-cli
   ```
   
   Then run CLI commands:
   ```bash
   dotenv -e .env -- npx @better-auth/cli generate --config ./src/libs/better-auth/auth.ts
   dotenv -e .env -- npx @better-auth/cli migrate --config ./src/libs/better-auth/auth.ts
   ```

   **Option 2: Using environment variables directly**
   
   ```bash
   DATABASE_URL="your_connection_string" BETTER_AUTH_SECRET="your_secret" BETTER_AUTH_URL="http://localhost:3000" npx @better-auth/cli generate --config ./src/libs/better-auth/auth.ts
   DATABASE_URL="your_connection_string" BETTER_AUTH_SECRET="your_secret" BETTER_AUTH_URL="http://localhost:3000" npx @better-auth/cli migrate --config ./src/libs/better-auth/auth.ts
   ```

   **Option 3: Export variables in your shell**
   
   ```bash
   export $(cat .env | xargs)
   npx @better-auth/cli generate --config ./src/libs/better-auth/auth.ts
   npx @better-auth/cli migrate --config ./src/libs/better-auth/auth.ts
   ```

## Usage

### Server-Side (Server Components, Server Actions, API Routes)

```typescript
import { getSession, getCurrentUser, requireAuth } from "@/libs/better-auth";

// Get session (returns null if not authenticated)
const session = await getSession();

// Get current user (returns null if not authenticated)
const user = await getCurrentUser();

// Require authentication (throws if not authenticated)
const session = await requireAuth();
```

### Client-Side (React Components)

```typescript
"use client";
import { useSession, signIn, signUp, signOut } from "@/libs/better-auth/client";

export function MyComponent() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <button onClick={() => signOut()}>Sign Out</button>
      ) : (
        <button onClick={() => signIn.email({ email: "...", password: "..." })}>
          Sign In
        </button>
      )}
    </div>
  );
}
```

## API Route

The auth API handler is set up at `/api/auth/[...all]` which handles all Better Auth endpoints automatically.

## Configuration

Edit `auth.ts` to configure:
- Email/Password authentication (already enabled)
- Social providers (GitHub, Google, etc.)
- Database connection
- Session settings
- And more...

