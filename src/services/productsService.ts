// ============================================================================
// Servicios para productos (products)
// ============================================================================
import { supabase } from './supabaseClient';
import type { Product } from '../types/inventory.types';

// ----------------------------------------------------------------------------
// Tipo crudo de la DB (snake_case)
// ----------------------------------------------------------------------------

export interface ProductRow {
    id: string;
    company_id: string;
    system_code: string;
    product_name: string | null;
    brand: string;
    barcode: string | null;
    line: string;
    category: string;
    subcategory: string | null;
    unit_of_measurement: string | null;
    presentation: string | null;
    content: string | null;
    provider: string | null;
    min_stock: number;
    cost: number;
    sale_price: number;
    stock: number;
    active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

/**
 * Convierte una fila cruda de products al tipo UI Product.
 * Mantiene la forma que usan las paginas (camelCase, availableStock
 * en vez de stock, registrationDate/Time desde created_at).
 *
 * Identidad de UI: `systemCode` (unico por empresa). `id` queda con
 * el UUID interno de la DB (no se usa en la UI actual, pero se
 * conserva por si se necesita en el futuro).
 */
export function rowToProduct(row: ProductRow): Product {
    return {
        id: row.id,
        systemCode: row.system_code,
        productName: row.product_name ?? '',
        brand: row.brand,
        barcode: row.barcode ?? '',
        line: row.line,
        category: row.category,
        subcategory: row.subcategory ?? '',
        unitOfMeasurement: row.unit_of_measurement ?? '',
        presentation: row.presentation ?? '',
        content: row.content ?? '',
        provider: row.provider ?? '',
        minStock: row.min_stock,
        cost: row.cost,
        salePrice: row.sale_price,
        availableStock: row.stock,
        registrationDate: row.created_at.slice(0, 10),
        registrationTime: row.created_at.slice(11, 19),
        status: row.active,
    };
}

// ----------------------------------------------------------------------------
// Inputs de escritura (camelCase)
// ----------------------------------------------------------------------------

export interface CreateProductInput {
    productName?: string;
    brand: string;
    barcode?: string;
    line: string;
    category: string;
    subcategory?: string;
    unitOfMeasurement?: string;
    presentation?: string;
    content?: string;
    provider?: string;
    minStock?: number;
    cost?: number;
    salePrice: number;
    active?: boolean;
}

export type UpdateProductInput = Partial<CreateProductInput>;

// ----------------------------------------------------------------------------
// Errores amigables
// ----------------------------------------------------------------------------

function translateProductError(message: string): string {
    const m = message.toLowerCase();
    if (m.includes('duplicate key') && m.includes('uq_products_company_code')) {
        return 'Ya existe un producto con ese codigo de sistema en tu empresa.';
    }
    if (m.includes('violates row-level security')) {
        return 'No tienes permisos para realizar esta accion. Verifica tu rol.';
    }
    if (m.includes('check constraint') && m.includes('cost')) {
        return 'El costo no puede ser negativo.';
    }
    if (m.includes('check constraint') && m.includes('sale_price')) {
        return 'El precio de venta no puede ser negativo.';
    }
    if (m.includes('check constraint') && m.includes('stock')) {
        return 'El stock no puede ser negativo.';
    }
    if (m.includes('null value') && m.includes('company_id')) {
        return 'No se pudo asociar el producto a tu empresa. Cierra sesion y vuelve a entrar.';
    }
    return message;
}

// ----------------------------------------------------------------------------
// LECTURAS
// ----------------------------------------------------------------------------

/**
 * Lista productos activos (soft-deleted excluidos) de la empresa,
 * ordenados por mas recientes.
 */
export async function getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Error al obtener productos: ${translateProductError(error.message)}`);
    }

    return (data as ProductRow[]).map(rowToProduct);
}

/**
 * Obtiene un producto por systemCode (identidad de UI).
 * RLS acota la consulta a company_id = current_company_id().
 */
export async function getProductBySystemCode(systemCode: string): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('system_code', systemCode)
        .is('deleted_at', null)
        .maybeSingle();

    if (error) {
        throw new Error(`Error al obtener producto: ${translateProductError(error.message)}`);
    }

    return data ? rowToProduct(data as ProductRow) : null;
}

// ----------------------------------------------------------------------------
// ESCRITURAS
// ----------------------------------------------------------------------------

/**
 * Crea un producto nuevo. La DB asigna id (UUID), company_id (via
 * trigger auto-fill), created_at, updated_at, active (default TRUE),
 * stock (default 0). El stock SOLO cambia via inventory_movements
 * (trigger en Paso 4.4) -- el frontend nunca escribe stock directo.
 *
 * system_code lo genera el cliente (ver AddNewProductModal) porque la
 * DB no tiene default para esa columna.
 *
 * Devuelve el producto persistido con su fila fresca.
 */
export async function createProduct(
    systemCode: string,
    input: CreateProductInput
): Promise<Product> {
    const insertPayload = {
        system_code: systemCode,
        product_name: input.productName ?? null,
        brand: input.brand,
        barcode: input.barcode ?? null,
        line: input.line,
        category: input.category,
        subcategory: input.subcategory ?? null,
        unit_of_measurement: input.unitOfMeasurement ?? null,
        presentation: input.presentation ?? null,
        content: input.content ?? null,
        provider: input.provider ?? null,
        min_stock: input.minStock ?? 0,
        cost: input.cost ?? 0,
        sale_price: input.salePrice,
        active: input.active ?? true,
    };

    const { data, error } = await supabase
        .from('products')
        .insert(insertPayload)
        .select('*')
        .single();

    if (error) {
        throw new Error(`Error al crear producto: ${translateProductError(error.message)}`);
    }

    return rowToProduct(data as ProductRow);
}

/**
 * Actualiza campos editables de un producto (NO modifica stock --
 * eso es responsabilidad de los movimientos de inventario).
 *
 * Devuelve el producto actualizado.
 */
export async function updateProduct(
    systemCode: string,
    changes: UpdateProductInput
): Promise<Product> {
    const updatePayload: Record<string, unknown> = {};
    if (changes.productName !== undefined) updatePayload.product_name = changes.productName ?? null;
    if (changes.brand !== undefined) updatePayload.brand = changes.brand;
    if (changes.barcode !== undefined) updatePayload.barcode = changes.barcode ?? null;
    if (changes.line !== undefined) updatePayload.line = changes.line;
    if (changes.category !== undefined) updatePayload.category = changes.category;
    if (changes.subcategory !== undefined) updatePayload.subcategory = changes.subcategory ?? null;
    if (changes.unitOfMeasurement !== undefined) updatePayload.unit_of_measurement = changes.unitOfMeasurement ?? null;
    if (changes.presentation !== undefined) updatePayload.presentation = changes.presentation ?? null;
    if (changes.content !== undefined) updatePayload.content = changes.content ?? null;
    if (changes.provider !== undefined) updatePayload.provider = changes.provider ?? null;
    if (changes.minStock !== undefined) updatePayload.min_stock = changes.minStock;
    if (changes.cost !== undefined) updatePayload.cost = changes.cost;
    if (changes.salePrice !== undefined) updatePayload.sale_price = changes.salePrice;
    if (changes.active !== undefined) updatePayload.active = changes.active;

    const { data, error } = await supabase
        .from('products')
        .update(updatePayload)
        .eq('system_code', systemCode)
        .is('deleted_at', null)
        .select('*')
        .single();

    if (error) {
        throw new Error(`Error al actualizar producto: ${translateProductError(error.message)}`);
    }

    return rowToProduct(data as ProductRow);
}

/**
 * Soft delete: marca deleted_at con la hora actual. La policy de UPDATE
 * de products permite a admin/recep, asi que recepcionistas tambien
 * pueden 'eliminar' productos desde la UI sin chocar con la policy
 * de DELETE (solo admin).
 */
export async function softDeleteProduct(systemCode: string): Promise<void> {
    const { error } = await supabase
        .from('products')
        .update({ deleted_at: new Date().toISOString() })
        .eq('system_code', systemCode)
        .is('deleted_at', null);

    if (error) {
        throw new Error(`Error al eliminar producto: ${translateProductError(error.message)}`);
    }
}