# AGENTS.md

Project: VetAriel / "Gestor Veterinario" — React 18 + TypeScript + Vite 6 SPA for
veterinary clinic management. Deployed to Vercel. Backend: Supabase (Postgres +
Auth + RLS + Edge Functions) + `@tanstack/react-query` en el cliente.

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
- `npx supabase <cmd>` — Supabase CLI v2 (instalado como devDep). Solo se
  usa contra el proyecto linkeado. Para cambios de schema usar el
  SQL editor del dashboard hasta definir el flujo de envs (Paso 9).

Pre-commit hook (Husky + lint-staged): runs ESLint on staged JS/TS files and
Prettier on staged CSS/JSON files. Use `npm run format` for explicit source
formatting; the existing source is not yet fully formatted.

## Architecture / data layer

### Estado actual de la migración

| Capa | Estado |
|---|---|
| Identidad (Supabase Auth + `profiles` + `companies`) | ✅ Migrado |
| Edge Function `admin-users` (CRUD usuarios) | ✅ Migrado |
| Clientes (`clients`) | ✅ Migrado (read en Paso 1C, escrituras en Paso 4.1) |
| Mascotas + historial clínico (`pets`, `pet_records`) | ✅ Migrado (Paso 4.2) |
| Productos + servicios (`products`, `services`) | ⏳ Pendiente (Paso 4.3) |
| Movimientos de inventario (`inventory_movements`, `items`) | ⏳ Pendiente (Paso 4.4) |
| Colas clínica + grooming (`clinic_queue`, `grooming_queue`) | ⏳ Pendiente (Paso 6) |
| Ventas / comprobantes / pagos (`invoices`, `payments`) | ⏳ Pendiente (Paso 5) |
| `addProductToClient` / `removeProductFromClient` (carrito en cliente) | ⏳ Pendiente (Paso 5) |
| Colas en localStorage (`petsInQueueMedical`, `petsInQueueGrooming*`) | 🟡 Aún localStorage (Paso 6) |

### Convención por entidad: `services/` + `hooks/`

Para cada tabla de negocio existe una pareja:

- `src/services/<entity>Service.ts` — única capa que sabe hablar con Supabase.
  Funciones `async` con snake_case `<Entity>Row`, mapeo a camelCase UI
  (`rowToX`), y errores traducidos al español (`translateXError`).
  El servicio es la fuente del formato: ahí se decide si los joins embeben
  clientes, productos, etc.
- `src/hooks/use<Entity>Query.ts` — React Query.
  - `<entity>Key` constante para el `queryKey` (compartido).
  - `use<Entity>Query()` para listas / `use<Entity>Query(id)` para detalle.
  - `use<Entity>Mutations()` con `create/update/remove`. Cada mutación
    invalida `<entity>Key`; `update` también hace `setQueryData` para el
    detalle cacheado.

Ejemplos ya en producción: `clientsService.ts` + `useClientsQuery.ts`,
`petsService.ts` + `usePetsQuery.ts`, `adminUsersService.ts` (Edge Function) +
`useUsersQuery.ts`.

### Contexts como fachada (no como source of truth)

Los contextos (`ClientsContext`, `ProductsAndServicesContext`,
`GlobalContext`, `FinancialContext`, `ToastContext`) ya **no** son dueñas del
estado: lo son los hooks de React Query. El contexto envuelve los hooks y
expone una API estable (`petsData`, `addPet`, `updatePetData`, …) para no
tocar ~15 consumidores cuando migramos.

Reglas:
- Las funciones que antes eran síncronas ahora devuelven `Promise`.
- Las firmas se mantienen idénticas siempre que sea posible.
- Lo que aún vive en localStorage se queda en `useState` + `useEffect`
  dentro del contexto hasta que se migra (Paso 5/6).

### Patrón de mutación en páginas (UX consistente)

Toda página que escribe contra Supabase sigue este flujo:

1. `const { toast } = useToast()`.
2. `const [isSubmitting, setIsSubmitting] = useState(false)`.
3. `async function handler() { setIsSubmitting(true); try { await mutation(); toast.success(msg); navigate(...); } catch (e) { toast.error(e.message); } finally { setIsSubmitting(false); } }`.
4. `<ActionButtons submitText={isSubmitting ? '…' : '…'} disabled={isSubmitting} onSubmit={handler} />`.

`RecordForm` y `NoteForm` aceptan ahora `submitText` + `disabled` para
encadenar este patrón en formularios del historial clínico.

### Auth y rutas

- `src/components/ProtectedRoute.tsx` envuelve cada ruta salvo `/login`.
- Sesión: `supabase.auth` (no `localStorage['activeUser']` — eso es legacy).
- `src/App.tsx` renderiza `Layout` + `ProtectedRoute` salvo en `/login`.
- `vercel.json` reescribe todo a `/` para SPA fallback.

