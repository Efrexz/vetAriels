# Paso 1 — Schema v2 (multi-tenant, roles seguros, facturación peruana)

Este paso sienta las bases de TODO el producto. Se ejecuta **una sola vez** por
proyecto de Supabase.

## Orden de ejecución

En el **SQL Editor** de Supabase, ejecuta estos archivos en orden. Cada uno
asume que el anterior terminó bien.

1. `db/supabase-schema-v2.sql` — 15 tablas + índices + constraints + RLS activado.
2. `db/supabase-triggers-v2.sql` — 6 triggers (profile, stock, correlativos, updated_at).
3. `db/supabase-rls-v2.sql` — 50+ policies por empresa y por rol.
4. `db/supabase-seed-v2.sql` — Crea la empresa "VetAriel" + 4 clientes + 5 mascotas demo.

Después del seed, ejecuta `db/supabase-verify-v2.sql` paso a paso para validar.

## Qué necesitas hacer ANTES del seed

1. **Authentication > Users > Add user**:
   - Email: `zyzz_448@hotmail.com`
   - Password: `123123`
   - Auto Confirm User: ✅
   - **App Metadata** (JSON):
     ```json
     {
       "company_id": "00000000-0000-0000-0000-000000000001",
       "role": "ADMIN",
       "first_name": "efrain",
       "last_name": "quintero"
     }
     ```
2. El trigger `handle_new_user` creará el `profile` automáticamente al insertar el usuario.

## Qué cambió respecto a v1

| Antes (v1, 1C-1E) | Ahora (v2) |
|---|---|
| 2 tablas mínimas | 16 tablas (15 + company_counters) |
| Sin tenant | `company_id` en todo |
| Rol en `user_metadata` (vulnerable) | Rol en tabla `profiles` (seguro) |
| Stock calculado en frontend | Stock via trigger en DB |
| Sin soft delete | `deleted_at` en todas las entidades |
| Sin auditoría | | `created_at`/`updated_at`/`created_by` |
| Correlativos manuales | Atómicos via `company_counters` + `FOR UPDATE` |
| Historial grooming tabla aparte | Estado `ENTREGADO` en la misma tabla |
| `pet.records` (JSON embebido) | Tabla propia `pet_records` |

## Cómo leer las policies

Todas usan helpers:
- `public.current_company_id()` → empresa del usuario actual.
- `public.current_role()` → rol del usuario actual.
- `public.is_admin()` → shortcut para `role = 'ADMIN'`.

Cada tabla tiene 4 policies (SELECT, INSERT, UPDATE, DELETE). El control es
por **empresa Y por rol** simultáneamente.

## Próximo paso (Paso 2)

Una vez validado: confirmar el auto-promoción ya no funciona (intentar
`supabase.auth.updateUser({ data: { rol: 'ADMIN' } })` no debe cambiar nada en
profiles.role porque el rol vive en `profiles`, no en metadata). Después
arreglamos la policies con un trigger que impida al usuario cambiar su propio
rol/empresa. Ese trigger va en el Paso 3.

## Si algo falla

Errores comunes y solución:

| Error | Causa | Solución |
|---|---|---|
| `relation "public.profiles" does not exist` | Ejecutaste triggers-v2 antes que schema-v2 | Ejecuta en orden. |
| `permission denied for table profiles` | La policy de profiles bloquea el trigger | El trigger usa `SECURITY DEFINER`, no debería pasar. Si pasa, revisa que se haya ejecutado. |
| `duplicate key value violates unique constraint` en pets hc | Reejecutaste el seed | Limpia las tablas antes de re-seed (DROP + recreate). |
| El HC sale NULL | El trigger no se creó | Re-ejecuta triggers-v2. |
| No puedo ver tablas en Table Editor | RLS está activado pero no tienes profile | Crea el usuario con metadata correcta. |

Cuando termines, dime "Paso 1 OK" y vamos al Paso 2 (verificación de
seguridad del rol + trigger anti-auto-promoción).