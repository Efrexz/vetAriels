import { createContext, useEffect, useState , ReactNode, useContext } from 'react';

import { Payment } from '@t/financial.types';

interface FinancialContextType {
    paymentsData: Payment[];
    addNewPayment: (newPayment: Payment) => void;
    removePayment: (id: string) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

interface FinancialProviderProps {
    children: ReactNode;
}

function FinancialProvider({ children }: FinancialProviderProps) {

    // Datos de ejemplo MINIMOS para que la caja no este vacia en la
    // demostracion inicial. En la FASE 5 (Paso 5) paymentsData pasa a
    // leerse de la tabla payments de Supabase y esto desaparece.
    const initialPaymentsData : Payment[] = [
        { id: '300EBFEA', date: '31-07-2024 07:43 AM', description: 'APERTURA ANGELLY', paymentMethod: 'EFECTIVO', income: '2,084.00', expense: null, docRef: '', movementType: 'ENTRADA' },
        { id: 'FD12A67B', date: '30-07-2024 10:05 PM', description: 'Compra de camaras', paymentMethod: 'EFECTIVO', income: null, expense: '150.00', docRef: '', movementType: 'SALIDA' },
        { id: 'AB4801FD', date: '30-07-2024 10:00 PM', description: '', paymentMethod: 'VISA', income: '475.00', expense: null, docRef: 'BV01-0003571', movementType: 'VENTA' },
    ];


    const [paymentsData, setPaymentsData] = useState<Payment[]>(() => {
        try {
            const savedData = localStorage.getItem('paymentsData');
            return savedData ? (JSON.parse(savedData) as Payment[]) : initialPaymentsData;
        } catch {
            // localStorage corrompido no debe tumbar toda la app
            return initialPaymentsData;
        }
    });

    // Guardar en localStorage cada vez que cambien los estados
    useEffect(() => {
        localStorage.setItem('paymentsData', JSON.stringify(paymentsData));
    }, [paymentsData]);

    //agregar nuevo ingreso o egreso
    function addNewPayment(newPayment: Payment) {
        setPaymentsData([newPayment, ...paymentsData]);
    }

    function removePayment(id: string) {
        setPaymentsData(paymentsData.filter(payment => (payment.id !== id)));
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