// ============================================================================
// Servicios de autenticación con Supabase
// ============================================================================
import { supabase } from './supabaseClient';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

export type AuthError = {
  message: string;
};

/**
 * Inicia sesión con email y contraseña.
 * Supabase compara el hash, no el texto plano.
 */
export async function signIn(email: string, password: string): Promise<Session> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.session) {
    throw new Error('No se pudo iniciar sesión');
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