### Datos restantes en localStorage

Solo dos categorías persisten aún ahí:
- **UI state** (no de negocio): `themeColor`, `roles`, `companyData`.
- **Colas** que se migran en Paso 6: `petsInQueueMedical`, `petsInQueueGrooming`,
  `petsInQueueGroomingHistory`.

## Path aliases / imports

Aliases definidos en **ambos** `tsconfig.json` y `vite.config.js` (mantenerlos
en sync):

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

## Database facts worth knowing

- **Multi-tenant desde el día 1**: TODA tabla de negocio lleva
  `company_id UUID → companies(id)`. El filtro se hace en la policy RLS
  usando `public.current_company_id()`.
- **Roles** viven en `profiles.role` (no en `auth.user_metadata`).
  Policies leen `public.current_role()` y conceden por rol.
- **Soft delete**: `deleted_at TIMESTAMPTZ NULL` en entidades principales.
  Queries filtran `WHERE deleted_at IS NULL`. Removes desde la UI son
  `UPDATE deleted_at = now()` (no DELETE), para que recepcionistas también
  puedan “eliminar” sin chocar con la policy DELETE (solo admin).
- **HC de mascotas** lo asigna el trigger `assign_pet_hc` con
  `LPAD(current_value, 6, '0')`. El contador vive en
  `company_counters(company_id, 'PET_HC', DATE '1970-01-01')` —
  fecha fija para evitar que el índice único `uq_pets_company_hc`
  choque al día siguiente (ver `supabase/migrations/20260825000000_fix_pet_hc_counter.sql`).
  Preview en formularios: `useNextPetHcQuery()` lee ese contador y suma 1.
- **`pets.species`** tiene CHECK `IN ('CANINO', 'FELINO')`. La UI no debe
  ofrecer otras especies.
- **`pets.esterilized`** tiene CHECK `IN ('SI', 'NO')` (string, no boolean).
- **`pet_records.type`** tiene CHECK `IN ('CONSULTA', 'NOTA')`. Las
  constantes fisiológicas son columnas planas en DB (`temperature`,
  `heart_rate`, `weight`, `oxygen_saturation`); el servicio las mapea a
  `physiologicalConstants` (objeto anidado) para la UI.
- **Stock de productos** lo mantiene el trigger `update_product_stock_on_insert/delete`
  sobre `inventory_movement_items`. **El frontend NUNCA calcula stock**
  — solo lee `products.stock` y escribe vía movimientos (Paso 4.4).
- **`invoices.correlativo`** y **`grooming_queue.turn`** se asignan atómicamente
  via `company_counters` + `SELECT … FOR UPDATE` en sus triggers.

## Migraciones SQL

- **Fuente de verdad**: `db/*.sql` (re-ejecutables, idempotentes).
  EXCEPTUO los archivos en `db/legacy/` (1C/1E) — NEVER ejecutarlos.
- **Migraciones incrementales** ya desplegadas: `supabase/migrations/<timestamp>_*.sql`.
- Cada nueva migración debe:
  1. Usar timestamp `YYYYMMDDHHmmss`.
  2. Ser idempotente (`CREATE OR REPLACE`, `DROP IF EXISTS`).
  3. Actualizar también el archivo en `db/` para mantenerlo como fuente de verdad.
  4. Comentarios en español.

## Utilidades de fecha

- SIEMPRE parsear fechas textuales con `@utils/date.ts` (`parseDateSafe`,
  `isWithinRange`, `isSameDay/Month...`). Las fechas ISO de Supabase
  ('yyyy-mm-dd') se parsean en hora LOCAL (nunca `new Date(string)`, el
  shift UTC rompe filtros en Lima UTC-5). No re-implementar parsers: es un
  solo util para toda la app.
- Para guardar fechas nuevas (movimientos, pagos) preferir created_at de
  la DB; la UI usa registrationDate/Time derivados en rowToX.

## Scripts npm

- `npm run migrate:localstorage` — script de migracion de datos (ver docs/PASO_4.md);
  requiere ADMIN_EMAIL/ADMIN_PASSWORD en `.env`. Idempotente.

## Convenciones de aprendizaje

El usuario es frontend puro aprendiendo backend. Cada tecnología nueva se introdujo con:
1. Qué es y qué problema resuelve
2. Por qué la usamos aquí
3. Alternativas y por qué elegimos esta
4. Cuándo se usa en proyectos reales
5. Qué parte del proyecto cambia

Mantener este estilo pedagógico en pasos futuros (ver `docs/PASO_*.md`).