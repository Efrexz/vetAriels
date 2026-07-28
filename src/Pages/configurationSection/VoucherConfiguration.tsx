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
        <section className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    Configuraci&oacute;n
                </span>
                <h1 className="text-2xl font-bold font-display text-ink">
                    Configuraci&oacute;n de Comprobantes
                </h1>
            </div>
            <div className="bg-paper rounded-2xl shadow-sm p-5 mb-6 border border-slate-200">
                <div className="flex flex-col sm:flex-row items-center gap-3 mb-5">
                    <button
                        className="bg-primary text-white py-2 px-5 rounded-xl hover:opacity-90 flex items-center gap-2 transition-colors font-semibold font-display shadow-sm shadow-primary/25"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Agregar comprobante
                    </button>
                    <select
                        name="company"
                        className="w-full sm:w-[260px] rounded-lg border border-slate-200 bg-white text-sm py-2 px-3 text-slate focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                    >
                        <option value="">Empresa</option>
                        <option value="RUC10">OLGA BUSTINZA RODRIGUEZ</option>
                        <option value="RUC20">VETERINARIA ARIELS E.I.R.L</option>
                    </select>
                    <button className="ml-auto border border-slate-200 text-slate py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <RefreshIcon className="w-5 h-5" />
                    </button>
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
                            {paymentsData.map((payment, index) => (
                                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 px-4 text-center text-sm text-slate">{payment.date}</td>
                                    <td className="py-3 px-4 text-center text-sm text-ink font-medium">{payment.companie}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">{payment.voucherName}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">{payment.serialNumber}</td>
                                    <td className="py-3 px-4 text-center text-sm text-ink font-semibold font-display">{payment.lastNumber}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">{payment.default ? 'Si' : 'No'}</td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button className="p-1.5 rounded-lg text-slate hover:text-ink hover:bg-slate-100 transition-colors">
                                                <SearchIcon className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors">
                                                <FileInvoiceIcon className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 rounded-lg text-slate hover:text-danger hover:bg-danger/10 transition-colors">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
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