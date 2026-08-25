// ============================================================================
// Edge Function: admin-users
// ============================================================================
// Gestion server-side de usuarios (la anon key no puede listar/crear users
// de Supabase Auth). Solo accesible para usuarios con rol ADMIN de la misma
// empresa.
//
// Acciones soportadas (campo `action` en el body):
//   - list:        lista usuarios de la empresa del admin que invoca
//   - create:      crea un usuario nuevo (con su profile automatico via trigger)
//   - deactivate:  desactiva un usuario (active = false)
//   - change_role: cambia el rol de un usuario
//
// Deploy:
//   npx supabase functions deploy admin-users --no-verify-jwt
//   (el --no-verify-jwt es porque nosotros validamos el JWT manualmente dentro)
// ============================================================================

// @ts-ignore: Deno runtime
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-ignore: Deno runtime
import { corsHeaders } from '../_shared/cors.ts';

interface RequestBody {
  action: 'list' | 'create' | 'deactivate' | 'change_role';
  // create
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: 'ADMIN' | 'VETERINARIO' | 'RECEPCIONISTA' | 'GROOMER';
  // deactivate / change_role
  user_id?: string;
  // change_role
  new_role?: 'ADMIN' | 'VETERINARIO' | 'RECEPCIONISTA' | 'GROOMER';
}

interface AdminContext {
  adminId: string;
  companyId: string;
}

// Roles validos (debe coincidir con profiles.role CHECK constraint)
const VALID_ROLES = ['ADMIN', 'VETERINARIO', 'RECEPCIONISTA', 'GROOMER'] as const;

// @ts-ignore: Deno runtime
Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    // 1) Verificar que el invocador esta autenticado y es ADMIN de su empresa
    const adminCtx = await verifyAdminFromRequest(req);
    if (!adminCtx) {
      return jsonResponse({ error: 'Unauthorized: admin requerido' }, 403);
    }

    // 2) Crear cliente con service_role (puede hacer todo)
    const supabaseAdmin = createClient(
      // @ts-ignore: Deno env
      Deno.env.get('SUPABASE_URL') ?? '',
      // @ts-ignore: Deno env
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: { autoRefreshToken: false, persistSession: false },
      }
    );

    // 3) Parsear body
    const body: RequestBody = await req.json();

    // 4) Despachar segun la accion
    switch (body.action) {
      case 'list':
        return await handleList(supabaseAdmin, adminCtx);
      case 'create':
        return await handleCreate(supabaseAdmin, adminCtx, body);
      case 'deactivate':
        return await handleDeactivate(supabaseAdmin, adminCtx, body);
      case 'change_role':
        return await handleChangeRole(supabaseAdmin, adminCtx, body);
      default:
        return jsonResponse(
          { error: `Accion desconocida: ${(body as any).action}` },
          400
        );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    console.error('admin-users error:', err);
    return jsonResponse({ error: message }, 500);
  }
});

// ============================================================================
// Helpers
// ============================================================================

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

/**
 * Verifica el JWT del invocador y devuelve su company_id si es ADMIN activo.
 */
async function verifyAdminFromRequest(req: Request): Promise<AdminContext | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;

  const supabaseUser = createClient(
    // @ts-ignore: Deno env
    Deno.env.get('SUPABASE_URL') ?? '',
    // @ts-ignore: Deno env
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );

  const {
    data: { user },
    error: authError,
  } = await supabaseUser.auth.getUser();
  if (authError || !user) return null;

  const { data: profile, error: profileError } = await supabaseUser
    .from('profiles')
    .select('role, company_id, active')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) return null;
  if (profile.role !== 'ADMIN' || !profile.active) return null;

  return {
    adminId: user.id,
    companyId: profile.company_id,
  };
}

// ============================================================================
// Acciones
// ============================================================================

/**
 * Lista usuarios de la empresa del admin (via profiles + auth.users join).
 * No expone service_role key ni hashes de password.
 */
async function handleList(
  supabaseAdmin: ReturnType<typeof createClient>,
  ctx: AdminContext
): Promise<Response> {
  // Traer todos los profiles de la empresa
  const { data: profiles, error } = await supabaseAdmin
    .from('profiles')
    .select('id, first_name, last_name, phone, role, active, created_at')
    .eq('company_id', ctx.companyId)
    .order('created_at', { ascending: false });

  if (error) return jsonResponse({ error: error.message }, 500);

  // Traer emails de auth.users (requiere service_role, no se puede desde anon)
  const userIds = (profiles ?? []).map((p) => p.id);
  const emailMap: Record<string, string> = {};

  // admin.listUsers pagina; aqui pedimos hasta 100 que es razonable
  for (const id of userIds) {
    const { data } = await supabaseAdmin.auth.admin.getUserById(id);
    if (data?.user?.email) {
      emailMap[id] = data.user.email;
    }
  }

  const users = (profiles ?? []).map((p) => ({
    id: p.id,
    email: emailMap[p.id] ?? null,
    first_name: p.first_name,
    last_name: p.last_name,
    phone: p.phone,
    role: p.role,
    active: p.active,
    created_at: p.created_at,
  }));

  return jsonResponse({ users });
}

/**
 * Crea un usuario nuevo. La creacion en auth.users dispara el trigger
 * handle_new_user que genera el profile con la metadata que pasamos.
 */
