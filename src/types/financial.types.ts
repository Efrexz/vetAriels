export interface Payment {
  id: string;
  date: string;
  description: string;
  paymentMethod: string;
  income: string | null;
  expense: string | null;
  docRef: string;
  movementType: 'INGRESO' | 'EGRESO' | 'VENTA';
}