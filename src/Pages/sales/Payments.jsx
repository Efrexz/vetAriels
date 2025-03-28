import { useContext, useState } from 'react';
import { FinancialContext } from '@context/FinancialContext';
import { PaymentAndDepositModal } from '@components/PaymentAndDepositModal';
import { ConfirmActionModal } from '../../components/ConfirmActionModal';
import TrashIcon from '@assets/trashIcon.svg?react';
import FileInvoiceIcon from '@assets/file-invoice.svg?react';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import ImageIcon from '@assets/imageIcon.svg?react';


const tableHeaders = ["ID", "Fecha", "Descripción", "Medio de Pago", "Entrada", "Salida", "Doc. Ref.", "Movimiento", "Opciones"];

function Payments() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { paymentsData } = useContext(FinancialContext);
    const [paymentsDataToEdit, setPaymentsDataToEdit] = useState(null);
    const [isConfirmActionModalOpen, setIsConfirmActionModalOpen] = useState(false);
    const [typeOfOperation, setTypeOfOperation] = useState('');
    return (
        <section className="container mx-auto p-6">
            <h1 className="text-xl md:text-2xl font-bold text-blue-500 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <FileInvoiceIcon className="w-6 md:w-9 h-6 md:h-9 mr-2" />
                Entradas / Salidas de Caja
            </h1>
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="p-4 rounded-lg mb-2 bg-white shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-4">
                        <div className="flex flex-col md:flex-row gap-2 w-full">
                            <input
                                type="text"
                                placeholder="Buscar por ID..."
                                className="w-full py-2 px-4 border-gray-200 border-2 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Buscar descripción..."
                                className="w-full py-2 px-4 border-gray-200 border-2 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="date"
                                className="w-full py-2 px-4 border-gray-200 border-2 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4">
                        <div className="w-full sm:w-[300px]">
                            <select
                                name="Metodo-de-pago"
                                className="w-full rounded-lg border-gray-200 border-2 text-gray-700 sm:text-sm py-2 px-3"
                            >
                                <option value="">Método de Pago</option>
                                <option value="AMERICAN EXPRESS">American Express</option>
                                <option value="VISA">VISA</option>
                                <option value="MASTERCARD">Mastercard</option>
                            </select>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 w-full sm:w-auto"
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setTypeOfOperation("ENTRADA");
                                }}
                            >
                                ENTRADA
                            </button>
                            <button
                                className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 w-full sm:w-auto"
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setTypeOfOperation("SALIDA");
                                }}
                            >
                                SALIDA
                            </button>
                        </div>
                    </div>
                </div>

                {
                    isModalOpen && (
                        <PaymentAndDepositModal onClose={() => setIsModalOpen(false)} typeOfOperation={typeOfOperation} />
                    )
                }
                <div className="overflow-x-auto border border-gray-300 rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                {tableHeaders.map((header) => (
                                    <th key={header} className="py-2 px-2 border text-gray-700 text-center text-xs">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paymentsData.map((payment, index) => (
                                <tr key={index} className="hover:bg-gray-100 text-xs">
                                    <td className="py-2 px-2 border-b text-center border">{payment.id.slice(0, 9).toUpperCase()}</td>
                                    <td className="py-2 px-2 border-b text-center border">{payment.date}</td>
                                    <td className="py-2 px-2 border-b text-left border">{payment.description}</td>
                                    <td className="py-2 px-2 border-b text-center border">{payment.paymentMethod}</td>
                                    <td className="py-2 px-2 border-b text-center border text-green-600">{payment.income}</td>
                                    <td className="py-2 px-2 border-b text-center border text-red-600">{payment.expense}</td>
                                    <td className="py-2 px-2 border-b text-center border">{payment.docRef}</td>
                                    <td className="py-2 px-2 border-b text-center border">{payment.movementType}</td>
                                    <td className="py-8 px-4 text-center border">
                                        <div className="flex justify-center items-center h-full space-x-2">
                                            <button className="text-blue-400 hover:text-blue-500" title="Ver imagen">
                                                <ImageIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-600"
                                                onClick={() => {
                                                    setPaymentsDataToEdit(payment)
                                                    setIsConfirmActionModalOpen(true)
                                                }}
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                            <button className="text-blue-400 hover:text-blue-500">
                                                <RoleUserIcon className="w-4 h-4" />
                                            </button>
                                        </div>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {
                    isConfirmActionModalOpen && (
                        <ConfirmActionModal
                            elementData={paymentsDataToEdit}
                            typeOfOperation="payments"
                            onClose={() => setIsConfirmActionModalOpen(false)}
                        />
                    )
                }
                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                    <p className="text-gray-600 text-center md:text-left">
                        Página: 1 de 1 | Registros del 1 al {paymentsData.length} | Total{" "}
                        {paymentsData.length}
                    </p>
                    <div className="flex flex-wrap md:flex-row justify-center space-x-2 md:space-x-4">
                        <button className="py-2 px-4 border rounded">Primera</button>
                        <button className="py-2 px-4 border rounded">Anterior</button>
                        <button className="py-2 px-4 border rounded bg-blue-500 text-white">1</button>
                        <button className="py-2 px-4 border rounded">Siguiente</button>
                        <button className="py-2 px-4 border rounded">Última</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { Payments };