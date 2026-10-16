# Paso 8 — Pruebas de penetración (RLS)

> **Qué es.** El hardening de seguridad YA está aplicado en la DB
> (`20260825100000_rls_hardening.sql` + `20260825120000_queue_delete_policies.sql`).
> Este paso lo VERIFICA con cada rol: intentar lo que DEBE fallar y confirmar
> que falla, y repetir lo que DEBE permitirse y confirmar que funciona.
>
> Mientras el smoke test preguntó *"¿funciona lo que debe funcionar?"*, esto
> pregunta *"¿falla lo que debe fallar?"*. Un "pasa" aquí es una bandera roja.

---

## Cómo correr las pruebas

1. `npm run dev` (necesario: `window.supabase` SOLO se expone en DEV;
   en producción la app no expone el cliente — protección anti-XSS).
2. Abre `http://localhost:5173` → F12 → pestaña **Console**.
3. Login con la cuenta del rol que vas a testear (cada bloque lo indica).
4. Pega el snippet COMPLETO (incluye el helper inicial) en la consola y Enter.
5. Compara la salida con el "ESPERADO" de cada bloque.

**Ayuda de lectura de errores:**
- `error.code === '42501'` con mensaje *"new row violates row-level security policy"*
  → RLS bloqueó un INSERT/UPDATE (la policy WITH CHECK rechazó la fila nueva).
- `data: []` con `error: null` en DELETE/UPDATE → RLS no rechazó la operación,
  simplemente **la fila no era visible** para ese rol y se afectó a 0 filas
  (así funcionan las policies de USING: filtros silenciosos).
- Errores con texto en español (ej. *"No puedes restaurar un registro..."*)
  → vienen de los TRIGGERS de seguridad, no de las policies (2a capa).

**Checklist de resultados:** al final hay una tabla para marcar PASS/FAIL y qué reportar.

---

## TEST A — RECEPCIONISTA

> Login: `recepcion@vetariel.com` / `123123`

**Helper** (pégalo una vez al iniciar la sesión de cada rol):

```js
// Helper: corre un query y imprime {data, error} legible
const $q = async (label, promise) => {
  const { data, error, count } = await promise;
  console.log(`▶ ${label}`, { data, error, count });
  return { data, error, count };
};
const myRole = await window.supabase.from('profiles').select('role, active').single();
console.log('Mi perfil:', myRole.data);
```

### A1 — DELETE directo de mascota/cliente: DEBE afectar 0 filas

```js
var { data: pet } = await window.supabase.from('pets').select('id, pet_name').limit(1).single();
$q('DELETE mascota (recepcionista)', window.supabase.from('pets').delete().eq('id', pet.id).select());
// ESPERADO: data = [] y error = null  (RLS silencia: la fila no es visible para borrar)
$q('verificar que la mascota SIGUE viva', window.supabase.from('pets').select('id, pet_name, deleted_at').eq('id', pet.id).single());
// ESPERADO: data existe (deleted_at = null). PASS si la fila sigue viva.
```

```js
var { data: cli } = await window.supabase.from('clients').select('id, first_name').limit(1).single();
$q('DELETE cliente (recepcionista)', window.supabase.from('clients').delete().eq('id', cli.id).select());
// ESPERADO: data = [], error = null. La fila NO se borró (solo admin puede).
```

### A2 — Soft-delete vía update: SÍ está permitido

```js
// Usa el cliente de smoke test "Smoke Test" para no tocar datos reales.
// Si nunca lo creaste, cambia first_name por el de un cliente real.
var { data: cli } = await window.supabase.from('clients').select('id, first_name').eq('first_name', 'Smoke').single();
$q('soft-delete cliente', window.supabase.from('clients').update({ deleted_at: new Date().toISOString() }).eq('id', cli.id).select());
// ESPERADO: 1 fila actualizada, error = null.
$q('la papelera es INVISIBLE vía API', window.supabase.from('clients').select().eq('id', cli.id));
// ESPERADO: data = [] pese a existir en DB (RLS SELECT filtra deleted_at).
$q('revivir fila borrada debe FALLAR', window.supabase.from('clients').update({ deleted_at: null }).eq('id', cli.id).select());
// ESPERADO: error 'No puedes restaurar un registro eliminado. Pide a un administrador.'
```

