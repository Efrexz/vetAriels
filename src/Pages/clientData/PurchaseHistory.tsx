import { useState } from 'react';
import SearchIcon from '@assets/searchIcon.svg?react';

interface Receipt {
    date: string;
    comprobante: string;
    concept: string;
    pet: string;
    price: string;
    quantity: string;
    total: string;
    status: 'PAGADO' | 'PENDIENTE' | 'ANULADO';
}

const receipts : Receipt[] = [
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

const tableHeaders: string[] = [
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
        <section className="bg-paper rounded-2xl shadow-sm p-5 border border-slate-200">
            <div className="p-4 rounded-xl mb-4 border border-slate-200 bg-slate-50/50">
                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <div className="flex items-center w-full sm:w-auto border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-primary">
                            <div className="flex items-center justify-center px-3">
                                <SearchIcon className="w-4 h-4 text-slate" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="w-full sm:w-[250px] py-2 px-2 focus:outline-none focus:ring-0 text-sm text-ink placeholder:text-slate/70"
                            />
                        </div>
                        <input
                            type="date"
                            className="w-full sm:w-auto py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {headlinesOptions.map((option, index) => (
                        <div key={index} className="w-full">
                            <select
                                name={option.type}
                                className="w-full rounded-lg border border-slate-200 bg-white text-sm py-2 px-3 text-slate focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
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
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-slate-200">
                            {tableHeaders.map((header) => (
                                <th key={header} className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-slate">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {receipts.map((receipt, index) => (
                            <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer transition-colors">
                                <td className="py-3 px-4 text-center text-sm text-slate">{receipt.date}</td>
                                <td className="py-3 px-4 text-center text-sm text-ink font-medium">{receipt.comprobante}</td>
                                <td className="py-3 px-4 text-center text-sm text-slate">{receipt.concept}</td>
                                <td className="py-3 px-4 text-center text-sm text-slate">{receipt.pet}</td>
                                <td className="py-3 px-4 text-center text-sm text-ink font-semibold font-display">{receipt.price}</td>
                                <td className="py-3 px-4 text-center text-sm text-slate">{receipt.quantity}</td>
                                <td className="py-3 px-4 text-center text-sm text-ink font-semibold font-display">{receipt.total}</td>
                                <td className="py-3 px-4 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        receipt.status === 'PAGADO' ? 'bg-success/10 text-success' :
                                        receipt.status === 'PENDIENTE' ? 'bg-amber/10 text-amber' :
                                        'bg-danger/10 text-danger'
                                    }`}>
                                        {receipt.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <button className="p-1.5 rounded-lg text-slate hover:text-primary hover:bg-primary/10 transition-colors">
                                        <SearchIcon className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-5 gap-4">
                <p className="text-slate text-sm">
                    Registros 1&ndash;4 de 4
                </p>
                <div className="flex flex-wrap gap-2">
                    <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">Primera</button>
                    <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">Anterior</button>
                    <button className="py-1.5 px-3 rounded-lg text-sm bg-primary text-white font-semibold transition-colors">1</button>
                    <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">Siguiente</button>
                    <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">&Uacute;ltima</button>
                </div>
            </div>
        </section>

    );
}

export { PurchaseHistory };