async function handleCreate(
  supabaseAdmin: ReturnType<typeof createClient>,
  ctx: AdminContext,
  body: RequestBody
): Promise<Response> {
  // Validar campos requeridos
  if (!body.email || !body.password || !body.first_name || !body.last_name || !body.role) {
    return jsonResponse(
      {
        error:
          'Faltan campos requeridos: email, password, first_name, last_name, role',
      },
      400
    );
  }
  if (!VALID_ROLES.includes(body.role)) {
    return jsonResponse(
      { error: `Rol invalido. Debe ser uno de: ${VALID_ROLES.join(', ')}` },
      400
    );
  }
  if (body.password.length < 6) {
    return jsonResponse({ error: 'La contrasena debe tener al menos 6 caracteres' }, 400);
  }

  // Defensa en profundidad: si por algun motivo ctx.companyId no esta
  // disponible, abortamos ANTES de crear el usuario. Asi no quedan
  // usuarios huerfanos en auth.users sin profile.
  if (!ctx.companyId) {
    return jsonResponse(
      { error: 'El admin no tiene empresa asignada. Contacta soporte.' },
      500
    );
  }

  // Crear usuario con service_role, asignando metadata con company_id.
  // email_confirm: true evita que Supabase envie un email de verificacion.
  const { data: created, error: createError } =
    await supabaseAdmin.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
      app_metadata: {
        company_id: ctx.companyId,
        role: body.role,
        first_name: body.first_name,
        last_name: body.last_name,
      },
      user_metadata: {
        phone: body.phone ?? '',
      },
    });

  if (createError || !created.user) {
    return jsonResponse(
      { error: createError?.message ?? 'No se pudo crear el usuario' },
      400
    );
  }

  // Defense in depth: GoTrue inserta al usuario con raw_app_meta_data VACIO
  // y aplica el app_metadata en un UPDATE posterior. El trigger
  // handle_new_user v3 escucha INSERT y UPDATE, pero por si acaso el trigger
  // no se creo o fallo, aseguramos que el profile exista usando upsert
  // con service_role (bypassa RLS).
  const { error: profileError } = await supabaseAdmin.from('profiles').upsert(
    {
      id: created.user.id,
      company_id: ctx.companyId,
      role: body.role,
      first_name: body.first_name,
      last_name: body.last_name,
    },
    { onConflict: 'id' }
  );

  if (profileError) {
    // El usuario se creo pero el profile fallo. Lo logueamos y devolvemos
    // el error para que el admin sepa que algo anda mal (en vez de un
    // success silencioso con un usuario huerfano).
    console.error('admin-users: fallo al crear/actualizar profile', profileError);
    return jsonResponse(
      {
        error:
          'Usuario creado en Auth pero no se pudo crear su profile. Contacta soporte.',
        user_id: created.user.id,
      },
      500
    );
  }

  return jsonResponse({
    success: true,
    user_id: created.user.id,
    message: 'Usuario creado correctamente',
  });
}

/**
 * Desactiva un usuario (no lo borra). El trigger prevent_profile_deletion
 * convierte el DELETE en soft-delete; aqui hacemos lo mismo de forma explicita.
 */
async function handleDeactivate(
  supabaseAdmin: ReturnType<typeof createClient>,
  ctx: AdminContext,
  body: RequestBody
): Promise<Response> {
  if (!body.user_id) {
    return jsonResponse({ error: 'Falta user_id' }, 400);
  }

  // Validar que el usuario pertenece a la misma empresa
  const { data: targetProfile, error: lookupError } = await supabaseAdmin
    .from('profiles')
    .select('company_id')
    .eq('id', body.user_id)
    .single();

  if (lookupError || !targetProfile) {
    return jsonResponse({ error: 'Usuario no encontrado' }, 404);
  }
  if (targetProfile.company_id !== ctx.companyId) {
    return jsonResponse(
      { error: 'No puedes modificar usuarios de otra empresa' },
      403
    );
  }

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ active: false })
    .eq('id', body.user_id);

  if (error) {
    return jsonResponse(
      { error: 'No se pudo desactivar: ' + error.message },
      400
    );
  }
  return jsonResponse({ success: true });
}

/**
 * Cambia el rol de un usuario. Solo para profiles de la misma empresa.
 */
async function handleChangeRole(
  supabaseAdmin: ReturnType<typeof createClient>,
  ctx: AdminContext,
  body: RequestBody
): Promise<Response> {
  if (!body.user_id || !body.new_role) {
    return jsonResponse({ error: 'Faltan user_id o new_role' }, 400);
  }
  if (!VALID_ROLES.includes(body.new_role)) {
    return jsonResponse(
      { error: `Rol invalido. Debe ser uno de: ${VALID_ROLES.join(', ')}` },
      400
    );
  }

  // Validar que pertenece a la misma empresa
  const { data: targetProfile, error: lookupError } = await supabaseAdmin
    .from('profiles')
    .select('company_id')
    .eq('id', body.user_id)
    .single();

  if (lookupError || !targetProfile) {
    return jsonResponse({ error: 'Usuario no encontrado' }, 404);
  }
  if (targetProfile.company_id !== ctx.companyId) {
    return jsonResponse(
      { error: 'No puedes modificar usuarios de otra empresa' },
      403
    );
  }

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ role: body.new_role })
    .eq('id', body.user_id);

  if (error) {
    // El trigger prevent_last_admin_demotion puede haber bloqueado.
    return jsonResponse(
      { error: 'No se pudo cambiar rol: ' + error.message },
      400
    );
  }

  // Tambien actualizar app_metadata para que el JWT lleve el nuevo rol
  await supabaseAdmin.auth.admin.updateUserById(body.user_id, {
    app_metadata: {
      company_id: ctx.companyId,
      role: body.new_role,
    },
  });

  return jsonResponse({ success: true });
}
