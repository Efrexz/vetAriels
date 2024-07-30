
import RefreshIcon from '../assets/refreshIcon.svg?react';
import EraserIcon from '../assets/eraserIcon.svg?react';
import SearchIcon from '../assets/searchIcon.svg?react';
import PDFIcon from '../assets/pdfIcon.svg?react';
import ExcelIcon from '../assets/fileExcelIcon.svg?react';



const comprobantes = [
    {
        date: '29-07-2024 07:33 PM',
        comprobante: 'BOLETA DE VENTA ELECTRÓNICA: BV01 - 0003560',
        client: 'GLORIA CAROLINA ESPINOZA BORJA',
        amount: '40.00',
        payment: 'MASTERCARD (40.00)',
        status: 'PAGADO'
    },
    {
        date: '29-07-2024 06:16 PM',
        comprobante: 'RECIBO: S01 - 0010773',
        client: 'LUCIA ALVARADO',
        amount: '180.00',
        payment: 'PLIN (180.00)',
        status: 'PAGADO'
    },
    {
        date: '29-07-2024 06:16 PM',
        comprobante: 'RECIBO: S01 - 0010773',
        client: 'LUCIA ALVARADO',
        amount: '180.00',
        payment: 'PLIN (180.00)',
        status: 'PAGADO'
    },
    {
        date: '29-07-2024 06:16 PM',
        comprobante: 'RECIBO: S01 - 0010773',
        client: 'LUCIA ALVARADO',
        amount: '180.00',
        payment: 'PLIN (180.00)',
        status: 'PAGADO'
    },
    {
        date: '29-07-2024 07:33 PM',
        comprobante: 'BOLETA DE VENTA ELECTRÓNICA: BV01 - 0003560',
        client: 'GLORIA CAROLINA ESPINOZA BORJA',
        amount: '40.00',
        payment: 'MASTERCARD (40.00)',
        status: 'PAGADO'
    },
    {
        date: '29-07-2024 06:16 PM',
        comprobante: 'RECIBO: S01 - 0010773',
        client: 'LUCIA ALVARADO',
        amount: '180.00',
        payment: 'PLIN (180.00)',
        status: 'PAGADO'
    },
];

const tableHeaders = [
    "Fecha de emisión",
    "Comprobante",
    "Cliente",
    "Monto",
    "Forma de pago",
    "Estado",
    "Opciones"
];

const headlinesOptions = [
    {
        type: "Tipo-de-Comprobante",
        options: [
            { value: "recibo", label: "RECIBO" },
            { value: "boleta", label: "BOLETA DE VENTA ELECTRÓNICA" },
            { value: "factura", label: "FACTURA ELECTRONICA" },
        ],
    },
    {
        type: "Cualquier-Estado",
        options: [
            { value: "pagado", label: "Pagado" },
            { value: "pendiente", label: "Pendiente" },
            { value: "anulado", label: "Anulado" },
        ],
    }
];

function Invoices() {
    return (
        <section className="container mx-auto p-6">
            <h1 className="text-3xl font-medium text-blue-500 mb-4 pb-4 border-b-2 border-gray-100">Comprobantes</h1>
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex items-center space-x-4 mb-4">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded">Comprobantes Emitidos</button>
                    <button className="bg-transparent text-blue-400 py-2 px-4 rounded hover:bg-gray-100 hover:text-blue-600">Por items</button>
                </div>
                <div className="p-4 rounded-lg mb-2">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className=" w-full flex gap-2">
                            <input
                                type="text"
                                placeholder="Buscar cliente..."
                                className="w-full py-2 px-4 border-gray-200 border-2 rounded-lg focus:outline-none focus:border-blue-500 "
                            />
                            <input
                                type="text"
                                placeholder="Buscar número..."
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
                    <div className="flex items-center space-x-2 mb-4">
                        {
                            headlinesOptions.map((option, index) => (
                                <div key={index} className=" w-[310px] flex gap-2">
                                    <select
                                        name={option.type}
                                        className="mt-1.5 w-full rounded-lg border-gray-200 border-2 text-gray-700 sm:text-sm p-2"
                                    >
                                        <option value="">{option.type}</option>
                                        {option.options.map((option, index) => (
                                            <option key={index} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                </div>
                            ))
                        }
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
                            {comprobantes.map((comprobante, index) => (
                                <tr key={index} className="hover:bg-gray-100 cursor-pointer">
                                    <td className="py-2 px-4 border-b text-center border ">{comprobante.date}</td>
                                    <td className="py-2 px-4 border-b text-center border">{comprobante.comprobante}</td>
                                    <td className="py-2 px-4 border-b text-center border">{comprobante.client}</td>
                                    <td className="py-2 px-4 border-b text-center border">{comprobante.amount}</td>
                                    <td className="py-2 px-4 border-b text-center border">{comprobante.payment}</td>
                                    <td className="py-2 px-4 border-b text-center border text-white bg-green-500 rounded">{comprobante.status}</td>
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
                    <p className="text-gray-600">Página: 1 de 1 | Registros del 1 al 4 | Total 4</p>
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

export { Invoices };