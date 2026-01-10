---
name: chat-companion
description: This is a new rule
---

# 1. Tech Stack (Locked)

These choices are final unless explicitly changed by maintainers.

Framework: Next.js (App Router)

Language: TypeScript (required, no JavaScript files)

Rendering Model: React Server Components (default)

Styling:

Tailwind CSS (layout, spacing, utilities)

Stylus CSS Modules (complex, component-specific styles)

UI Foundation:

- shadcn/ui

- Radix UI

State Management:

- Zustand (client-only UI state). It should compatible for hydration.

Forms:

tanstack-form

Zod (schema validation)

URL State:

- nuqs

Data Validation:

- Zod

Animation:

- Framer-motion

# 2. Naming Conventions

Folders: kebab-case (profile-settings)

React Components: kebab-case (UserProfile.tsx)

Hooks: camelCase with use prefix (useProfile)

Files:

Components: kebab-case.tsx

Hooks / utils: kebab-case.ts

# 3. API Route handler

API Route Handlers

Located at app/api/\*\*/route.ts

Validate all inputs with Zod

Return consistent response shape:

# 4. Error Handling

Use error.tsx per route

Use notFound() for 404

No silent failures

Always surface user-safe error messages

# 5. Project Enforcement Rules

Follow existing patterns before introducing new ones

No new libraries without approval

Prefer refactoring over duplication

Keep diffs minimal and intentional
