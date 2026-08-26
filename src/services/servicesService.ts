// ============================================================================
// Servicios para servicios (services)
// ============================================================================
import { supabase } from './supabaseClient';
import type { Service } from '../types/inventory.types';

// ----------------------------------------------------------------------------
// Tipo crudo de la DB (snake_case)
// ----------------------------------------------------------------------------

export interface ServiceRow {
    id: string;
    company_id: string;
    service_name: string | null;
    line: string;
    category: string;
    cost: number;
    sale_price: number;
    available_for_sale: boolean;
    active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

/**
 * Convierte una fila cruda de services al tipo UI Service.
 * Mantiene la forma que usan las paginas (camelCase, registrationDate/Time
 * desde created_at).
 */
export function rowToService(row: ServiceRow): Service {
    return {
        id: row.id,
        serviceName: row.service_name ?? '',
        line: row.line,
        category: row.category,
        cost: row.cost,
        salePrice: row.sale_price,
        availableForSale: row.available_for_sale,
        registrationDate: row.created_at.slice(0, 10),
        registrationTime: row.created_at.slice(11, 19),
        status: row.active,
    };
}

// ----------------------------------------------------------------------------
// Inputs de escritura (camelCase)
// ----------------------------------------------------------------------------

export interface CreateServiceInput {
    serviceName?: string;
    line: string;
    category: string;
    cost?: number;
    salePrice: number;
    availableForSale?: boolean;
    active?: boolean;
}

export type UpdateServiceInput = Partial<CreateServiceInput>;

// ----------------------------------------------------------------------------
// Errores amigables
// ----------------------------------------------------------------------------

function translateServiceError(message: string): string {
    const m = message.toLowerCase();
    if (m.includes('violates row-level security')) {
        return 'No tienes permisos para realizar esta accion. Verifica tu rol.';
    }
    if (m.includes('check constraint') && m.includes('cost')) {
        return 'El costo no puede ser negativo.';
    }
    if (m.includes('check constraint') && m.includes('sale_price')) {
        return 'El precio de venta no puede ser negativo.';
    }
    if (m.includes('null value') && m.includes('company_id')) {
        return 'No se pudo asociar el servicio a tu empresa. Cierra sesion y vuelve a entrar.';
    }
    return message;
}

// ----------------------------------------------------------------------------
// LECTURAS
// ----------------------------------------------------------------------------

export async function getServices(): Promise<Service[]> {
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Error al obtener servicios: ${translateServiceError(error.message)}`);
    }

    return (data as ServiceRow[]).map(rowToService);
}

export async function getServiceById(id: string): Promise<Service | null> {
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .maybeSingle();

    if (error) {
        throw new Error(`Error al obtener servicio: ${translateServiceError(error.message)}`);
    }

    return data ? rowToService(data as ServiceRow) : null;
}

// ----------------------------------------------------------------------------
// ESCRITURAS
// ----------------------------------------------------------------------------

export async function createService(input: CreateServiceInput): Promise<Service> {
    const insertPayload = {
        service_name: input.serviceName ?? null,
        line: input.line,
        category: input.category,
        cost: input.cost ?? 0,
        sale_price: input.salePrice,
        available_for_sale: input.availableForSale ?? true,
        active: input.active ?? true,
    };

    const { data, error } = await supabase
        .from('services')
        .insert(insertPayload)
        .select('*')
        .single();

    if (error) {
        throw new Error(`Error al crear servicio: ${translateServiceError(error.message)}`);
    }

    return rowToService(data as ServiceRow);
}

export async function updateService(id: string, changes: UpdateServiceInput): Promise<Service> {
    const updatePayload: Record<string, unknown> = {};
    if (changes.serviceName !== undefined) updatePayload.service_name = changes.serviceName ?? null;
    if (changes.line !== undefined) updatePayload.line = changes.line;
    if (changes.category !== undefined) updatePayload.category = changes.category;
    if (changes.cost !== undefined) updatePayload.cost = changes.cost;
    if (changes.salePrice !== undefined) updatePayload.sale_price = changes.salePrice;
    if (changes.availableForSale !== undefined) updatePayload.available_for_sale = changes.availableForSale;
    if (changes.active !== undefined) updatePayload.active = changes.active;

    const { data, error } = await supabase
        .from('services')
        .update(updatePayload)
        .eq('id', id)
        .is('deleted_at', null)
        .select('*')
        .single();

    if (error) {
        throw new Error(`Error al actualizar servicio: ${translateServiceError(error.message)}`);
    }

    return rowToService(data as ServiceRow);
}

/**
 * Soft delete: marca deleted_at. La policy de UPDATE de services permite
 * admin/recep, asi que recepcionistas tambien pueden 'eliminar'.
 */
export async function softDeleteService(id: string): Promise<void> {
    const { error } = await supabase
        .from('services')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .is('deleted_at', null);

    if (error) {
        throw new Error(`Error al eliminar servicio: ${translateServiceError(error.message)}`);
    }
}