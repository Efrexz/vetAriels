import { useState } from 'react';
import { useFinancial } from '@context/FinancialContext';
import { Payment } from '@t/financial.types';
import { PaymentAndDepositModal } from '@components/modals/PaymentAndDepositModal';
import { ConfirmActionModal } from '@components/modals/ConfirmActionModal';
import TrashIcon from '@assets/trashIcon.svg?react';
import FileInvoiceIcon from '@assets/file-invoice.svg?react';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import ImageIcon from '@assets/imageIcon.svg?react';

const tableHeaders: string[] = ["ID", "Fecha", "Descripción", "Medio de Pago", "Entrada", "Salida", "Doc. Ref.", "Movimiento", "Opciones"];

type OperationType = 'ENTRADA' | 'SALIDA';

function Payments() {

    const { paymentsData } = useFinancial();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [paymentToEdit, setPaymentToEdit] = useState<Payment | null>(null);
    const [operationType, setOperationType] = useState<OperationType>('ENTRADA');
    return (
        <section className="p-4 sm:p-6 bg-gray-950 text-gray-50 min-h-screen">
            <h1 className="text-xl sm:text-3xl font-medium  mb-6 tracking-wide border-b border-cyan-500 pb-3 flex items-center">
                <FileInvoiceIcon className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-cyan-400 drop-shadow-lg" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">Entradas / Salidas de Caja</span>
            </h1>
            <div className="bg-gray-900 rounded-2xl shadow-xl p-4 sm:p-6 mb-8 border border-gray-700">
                <div className="p-4 rounded-xl mb-4 bg-gray-800 border-2 border-cyan-500/30">
                    <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-4">
                        <div className="flex flex-col md:flex-row gap-4 w-full">
                            <input
                                type="text"
                                placeholder="Buscar por ID..."
                                className="w-full py-3 px-5 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all hover:border-cyan-500"
                            />
                            <input
                                type="text"
                                placeholder="Buscar descripción..."
                                className="w-full py-3 px-5 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all hover:border-cyan-500"
                            />
                            <input
                                type="date"
                                className="w-full py-3 px-5 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all hover:border-cyan-500"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4">
                        <div className="w-full sm:w-[300px]">
                            <select
                                name="Metodo-de-pago"
                                className="w-full rounded-xl border-2 border-gray-600 bg-gray-700 text-gray-100 sm:text-sm py-3 px-5 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all hover:border-cyan-500"
                            >
                                <option className="bg-gray-700" value="">Método de Pago</option>
                                <option className="bg-gray-700" value="AMERICAN EXPRESS">American Express</option>
                                <option className="bg-gray-700" value="VISA">VISA</option>
                                <option className="bg-gray-700" value="MASTERCARD">Mastercard</option>
                            </select>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                className="py-3 px-6 rounded-xl font-bold transition-all w-full sm:w-auto
                                bg-transparent text-green-500 border-2 border-green-500
                                shadow-md shadow-green-500/50 hover:bg-green-500 hover:text-white
                                hover:shadow-green-400/80"
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setOperationType("ENTRADA");
                                }}
                            >
                                + ENTRADA
                            </button>
                            <button
                                className="py-3 px-6 rounded-xl font-bold transition-all w-full sm:w-auto
                                bg-transparent text-red-500 border-2 border-red-500
                                shadow-md shadow-red-500/50 hover:bg-red-500 hover:text-white
                                hover:shadow-red-400/80"
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setOperationType("SALIDA");
                                }}
                            >
                                - SALIDA
                            </button>
                        </div>
                    </div>
                </div>
                {
                    isModalOpen && (
                        <PaymentAndDepositModal onClose={() => setIsModalOpen(false)} typeOfOperation={operationType} />
                    )
                }
                <div className="overflow-x-auto border border-gray-700 rounded-xl shadow-inner">
                    <table className="min-w-full bg-gray-900">
                        <thead className='bg-gray-800 border-b border-gray-700'>
                            <tr>
                                {tableHeaders.map((header) => (
                                    <th key={header} className="py-3 px-2 text-center text-sm font-bold text-gray-300 uppercase tracking-wider border-r border-gray-700">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paymentsData.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-800 text-xs transition-colors duration-200">
                                    <td className="py-2 px-2 border-b border-r border-gray-700 text-center">{payment.id.slice(0, 9).toUpperCase()}</td>
                                    <td className="py-2 px-2 border-b border-r border-gray-700 text-center text-gray-400">{payment.date}</td>
                                    <td className="py-2 px-2 border-b border-r border-gray-700 text-left text-gray-200">{payment.description}</td>
                                    <td className="py-2 px-2 border-b border-r border-gray-700 text-center text-gray-300">{payment.paymentMethod}</td>
                                    <td className="py-2 px-2 border-b border-r border-gray-700 text-center text-green-400 font-bold">{payment.income}</td>
                                    <td className="py-2 px-2 border-b border-r border-gray-700 text-center text-red-400 font-bold">{payment.expense}</td>
                                    <td className="py-2 px-2 border-b border-r border-gray-700 text-center text-gray-400">{payment.docRef}</td>
                                    <td className="py-2 px-2 border-b border-r border-gray-700 text-center text-gray-400">{payment.movementType}</td>
                                    <td className="py-4 px-4 border-b border-r border-gray-700 text-center">
                                        <div className="flex justify-center items-center h-full space-x-4">
                                            <button className="text-cyan-500 hover:text-cyan-300 transition-colors" title="Ver imagen">
                                                <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-400 transition-colors"
                                                onClick={() => {
                                                    setPaymentToEdit(payment)
                                                    setConfirmModalOpen(true)
                                                }}
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                            <button className="text-emerald-500 hover:text-emerald-300 transition-colors">
                                                <RoleUserIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {
                    isConfirmModalOpen && paymentToEdit && (
                        <ConfirmActionModal
                            elementData={paymentToEdit}
                            typeOfOperation="payments"
                            onClose={() => setConfirmModalOpen(false)}
                        />
                    )
                }
                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                    <p className="text-gray-400 text-center md:text-left">
                        Página: 1 de 1 | Registros del 1 al {paymentsData.length} | Total{" "}
                        {paymentsData.length}
                    </p>
                    <div className="flex flex-wrap md:flex-row justify-center space-x-2 md:space-x-4">
                        <button className="py-2 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Primera</button>
                        <button className="py-2 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Anterior</button>
                        <button className="py-2 px-4 border border-gray-600 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors">1</button>
                        <button className="py-2 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Siguiente</button>
                        <button className="py-2 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Última</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { Payments };