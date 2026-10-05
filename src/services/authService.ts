// ============================================================================
// Servicios de autenticación con Supabase
// ============================================================================
import { supabase } from './supabaseClient';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

export type AuthError = {
  message: string;
};

/**
 * Traduce los errores mas comunes de GoTrue a mensajes claros en espanol.
 * GoTrue responde en ingles y el mensaje crudo confunde a los usuarios.
 */
export function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) {
    return 'Correo o contraseña incorrectos.';
  }
  if (m.includes('email not confirmed')) {
    return 'Tu correo aún no fue confirmado. Revisa tu bandeja de entrada.';
  }
  if (m.includes('user not found') || m.includes('unknown user')) {
    return 'No existe una cuenta con ese correo.';
  }
  if (m.includes('rate limit')) {
    return 'Demasiados intentos. Espera un momento e intenta de nuevo.';
  }
  if (m.includes('security purposes') || m.includes('too many requests')) {
    return 'Por seguridad, espera unos segundos antes de reintentar.';
  }
  return message;
}

/**
 * Verifica si el profile del usuario actual sigue activo (active = true).
 * Corta el login de usuarios desactivados por el admin: aunque el JWT
 * siga valido en Auth, un profile inactivo no debe poder entrar.
 * Devuelve tambien la fila del profile para reutilizarla en la app.
 */
export async function fetchOwnProfile(): Promise<{
  id: string;
  companyId: string;
  role: string;
  active: boolean;
  firstName: string;
  lastName: string;
  phone: string;
} | null> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, company_id, role, active, first_name, last_name, phone')
    .eq('id', userData.user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`No se pudo leer tu perfil de usuario: ${error.message}`);
  }
  if (!data) return null;

  const row = data as {
    id: string;
    company_id: string;
    role: string;
    active: boolean;
    first_name: string;
    last_name: string;
    phone: string | null;
  };

  return {
    id: row.id,
    companyId: row.company_id,
    role: row.role,
    active: row.active,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone ?? '',
  };
}

/**
 * Inicia sesión con email y contraseña.
 * Supabase compara el hash, no el texto plano.
 *
 * Despues de autenticar valida que el profile este ACTIVO: si el admin
 * desactivo al usuario, cierra la sesion inmediatamente y devuelve un
 * error claro (los usuarios desactivados no deben poder entrar).
 */
export async function signIn(email: string, password: string): Promise<Session> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(translateAuthError(error.message));
  }

  if (!data.session) {
    throw new Error('No se pudo iniciar sesión');
  }

  const profile = await fetchOwnProfile();
  if (!profile || !profile.active) {
    await supabase.auth.signOut();
    throw new Error(
      'Tu usuario esta desactivado. Contacta al administrador de tu clinica.'
    );
  }

  return data.session;
}

/**
 * Cierra la sesión del usuario actual.
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Envia un email de recuperacion de contrasena al usuario.
 * El link lleva al usuario a una pantalla donde define una nueva contrasena.
 */
export async function resetPassword(email: string): Promise<void> {
  const redirectTo = `${window.location.origin}/reset-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Obtiene la sesión activa (si existe).
 * Útil para saber si el usuario sigue logueado al recargar la página.
 */
export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(error.message);
  }
  return data.session;
}

/**
 * Obtiene el usuario actual (si está autenticado).
 */
export async function getCurrentUser(): Promise<SupabaseUser | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(error.message);
  }
  return data.user;
}

/**
 * Suscribe a cambios de la sesión (login, logout, refresh).
 * Devuelve una función para cancelar la suscripción.
 */
export function onAuthStateChange(
  callback: (session: Session | null) => void,
): () => void {
  const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return () => subscription.subscription.unsubscribe();
}
