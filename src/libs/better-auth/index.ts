// Server-side exports
export { auth, getSession, getCurrentUser, requireAuth } from "./server";
export type { Session, User } from "./auth";

// Client-side exports (re-exported conditionally)
export { authClient } from "./client";

