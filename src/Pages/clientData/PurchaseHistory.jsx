import SearchIcon from '@assets/searchIcon.svg?react';


const comprobantes = [
    {
        date: '29-07-2024 07:33 PM',
        comprobante: 'BOLETA DE VENTA ELECTRÓNICA: BV01 - 0003560',
        concept: 'CONSULTA',
        pet: 'FRAC',
        price: '10.00',
        quantity: '1',
        total: '10.00',
        status: 'PAGADO'
    },
    {
        date: '29-07-2024 07:33 PM',
        comprobante: 'BOLETA DE VENTA ELECTRÓNICA: BV01 - 0003560',
        concept: 'CONSULTA',
        pet: 'FRAC',
        price: '10.00',
        quantity: '1',
        total: '10.00',
        status: 'PAGADO'
    },
    {
        date: '29-07-2024 07:33 PM',
        comprobante: 'BOLETA DE VENTA ELECTRÓNICA: BV01 - 0003560',
        concept: 'CONSULTA',
        pet: 'FRAC',
        price: '10.00',
        quantity: '1',
        total: '10.00',
        status: 'PAGADO'
    },
];

const tableHeaders = [
    "Fecha de emisión",
    "Comprobante",
    "Concepto",
    "Mascota",
    "Precio",
    "Cantidad",
    "Total",
    "Estado",
    "Opciones"
];

const headlinesOptions = [
    {
        type: "Clase...",
        options: [
            { value: "producto", label: "Producto" },
            { value: "recibo", label: "Recibo" },
        ],
    },
    {
        type: "Cualquier-Estado",
        options: [
            { value: "pagado", label: "Pagado" },
            { value: "pendiente", label: "Pendiente" },
            { value: "anulado", label: "Anulado" },
        ],
    },
    {
        type: "Tipo-de-Comprobante",
        options: [
            { value: "recibo", label: "RECIBO" },
            { value: "boleta", label: "BOLETA DE VENTA ELECTRÓNICA" },
            { value: "factura", label: "FACTURA ELECTRONICA" },
        ],
    }
];

function PurchaseHistory() {
    return (
        <section className="bg-white rounded-lg shadow p-4">
            <div className="p-4 rounded-lg mb-4">
                <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <div className="flex w-full sm:w-auto border-gray-200 border rounded-lg overflow-hidden hover:border-blue-300 focus-within:border-blue-300">
                            <div className="flex items-center justify-center bg-gray-100 px-3">
                                <SearchIcon className="w-5 h-5 text-gray-600" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="w-full sm:w-[250px] py-2 px-4 focus:outline-none focus:ring-0"
                            />
                        </div>
                        <input
                            type="date"
                            className="w-full sm:w-auto py-2 px-4 border-gray-200 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {headlinesOptions.map((option, index) => (
                        <div key={index} className="w-full">
                            <select
                                name={option.type}
                                className="w-full rounded-lg border-gray-200 border-2 text-gray-700 sm:text-sm p-2 hover:border-blue-300 focus-within:border-blue-300"
                            >
                                <option value="">{option.type}</option>
                                {option.options.map((opt, optIndex) => (
                                    <option key={optIndex} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
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
                                <td className="py-2 px-4 border-b text-center">{comprobante.date}</td>
                                <td className="py-2 px-4 border-b text-center">{comprobante.comprobante}</td>
                                <td className="py-2 px-4 border-b text-center">{comprobante.concept}</td>
                                <td className="py-2 px-4 border-b text-center">{comprobante.pet}</td>
                                <td className="py-2 px-4 border-b text-center">{comprobante.price}</td>
                                <td className="py-2 px-4 border-b text-center">{comprobante.quantity}</td>
                                <td className="py-2 px-4 border-b text-center">{comprobante.total}</td>
                                <td className="py-2 px-4 border-b text-center text-white bg-green-500 rounded">
                                    {comprobante.status}
                                </td>
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
            <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-4 md:space-y-0">
                <p className="text-gray-600 text-sm text-center md:text-left">
                    Página: 1 de 1 | Registros del 1 al 4 | Total 4
                </p>
                <div className="flex space-x-2">
                    <button className="py-2 px-4 border rounded">Primera</button>
                    <button className="py-2 px-4 border rounded">Anterior</button>
                    <button className="py-2 px-4 border rounded bg-blue-500 text-white">1</button>
                    <button className="py-2 px-4 border rounded">Siguiente</button>
                    <button className="py-2 px-4 border rounded">Última</button>
                </div>
            </div>
        </section>

    );
}

export { PurchaseHistory };