import { useState } from 'react';
import { PaymentAndDepositModal } from '../../components/PaymentAndDepositModal';
import SearchIcon from '../../assets/searchIcon.svg?react';
import EraserIcon from '../../assets/eraserIcon.svg?react';
import RefreshIcon from '../../assets/refreshIcon.svg?react';
import PDFIcon from '../../assets/pdfIcon.svg?react';
import FileInvoiceIcon from '../../assets/file-invoice.svg?react';
import ExcelIcon from '../../assets/fileExcelIcon.svg?react';


const paymentsData = [
    { id: '300EBFEA', date: '31-07-2024 07:43 AM', description: 'APERTURA ANGELLY', paymentMethod: 'EFECTIVO', income: '2,084.00', expense: null, docRef: '', movementType: 'DIRECTO' },
    { id: 'FD12A67B', date: '30-07-2024 10:05 PM', description: '', paymentMethod: 'VISA', income: '150.00', expense: null, docRef: 'BV01-0003572', movementType: 'VENTA' },
    { id: 'AB4801FD', date: '30-07-2024 10:00 PM', description: '', paymentMethod: 'VISA', income: '475.00', expense: null, docRef: 'BV01-0003571', movementType: 'VENTA' },
];


const tableHeaders = ["Fecha", "ID", "Descripción", "Medio de Pago", "Entrada", "Salida", "Doc. Ref.", "Tipo de Mov.", "Opciones"];

function Payments() {
    const [isModalOpen, setIsModalOpen] = useState(false);


    const [typeOfOperation, setTypeOfOperation] = useState('');
    return (
        <section className="container mx-auto p-6">
            <h1 className="text-3xl font-medium text-blue-500 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <FileInvoiceIcon className="w-9 h-9 mr-2" />
                Entradas / Salidas de Caja
            </h1>
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="p-4 rounded-lg mb-2">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="w-full flex gap-2">
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
                        <button className="bg-transparent border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-200">
                            <EraserIcon className="w-5 h-5" />
                        </button>
                        <button className="bg-transparent border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-200">
                            <RefreshIcon className="w-5 h-5" />
                        </button>
                        <button className="bg-transparent border border-gray-300 text-orange-500 py-2 px-4 rounded hover:bg-gray-200">
                            <PDFIcon className="w-5 h-5" />
                        </button>
                        <button className="bg-transparent border border-gray-300 text-green-600 py-2 px-4 rounded hover:bg-gray-200">
                            <ExcelIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-[300px] flex gap-2">
                            <select
                                name="Metodo-de-pago"
                                className="mt-1.5 w-full rounded-lg border-gray-200 border-2 text-gray-700 sm:text-sm p-2"
                            >
                                <option value="">Método de Pago</option>
                                <option value="AMERICAN EXPRESS">American Express</option>
                                <option value="VISA">VISA</option>
                                <option value="MASTERCARD">Mastercard</option>

                            </select>
                        </div>
                        <div className="flex space-x-4 mt-1.5">
                            <button
                                className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600"
                                onClick={() => {
                                    setIsModalOpen(true)
                                    setTypeOfOperation("Entrada")
                                }}>
                                ENTRADA
                            </button>
                            <button
                                className="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600"
                                onClick={() => {
                                    setIsModalOpen(true)
                                    setTypeOfOperation("Salida")
                                }}
                            >SALIDA</button>
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
                                    <th key={header} className="py-2 px-4 border text-gray-700 text-center">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paymentsData.map((payment, index) => (
                                <tr key={index} className="hover:bg-gray-100 cursor-pointer">
                                    <td className="py-2 px-4 border-b text-center border">{payment.date}</td>
                                    <td className="py-2 px-4 border-b text-center border">{payment.id}</td>
                                    <td className="py-2 px-4 border-b text-center border">{payment.description}</td>
                                    <td className="py-2 px-4 border-b text-center border">{payment.paymentMethod}</td>
                                    <td className="py-2 px-4 border-b text-center border text-green-600">{payment.income}</td>
                                    <td className="py-2 px-4 border-b text-center border text-red-600">{payment.expense}</td>
                                    <td className="py-2 px-4 border-b text-center border">{payment.docRef}</td>
                                    <td className="py-2 px-4 border-b text-center border">{payment.movementType}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        <button className="text-green-500 hover:text-green-700">
                                            <SearchIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-gray-600">Página: 1 de 1 | Registros del 1 al {paymentsData.length} | Total {paymentsData.length}</p>
                    <div className="flex space-x-2">
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