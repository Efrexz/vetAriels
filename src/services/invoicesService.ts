// ============================================================================
// Servicios para comprobantes (invoices + invoice_items + pagos VENTA)
// ============================================================================
// El trigger assign_invoice_correlative asigna el correlativo atomico por
// (empresa, tipo de comprobante) via company_counters. La serie la define
// el cliente: 'B001' boletas / 'F001' facturas (convencion SUNAT).
//
// Modelo de impuestos (igual que el form): salePrice de los items YA INCLUYE
// IGV 18%. Entonces: total = suma(items.subtotal); subtotal = total/1.18;
// igv = total - subtotal. (Si un dia quebran egreso exonerado, aqui se
// administra por item.)
// ============================================================================
import { supabase } from './supabaseClient';

// ----------------------------------------------------------------------------
// Rows / mapping
// ----------------------------------------------------------------------------

export interface InvoiceItemRow {
    id: string;
    invoice_id: string;
    item_type: 'PRODUCTO' | 'SERVICIO';
    product_id: string | null;
    service_id: string | null;
    description: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

export interface InvoiceRow {
    id: string;
    company_id: string;
    client_id: string;
    tipo_comprobante: 'BOLETA' | 'FACTURA';
    serie: string;
    correlativo: number;
    cliente_doc_tipo: 'DNI' | 'RUC';
    cliente_doc_numero: string;
    subtotal: number;
    igv: number;
    total: number;
    estado: 'EMITIDA' | 'ANULADA';
    created_by: string | null;
    created_at: string;
    clients?: { first_name: string; last_name: string } | { first_name: string; last_name: string }[] | null;
    payments?: {
        payment_method: string;
        amount: number;
    }[] | null;
}

export type UiInvoice = {
    id: string;
    comprobante: string;        // 'BV01 - 0003560'
    tipoComprobante: 'BOLETA' | 'FACTURA';
    client: string;
    clientDoc: string;
    date: string;
    amount: number;
    paidWith: string;           // metodos de pago (ya en DB)
    status: 'PAGADO' | 'PENDIENTE' | 'ANULADA';
};

function clientFromJoin(join: InvoiceRow['clients']): string {
    if (!join) return '';
    const c = Array.isArray(join) ? join[0] : join;
    return c ? `${c.first_name} ${c.last_name}`.trim() : '';
}

export function rowToInvoice(row: InvoiceRow): UiInvoice {
    const payments = row.payments ?? [];
    const paidAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    return {
        id: row.id,
        comprobante: `${row.serie} - ${String(row.correlativo).padStart(7, '0')}`,
        tipoComprobante: row.tipo_comprobante,
        client: clientFromJoin(row.clients),
        clientDoc: row.cliente_doc_numero,
        date: row.created_at,
        amount: row.total,
        paidWith: payments.length > 0
            ? Array.from(new Set(payments.map((p) => p.payment_method))).join(', ')
            : '',
        status: row.estado === 'ANULADA'
            ? 'ANULADA'
            : paidAmount >= row.total ? 'PAGADO' : 'PENDIENTE',
    };
}

// ----------------------------------------------------------------------------
// Inputs
// ----------------------------------------------------------------------------

export interface InvoiceItemInput {
    itemType: 'PRODUCTO' | 'SERVICIO';
    productId?: string;
    serviceId?: string;
    description: string;
    quantity: number;
    unitPrice: number;
}

export interface InvoicePaymentInput {
    paymentMethod: 'EFECTIVO' | 'VISA' | 'YAPE' | 'PLIN' | 'TRANSFERENCIA' | 'OTRO';
    amount: number;
    description?: string;
}

export interface CreateInvoiceInput {
    clientId: string;
    tipoComprobante: 'BOLETA' | 'FACTURA';
    clienteDocTipo: 'DNI' | 'RUC';
    clienteDocNumero: string;
    items: InvoiceItemInput[];
    payments: InvoicePaymentInput[];
    /** Solo para backend/scripts: explicit company (service_role). */
    companyId?: string;
}

export interface CreatedInvoice {
    id: string;
    serie: string;
    correlativo: number;
    comprobante: string;   // 'B001 - 0000001'
    total: number;
}

// ----------------------------------------------------------------------------
// Errores
// ----------------------------------------------------------------------------

function translateInvoiceError(message: string): string {
    const m = message.toLowerCase();
    if (m.includes('violates row-level security')) {
        return 'No tienes permisos para emitir comprobantes.';
    }
    if (m.includes('stock insuficiente')) {
        return 'Venta rechazada: no hay stock suficiente para alguno de los productos.';
    }
    if (m.includes('check constraint') && m.includes('invoice_items')) {
        return 'Cada item del comprobante debe ser un producto o un servicio.';
    }
    if (m.includes('null value') && m.includes('company_id')) {
        return 'No se pudo asociar el comprobante a tu empresa. Cierra sesion y vuelve a entrar.';
    }
    return message;
}

// ----------------------------------------------------------------------------
// API
// ----------------------------------------------------------------------------

export async function getInvoices(): Promise<UiInvoice[]> {
    const { data, error } = await supabase
        .from('invoices')
        .select(`
            *,
            clients ( first_name, last_name ),
            payments ( payment_method, amount )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Error al obtener comprobantes: ${translateInvoiceError(error.message)}`);
    }

    return (data as InvoiceRow[]).map(rowToInvoice);
}

/**
 * Crea el comprobante via RPC `create_invoice` (Fase 2).
 *
 * UNA sola operacion atomica en el servidor: cabecera + items + pagos +
 * descarga de stock. Si algo falla, TODO se revierte (no quedan
 * comprobantes huerfanos ni cobros sin comprobante). El total lo calcula
 * el servidor; stock insuficiente rechaza la venta completa.
 *
 * Pendiente anotado: idempotencia por clave de request.
 */
export async function createInvoice(input: CreateInvoiceInput): Promise<CreatedInvoice> {
    const validItems = input.items.filter((it) => it.quantity > 0 && it.unitPrice > 0);
    if (validItems.length === 0) {
        throw new Error('El comprobante necesita al menos un item con cantidad y precio.');
    }

    const { data, error } = await supabase.rpc('create_invoice', {
        p_client_id: input.clientId,
        p_tipo_comprobante: input.tipoComprobante,
        p_doc_tipo: input.clienteDocTipo,
        p_doc_numero: input.clienteDocNumero || '00000000',
        p_items: validItems.map((it) => ({
            item_type: it.itemType,
            product_id: it.productId ?? null,
            service_id: it.serviceId ?? null,
            description: it.description,
            quantity: it.quantity,
            unit_price: it.unitPrice,
        })),
        p_payments: input.payments
            .filter((p) => p.amount > 0)
            .map((p) => ({
                payment_method: p.paymentMethod,
                amount: p.amount,
                description: p.description || null,
            })),
    });

    if (error) {
        throw new Error(translateInvoiceError(error.message));
    }

    return data as CreatedInvoice;
}