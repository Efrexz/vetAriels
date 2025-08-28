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
        <section className="container mx-auto p-6">
            <h1 className="text-xl sm:text-3xl font-medium text-orange-500 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <ShoppingCart className="w-6 sm:w-9 h-6 sm:h-9  mr-2" />
                Cuentas activas
            </h1>
            <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-300">
                <div className="flex items-center space-x-4 mb-4">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded">Por cliente</button>
                    <button className="bg-transparent text-blue-400 py-2 px-4 rounded hover:bg-gray-100 hover:text-blue-600">Por items</button>
                </div>
                <div className="p-4 rounded-lg mb-2 border border-gray-300">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            className="w-full md:w-[280px] py-2 px-4 border rounded-lg focus:outline-none focus:border-blue-500"
                        />

                        <input
                            type="date"
                            className="w-full  md:w-[280px] py-2 px-4 border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto border border-gray-300 rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead className='bg-gray-100'>
                            <tr>
                                {tableHeaders.map((header) => (
                                    <th key={header} className="py-2 text-center border text-gray-700 px-4">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {activeAccounts?.map((account) => (
                                <tr
                                    key={account.id}
                                    className='hover:bg-gray-100 hover:cursor-pointer'
                                    onClick={() => navigate(`/sales/client/${account.id}`)}
                                >
                                    <td className="py-2 text-center border">
                                        {account.firstName} {account.lastName}
                                    </td>
                                    <td className="py-2 text-center border">
                                        {account?.products[0].additionDate} {account.products[0].additionTime}
                                    </td>
                                    <td className="py-2 text-center border">
                                        {account.products.length}
                                    </td>
                                    <td className="py-2 text-center border">
                                        <span>
                                            S/{calculateTotal(account.products)}
                                        </span>
                                    </td>
                                    <td className="py-2 text-center border">
                                        <button
                                            className="text-green-500 hover:text-green-700"
                                            onClick={() => navigate(`/sales/client/${account.id}`)}
                                        >
                                            <SearchIcon className="w-5 h-5" />
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
            </div >

            <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                <p className="text-gray-600 text-center md:text-left">
                    Página: 1 de 1 | Registros del 1 al {activeAccounts.length} | Total{" "}
                    {activeAccounts.length}
                </p>
                <div className="flex flex-wrap md:flex-row justify-center space-x-2 md:space-x-4">
                    <button className="py-2 px-4 border rounded">Primera</button>
                    <button className="py-2 px-4 border rounded">Anterior</button>
                    <button className="py-2 px-4 border rounded bg-blue-500 text-white">1</button>
                    <button className="py-2 px-4 border rounded">Siguiente</button>
                    <button className="py-2 px-4 border rounded">Última</button>
                </div>
            </div>
        </section >
    );
}

export { ActiveOrders };