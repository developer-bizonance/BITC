<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# BITC Dashboard & Backend Architecture Rules
1. **Prisma 7 & Neon PostgreSQL**: All database schema changes must be updated in `prisma/schema.prisma` and configured in `prisma.config.ts`. Always run `npx prisma db push` and `npm run db:seed` when modifying models.
2. **Dashboard Readiness**: Maintain clean relationships between `User`, `Course`, `Application`, `Inquiry`, `Event`, and `Blog` models to support Admin & Student Dashboard features (role-based access, application status changes, student enrollment management, and inquiry conversion pipelines).
3. **API Contracts**: All backend route handlers in `/api/` must return structured JSON responses (`{ success: boolean, data/courses/application, error?: string }`) and gracefully handle database operations with fallback mechanisms.

