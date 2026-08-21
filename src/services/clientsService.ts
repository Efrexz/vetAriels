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
  email: string | null;
  phone1: string;
  phone2: string | null;
  address: string;
  created_at: string;
}

/**
 * Convierte una fila de Supabase (snake_case) al tipo Client que usa tu app.
 * Por ahora solo las columnas que existen en el schema.
 * El resto (dni, district, pets, products, ...) se completarán en fases siguientes.
 */
export function rowToClient(row: ClientRow): Client {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email ?? '',
    dni: '',
    date: row.created_at.slice(0, 10),
    hour: row.created_at.slice(11, 19),
    phone1: row.phone1,
    phone2: row.phone2 ?? '',
    address: row.address,
    district: '',
    reference: '',
    observations: '',
    pets: [],
    products: [],
  };
}

// ============================================================================
// OPERACIONES (READ-ONLY en esta fase)
// ============================================================================

/**
 * Obtiene todos los clientes de la tabla `clients`.
 * Equivalente a: SELECT * FROM clients ORDER BY created_at DESC
 */
export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error al obtener clientes: ${error.message}`);
  }

  return (data as ClientRow[]).map(rowToClient);
}

/**
 * Obtiene un cliente por su ID.
 * Equivalente a: SELECT * FROM clients WHERE id = ?
 */
export async function getClientById(id: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Error al obtener cliente: ${error.message}`);
  }

  return data ? rowToClient(data as ClientRow) : null;
}
