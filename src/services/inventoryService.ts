// ============================================================================
// Servicios para movimientos de inventario (inventory_movements + items)
// ============================================================================
// Tabla 'inventory_movements' (cabezal): id, company_id, type CARGA/DESCARGA,
// reason, responsible, store, created_by, created_at.
// Tabla 'inventory_movement_items' (lineas): id, movement_id, product_id,
// quantity, unit_cost.
//
// El stock de products NO lo escribe el frontend: lo mantiene el trigger
// update_product_stock_on_insert/delete (Paso 1). El frontend solo lee
// products.stock tras invalidar la query.
// ============================================================================
import { supabase } from './supabaseClient';
import type { Product, Service, InventoryOperation } from '../types/inventory.types';

// ----------------------------------------------------------------------------
// Tipos crudos de la DB
// ----------------------------------------------------------------------------

export interface InventoryMovementItemRow {
    id: string;
    movement_id: string;
    product_id: string;
    quantity: number;
    unit_cost: number;
    products?: { system_code: string; product_name: string | null; brand: string; sale_price: number } | { system_code: string; product_name: string | null; brand: string; sale_price: number }[] | null;
}

export interface InventoryMovementRow {
    id: string;
    company_id: string;
    type: 'CARGA' | 'DESCARGA';
    reason: string;
    responsible: string;
    store: string | null;
    created_by: string | null;
    created_at: string;
    profiles?: { first_name: string; last_name: string } | { first_name: string; last_name: string }[] | null;
    inventory_movement_items?: InventoryMovementItemRow[] | null;
}

// ----------------------------------------------------------------------------
// Mapeos
// ----------------------------------------------------------------------------

function productFromJoin(
    join: InventoryMovementItemRow['products']
): { systemCode: string; productName: string; brand: string; salePrice: number } | null {
    if (!join) return null;
    const p = Array.isArray(join) ? join[0] : join;
    if (!p) return null;
    return {
        systemCode: p.system_code,
        productName: p.product_name ?? '',
        brand: p.brand,
        salePrice: p.sale_price,
    };
}

function registeredByFromJoin(
    join: InventoryMovementRow['profiles']
): string {
    if (!join) return '';
    const p = Array.isArray(join) ? join[0] : join;
    if (!p) return '';
    return `${p.first_name} ${p.last_name}`.trim();
}

/**
 * Convierte una fila cruda de inventory_movement_items al PurchasedItem
 * que espera la UI (que es Product & Service).
 */
function rowItemToPurchasedItem(row: InventoryMovementItemRow) {
    const product = productFromJoin(row.products);
    return {
        provisionalId: row.id,
        additionDate: '',
        additionTime: '',
        quantity: row.quantity,
        systemCode: product?.systemCode ?? '',
        productName: product?.productName ?? '',
        brand: product?.brand ?? '',
        salePrice: product?.salePrice ?? 0,
        cost: row.unit_cost,
        line: '',
        category: '',
        status: true,
        id: row.product_id,
        availableStock: undefined,
    };
}

/**
 * Convierte una fila cruda de inventory_movements al tipo UI
 * InventoryOperation que usan las paginas.
 */
export function rowToMovement(row: InventoryMovementRow): InventoryOperation {
    const items = (row.inventory_movement_items ?? []).map(rowItemToPurchasedItem);

    const date = row.created_at.slice(0, 10);
    const time = row.created_at.slice(11, 19);

    return {
        id: row.id,
        date,
        time,
        reason: row.reason,
        responsible: row.responsible,
        registeredBy: registeredByFromJoin(row.profiles),
        operationType: row.type,
        store: row.store ?? '',
        products: items,
    };
}

// ----------------------------------------------------------------------------
// Inputs
// ----------------------------------------------------------------------------

export interface MovementItemInput {
    productId: string;
    quantity: number;
    unitCost?: number;
}

export interface CreateMovementInput {
    type: 'CARGA' | 'DESCARGA';
    reason: string;
    responsible: string;
    store?: string;
    items: MovementItemInput[];
}

// ----------------------------------------------------------------------------
// Errores
// ----------------------------------------------------------------------------

function translateMovementError(message: string): string {
    const m = message.toLowerCase();
    if (m.includes('violates row-level security')) {
        return 'No tienes permisos para realizar esta accion. Verifica tu rol.';
    }
    if (m.includes('check constraint') && m.includes('stock')) {
        return 'No hay stock suficiente para registrar esta descarga.';
    }
    if (m.includes('check constraint') && m.includes('quantity')) {
        return 'La cantidad debe ser mayor a 0.';
    }
    if (m.includes('foreign key') && m.includes('product_id')) {
        return 'Uno de los productos seleccionados no existe.';
    }
    if (m.includes('null value') && m.includes('company_id')) {
        return 'No se pudo asociar el movimiento a tu empresa. Cierra sesion y vuelve a entrar.';
    }
    return message;
}

