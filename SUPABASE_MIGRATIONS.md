# Supabase Migrations Guide

This guide explains how to set up and use Supabase migrations for managing your database schema.

## Prerequisites

### Install Supabase CLI

**Option 1: Using Homebrew (macOS/Linux)**

```bash
brew install supabase/tap/supabase
```

**Option 2: Using npm**

```bash
npm install -g supabase
```

**Option 3: Using npx (no installation needed)**

```bash
npx supabase --help
```

Verify installation:

```bash
supabase --version
```

## Initial Setup

### 1. Initialize Supabase

Run this command in your project root:

```bash
supabase init
```

This creates:

- `supabase/` directory
- `supabase/config.toml` - Configuration file
- `supabase/migrations/` - Directory for migration files

### 2. Link to Your Supabase Project

Link your local project to your remote Supabase project:

```bash
supabase link --project-ref your-project-ref
```

You can find your project ref in your Supabase dashboard URL:
`https://app.supabase.com/project/[project-ref]`

Or get it from your Supabase dashboard → Settings → General → Reference ID

## Migration Workflow

### Creating a New Migration

Create a new migration file:

```bash
supabase migration new migration_name
```

This creates a timestamped file in `supabase/migrations/`:

- Format: `YYYYMMDDHHMMSS_migration_name.sql`
- Example: `20260106143238_add_user_preferences.sql`

### Writing Migrations

Edit the generated migration file with your SQL:

```sql
-- Example: Add a new column
ALTER TABLE "user" ADD COLUMN "preferences" jsonb DEFAULT '{}'::jsonb;

-- Example: Safe migration (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user' AND column_name = 'preferences'
    ) THEN
        ALTER TABLE "user" ADD COLUMN "preferences" jsonb DEFAULT '{}'::jsonb;
    END IF;
END $$;
```

**Best Practices:**

- Make migrations idempotent when possible (use `IF NOT EXISTS` checks)
- Always test migrations locally before pushing to production
- Use descriptive migration names
- One logical change per migration file

### Applying Migrations

#### Local Development

**Reset local database and apply all migrations:**

```bash
pnpm run db:reset
```

**Apply pending migrations:**

```bash
pnpm run db:migrate
```

**Check migration status:**

```bash
pnpm run db:status
```

#### Production (Remote)

**Push migrations to remote Supabase project:**

```bash
pnpm run db:push
```

This applies all pending migrations to your production database.

**Note**: Always review migrations before pushing to production!

### Viewing Migration Status

Check which migrations have been applied:

```bash
supabase migration list
```

Or use the npm script:

```bash
pnpm run db:status
```

## Existing Migrations

The following migrations have been converted from better-auth:

1. **Initial Better Auth Tables** (`20251207143525_initial_better_auth_tables.sql`)

   - Creates `user`, `session`, `account`, and `verification` tables
   - Sets up indexes and foreign keys

2. **Add Onboarding Column** (`20260106143238_add_onboarding_column.sql`)
   - Adds `hasCompletedOnboarding` column to `user` table
   - Uses idempotent migration pattern

## Common Commands

| Command                  | Description                                     |
| ------------------------ | ----------------------------------------------- |
| `pnpm run db:new <name>` | Create new migration file                       |
| `pnpm run db:migrate`    | Apply pending migrations locally                |
| `pnpm run db:reset`      | Reset local database and reapply all migrations |
| `pnpm run db:push`       | Push migrations to remote Supabase project      |
| `pnpm run db:status`     | Check migration status                          |

## Troubleshooting

### Error: "project not found"

Make sure you've linked your project:

```bash
supabase link --project-ref your-project-ref
```

### Error: "migration already applied"

This is normal if you're trying to reapply a migration. Supabase tracks which migrations have been applied.

### Error: "relation already exists"

If you see this error, the migration may have been partially applied. Check your database state and either:

1. Roll back the partial migration
2. Modify the migration to be idempotent (use `IF NOT EXISTS`)

### Reset Everything

If you need to start fresh:

```bash
# Reset local database
pnpm run db:reset

# Or manually
supabase db reset
```

## Migration Best Practices

1. **Always test locally first** - Use `db:reset` to test migrations
2. **Use idempotent migrations** - Check for existence before creating
3. **One change per migration** - Keep migrations focused
4. **Use descriptive names** - Make it clear what each migration does
5. **Review before pushing** - Always review migrations before `db:push`
6. **Backup production** - Consider backing up before major migrations

## Integration with Better Auth

Better Auth migrations are now managed through Supabase migrations. When you add new fields to `auth.ts`:

1. Generate the migration SQL using Better Auth CLI:

   ```bash
   dotenv -e .env -- npx @better-auth/cli generate --config ./src/libs/better-auth/auth.ts
   ```

2. Create a new Supabase migration:

   ```bash
   pnpm run db:new add_new_field_name
   ```

3. Copy the generated SQL into the new migration file

4. Make it idempotent if needed (add `IF NOT EXISTS` checks)

5. Test locally:

   ```bash
   pnpm run db:reset
   ```

6. Push to production:
   ```bash
   pnpm run db:push
   ```

## Additional Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Supabase Migrations Guide](https://supabase.com/docs/guides/database/migrations)
- [Better Auth Documentation](https://www.better-auth.com/docs)
