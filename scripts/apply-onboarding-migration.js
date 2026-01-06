const { Pool } = require("pg");
require("dotenv").config();

async function applyMigration() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const pool = new Pool({
    connectionString: databaseUrl,
  });

  try {
    // Check if column already exists
    const checkResult = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'user' 
      AND column_name = 'hasCompletedOnboarding'
    `);

    if (checkResult.rows.length > 0) {
      console.log(
        "✓ Column 'hasCompletedOnboarding' already exists. Migration skipped."
      );
      return;
    }

    // Apply the migration
    await pool.query(`
      ALTER TABLE "user" 
      ADD COLUMN "hasCompletedOnboarding" boolean NOT NULL DEFAULT false
    `);

    console.log(
      "✓ Successfully added 'hasCompletedOnboarding' column to 'user' table"
    );
  } catch (error) {
    if (error.code === "42P07" || error.message.includes("already exists")) {
      console.log(
        "✓ Column 'hasCompletedOnboarding' already exists. Migration skipped."
      );
    } else {
      console.error("✗ Migration failed:", error.message);
      throw error;
    }
  } finally {
    await pool.end();
  }
}

applyMigration()
  .then(() => {
    console.log("Migration completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
