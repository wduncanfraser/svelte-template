# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Test Commands

```bash
pnpm dev              # Dev server at http://localhost:5173 (proxies /api/, /login, /logout, /callback to localhost:8080)
pnpm build            # Production static build → build/
pnpm preview          # Preview production build locally
pnpm test             # Run Vitest
pnpm lint             # ESLint + Prettier check
pnpm format           # Prettier auto-fix
pnpm svelte-check     # TypeScript + Svelte type check
pnpm generate-api     # Regenerate API client from src/lib/contracts/todo.yaml
```

## Running Locally

Requires the backend running at `http://localhost:8080`. See `../ktor-koin-template` for backend setup.

```bash
pnpm dev
```

Or run the full stack via Docker (frontend + backend). The frontend connects to the backend over the shared `todo-net` Docker network — start the backend stack first:

```bash
# In ../ktor-koin-template/
docker compose up -d

# Then in this directory
docker compose up
```

Requires a `.env` file at `../ktor-koin-template/.env` with Discord OAuth credentials.

## Architecture

SvelteKit SPA (adapter-static) served by nginx, consuming the Todo API via a generated TypeScript client.

### Code Generation (do not edit `src/lib/generated/`)

The OpenAPI contract lives at `src/lib/contracts/todo.yaml` — a committed copy of the backend's bundled spec. Update it manually when the backend publishes a new contract version, then run `pnpm generate-api` to regenerate the client. Commit both changes together.

After changing `src/lib/contracts/todo.yaml`, run:

```bash
pnpm generate-api
```

### Authentication

Auth is session-cookie based (httpOnly, set by the backend after Discord OAuth). The frontend never handles tokens directly.

- Login: link to `GET /login` (initiates Discord OAuth on the backend)
- Logout: link to `GET /logout` (clears cookie, redirects to `/login`)
- Auth state: detected by calling the API with `redirect: 'manual'`; an `opaqueredirect` response means unauthenticated

`src/lib/auth.svelte.ts` exports `checkAuth()` and `getAuthState()`. The root layout (`src/routes/+layout.svelte`) checks auth on mount and renders either the login screen or the app.

### Structure

```
src/lib/
  api/client.ts          # Configures generated client (baseUrl, redirect: 'manual')
  auth.svelte.ts         # Auth state and checkAuth()
  contracts/todo.yaml    # OpenAPI contract (do not edit — update from backend)
  generated/todo/        # Generated API client (do not edit)
  components/
    TodoItem.svelte
    TodoList.svelte
src/routes/
  +layout.ts             # Disables SSR (SPA mode)
  +layout.svelte         # Auth gate + app shell
  +page.svelte           # Todo list page
  +error.svelte
```

### Todo Feature (Removable)

The todo CRUD feature is self-contained in `src/lib/components/TodoList.svelte`, `src/lib/components/TodoItem.svelte`, and `src/routes/+page.svelte`. Remove these and replace with your own feature when using this as a template.

### Deployment

Multi-stage Docker build: `node:24-alpine` builds the static assets, `nginx:alpine` serves them. nginx proxies `/api/`, `/login`, `/logout`, `/callback` to the backend.

The environment variable `PUBLIC_API_BASE_URL` overrides the default API base path (`/api/v1`).
