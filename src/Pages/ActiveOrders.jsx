import RefreshIcon from '../assets/refreshIcon.svg?react';
import EraserIcon from '../assets/eraserIcon.svg?react';
import SearchIcon from '../assets/searchIcon.svg?react';
import PDFIcon from '../assets/pdfIcon.svg?react';
import PaperPlaneIcon from '../assets/paperPlaneIcon.svg?react';
import WhatsAppIcon from '../assets/whatsAppIcon.svg?react';


const activeAccounts = [
    { client: 'POOL CHRISTIAN, GRADOS VICUÑA', lastMovement: '29-07-2024 02:21 p. m.', items: 2, amount: '40.00' },
    { client: 'ALEXIA HAI-LA, VIGURIA WONG', lastMovement: '29-07-2024 01:05 p. m.', items: 2, amount: '260.00' },
    { client: 'LUIS ALBERTO, TRUJILLO EYZAQUIRRE', lastMovement: '29-07-2024 12:47 p. m.', items: 2, amount: '70.00' },
    { client: 'PAOLO SEBASTIAN, ZAPATA VICTORIA', lastMovement: '29-07-2024 11:36 a. m.', items: 5, amount: '207.00' },
];

const tableHeaders = [
    "Cliente",
    "Último movimiento",
    "Items en lista",
    "Monto",
    "Opciones"
];

function ActiveOrders() {
    return (
        <section className="container mx-auto p-6">
            <h1 className="text-3xl font-medium text-orange-500 mb-4 pb-4 border-b-2 border-gray-100">Cuentas activas</h1>
            <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-300">
                <div className="flex items-center space-x-4 mb-4">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded">Por cliente</button>
                    <button className="bg-transparent text-blue-400 py-2 px-4 rounded hover:bg-gray-100 hover:text-blue-600">Por items</button>
                </div>
                <div className=" p-4 rounded-lg mb-2 border border-gray-300">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="relative w-full flex gap-2">
                            <input
                                type="text"
                                placeholder="Buscar cliente..."
                                className="w-full py-2 px-4 border rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="date"
                                className="w-full py-2 px-4 border rounded-lg focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <button className="bg-transparent border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-200">
                            <EraserIcon className="w-5 h-5" />
                        </button>
                        <button className="bg-transparent border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-200">
                            <RefreshIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto border border-gray-300 rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                {tableHeaders.map((header) => (
                                    <th key={header} className="py-2 text-center border text-gray-700">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {activeAccounts.map((account, index) => (
                                <tr key={index} className='hover:bg-gray-100'>
                                    <td className="py-2 text-center border">{account.client}</td>
                                    <td className="py-2 text-center border">{account.lastMovement}</td>
                                    <td className="py-2 text-center border">{account.items}</td>
                                    <td className="py-2 text-center border">{account.amount}</td>
                                    <td className="py-2 text-center border">
                                        <button className="text-green-500 hover:text-green-700">
                                            <SearchIcon className="w-5 h-5" />
                                        </button>
                                        <button className="text-orange-500 hover:text-orange-700 ml-2">
                                            <PDFIcon className="w-5 h-5" />
                                        </button>
                                        <button className="text-blue-500 hover:text-blue-700 ml-2">
                                            <PaperPlaneIcon className="w-5 h-5" />
                                        </button>
                                        <button className="text-green-500 hover:text-green-700 ml-2">
                                            <WhatsAppIcon className="w-5 h-5" />
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

export { ActiveOrders };