> Si A2 pasa: deja al cliente soft-deleted de momento (te servirá en C3/D2) y
> restaúralo al final como ADMIN con el paso D3 o el SQL de limpieza.

### A3 — Historial clínico: recepcionista NO puede escribir

```js
var { data: pet } = await window.supabase.from('pets').select('id, pet_name').limit(1).single();
$q('INSERT record (recepcionista)', window.supabase.from('pet_records').insert({ pet_id: pet.id, type: 'NOTA', reason: 'test recep' }));
// ESPERADO: error 42501 'new row violates row-level security policy for table "pet_records"'
// (la policy de insert solo concede ADMIN y VETERINARIO)
```

### A4 — Operar la cola de clínica: SÍ (Paso 6)

```js
var { data: cq } = await window.supabase.from('clinic_queue').select('id, state').limit(1).single();
if (cq) $q('UPDATE estado de cola (recepcionista)', window.supabase.from('clinic_queue').update({ state: 'EN_ESPERA' }).eq('id', cq.id).select());
// ESPERADO: 1 fila actualizada (la cola permite admin/recep/vet). Si no hay filas: créalas
// desde la UI (smoke test paso 7.1).
$q('DELETE de cola (recepcionista)', window.supabase.from('clinic_queue').delete().eq('id', cq.id).select());
// ESPERADO: 1 fila borrada (Paso 6 lo permite: admin/recep/vet).
```

---

## TEST B — GROOMER

> Primero crea el usuario: **Config → Usuarios → Crear usuario** con
> `groomer@vetariel.com`, rol **GROOMER**, contraseña `123123`.
> Luego logout en tu cuenta admin y login como `groomer@vetariel.com`.

Pega el helper (arriba) y corre:

### B1 — Escribir clientes: DEBE fallar en todo ámbito

```js
// B1a INSERT: la policy de insert no incluye GROOMER -> 42501
$q('INSERT cliente (groomer)', window.supabase.from('clients').insert({ first_name: 'H', last_name: 'Hack', phone1: '999999999', address: 'x' }));
// ESPERADO: error 42501 'new row violates row-level security policy for table "clients"'

// B1b UPDATE: la policy USING no incluye GROOMER -> 0 filas (silencioso)
$q('UPDATE clientes (groomer)', window.supabase.from('clients').update({ email: 'hack@evil.com' }).neq('email', 'hack@evil.com').select());
// ESPERADO: data = [], error = null. NADIE (de tu empresa) fue actualizado.
```

### B2 — Escribir mascotas/records: DEBE fallar

```js
var { data: cli } = await window.supabase.from('clients').select('id, first_name').limit(1).single();
$q('INSERT mascota (groomer)', window.supabase.from('pets').insert({ owner_id: cli.id, pet_name: 'Hack', species: 'CANINO', breed: 'CRUCE', sex: 'MACHO', birth_date: '2020-01-01' }));
// ESPERADO: error 42501 table "pets"
var { data: pet } = await window.supabase.from('pets').select('id, pet_name').limit(1).single();
$q('INSERT record (groomer)', window.supabase.from('pet_records').insert({ pet_id: pet.id, type: 'NOTA', reason: 'test groomer' }));
// ESPERADO: error 42501 table "pet_records"
```

### B3 — Leer todo lo de la empresa: SÍ puede

```js
const leer = async (t) => (await window.supabase.from(t).select('id')).data?.length;
for (const t of ['clients', 'pets', 'pet_records', 'products', 'services']) {
  console.log(` Lectura ${t}: ${await leer(t)} filas`);
}
// ESPERADO: números >= 1 (con la empresa ya poblada), sin errores. GROOMER lee TODO el tenant.
```

### B4 — Operar su cola de grooming: SÍ (Paso 6)

