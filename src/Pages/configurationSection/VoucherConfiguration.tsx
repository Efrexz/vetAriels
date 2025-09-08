import TrashIcon from '@assets/trashIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import FileInvoiceIcon from '@assets/file-invoice.svg?react';
import RefreshIcon from '@assets/refreshIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';


const tableHeaders = ["Fecha de registro", "Empresa", "	Nombre de comprobante", "Serie (actual)", "Ultimo número emitido", "Predeterminado", "Opciones"];

const paymentsData = [{
        date: '29-07-2024 07:33 PM',
        companie: 'Gloria Carolina Espinoza Borja',
        voucherName: 'BOLETA DE VENTA ELECTRÓNICA',
        serialNumber: 'B001',
        lastNumber: '0015977',
        default: false,
    }]


function VoucherConfiguration() {

    return (
        <section className="container mx-auto p-6">
            <h1 className="text-3xl font-medium text-orange-400 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <FileInvoiceIcon className="w-8 h-8 mr-2" />
                Configuración de Comprobantes
            </h1>
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="p-4 rounded-lg mb-2">
                    <div className="flex items-center space-x-4 mb-4">
                        <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3"
                        >
                            <PlusIcon className="w-5 h-5 text-white" />
                            AGREGAR COMPROBANTE
                        </button>
                        <div className="w-[400px] flex gap-2">
                            <select
                                name="company"
                                className=" w-full rounded-lg border-gray-200 border-2 text-gray-700 sm:text-sm p-2"
                            >
                                <option value="">Empresa</option>
                                <option value="RUC10">OLGA BUSTINZA RODRIGUEZ</option>
                                <option value="RUC20">VETERINARIA ARIELS E.I.R.L</option>
                            </select>
                        </div>
                        <button className="bg-transparent border border-gray-300 text-gray-600 py-2 px-4 rounded hover:bg-gray-200">
                            <RefreshIcon className="w-5 h-5" />
                        </button>
                    </div>

                </div>
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
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b text-center border">{payment.date}</td>
                                    <td className="py-2 px-4 border-b text-center border">{payment.companie}</td>
                                    <td className="py-2 px-4 border-b text-center border">{payment.voucherName}</td>
                                    <td className="py-2 px-4 border-b text-center border">{payment.serialNumber}</td>
                                    <td className="py-2 px-4 border-b text-center border">{payment.lastNumber}</td>
                                    <td className="py-2 px-4 border-b text-center border">{payment.default ? 'Si' : 'No'}</td>
                                    <td className="py-6 px-4 border-b text-center flex items-center justify-center gap-1">
                                        <button className="text-orange-500 hover:text-orange-600" title="Ver imagen">
                                            <SearchIcon className="w-4 h-4" />
                                        </button>
                                        <button className="text-purple-400 hover:text-purple-500">
                                            <FileInvoiceIcon className="w-4 h-4" />
                                        </button>
                                        <button className="text-red-500 hover:text-red-600">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export { VoucherConfiguration };