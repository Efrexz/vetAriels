// ============================================================================
// Servicio: invocacion de la Edge Function admin-users
// ============================================================================
import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

// ============================================================================
// Tipos (deben coincidir con la Edge Function)
// ============================================================================

export type UserRole = 'ADMIN' | 'VETERINARIO' | 'RECEPCIONISTA' | 'GROOMER';

export interface AdminUser {
  id: string;
  email: string | null;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: UserRole;
  active: boolean;
  created_at: string;
}

export interface ListUsersResult {
  users: AdminUser[];
}

export interface CreateUserInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
}

export interface CreateUserResult {
  success: true;
  user_id: string;
  message: string;
}

// ============================================================================
// Helpers
// ============================================================================

async function invokeAdmin<T>(
  body: Record<string, unknown>
): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>('admin-users', {
    body,
  });

  // SupabaseJS descarta el body en errores 4xx/5xx. Hay que leerlo
  // manualmente via error.context para obtener el mensaje real
  // que envio nuestra Edge Function.
  if (error instanceof FunctionsHttpError) {
    try {
      const errorBody = (await error.context.json()) as { error?: string };
      if (errorBody.error) {
        throw new Error(errorBody.error);
      }
    } catch (innerErr) {
      // Si es un error nuestro (throw anterior), propagalo.
      // Si es fallo de parseo del JSON, lanza el mensaje generico.
      if (innerErr instanceof Error && innerErr.message) {
        throw innerErr;
      }
    }
  }

  if (error) {
    throw new Error(error.message ?? 'Error invocando la funcion admin-users');
  }

  if (!data) {
    throw new Error('Respuesta vacia de la funcion admin-users');
  }

  // La Edge Function puede envolver errores con { error: '...' } y status 2xx
  // tambien (defense in depth).
  if ((data as unknown as { error?: string }).error) {
    throw new Error((data as unknown as { error: string }).error);
  }

  return data as T;
}

// ============================================================================
// API
// ============================================================================

export async function listUsers(): Promise<AdminUser[]> {
  const result = await invokeAdmin<ListUsersResult>({ action: 'list' });
  return result.users;
}

export async function createUser(input: CreateUserInput): Promise<CreateUserResult> {
  return invokeAdmin<CreateUserResult>({ action: 'create', ...input });
}

export async function deactivateUser(userId: string): Promise<void> {
  await invokeAdmin<{ success: true }>({
    action: 'deactivate',
    user_id: userId,
  });
}

export async function changeUserRole(
  userId: string,
  newRole: UserRole
): Promise<void> {
  await invokeAdmin<{ success: true }>({
    action: 'change_role',
    user_id: userId,
    new_role: newRole,
  });
}