```js
// 1) Crea una orden de grooming desechable desde la UI (menú Grooming → Nueva
//    orden → agrega cualquier servicio → crear).
var { data: fq } = await window.supabase.from('grooming_queue').select('id, turn, state').order('created_at', { ascending: false }).limit(1).single();
if (!fq) { console.log('No hay órdenes: crea una desde la UI primero'); } else {
  $q('UPDATE estado grooming (groomer)', window.supabase.from('grooming_queue').update({ state: 'EN_ATENCION' }).eq('id', fq.id).select());
  // ESPERADO: 1 fila actualizada (admin/recep/groomer pueden).
  $q('DELETE grooming (groomer)', window.supabase.from('grooming_queue').delete().eq('id', fq.id).select());
  // ESPERADO: 1 fila borrada (Paso 6 la permite; los items se borran en cascada).
}
```

---

## TEST C — Cross-tenant (otra empresa)

> Necesita una EMPRESA B temporal en la DB. A un usuario de B NO le debe
> llegar NADA de VetAriel, ni leer ni escribir. Setup + teardown en SQL Editor.

### C1 — Setup (SQL Editor)

```sql
-- Empresa B de prueba. Devuelve su id (guárdalo: es <EMPRESA_B_ID>):
insert into companies (name, ruc)
values ('Empresa B (test)', '99999999999')
returning id as empresa_b_id;

-- Cliente de B (suficiente para el test de lectura de C3):
insert into clients (company_id, first_name, last_name, phone1, address)
values (
  (select id from companies where name = 'Empresa B (test)'),
  'Cliente', 'De B', '999000000', 'Calle B 123'
);
```

### C2 — Usuario de B

1. Dashboard > **Authentication > Users > Add user** → `tenantb@test.com`
   con contraseña `123123` y marca **Confirmar automáticamente el correo**.
2. En el SQL Editor (el trigger `handle_new_user` NO lo asigna, porque
   requiere app_metadata que el dashboard no pasa):

```sql
insert into public.profiles (id, company_id, role, first_name, last_name)
select id, (select id from companies where name = 'Empresa B (test)'),
       'ADMIN', 'Usuario', 'B'
from auth.users where email = 'tenantb@test.com'
on conflict (id) do update set company_id = excluded.company_id,
                               role = excluded.role;
```

> Nota: lo creamos como ADMIN de la empresa B a propósito — es el peor caso
> posible: un admin de otra empresa. Si falla, es lo que pasa.

3. Logout en la app → login `tenantb@test.com` / `123123` → pegar helper.

### C3 — Desde B: datos de VetAriel son invisibles

> Antes de cambiar de sesión: en tu consola de **VetAriel** (Test A ya imprime
> mascotas) anota un `pet_id` real de VetAriel → será `<PET_ID_VETARIEL>`.

```js
$q('clients visibles', window.supabase.from('clients').select('id, first_name'));
// ESPERADO: solo 'Cliente De B' (1 fila). NINGÚN cliente de VetAriel.
// (Revisa también la UI: clientes, mascotas y ventas TODO vacío para B.)
$q('UPDATE cliente de VetAriel', window.supabase.from('clients').update({ phone1: '000' }).eq('first_name', '<NOMBRE_CLIENTE_VETARIEL>').select());
// ESPERADO: data = []. La policy filtra por empresa aunque uses su UUID/nombre.
// (Obtén <NOMBRE_CLIENTE_VETARIEL> desde la app con tu login de VetAriel.)
$q('INSERT record apuntando a mascota de VetAriel', window.supabase.from('pet_records').insert({ pet_id: '<PET_ID_VETARIEL>', type: 'NOTA', reason: 'cross tenant' }));
// ESPERADO: error 'El recurso referenciado pertenece a otra empresa.'
// (2ª capa: trigger de FKs cross-tenant.)
```

> Con ADMIN de B, la vista es la dura: el usuario tendrá permisos "de admin",
> pero la UI de B estará vacía (0 clientes, 0 ventas, 0 mascotas) porque
> no hay data de B más que el cliente de prueba, y la de VetAriel es
> invisible. El peor caso de abuso queda neutralizado.

### C4 — Teardown (SQL Editor)

