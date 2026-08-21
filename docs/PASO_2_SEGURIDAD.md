# Paso 2 — Seguridad de roles (anti-escalación)

Este paso cierra la superficie de ataque del rol. Vamos en 2 capas:

1. **Capa 1 (ya aplicada en 1E/2E)**: Policies RLS dicen QUIÉN puede hacer QUÉ.
2. **Capa 2 (este paso)**: Triggers dicen QUÉ cambios de datos son válidos.

Aunque las policies ya bloquean mucho, los triggers son la red de seguridad
final si alguien encuentra un bug en una policy.

---

## Ejecutar el SQL

1. Abre tu proyecto en Supabase.
2. SQL Editor → **New query**.
3. Pega el contenido de `db/supabase-security-v2.sql`.
4. Click **Run**.
5. Al final del archivo hay un `SELECT` que lista los triggers activos.
   Debes ver **3 triggers** en `profiles`:
   - `trg_prevent_privilege_escalation` (BEFORE UPDATE)
   - `trg_prevent_last_admin_demotion` (BEFORE UPDATE)
   - `trg_prevent_profile_deletion` (BEFORE DELETE)
   - `trg_set_updated_at` (BEFORE UPDATE, ya existía)
   - `on_auth_user_created` (AFTER INSERT en auth.users, ya existía)

---

## Tests manuales de seguridad

Una vez ejecutados los triggers, valida con el navegador **estando logueado**.

### Test 1 — El usuario no puede auto-promoverse a ADMIN

En la consola del navegador (DevTools → Console):

```js
const { data, error } = await window.supabase
  .from('profiles')
  .update({ role: 'ADMIN' })
  .eq('id', 'TU-USER-UUID-AQUI');
console.log('Error esperado:', error?.message);
```

**Si la app no expone `window.supabase`**, agrega esto temporalmente a `src/services/supabaseClient.ts` y reinicia Vite:

```ts
if (typeof window !== 'undefined') {
  (window as any).supabase = supabase;
}
```

**Resultado esperado**:
- `error.code: '42501'` (insufficient_privilege)
- Mensaje: `"Seguridad: solo un ADMIN puede cambiar roles. Actor: ..."`
- El role sigue siendo el mismo (puedes verificarlo con un SELECT).

### Test 2 — El usuario no puede cambiar su propia empresa

```js
const { data, error } = await window.supabase
  .from('profiles')
  .update({ company_id: 'OTRA-EMPRESA-UUID' })
  .eq('id', 'TU-USER-UUID-AQUI');
console.log('Error esperado:', error);
```

**Resultado esperado**: `error.code: '42501'`.

### Test 3 — El usuario no puede darse de baja a sí mismo si es el último ADMIN

```js
const { data, error } = await window.supabase
  .from('profiles')
  .update({ active: false })
  .eq('id', 'TU-USER-UUID-AQUI');
console.log('Error esperado:', error);
```

**Resultado esperado**: Como eres el único ADMIN, debe fallar con `"No puedes degradar/desactivar al ultimo ADMIN de la empresa."`

### Test 4 — El usuario puede actualizar campos NO sensibles

```js
const { data, error } = await window.supabase
  .from('profiles')
  .update({ first_name: 'Efrain Test' })
  .eq('id', 'TU-USER-UUID-AQUI');
console.log('Debe pasar:', data);
```

**Resultado esperado**: `data` contiene tu profile actualizado. NO debe haber error.

### Test 5 — Auto-promoción via Supabase Auth NO escala privilegios

```js
const { data, error } = await window.supabase.auth.updateUser({
  data: { rol: 'ADMIN' }
});
console.log('Update metadata OK (no escala):', data);
```

**Resultado esperado**: El update pasa (Supabase Auth lo permite), pero:
- Tu `role` en `profiles` SIGUE siendo el original.
- Las queries que filtran por `profiles.role` no te ven como ADMIN.

Verifica con:

```js
const { data } = await window.supabase
  .from('clients')
  .select('*')
  .limit(1);
console.log('Debe devolver datos:', data);
```

Esto funciona aunque hayas intentado auto-promote, porque el rol real vive en `profiles`.

### Test 6 — Anon NO puede leer datos

Abre una **ventana de incógnito** (sin sesión) y ve a tu app. Debería redirigir a `/login`. Intenta acceder a la API directamente:

```js
// En la consola de la ventana de incognito
const { data, error } = await window.supabase.from('clients').select('*');
console.log('data:', data, 'error:', error);
```

**Resultado esperado**: `data: []` (array vacío por RLS) o un error de permisos.

---

## Por qué esta arquitectura es segura

| Capa | Qué protege | Cómo |
|---|---|---|
| 1. RLS policies | Acceso por fila según rol/empresa | Consultas se filtran antes de devolver |
| 2. Triggers (este paso) | Cambios de datos inválidos | Validación en la DB antes de COMMIT |
| 3. Soft-delete | Pérdida de información | DELETE se convierte en UPDATE active=false |
| 4. Anti-lockout | Empresa sin admins | Trigger cuenta admins restantes |

Aunque un atacante lograra saltarse la policy 1 (por un bug), el trigger 2
lo atrapa. Y si lograra saltarse ambos, no podría borrar datos (capa 3) ni
dejar la empresa inmanejable (capa 4).

---

## Próximo paso (Paso 3)

Una vez validados los tests, voy a:

- Crear la **Edge Function `admin-users`** para que el Admin pueda crear/gestionar usuarios desde `/config/users` (no se puede hacer con la anon key).
- Implementar flujo de **recuperación de contraseña** (forgot password).
- Documentar todo en `docs/PASO_3_USERS.md`.

Avísame cuando los tests manuales pasen.