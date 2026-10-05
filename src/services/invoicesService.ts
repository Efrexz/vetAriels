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
 * Crea el comprobante: cabezal (trigger asigna correlativo) + items +
 * pagos (movement_type 'VENTA' ligados por invoice_id + doc_ref).
 *
 * NO es una transaccion SQL unica (PostgREST REST no la permite desde
 * el cliente); si falla un paso se intenta limpiar lo creado para no
 * dejar comprobantes huerfanos. El flujo feliz es: cabezal -> items ->
 * pagos.
 */
export async function createInvoice(input: CreateInvoiceInput): Promise<CreatedInvoice> {
    const validItems = input.items.filter((it) => it.quantity > 0 && it.unitPrice > 0);
    if (validItems.length === 0) {
        throw new Error('El comprobante necesita al menos un item con cantidad y precio.');
    }

    const total = validItems.reduce(
        (sum, it) => sum + it.quantity * it.unitPrice, 0
    );
    // IGV 18% incluido en el precio (Peru).
    const subtotal = total / 1.18;
    const igv = total - subtotal;

    const serie = input.tipoComprobante === 'FACTURA' ? 'F001' : 'B001';

    const { data: head, error: headError } = await supabase
        .from('invoices')
        .insert({
            client_id: input.clientId,
            tipo_comprobante: input.tipoComprobante,
            serie,
            // correlativo lo asigna el trigger (NO se envia).
            cliente_doc_tipo: input.clienteDocTipo,
            cliente_doc_numero: input.clienteDocNumero || '00000000',
            subtotal: Number(subtotal.toFixed(2)),
            igv: Number(igv.toFixed(2)),
            total: Number(total.toFixed(2)),
            estado: 'EMITIDA',
        })
        .select('*')
        .single();

    if (headError) {
        throw new Error(`Error al crear el comprobante: ${translateInvoiceError(headError.message)}`);
    }

    const invoice = head as InvoiceRow;
    const docRef = `${invoice.serie}-${String(invoice.correlativo).padStart(7, '0')}`;

    // Items
    const itemsPayload = validItems.map((it) => ({
        invoice_id: invoice.id,
        item_type: it.itemType,
        product_id: it.productId ?? null,
        service_id: it.serviceId ?? null,
        description: it.description,
        quantity: it.quantity,
        unit_price: it.unitPrice,
        subtotal: Number((it.quantity * it.unitPrice).toFixed(2)),
    }));

    const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsPayload);

    if (itemsError) {
        // Rollback best-effort: el DELETE de invoices es solo admin (RLS);
        // un_receipt huersano no es grave y es mejor verbose que silent.
        await supabase.from('invoices').delete().eq('id', invoice.id);
        throw new Error(`Error al guardar los items: ${translateInvoiceError(itemsError.message)}`);
    }

    // Pagos (caja): cada metodo elegido es un movement VENTA.
    const validPayments = input.payments.filter((p) => p.amount > 0);
    if (validPayments.length > 0) {
        const paymentsPayload = validPayments.map((p) => ({
            movement_type: 'VENTA' as const,
            description: p.description?.trim() || `Cobro ${docRef}`,
            payment_method: p.paymentMethod,
            amount: p.amount,
            doc_ref: docRef,
            invoice_id: invoice.id,
        }));
        const { error: payError } = await supabase
            .from('payments')
            .insert(paymentsPayload);

        if (payError) {
            // El comprobante quedo EMITIDO pero los cobros fallaron: la
            // factura aparece PENDIENTE y es cobrable luego desde la caja.
            console.error('createInvoice: pagos fallaron:', payError);
        }
    }

    // Descarga de stock de los productos vendidos (servicios NO descargan).
    const productItems = validItems.filter((it) => it.itemType === 'PRODUCTO' && it.productId);
    if (productItems.length > 0) {
        try {
            const { createMovement } = await import('./inventoryService');
            await createMovement({
                type: 'DESCARGA',
                reason: `Venta ${docRef}`,
                responsible: 'Sistema',
                items: productItems.map((it) => ({
                    productId: it.productId as string,
                    quantity: it.quantity,
                    unitCost: 0,
                })),
            });
        } catch (stockErr) {
            // Si no hay stock suficiente el trigger rechaza: la venta se
            // emite igual (los servicios tambien se venden); el admin
            // corrige el inventario con un ajuste.
            console.error('createInvoice: descarga de stock fallo:', stockErr);
        }
    }

    return {
        id: invoice.id,
        serie: invoice.serie,
        correlativo: invoice.correlativo,
        comprobante: docRef,
        total,
    };
}