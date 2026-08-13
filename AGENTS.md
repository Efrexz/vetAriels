# AGENTS.md

Project: VetAriel / "Gestor Veterinario" — React 18 + TypeScript + Vite 6 SPA for
veterinary clinic management. Deployed to Vercel.

## Commands

- `npm run dev` — Vite dev server.
- `npm run build` — production build (vite build). Emits to `dist/`.
- `npm run lint` — ESLint over `js,jsx,ts,tsx` with `--max-warnings 0`.
- `npm run lint:fix` — ESLint auto-fix.
- `npm run typecheck` — `tsc --noEmit`. **Must pass before committing.**
- `npm run format` — Prettier format all source files.
- `npm run format:check` — Prettier check without writing.
- `npm run test` — Vitest in watch mode.
- `npm run test:run` — Vitest single run (CI).
- `npm run test:coverage` — Vitest with coverage report.
- `npm run preview` — serve the built `dist/`.

Pre-commit hook (Husky + lint-staged): runs ESLint on staged JS/TS files and
Prettier on staged CSS/JSON files. Use `npm run format` for explicit source
formatting; the existing source is not yet fully formatted.

## Architecture / data layer

- **No backend. All persistence is `localStorage`.** Four React contexts
  (`GlobalContext`, `ClientsContext`, `ProductsAndServicesContext`,
  `FinancialContext` in `src/context/`) read/write localStorage keys
  (`activeUser`, `users`, `roles`, `clients`, `petsData`, `productsData`,
  `servicesData`, `restockData`, `dischargesData`, `paymentsData`,
  `petsInQueue*`, `historyCounter`, `companyData`, `themeColor`, ...). To reset
  the app during dev, clear site data / localStorage.
- Auth: `src/components/ProtectedRoute.tsx` gates every route except `/login`.
  The active session is `localStorage['activeUser']`. App.tsx renders the
  `Layout` + `ProtectedRoute` tree only when `pathname !== '/login'`, otherwise
  a bare `/login` route. Default demo creds are documented in `README.md`.
- Routing: `react-router-dom` v6, declared in `src/App.tsx`. SPA fallback is
  handled by `vercel.json` (rewrite everything to `/`).

## Path aliases / imports

Aliases are defined in **both** `tsconfig.json` and `vite.config.js`; keep them
in sync:

- `@assets/*` → `src/assets/*`
- `@components/*` → `src/components/*`
- `@pages/*` → `src/Pages/*`  (note: folder is `Pages`, alias is `@pages`)
- `@context/*` → `src/context/*`
- `@t/*` → `src/types/*`
- `@utils/*` → `src/utils/*`
- `@hooks/*` → `src/hooks/*`

Import extension style is inconsistent in the migration: `main.tsx` imports
`./App.jsx`, `App.tsx` imports e.g. `./Pages/Internments.jsx` and
`./Pages/products/operationInfo.jsx/OperationInfo` (note the
`operationInfo.jsx` directory name — match it exactly). When adding files,
follow the surrounding file's existing extension convention rather than
inventing a new one.

`index.html` references `/src/main.jsx` even though the file is `main.tsx`;
Vite resolves it — do not "fix" this without verifying.

## Toolchain

- Vite plugins: `@vitejs/plugin-react-swc` (SWC, not Babel) and
  `vite-plugin-svgr`. SVGs under `src/assets/*.svg` are imported as React
  components.
- `tsconfig.json`: `target: "ES2020"`, `strict: true`, `noEmit: true`,
  `types: ["vite/client"]`. Only `src/` is included in TS checking.
- Tailwind: `@tailwindcss/forms` plugin + custom `xs: 475px` breakpoint.
  Content globs cover `js,ts,jsx,tsx` — new source dirs under `src/` are picked
  up automatically.
- ESLint: `@typescript-eslint` parser + recommended rules for TS/TSX files.
- Prettier: single quotes, trailing commas, 100 char width.
- Vitest: jsdom environment, global test helpers, setup file at `src/test/setup.ts`.
- Husky + lint-staged: pre-commit auto-format + lint on staged files.

## Style / layout conventions

- Feature screens live under `src/Pages/<feature>/` subfolders
  (`sales`, `grooming`, `products`, `servicesSection`, `configurationSection`,
  `clientData`, `petInfo`). Reusable UI is in `src/components/`
  (`forms`, `layout`, `modals`, `search`, `ui`).
- Styling is Tailwind utility classes + theme color stored in localStorage
  (`themeColor`, defaults to `blue`). Respect the active theme color rather
  than hardcoding colors.
- UI text and README are in Spanish; commit messages are in Spanish. Match the
  existing language when editing.
