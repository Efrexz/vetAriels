import { useNavigate } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { Client } from '@t/client.types';
import { PurchasedItem } from '@t/inventory.types';
import SearchIcon from '@assets/searchIcon.svg?react';
import WhatsAppIcon from '@assets/whatsAppIcon.svg?react';
import ShoppingCart from '@assets/shoppingCart.svg?react';

const tableHeaders: string[] = ["Cliente", "Último movimiento", "Items en lista", "Monto", "Opciones"];

function ActiveOrders() {

    const { clients } = useClients();
    const navigate = useNavigate();

    //filtramos los clientes que tengan por lo menos un producto en la cola de ventas
    const activeAccounts: Client[] = clients.filter(client => client.products && client.products.length > 0);

    const calculateTotal = (products: PurchasedItem[]): string => {
        const total = products.reduce((accumulator, product) => {
            return accumulator + (product.salePrice || 0);
        }, 0);
        return total.toFixed(2); // 2 decimales para mostrarlo como moneda.
    };
    return (
        <section className="w-full p-1 sm:p-6 bg-gray-950 text-gray-50 min-h-screen">
            <h1 className="text-xl md:text-2xl font-medium text-white mb-4 tracking-wide border-b border-cyan-500 pb-2 flex items-center">
                <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8 mr-2 text-cyan-400 drop-shadow-lg" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">Cuentas activas</span>
            </h1>
            <div className="bg-gray-900 rounded-xl shadow-lg p-3 sm:p-4 mb-6 border border-gray-700">
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-4">
                <button className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-emerald-500 text-white py-2 px-4 rounded-lg font-bold hover:from-cyan-400 hover:to-emerald-400 transition-all shadow-md">
                    Por cliente
                </button>
                <button className="w-full sm:w-auto bg-gray-800 text-cyan-400 py-2 px-4 rounded-lg font-bold border border-cyan-500 hover:bg-cyan-500 hover:text-white transition-all shadow-md">
                    Por items
                </button>
                </div>
                <div className="p-3 rounded-lg mb-3 bg-gray-800 border-2 border-cyan-500/30">
                <div className="flex flex-col md:flex-row items-center gap-3">
                    <input
                    type="text"
                    placeholder="Buscar cliente..."
                    className="w-full md:w-[240px] py-1 px-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all hover:border-cyan-500"
                    />
                    <input
                    type="date"
                    className="w-full md:w-[240px] py-1 px-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all hover:border-cyan-500"
                    />
                </div>
                </div>
                <div className="overflow-x-auto border border-gray-700 rounded-lg shadow-inner">
                    <table className="min-w-full bg-gray-800">
                        <thead className="bg-gray-700 border-b border-gray-600">
                            <tr>
                                {tableHeaders.map((header) => (
                                <th
                                    key={header}
                                    className="py-2 text-center text-xs font-bold text-gray-300 uppercase tracking-wider px-3 border-r border-gray-600"
                                >
                                    {header}
                                </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {activeAccounts?.map((account) => (
                                <tr
                                key={account.id}
                                className="hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                                onClick={() => navigate(`/sales/client/${account.id}`)}
                                >
                                    <td className="py-1 border border-gray-700 text-center text-gray-200 px-3">
                                        {account.firstName} {account.lastName}
                                    </td>
                                    <td className="py-1 border border-gray-700 text-center text-gray-400 text-xs px-3">
                                        {account?.products[0].additionDate} {account.products[0].additionTime}
                                    </td>
                                    <td className="py-1 border border-gray-700 text-center text-gray-200 font-semibold px-3">
                                        {account.products.length}
                                    </td>
                                    <td className="py-1 border border-gray-700 text-center text-green-400 font-bold px-3">
                                        <span>S/{calculateTotal(account.products)}</span>
                                    </td>
                                    <td className="py-1 text-center px-3 border border-gray-700">
                                        <div className='flex justify-center items-center'>
                                            <button
                                                className="text-cyan-500 hover:text-cyan-300 transition-colors duration-200"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/sales/client/${account.id}`);
                                                }}
                                                >
                                                <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </button>
                                                <button
                                                className="text-emerald-500 hover:text-emerald-300 ml-3 transition-colors duration-200"
                                                onClick={(e) => e.stopPropagation()}
                                                >
                                                <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center mt-3 gap-3">
                    <p className="text-gray-400 text-sm text-center md:text-left">
                        Página: 1 de 1 | Registros del 1 al {activeAccounts.length} | Total {activeAccounts.length}
                    </p>
                    <div className="flex flex-wrap md:flex-row justify-center space-x-1 md:space-x-2">
                        <button className="py-1 px-3 border border-gray-600 rounded text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Primera</button>
                        <button className="py-1 px-3 border border-gray-600 rounded text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Anterior</button>
                        <button className="py-1 px-3 border border-gray-600 rounded bg-cyan-600 text-white hover:bg-cyan-500 transition-colors">1</button>
                        <button className="py-1 px-3 border border-gray-600 rounded text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Siguiente</button>
                        <button className="py-1 px-3 border border-gray-600 rounded text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Última</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { ActiveOrders };