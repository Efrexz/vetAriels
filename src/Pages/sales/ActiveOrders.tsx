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
        <section className=" p-4 sm:p-6 bg-gray-950 text-gray-50 min-h-screen">
            <h1 className="text-xl sm:text-3xl font-medium text-white mb-6 tracking-wide border-b border-cyan-500 pb-3 flex items-center">
                <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-cyan-400 drop-shadow-lg" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">Cuentas activas</span>
            </h1>
            <div className="bg-gray-900 rounded-2xl shadow-xl p-4 sm:p-6 mb-8 border border-gray-700">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                    <button className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-bold hover:from-cyan-400 hover:to-emerald-400 transition-all shadow-md">Por cliente</button>
                    <button className="w-full sm:w-auto bg-gray-800 text-cyan-400 py-3 px-6 rounded-xl font-bold border border-cyan-500 hover:bg-cyan-500 hover:text-white transition-all shadow-md">Por items</button>
                </div>
                <div className="p-4 rounded-xl mb-4 bg-gray-800 border-2 border-cyan-500/30">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            className="w-full md:w-[280px] py-3 px-5 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                        />
                        <input
                            type="date"
                            className="w-full md:w-[280px] py-3 px-5 bg-gray-700 border border-gray-600 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto border border-gray-700 rounded-xl shadow-inner">
                    <table className="min-w-full bg-gray-900">
                        <thead className='bg-gray-800 border-b border-gray-700'>
                            <tr>
                                {tableHeaders.map((header) => (
                                    <th key={header} className="py-3 text-center text-sm font-bold text-gray-300 uppercase tracking-wider px-4 border-r border-gray-700">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {activeAccounts?.map((account) => (
                                <tr
                                    key={account.id}
                                    className='hover:bg-gray-800 transition-colors duration-200 cursor-pointer'
                                    onClick={() => navigate(`/sales/client/${account.id}`)}
                                >
                                    <td className="py-2 border border-gray-700  text-center text-gray-200 px-4">
                                        {account.firstName} {account.lastName}
                                    </td>
                                    <td className="py-2 border border-gray-700 text-center text-gray-400 text-sm px-4">
                                        {account?.products[0].additionDate} {account.products[0].additionTime}
                                    </td>
                                    <td className="py-2 border border-gray-700 text-center text-gray-200 font-semibold px-4">
                                        {account.products.length}
                                    </td>
                                    <td className="py-2 border border-gray-700 text-center text-green-400 font-bold px-4">
                                        <span>
                                            S/{calculateTotal(account.products)}
                                        </span>
                                    </td>
                                    <td className="py-2 text-center px-4">
                                        <button
                                            className="text-cyan-500 hover:text-cyan-300 transition-colors duration-200"
                                            onClick={(e) => { e.stopPropagation(); navigate(`/sales/client/${account.id}`); }}
                                        >
                                            <SearchIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                                        </button>
                                        <button
                                            className="text-emerald-500 hover:text-emerald-300 ml-4 transition-colors duration-200"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                <p className="text-gray-400 text-center md:text-left">
                    Página: 1 de 1 | Registros del 1 al {activeAccounts.length} | Total{" "}
                    <span className="font-extrabold text-gray-200">{activeAccounts.length}</span>
                </p>
                <div className="flex flex-wrap md:flex-row justify-center space-x-2 md:space-x-4">
                    <button className="py-2 px-4 border border-gray-700 rounded-xl text-gray-400 hover:bg-gray-800 transition-colors">Primera</button>
                    <button className="py-2 px-4 border border-gray-700 rounded-xl text-gray-400 hover:bg-gray-800 transition-colors">Anterior</button>
                    <button className="py-2 px-4 border-2 border-cyan-500 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold shadow-md hover:from-cyan-400 hover:to-emerald-400 transition-all">1</button>
                    <button className="py-2 px-4 border border-gray-700 rounded-xl text-gray-400 hover:bg-gray-800 transition-colors">Siguiente</button>
                    <button className="py-2 px-4 border border-gray-700 rounded-xl text-gray-400 hover:bg-gray-800 transition-colors">Última</button>
                </div>
            </div>
        </section>
    );
}

export { ActiveOrders };