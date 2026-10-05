# Paso 4 — Servicios + React Query para mascotas, productos, servicios e inventario

> Guía pedagógica del paso. Cada tecnología nueva se explica con:
> 1) Qué es y qué problema resuelve · 2) Por qué la usamos aquí ·
> 3) Alternativas y por qué las descartamos · 4) Cuándo se usa en proyectos
> reales · 5) Qué parte del proyecto cambió.

---

## 4.0 — Fix crítico del contador de HC

**Qué pasó.** El trigger `assign_pet_hc` leía el contador con
`counter_date = CURRENT_DATE`. La PK de `company_counters` es
`(company_id, counter_type, counter_date)`, así que cada día se creaba una
fila NUEVA empezando en 0 → al día siguiente el trigger generaba HC 000001
de nuevo → choque con el índice único `uq_pets_company_hc` → **insertar una
mascota fallaba con "duplicate key"**.

**La lección pedagógica.** Un contador que representa numeración de
historia clínica es **monotónico por empresa**: no se reinicia nunca.
El turno de grooming sí se reinicia a diario (por eso su type se llama
`GROOMING_TURN_DAILY`). La solución sin cambiar la PK: para PET_HC usar
la fecha fija `'1970-01-01'`, así existe una única fila por empresa.

**Archivos.** `supabase/migrations/20260825000000_fix_pet_hc_counter.sql`
(también consolida las filas diarias preexistentes).

---

## 4.1 — Escrituras de clientes (fase 1G de la deuda)

El Paso 1C migró solo la LECTURA de clientes; `addClient`/`updateClientData`
eran stubs que hacían `console.warn` y `CreateClientForm` navegaba a un
perfil que no existía.

**Novedad pedagogica — "el backend devuelve el objeto creado".** Cuando
Postgres genera el `id` con `gen_random_uuid()`, el frontend no puede
saber el id hasta que la DB responde. Por eso `createClient` devuelve el
`Client` persistido y el form navega con el **id real**, no uno generado
por el cliente que nunca se inserto. Igual patron para mascotas.

**Soft delete.** `removeClient` hace `UPDATE deleted_at = now()` porque la
RLS concede UPDATE a recepcionistas pero DELETE solo al ADMIN. Así un
recepcionista puede "eliminar" clientes sin chocar con la policy. Queries
leen con `is('deleted_at', null)`.

---

## 4.2 — Mascotas + historial clínico

**Joins embebidos de PostgREST.** Una sola query trae mascota + dueno +
registros + autor porque las FKs estan declaradas:

```ts
supabase.from('pets').select(`
  *,
  clients ( first_name, last_name ),
  pet_records ( *, profiles ( first_name, last_name ) )
`)
```

El mapping del servicio normaliza:
- `CONSULTA`/`NOTA` ↔ `consultation`/`note`.
- constantes fisiológicas: DB `temperature`, `heart_rate`… columnas planas →
  UI `physiologicalConstants` (objeto anidado).
- `created_by` (UUID) + join `profiles` → `createdBy` (nombre completo).

**Trade-off documentado:** el listado de mascotas trae *todos* los records
(embebidos). Con datasets de una clinica (<100 mascotas) es aceptable;
si crece, se separa `usePetRecordsQuery(petId)` en la ficha.

**Los contadores viven en la DB.** El HC ya NO genera el React: `historyCounter`
se elimino; el preview del form usa `useNextPetHcQuery()` que suma +1 al
`company_counters` (legible: tiene policy SELECT).

---

## 4.3 + 4.4 — Productos, servicios e inventario

**Identidad de UI = `systemCode`.** El `Product` UI tiene dos ids: `id`
(UUID de la DB) y `systemCode` (único por empresa). El router y las pages
usan `systemCode`; el servicio traduce `system_code`.

**Regla de oro del stock (por qué).** El stock se escribe SOLO vía
movimientos; el trigger de la DB hace la aritmética atómica. Dos
recepcionistas al mismo tiempo no lo corrompen. El frontend lee
`products.stock` y React Query invalida la lista tras crear un movimiento. El trigger rechaza sobredescargas (`CHECK stock >= 0`).

---

## Fase de seguridad adicional (post-auditoría)

Tras la auditoria de seguridad completa, en el Paso 4.5 se aplico este hardening:

1. `20260825100000_rls_hardening.sql`: helpers (`current_role`, `is_admin`,
   `current_company_id`) exigen `active`; revival de soft-delete bloqueada
   a no-admins; SELECT filtra `deleted_at`; FKs cross-tenant bloqueadas por
   trigger; `products.stock` resulta inmutable desde la app (solo via trigger).
2. Edge Function `deactivate` revoca sesiones; Login bloqueo inactivo.
3. `window.supabase` y Devtools solo en DEV.
4. Reset-password real ('/reset-password'), UserPassword funcional.

---

## Mini-script de migración de datos (localStorage → Supabase)

Ya no necesitas re-importar nada manualmente: `scripts/migrate-localstorage.mjs`.

**Antes de correr, agrega a `.env`** (el mismo panel donde ya pusiste las
credenciales VITE_):

```
ADMIN_EMAIL=tu_admin@...
ADMIN_PASSWORD=
```

### Paso a paso

1. **Abre la app vieja en el navegador** (donde están los datos locales).
2. Abre la consola (F12) y pega:

```js
copy(JSON.stringify({
  clients: localStorage['clients'],
  petsData: localStorage['petsData'],
  productsData: localStorage['productsData'],
  servicesData: localStorage['servicesData'],
  restockData: localStorage['restockData'],
  dischargesData: localStorage['dischargesData']
}, null, 2))
```

3. Eso copio el JSON al portapapeles. En la raíz del proyecto, créalo como
   `localstorage-export.json` (pega el resultado y guarda).
4. En la consola del proyecto:
   ```bash
   npm run migrate:localstorage
   ```
5. El script imprime progreso por fase y termina con un resumen
   (clientes/mascotas/records/servicios/productos/movimientos + ajuste de
   stock). Es un movimiento con type CARGA/DESCARGA + items, como
   cualquier operación normal.

**Es idempotente**: puedes re-ejecutarlo si algo falla; los que ya estaban
subidos no se duplican.

---

## Qué YA es Supabase tras este paso

entidad | tabla | estado
---|---|---
Clientes | `clients` | ✅ CRUD completo
Mascotas | `pets` | ✅ CRUD completo (HC por trigger)
Historial clinico | `pet_records` | ✅ CRUD completo
Productos | `products` | ✅ CRUD completo (stock via movimientos)
Servicios | `services` | ✅ CRUD completo
Movimientos | `inventory_movements` + items | ✅ cargar/descargar/listar/ver
Perfiles usuario | `profiles` + `companies` | ✅ (Paso 4.5)

**Sigue en localStorage**: colas (Paso 6), caja/pagos (Paso 5), y solo
UI state: `themeColor`, `roles` (no de negocio), overlay de companyData.

## Próximos pasos (ordenas)

- Paso 5: ventas/comprobantes/caja (`invoices`, `payments`).
- Paso 6: colas (clínica y grooming).
- Paso 7 completo: migrar historial de ventas a Supabase (el script se
  extiende).
