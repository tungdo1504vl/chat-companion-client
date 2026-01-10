import { NextResponse } from "next/server";
import { requireAuth } from "@/libs/better-auth/server";
import { auth } from "@/libs/better-auth/auth";

/**
 * API route to mark onboarding as complete
 * Updates the user's hasCompletedOnboarding field to true
 */
export async function POST() {
  try {
    const session = await requireAuth();
    const userId = session.user.id;

    // Access the database pool from auth configuration
    const db = auth.options.database;
    if (!db || typeof db.query !== "function") {
      throw new Error("Database connection not available");
    }

    await db.query(
      'UPDATE "user" SET "hasCompletedOnboarding" = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = $2',
      [true, userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
