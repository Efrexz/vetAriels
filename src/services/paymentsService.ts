// ============================================================================
// Servicios para caja (payments) — ingresos/egresos directos + ventas
// ============================================================================
// La DB acepta movement_type IN ('VENTA','INGRESO','EGRESO'). La UI usa
// ENTRADA/SALIDA (vocabulario del modal de caja). El servicio traduce:
//   UI ENTRADA -> DB INGRESO | UI SALIDA -> DB EGRESO | VENTA -> VENTA
// ============================================================================
import { supabase } from './supabaseClient';
import type { Payment } from '../types/financial.types';

// ----------------------------------------------------------------------------
// Row / mapping
// ----------------------------------------------------------------------------

export interface PaymentRow {
    id: string;
    company_id: string;
    invoice_id: string | null;
    movement_type: 'VENTA' | 'INGRESO' | 'EGRESO';
    description: string;
    payment_method: 'EFECTIVO' | 'VISA' | 'YAPE' | 'PLIN' | 'TRANSFERENCIA' | 'OTRO';
    amount: number;
    doc_ref: string | null;
    created_by: string | null;
    created_at: string;
}

/** DB -> UI. La fecha es created_at ISO completo (parseDateSafe la entiende). */
export function rowToPayment(row: PaymentRow): Payment {
    const uiType: Payment['movementType'] =
        row.movement_type === 'EGRESO' ? 'SALIDA'
        : row.movement_type === 'INGRESO' ? 'ENTRADA'
        : 'VENTA';

    const amountStr = row.amount.toFixed(2);

    return {
        id: row.id,
        date: row.created_at,
        description: row.description,
        paymentMethod: row.payment_method,
        income: row.movement_type === 'EGRESO' ? null : amountStr,
        expense: row.movement_type === 'EGRESO' ? amountStr : null,
        docRef: row.doc_ref ?? '',
        movementType: uiType,
    };
}

// ----------------------------------------------------------------------------
// Inputs
// ----------------------------------------------------------------------------

export interface CreatePaymentInput {
    /** 'ENTRADA' | 'SALIDA' (vocabulario UI). VENTA lo genera createInvoice. */
    movementType: 'ENTRADA' | 'SALIDA';
    description: string;
    paymentMethod: Payment['paymentMethod'];
    amount: number;
    docRef?: string;
    invoiceId?: string;
}

// ----------------------------------------------------------------------------
// Errores
// ----------------------------------------------------------------------------

function translatePaymentError(message: string): string {
    const m = message.toLowerCase();
    if (m.includes('violates row-level security')) {
        return 'No tienes permisos para registrar pagos.';
    }
    if (m.includes('check constraint') && m.includes('amount')) {
        return 'El monto debe ser mayor a 0.';
    }
    if (m.includes('check constraint') && m.includes('payment_method')) {
        return 'El metodo de pago no es valido.';
    }
    return message;
}

// ----------------------------------------------------------------------------
// API
// ----------------------------------------------------------------------------

export async function getPayments(): Promise<Payment[]> {
    const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Error al obtener pagos: ${translatePaymentError(error.message)}`);
    }

    return (data as PaymentRow[]).map(rowToPayment);
}

export async function createPayment(input: CreatePaymentInput): Promise<Payment> {
    const dbType = input.movementType === 'SALIDA' ? 'EGRESO' : 'INGRESO';

    const { data, error } = await supabase
        .from('payments')
        .insert({
            movement_type: dbType,
            description: input.description,
            payment_method: input.paymentMethod,
            amount: input.amount,
            doc_ref: input.docRef ?? null,
            invoice_id: input.invoiceId ?? null,
        })
        .select('*')
        .single();

    if (error) {
        throw new Error(`Error al registrar el pago: ${translatePaymentError(error.message)}`);
    }

    return rowToPayment(data as PaymentRow);
}

/**
 * Extorno: los pagos NO se borran (regular contable + policy DELETE solo
 * admin). En su lugar se registra un movimiento contrario ('SALIDA'
 * si el original era entrada, 'ENTRADA' si era salida o venta) con la
 * misma descripcion. La caja queda compensada y queda rastro.
 */
export async function extornPayment(payment: Payment): Promise<Payment> {
    const isOutflow = payment.income === null;
    const compensation = isOutflow ? 'ENTRADA' : 'SALIDA';
    return createPayment({
        movementType: compensation,
        description: `Extorno: ${payment.description || 'movimiento'}`,
        paymentMethod: payment.paymentMethod,
        amount: Number(isOutflow ? payment.expense : payment.income),
        docRef: payment.docRef || '',
    });
}