```sql
-- Borra la empresa B de prueba y su usuario. Primero OBTÉN los ids
-- con estos SELECT y reemplaza los placeholders:
select id, email from auth.users where email = 'tenantb@test.com';
select id, name from companies where name = 'Empresa B (test)';

-- Orden de borrado (hijos antes que padres):
delete from public.pets     where company_id = '<EMPRESA_B_ID>';
delete from public.clients  where company_id = '<EMPRESA_B_ID>';
delete from public.profiles where id = '<ID_AUTH_USER_B>';
-- auth.users también puedes borrarlo desde Dashboard > Authentication > Users:
delete from auth.users where id = '<ID_AUTH_USER_B>';
delete from public.companies where id = '<EMPRESA_B_ID>';
```

---

## TEST D — Usuario desactivado

> Prueba los 2 mecanismos: bloqueo de login Y corte de acceso con JWT vigente.

### D1 — Login bloqueado

1. Como ADMIN: Config → Usuarios → desactiva `recepcion@vetariel.com`
   (la UI llama a la Edge Function `admin-users` acción `deactivate`,
   que además REVOKA las sesiones activas del usuario).
2. Cualquier intento de login en la app con ese usuario → DEBE mostrar
   mensaje de bloqueo (cuenta desactivada) y NO entrar.

### D2 — Aunque conserve un JWT viejo: RLS lo corta

1. IMPORTANTE: desactiva al recepcionista en D1 SIN cerrar su pestaña
   (la sesión debe haberse abierto ANTES de la desactivación). En esa
   pestaña vieja pega el helper y corre:

```js
$q('SELECT clientes (sesión vieja)', window.supabase.from('clients').select('id, first_name'));
// ESPERADO: data = [] (current_company_id() devuelve NULL si profile.active = false).
var { error } = await window.supabase.from('clients').insert({ first_name: 'Zombie', last_name: 'User', phone1: '0', address: 'x' });
console.log('INSERT con JWT viejo:', error);
// ESPERADO: error 42501 (company_id y rol dejan de resolver).
```

### D3 — Revivir y restaurar (como ADMIN, al terminar)

1. Login admin → Config → Usuarios → activa de nuevo `recepcion@vetariel.com`.
2. Login recepcionista → verificado que puede leer TODO su tenant de nuevo.
3. (Si A2 dejó al cliente "Smoke" soft-deleted:) revívalo como admin via SQL
   (`update clients set deleted_at = null where first_name = 'Smoke';`).

---

## Checklist de resultados

| # | Prueba | ESPERADO | Resultado (PASS/FAIL) | Detalle si FAIL |
|---|---|---|---|---|
| A1 | Recep DELETE directo | rows=0 | | |
| A1b | La fila sigue viva | deleted_at=null | | |
| A2 | Recep soft-delete | 1 fila | | |
| A2b | Papelera invisible | rows=[] | | |
| A2c | Recep revivir fila | error trigger | | |
| A3 | Recep INSERT record | 42501 | | |
| A4 | Recep UPDATE cola | 1 fila | | |
| A4b | Recep DELETE cola | 1 fila | | |
| B1 | Groomer INSERT cliente | 42501 | | |
| B1b | Groomer UPDATE cliente | rows=[] | | |
| B2 | Groomer INSERT mascota/record | 42501 | | |
| B3 | Groomer LEE todo | filas>0 | | |
| B4 | Groomer UPDATE/DELETE grooming | 1 fila | | |
| C3 | B solo ve SU data | 1 fila ("De B") | | |
| C3b | B UPDATE cliente VetAriel | rows=[] | | |
| C3c | B INSERT record cross-tenant | error trigger | | |
| D1 | Login bloqueado | mensaje de bloqueo | | |
| D2 | JWT viejo+inactivo: SELECT | rows=[] | | |
| D2b | ...: INSERT | 42501 | | |

Si algo PASA cuando debía fallar, NO corras la siguiente prueba hasta arreglarlo:
cada hallazgo se convierte en una migración nueva (como los saltos que dimos en
la 4.5). Usa `docs/SMOKE_TEST.md` como referencia de los flujos normales.
