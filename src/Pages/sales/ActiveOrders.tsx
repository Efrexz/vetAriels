import { useState } from 'react';
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

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filters, setFilters] = useState<Record<string, string>>({
            provider: '',
            line: '',
            category: '',
            stock: '',
        });

    const filteredClients = clients.filter(client => {
        const matchesSearch = client.firstName?.toLowerCase().includes(searchTerm.toLowerCase());
    }

    )

    //filtramos los clientes que tengan por lo menos un producto en la cola de ventas
    const activeAccounts: Client[] = clients.filter(client => client.products && client.products.length > 0);

    const calculateTotal = (products: PurchasedItem[]): string => {
        const total = products.reduce((accumulator, product) => {
            return accumulator + (product.salePrice || 0);
        }, 0);
        return total.toFixed(2); // 2 decimales para mostrarlo como moneda.
    };
    return (
        <section className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    Cuentas
                </span>
                <h1 className="text-2xl font-bold font-display text-ink">
                    Cuentas activas
                </h1>
            </div>
            <div className="bg-paper rounded-2xl shadow-sm p-5 mb-6 border border-slate-200">
                <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
                    <button className="w-full sm:w-auto bg-primary/10 text-primary py-2 px-4 rounded-xl font-semibold font-display text-sm transition-colors">
                        Por cliente
                    </button>
                    <button className="w-full sm:w-auto bg-paper text-slate py-2 px-4 rounded-xl font-medium text-sm border border-slate-200 hover:bg-slate-50 transition-colors">
                        Por items
                    </button>
                </div>
                <div className="p-4 rounded-xl mb-4 border border-slate-200 bg-slate-50/50">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            className="w-full md:w-[240px] py-2 px-4 bg-white border border-slate-200 rounded-lg text-sm text-ink placeholder:text-slate/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                        />
                        <input
                            type="date"
                            className="w-full md:w-[240px] py-2 px-4 bg-white border border-slate-200 rounded-lg text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="border-b border-slate-200">
                                {tableHeaders.map((header) => (
                                    <th
                                        key={header}
                                        className="py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate px-3"
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
                                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/sales/client/${account.id}`)}
                                >
                                    <td className="py-3 px-3 text-center text-sm text-ink font-medium">
                                        {account.firstName} {account.lastName}
                                    </td>
                                    <td className="py-3 px-3 text-center text-xs text-slate">
                                        {account?.products[0].additionDate} {account.products[0].additionTime}
                                    </td>
                                    <td className="py-3 px-3 text-center text-sm text-ink font-semibold">
                                        {account.products.length}
                                    </td>
                                    <td className="py-3 px-3 text-center text-success font-bold text-sm font-display">
                                        <span>S/{calculateTotal(account.products)}</span>
                                    </td>
                                    <td className="py-3 px-3 text-center">
                                        <div className="flex justify-center items-center gap-1">
                                            <button
                                                className="p-1.5 rounded-lg text-slate hover:text-primary hover:bg-primary/10 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/sales/client/${account.id}`);
                                                }}
                                            >
                                                <SearchIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-1.5 rounded-lg text-slate hover:text-success hover:bg-success/10 transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <WhatsAppIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center mt-5 gap-4">
                    <p className="text-slate text-sm">
                        Registros 1&ndash;{activeAccounts.length} de {activeAccounts.length}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">Primera</button>
                        <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">Anterior</button>
                        <button className="py-1.5 px-3 rounded-lg text-sm bg-primary text-white font-semibold transition-colors">1</button>
                        <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">Siguiente</button>
                        <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">&Uacute;ltima</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { ActiveOrders };