export interface Payment {
    id: string;
    date: string;
    description: string;
    paymentMethod: 'EFECTIVO' | 'VISA' | 'YAPE' | 'PLIN' | 'TRANSFERENCIA' | 'OTRO';
    income: string | null;
    expense: string | null;
    docRef: string;
    movementType: 'ENTRADA' | 'INGRESO' | 'SALIDA' | 'VENTA';
}