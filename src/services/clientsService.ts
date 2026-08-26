// ============================================================================
// Servicios para la tabla `clients` en Supabase
// ============================================================================
// Esta capa es la única que sabe CÓMO hablar con Supabase.
// El resto de la app solo conoce estas funciones.
// ============================================================================
import { supabase } from './supabaseClient';
import type { Client } from '../types/client.types';

// Lo que Supabase devuelve tiene snake_case (id, first_name, last_name, ...).
// Lo que tu app espera tiene camelCase (id, firstName, lastName, ...).
// Estos tipos intermedios representan la fila "cruda" de Supabase.
export interface ClientRow {
  id: string;
  first_name: string;
  last_name: string;
  dni: string | null;
  email: string | null;
  phone1: string;
  phone2: string | null;
  address: string;
  district: string | null;
  reference: string | null;
  observations: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/**
 * Convierte una fila de Supabase (snake_case) al tipo Client que usa tu app.
 * Mapea fecha/hora desde created_at; mascotas/productos se resuelven en otras
 * tablas (este objeto solo conserva los arreglos vacios para no romper la
 * forma del tipo Client en componentes que dependen de ella).
 */
export function rowToClient(row: ClientRow): Client {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    dni: row.dni ?? '',
    email: row.email ?? '',
    date: row.created_at.slice(0, 10),
    hour: row.created_at.slice(11, 19),
    phone1: row.phone1,
    phone2: row.phone2 ?? '',
    address: row.address,
    district: row.district ?? '',
    reference: row.reference ?? '',
    observations: row.observations ?? '',
    pets: [],
    products: [],
  };
}

// ============================================================================
// Inputs de escritura (camelCase)
// ============================================================================

export interface CreateClientInput {
  firstName: string;
  lastName: string;
  dni?: string;
  email?: string;
  phone1: string;
  phone2?: string;
  address: string;
  district?: string;
  reference?: string;
  observations?: string;
}

export type UpdateClientInput = Partial<Omit<CreateClientInput, 'firstName' | 'lastName' | 'phone1' | 'address'>>;

// ============================================================================
// Errores amigables en espanol
// ============================================================================

function friendly(message: string): string {
  return message;
}

function translateClientError(message: string): string {
    const m = message.toLowerCase();
    if (m.includes('duplicate key') && m.includes('clients_company_id_dni')) {
        return 'Ya existe un cliente con ese numero de documento en tu empresa.';
    }
    if (m.includes('violates row-level security')) {
        return 'No tienes permisos para realizar esta accion. Verifica tu rol.';
    }
    if (m.includes('null value') && m.includes('phone1')) {
        return 'El telefono movil es obligatorio.';
    }
    if (m.includes('null value') && m.includes('address')) {
        return 'La direccion es obligatoria.';
    }
    if (m.includes('null value') && m.includes('company_id')) {
        return 'No se pudo asociar el cliente a tu empresa. Cierra sesion y vuelve a entrar.';
    }
    return friendly(message);
}

// ============================================================================
// LECTURAS
// ============================================================================

/**
 * Lista clientes activos (soft-deleted excluidos) de la empresa actual,
 * ordenados por mas recientes.
 * RLS acota la consulta a company_id = current_company_id().
 */
export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error al obtener clientes: ${translateClientError(error.message)}`);
  }

  return (data as ClientRow[]).map(rowToClient);
}

/**
 * Obtiene un cliente por su ID (o null si no existe / esta eliminado).
 */
export async function getClientById(id: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .maybeSingle();

  if (error) {
    throw new Error(`Error al obtener cliente: ${translateClientError(error.message)}`);
  }

  return data ? rowToClient(data as ClientRow) : null;
}

// ============================================================================
// ESCRITURAS
// ============================================================================

/**
 * Crea un cliente nuevo. La DB asigna id (UUID), created_at y, si la
 * empresa del usuario esta disponible, el company_id (via RLS +
 * current_company_id() tomado del JWT del usuario).
 *
 * created_by se toma del usuario autenticado (auditoria).
 *
 * Devuelve el cliente persistido (con el id real de DB) para que el
 * caller pueda navegar a su perfil de actualizacion.
 */
export async function createClient(input: CreateClientInput): Promise<Client> {
  const { data: userData } = await supabase.auth.getUser();
  const createdBy = userData.user?.id ?? null;

  const insertPayload = {
    first_name: input.firstName,
    last_name: input.lastName,
    dni: input.dni ?? null,
    email: input.email ?? null,
    phone1: input.phone1,
    phone2: input.phone2 ?? null,
    address: input.address,
    district: input.district ?? null,
    reference: input.reference ?? null,
    observations: input.observations ?? null,
    created_by: createdBy,
  };

  const { data, error } = await supabase
    .from('clients')
    .insert(insertPayload)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Error al crear cliente: ${translateClientError(error.message)}`);
  }

  return rowToClient(data as ClientRow);
}

/**
 * Actualiza campos editables de un cliente existente. No se permite
 * cambiar first_name / last_name / phone1 / address a null (la UI ya
 * los exige); si vienen vacios igualmente se envian.
 *
 * Devuelve el cliente actualizado con la fila fresca de la DB.
 */
export async function updateClient(
  id: string,
  changes: UpdateClientInput
): Promise<Client> {
  const updatePayload: Record<string, unknown> = {};
  if (changes.dni !== undefined) updatePayload.dni = changes.dni ?? null;
  if (changes.email !== undefined) updatePayload.email = changes.email ?? null;
  if (changes.phone2 !== undefined) updatePayload.phone2 = changes.phone2 ?? null;
  if (changes.district !== undefined) updatePayload.district = changes.district ?? null;
  if (changes.reference !== undefined) updatePayload.reference = changes.reference ?? null;
  if (changes.observations !== undefined) updatePayload.observations = changes.observations ?? null;

  const { data, error } = await supabase
    .from('clients')
    .update(updatePayload)
    .eq('id', id)
    .is('deleted_at', null)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Error al actualizar cliente: ${translateClientError(error.message)}`);
  }

  return rowToClient(data as ClientRow);
}

/**
 * Soft delete: marca deleted_at con la hora actual. La fila sigue en la
 * DB para integridad referencial (las mascotas del cliente no se borran),
 * pero desaparece de listados gracias al filtro `is('deleted_at', null)`
 * en los reads y al RLS.
 *
 * Se usa UPDATE (no DELETE) porque las policies RLS conceden UPDATE a
 * admin/recep y DELETE solo a admin. Asi recepcionistas tambien pueden
 * "eliminar" clientes desde la UI.
 */
export async function softDeleteClient(id: string): Promise<void> {
  const { error } = await supabase
    .from('clients')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .is('deleted_at', null);

  if (error) {
    throw new Error(`Error al eliminar cliente: ${translateClientError(error.message)}`);
  }
}
