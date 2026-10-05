import { createContext, ReactNode, useContext } from 'react';

import { Payment } from '@t/financial.types';
import { usePaymentsQuery, usePaymentsMutations } from '../hooks/usePaymentsQuery';

interface FinancialContextType {
    paymentsData: Payment[];
    addNewPayment: (newPayment: Omit<Payment, 'id' | 'date'>) => Promise<Payment>;
    removePayment: (payment: Payment) => Promise<Payment>;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

interface FinancialProviderProps {
    children: ReactNode;
}

function FinancialProvider({ children }: FinancialProviderProps) {
    const { data: paymentsData = [] } = usePaymentsQuery();
    const { create, extorn } = usePaymentsMutations();

    /**
     * Registra un ingreso/egreso de caja. El id y la fecha los asigna la
     * DB; el servicio traduce movementType UI (ENTRADA/SALIDA) a DB
     * (INGRESO/EGRESO).
     */
    async function addNewPayment(newPayment: Omit<Payment, 'id' | 'date'>): Promise<Payment> {
        return create.mutateAsync({
            movementType: newPayment.movementType as 'ENTRADA' | 'SALIDA',
            description: newPayment.description,
            paymentMethod: newPayment.paymentMethod,
            amount: Number(newPayment.income ?? newPayment.expense ?? 0),
            docRef: newPayment.docRef || '',
        });
    }

    /** Extorno: crea el movimiento contrario (no borra: fuero contable). */
    async function removePayment(payment: Payment): Promise<Payment> {
        return extorn.mutateAsync(payment);
    }

    return (
        <FinancialContext.Provider value={{ paymentsData, addNewPayment, removePayment }}>
            {children}
        </FinancialContext.Provider>
    );
}

    export function useFinancial(): FinancialContextType {
        const context = useContext(FinancialContext);
        if (context === undefined) {
            throw new Error('useFinancial debe ser usado dentro de un FinancialProvider');
        }
        return context;
    }

export { FinancialContext, FinancialProvider };