// ----------------------------------------------------------------------------
// LECTURAS
// ----------------------------------------------------------------------------

/**
 * Lista movimientos de inventario de la empresa (cabezal + items + productos
 * + autor) ordenados por mas recientes.
 */
export async function getMovements(): Promise<InventoryOperation[]> {
    const { data, error } = await supabase
        .from('inventory_movements')
        .select(`
            *,
            profiles ( first_name, last_name ),
            inventory_movement_items (
                *,
                products ( system_code, product_name, brand, sale_price )
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Error al obtener movimientos: ${translateMovementError(error.message)}`);
    }

    return (data as InventoryMovementRow[]).map(rowToMovement);
}

// ----------------------------------------------------------------------------
// ESCRITURAS
// ----------------------------------------------------------------------------

/**
 * Crea un movimiento de inventario (cabezal + items) en una sola
 * operacion. El stock de cada producto lo actualiza el trigger
 * update_product_stock_on_insert sobre inventory_movement_items.
 *
 * Devuelve el movimiento creado con sus items ya persistidos.
 */
export async function createMovement(input: CreateMovementInput): Promise<InventoryOperation> {
    // 1. Insertamos el cabezal
    const { data: head, error: headError } = await supabase
        .from('inventory_movements')
        .insert({
            type: input.type,
            reason: input.reason,
            responsible: input.responsible,
            store: input.store ?? null,
        })
        .select('*')
        .single();

    if (headError) {
        throw new Error(`Error al crear movimiento: ${translateMovementError(headError.message)}`);
    }

    const movementId = (head as InventoryMovementRow).id;

    // 2. Insertamos los items en batch
    const itemsPayload = input.items.map((item) => ({
        movement_id: movementId,
        product_id: item.productId,
        quantity: item.quantity,
        unit_cost: item.unitCost ?? 0,
    }));

    const { error: itemsError } = await supabase
        .from('inventory_movement_items')
        .insert(itemsPayload);

    if (itemsError) {
        // Si fallan los items, intentamos borrar el cabezal para no dejar orphan.
        // Si el delete tambien falla, peor el caso -- pero al menos no queda
        // un movimiento sin items visible.
        await supabase.from('inventory_movements').delete().eq('id', movementId);
        throw new Error(`Error al crear items del movimiento: ${translateMovementError(itemsError.message)}`);
    }

    // 3. Releemos el movimiento completo con sus items + joins para devolver
    //    la misma forma que getMovements().
    const { data: full, error: fullError } = await supabase
        .from('inventory_movements')
        .select(`
            *,
            profiles ( first_name, last_name ),
            inventory_movement_items (
                *,
                products ( system_code, product_name, brand, sale_price )
            )
        `)
        .eq('id', movementId)
        .single();

    if (fullError) {
        throw new Error(`Error al leer movimiento creado: ${translateMovementError(fullError.message)}`);
    }

    return rowToMovement(full as InventoryMovementRow);
}

// Helper para que las paginas existentes no necesiten conocer el shape
// de CreateMovementInput (ellas pasan el InventoryOperation UI y lo
// convertimos aqui).
export function uiOperationToCreateInput(
    ui: Omit<InventoryOperation, 'id'>
): CreateMovementInput {
    return {
        type: ui.operationType === 'CARGA' ? 'CARGA' : 'DESCARGA',
        reason: ui.reason,
        responsible: ui.responsible,
        store: ui.store,
        items: ui.products.flatMap((p) =>
            p.id
                ? [{ productId: p.id, quantity: p.quantity, unitCost: p.cost ?? 0 }]
                : []
        ),
    };
}

/**
 * Convierte el payload UI del formulario de DischargeAndChargeStock
 * (que tiene campos reason y operationType como strings libres) al
 * CreateMovementInput que espera el servicio. Mantiene el shape de UI
 * sin que las paginas necesiten conocer el modelo DB.
 */
export function buildMovementFromForm(params: {
    formReason: string;
    operationTypeLabel: string;
    responsible: string;
    store: string;
    type: 'CARGA' | 'DESCARGA';
    items: Array<{ id: string | undefined; quantity: number; cost?: number }>;
}): CreateMovementInput {
    // Concatenamos la etiqueta del select con el motivo libre para que el
    // campo `reason` en DB conserve toda la info del formulario sin
    // obligarnos a renombrar columnas.
    const reason = params.operationTypeLabel && params.operationTypeLabel !== 'Seleccione'
        ? `${params.operationTypeLabel} - ${params.formReason}`.trim()
        : params.formReason.trim();

    return {
        type: params.type,
        reason,
        responsible: params.responsible,
        store: params.store,
        items: params.items.flatMap((item) =>
            item.id
                ? [{ productId: item.id, quantity: item.quantity, unitCost: item.cost ?? 0 }]
                : []
        ),
    };
}