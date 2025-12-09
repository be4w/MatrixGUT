Purpose
This file gives concise, repository-specific guidance for AI coding agents working on MatrixGUT. Focus on the concrete patterns, commands, file locations, and gotchas discovered directly in the codebase.

**Architecture**

- **Server:** Express-based ESM server in `server/`. Entrypoint: `server/index.ts`. Dev mode uses Vite middleware (`server/vite.ts`) for HMR; production serves the built client from `dist/public`.
- **Client:** Vite + React app rooted at `client/`. Entry: `client/src/main.tsx`. `client/index.html` is the HTML template.
- **Database:** Drizzle ORM with `shared/schema.ts`. Migrations live in `migrations/`. `server/db.ts` wires Neon/Drizzle when `DATABASE_URL` is set.
- **Storage switch:** `server/storage.ts` exposes `storage` which is `MemStorage` when `DATABASE_URL` is not set (local dev) and `DbStorage` when it is set (production).

**Key commands / developer workflows**

- `npm run dev` — run `tsx server/index.ts` (development server + Vite middleware + HMR). Use this for iterative work on both client and server.
- `npm run build` — builds the client with Vite, then bundles the server with `esbuild` into `dist/`. The client build is emitted to `dist/public` (see `vite.config.ts`).
- `npm run start` — runs `NODE_ENV=production node dist/index.js`. Ensure `npm run build` ran successfully first.
- `npm run db:push` — run `drizzle-kit push` to apply schema changes/migrations.
- `npm run check` — `tsc` type-check only.

Environment notes

- The project targets Node `20.x` (see `package.json` `engines`).
- `DATABASE_URL` toggles actual DB usage. Without it, the app uses `MemStorage` (in-memory) — useful for local testing.
- `PORT` can be set to change the listening port; default is `5000`.

Project-specific patterns & gotchas

- ESM + TypeScript: the server runs as ESM; `fileURLToPath(import.meta.url)` and `__dirname` shims are used in server files (`server/index.ts`, `server/vite.ts`).
- Path aliases are used: `@/*` -> `client/src/*` and `@shared/*` -> `shared/*` (see `tsconfig.json` and `vite.config.ts`). Use these same aliases in edits.
- Vite middleware: In dev, the server uses Vite in middleware mode (`setupVite`). That function rewrites `src/main.tsx` to add a cache-busting HMR query — avoid altering that behavior unless you understand HMR interactions.
- Service worker & manifest: `server/routes.ts` explicitly serves `manifest.json` and `/sw.js` with proper MIME types. The SW must be available at `/sw.js` for registration in `client/src/main.tsx`.
- Validation logic: API input is validated with Drizzle + Zod. `shared/schema.ts` defines `insertTaskSchema` and includes a project-specific transform: if a task `name` ends with `hhhh` (case-insensitive) the `sensitive` flag is forced to `true`. When modifying task creation logic, preserve that transformation behavior if relevant.
- API surface: `server/routes.ts` exposes `/api/tasks` (GET, POST, PATCH, DELETE). Use `insertTaskSchema` for POST validation.
- Migrations: `server/index.ts` calls `migrate(db, { migrationsFolder: 'migrations' })` at startup when `db` exists — CI or deploy workflows should ensure migrations are present/applied.

Where to look for examples

- Server middleware and app lifecycle: `server/index.ts` and `server/vite.ts`.
- API routes & static asset serving: `server/routes.ts`.
- In-memory vs DB storage implementation: `server/storage.ts`.
- DB schema & Zod validation: `shared/schema.ts` (see `tasks` table and `insertTaskSchema`).
- Priority logic and domain rules: `client/src/lib/gut.ts` (GUT criteria + `calculatePriority`).

Editing & testing guidance

- For quick edits across client + server, run `npm run dev`. Client HMR is available through the server process.
- To reproduce production behavior locally: run `npm run build` then `npm run start` (or `NODE_ENV=production node dist/index.js`). Ensure `dist/public` exists — server will throw if it's missing.
- To enable DB-backed flows locally, set `DATABASE_URL` to a valid Neon/Postgres connection before starting. Otherwise, tests and local dev use `MemStorage`.

If something is unclear

- Tell me which part (server, client, DB, build) you want more detail about and I will expand the instructions or add examples.

---

Last updated: automatic agent scaffolded from repository contents. Please point out missing conventions or preferred workflows to iterate.
