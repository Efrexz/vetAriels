import { createContext, useEffect, useState } from 'react';

const FinancialContext = createContext();

function FinancialProvider({ children }) {

    const initialPaymentsData = [
        { id: '300EBFEA', date: '31-07-2024 07:43 AM', description: 'APERTURA ANGELLY', paymentMethod: 'EFECTIVO', income: '2,084.00', expense: null, docRef: '', movementType: 'INGRESO' },
        { id: 'FD12A67B', date: '30-07-2024 10:05 PM', description: 'Compra de camaralos', paymentMethod: 'EFECTIVO', income: null, expense: '150.00', docRef: '', movementType: 'EGRESO' },
        { id: 'AB4801FD', date: '30-07-2024 10:00 PM', description: '', paymentMethod: 'VISA', income: '475.00', expense: null, docRef: 'BV01-0003571', movementType: 'VENTA' },
    ];


    const [paymentsData, setPaymentsData] = useState(localStorage.getItem('paymentsData') ? JSON.parse(localStorage.getItem('paymentsData')) : initialPaymentsData);

    // Guardar en localStorage cada vez que cambien los estados
    useEffect(() => {
        localStorage.setItem('paymentsData', JSON.stringify(paymentsData));
    }, [paymentsData]);

    //agregar nuevo ingreso o egreso
    function addNewPayment(newPayment) {
        setPaymentsData([newPayment, ...paymentsData]);
    }

    function removePayment(id) {
        setPaymentsData(paymentsData.filter(payment => payment.id !== id));
    }


    return (
        <FinancialContext.Provider value={{ paymentsData, addNewPayment, removePayment }}>
            {children}
        </FinancialContext.Provider>
    );
}

export { FinancialContext, FinancialProvider };