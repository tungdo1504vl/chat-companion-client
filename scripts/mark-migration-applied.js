#!/usr/bin/env node

/**
 * Script to mark the first Supabase migration as applied
 * This is needed because the tables were already created via Better Auth CLI,
 * but Supabase's migration tracking doesn't know about it.
 */

const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

// Load .env file manually if dotenv is not available
try {
  require("dotenv").config({ path: ".env" });
} catch (e) {
  // If dotenv is not installed, try to load .env manually
  const envPath = path.join(__dirname, "..", ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is not set");
  console.error("Please make sure your .env file contains DATABASE_URL");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
});

async function markMigrationApplied() {
  const client = await pool.connect();

  try {
    console.log("Connecting to database...");

    // First, verify the tables exist
    const tablesCheck = await client.query(`
      SELECT 
        EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user') as user_exists,
        EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session') as session_exists,
        EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'account') as account_exists,
        EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'verification') as verification_exists;
    `);

    const { user_exists, session_exists, account_exists, verification_exists } =
      tablesCheck.rows[0];

    if (
      !user_exists ||
      !session_exists ||
      !account_exists ||
      !verification_exists
    ) {
      console.error("Error: Not all required tables exist in the database");
      console.error("Tables status:", {
        user: user_exists,
        session: session_exists,
        account: account_exists,
        verification: verification_exists,
      });
      console.error(
        "Please ensure all tables from the first migration exist before marking it as applied."
      );
      process.exit(1);
    }

    console.log("✓ All required tables exist");

    // Check if migration is already marked as applied
    const existingCheck = await client.query(`
      SELECT version FROM supabase_migrations.schema_migrations 
      WHERE version = '20251207143525';
    `);

    if (existingCheck.rows.length > 0) {
      console.log("✓ Migration 20251207143525 is already marked as applied");
      return;
    }

    // Insert the migration record
    console.log("Marking migration 20251207143525 as applied...");
    await client.query(`
      INSERT INTO supabase_migrations.schema_migrations (version)
      VALUES ('20251207143525')
      ON CONFLICT (version) DO NOTHING;
    `);

    console.log("✓ Successfully marked migration 20251207143525 as applied");
    console.log("\nYou can now run: npx supabase db push");
  } catch (error) {
    console.error("Error:", error.message);

    if (
      error.message.includes(
        'relation "supabase_migrations.schema_migrations" does not exist'
      )
    ) {
      console.error("\nThe migration tracking table does not exist.");
      console.error(
        "This might mean Supabase migrations haven't been initialized."
      );
      console.error(
        "Try running: npx supabase db push (this will create the tracking table)"
      );
    } else if (error.message.includes("permission denied")) {
      console.error(
        "\nPermission denied. Make sure your DATABASE_URL has the necessary permissions."
      );
    }

    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

markMigrationApplied().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
