import SearchIcon from '@assets/searchIcon.svg?react';
import FileInvoiceIcon from '@assets/file-invoice.svg?react';

type InvoiceStatus = 'PAGADO' | 'PENDIENTE' | 'ANULADO';

interface Invoice {
    id: string;
    date: string;
    comprobante: string;
    client: string;
    amount: string;
    payment: string;
    status: InvoiceStatus;
}


const invoicesData: Invoice[] = [
    {
        id: 'prueba1',
        date: '29-07-2024 07:33 PM',
        comprobante: 'BOLETA DE VENTA ELECTRÓNICA: BV01 - 0003560',
        client: 'GLORIA CAROLINA ESPINOZA BORJA',
        amount: '40.00',
        payment: 'MASTERCARD (40.00)',
        status: 'PAGADO'
    },
    {
        id: 'prueba2',
        date: '29-07-2024 06:16 PM',
        comprobante: 'RECIBO: S01 - 0010773',
        client: 'LUCIA ALVARADO',
        amount: '180.00',
        payment: 'PLIN (180.00)',
        status: 'PAGADO'
    },
    {
        id: 'prueba3',
        date: '29-07-2024 06:16 PM',
        comprobante: 'RECIBO: S01 - 0010773',
        client: 'LUCIA ALVARADO',
        amount: '180.00',
        payment: 'PLIN (180.00)',
        status: 'PAGADO'
    },
    {
        id: 'prueba4',
        date: '29-07-2024 06:16 PM',
        comprobante: 'RECIBO: S01 - 0010773',
        client: 'LUCIA ALVARADO',
        amount: '180.00',
        payment: 'PLIN (180.00)',
        status: 'PAGADO'
    },
    {
        id: 'prueba5',
        date: '29-07-2024 07:33 PM',
        comprobante: 'BOLETA DE VENTA ELECTRÓNICA: BV01 - 0003560',
        client: 'GLORIA CAROLINA ESPINOZA BORJA',
        amount: '40.00',
        payment: 'MASTERCARD (40.00)',
        status: 'PAGADO'
    },
    {
        id: 'prueba6',
        date: '29-07-2024 06:16 PM',
        comprobante: 'RECIBO: S01 - 0010773',
        client: 'LUCIA ALVARADO',
        amount: '180.00',
        payment: 'PLIN (180.00)',
        status: 'PAGADO'
    },
];


const tableHeaders: string[] = ["Fecha de emisión", "Comprobante", "Cliente", "Monto", "Forma de pago", "Estado", "Opciones"];

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
    const getStatusStyle = (status: InvoiceStatus) => {
        switch (status) {
            case 'PAGADO': return 'bg-success/10 text-success';
            case 'PENDIENTE': return 'bg-amber/10 text-amber';
            case 'ANULADO': return 'bg-danger/10 text-danger';
            default: return 'bg-slate-100 text-slate';
        }
    };
    return (
        <section className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    Comprobantes
                </span>
                <h1 className="text-2xl font-bold font-display text-ink">
                    Facturaci&oacute;n
                </h1>
            </div>
            <div className="bg-paper rounded-2xl shadow-sm p-5 mb-6 border border-slate-200">
                <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
                    <button className="bg-primary/10 text-primary py-2 px-4 rounded-lg text-sm font-semibold font-display">Comprobantes Emitidos</button>
                    <button className="text-slate py-2 px-4 rounded-lg text-sm hover:bg-slate-50 transition-colors font-medium">Por items</button>
                </div>
                <div className="p-4 rounded-xl mb-4 border border-slate-200 bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            className="w-full py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                        />
                        <input
                            type="text"
                            placeholder="Buscar n&uacute;mero..."
                            className="w-full py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                        />
                        <input
                            type="date"
                            className="w-full py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {headlinesOptions.map((option, index) => (
                            <div key={index} className="w-full">
                                <select
                                    name={option.type}
                                    className="w-full rounded-lg border border-slate-200 bg-white text-sm py-2 px-3 text-slate focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                >
                                    <option value="">{option.type}</option>
                                    {option.options.map((option, index) => (
                                        <option key={index} value={option.value}>
                                            {option.label}
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
                            {invoicesData.map((invoice) => (
                                <tr key={invoice.id} className="border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer transition-colors">
                                    <td className="py-3 px-4 text-center text-sm text-slate">{invoice.date}</td>
                                    <td className="py-3 px-4 text-center text-sm text-ink font-medium">{invoice.comprobante}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">{invoice.client}</td>
                                    <td className="py-3 px-4 text-center text-sm text-ink font-semibold font-display">{invoice.amount}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">{invoice.payment}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(invoice.status)}`}>
                                            {invoice.status}
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
                        Registros 1&ndash;5 de 5
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

export { Invoices };