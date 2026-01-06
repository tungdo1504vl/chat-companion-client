-- Safe migration: Add hasCompletedOnboarding column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'user' 
        AND column_name = 'hasCompletedOnboarding'
    ) THEN
        ALTER TABLE "user" ADD COLUMN "hasCompletedOnboarding" boolean NOT NULL DEFAULT false;
        RAISE NOTICE 'Column hasCompletedOnboarding added successfully';
    ELSE
        RAISE NOTICE 'Column hasCompletedOnboarding already exists';
    END IF;
END $$;

