# Paso 3 — Edge Functions + Gestión de Usuarios + Password Reset

Este paso desbloquea la gestión real de usuarios y el flujo de recuperación de contraseña, que requieren código del lado del servidor (Edge Functions) por seguridad.

---

## Conceptos nuevos

### Edge Function

Una función server-side que corre en Deno (no Node.js), desplegada en los servidores de Supabase. Tiene acceso a la `service_role` key del proyecto (con permisos totales), por eso vive en el servidor y NO en el frontend.

**Analogía**: si tu app React es la cocina del restaurante, una Edge Function es el sistema de seguridad del edificio. Hay cosas que el cliente (frontend) no puede hacer — necesita pedirle al sistema de seguridad (Edge Function con service_role) que las haga.

### service_role key

Llave maestra del proyecto Supabase. Puede:
- Leer/escribir cualquier tabla saltándose RLS.
- Crear/borrar usuarios de Auth.
- Cambiar metadata de cualquier usuario.

**Por qué NUNCA va al frontend**: con esta llave alguien podría borrar toda tu DB. Por eso vive solo en el servidor (Edge Function, settings del proyecto, etc.).

---

## Archivos del Paso 3

```
supabase/
├── config.toml                         ← config del proyecto Supabase local
├── functions/
│   ├── _shared/
│   │   └── cors.ts                      ← headers CORS compartidos
│   └── admin-users/
│       └── index.ts                     ← Edge Function (Deno runtime)
src/
└── services/
    └── adminUsersService.ts             ← wrapper frontend para invocar la funcion
```

`src/services/authService.ts` también recibió `resetPassword()` y `src/Pages/Login.tsx` ganó el modo "olvidé mi contraseña".

---

## Deploy de la Edge Function

### 1. Login con Supabase CLI

```bash
npx supabase login
```

Esto abre el navegador para que autorices al CLI. Necesitas tu cuenta de Supabase.

### 2. Linkear el proyecto local con tu proyecto en la nube

```bash
npx supabase link --project-ref TU-PROYECTO-ID
```

Tu `TU-PROYECTO-ID` lo sacas de la URL del dashboard:
`https://supabase.com/dashboard/project/dmgjpyaebvpqdgvbiaug` → `dmgjpyaebvpqdgvbiaug`.

### 3. Deploy de la función

```bash
npx supabase functions deploy admin-users --no-verify-jwt
```

**¿Por qué `--no-verify-jwt`?** La función valida el JWT manualmente dentro (revisa que sea admin), no en el gateway de Supabase. Esto da más control y permite logging detallado.

### 4. Verificar que se desplegó

Ve al dashboard de Supabase → **Edge Functions** → debería aparecer `admin-users`.

---

## Configurar email templates (para forgot-password)

1. Dashboard → **Authentication** → **Email Templates**.
2. **Reset Password**: personaliza el template. Por defecto dice algo como "Click here to reset your password".
3. Importante: la URL del link debe ser tu dominio real en producción, ej. `https://vetariel.com/reset-password`.

---

## Probar forgot-password

1. Reinicia Vite.
2. Ve a `http://localhost:5173/login`.
3. Click "¿Olvidaste tu contraseña?".
4. Ingresa tu email (`zyzz_448@hotmail.com`).
5. Click "Enviar link".
6. **Revisa tu bandeja** (y spam). Deberías recibir un email de Supabase con un link.
7. Click el link → te lleva a una pantalla de Supabase para definir nueva contraseña.
8. Vuelve a loguearte con la nueva.

**Si no llega el email**:
- Revisa la carpeta de spam.
- En desarrollo, Supabase a veces no envía emails a proveedores como Hotmail. Puedes ver el email en **Dashboard → Authentication → Logs**.
- Para desarrollo local, considera configurar un SMTP custom (SendGrid, Mailgun, etc.).

---

## Probar la Edge Function (crear usuario)

Una vez deployada, puedes probar desde la app:

1. Loguéate como admin.
2. Ve a **Configuración → Usuarios**.
3. **Crear usuario** (cuando esté conectado a la UI).
4. O desde la consola del navegador:

```js
const { data, error } = await window.supabase.functions.invoke('admin-users', {
  body: {
    action: 'create',
    email: 'recepcion@vetariel.com',
    password: '123123',
    first_name: 'Maria',
    last_name: 'Recepcionista',
    role: 'RECEPCIONISTA',
  },
});
console.log(data);
```

**Resultado esperado**: `{ success: true, user_id: '...', message: '...' }`.

El trigger `handle_new_user` crea el profile automáticamente.

---

## Acciones soportadas por la Edge Function

| Acción | Body | Descripción |
|---|---|---|
| `list` | `{ action: 'list' }` | Lista usuarios de tu empresa |
| `create` | `{ action, email, password, first_name, last_name, phone?, role }` | Crea usuario + profile |
| `deactivate` | `{ action, user_id }` | Soft-disable (active=false) |
| `change_role` | `{ action, user_id, new_role }` | Cambia rol del usuario |

---

## Cómo se invoca desde el frontend

`src/services/adminUsersService.ts` ya expone las 4 funciones tipadas:

```ts
import { listUsers, createUser, deactivateUser, changeUserRole } from '@services/adminUsersService';
```

---

## Próximo paso (Paso 4)

Una vez deployada y probada la función, vamos al **Paso 4: Servicios + React Query por dominio** para clientes, mascotas, productos, etc. Ahí migraremos los contextos restantes y aprovecharemos el cache de React Query para que la app se sienta instantánea.

Avísame cuando tengas la función deployada y los flujos de forgot-password + creación de usuario probados.