import PlusIcon from '@assets/plusIcon.svg?react';
import FileInvoiceIcon from '@assets/file-invoice.svg?react';
import RefreshIcon from '@assets/refreshIcon.svg?react';
import EraserIcon from '@assets/eraserIcon.svg?react';
import EditIcon from '@assets/editIcon.svg?react';
import UserIcon from '@assets/userIcon.svg?react';

const tableHeaders = ["Nombre", "Tipo de pago", "Observaciones", "Estado", "Opciones"];

const paymentsData = [{
        name: 'AMERICAN EXPRESS',
        paymentType: 'TARJETA DE CRÉDITO',
        observations: '',
        state: true,
    }]

function PaymentMethods() {

    return (
        <section className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    Configuraci&oacute;n
                </span>
                <h1 className="text-2xl font-bold font-display text-ink">
                    M&eacute;todos de pago
                </h1>
            </div>
            <div className="bg-paper rounded-2xl shadow-sm p-5 mb-6 border border-slate-200">
                <div className="flex flex-col sm:flex-row items-center gap-3 mb-5">
                    <button
                        className="bg-primary text-white py-2 px-5 rounded-xl hover:opacity-90 flex items-center gap-2 transition-colors font-semibold font-display shadow-sm shadow-primary/25"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Agregar m&eacute;todo de pago
                    </button>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <select
                            name="state"
                            className="w-full rounded-lg border border-slate-200 bg-white text-sm py-2 px-3 text-slate focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                        >
                            <option value="">Estado</option>
                            <option value="active">Activo</option>
                            <option value="inactive">Inactivo</option>
                        </select>
                        <select
                            name="paymentType"
                            className="w-full rounded-lg border border-slate-200 bg-white text-sm py-2 px-3 text-slate focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                        >
                            <option value="">Tipo de pago</option>
                            <option value="defaultType">Por defecto</option>
                            <option value="customType">Personalizados</option>
                        </select>
                    </div>
                    <div className="flex gap-2 ml-auto">
                        <button className="border border-slate-200 text-slate py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                            <EraserIcon className="w-5 h-5" />
                        </button>
                        <button className="border border-slate-200 text-slate py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                            <RefreshIcon className="w-5 h-5" />
                        </button>
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
                            {paymentsData.map((payment, index) => (
                                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 px-4 text-center text-sm text-ink font-medium">{payment.name}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">{payment.paymentType}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">{payment.observations}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payment.state ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                                            {payment.state ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button className="p-1.5 rounded-lg text-slate hover:text-ink hover:bg-slate-100 transition-colors" title="Editar">
                                                <EditIcon className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 rounded-lg text-slate hover:text-primary hover:bg-primary/10 transition-colors">
                                                <UserIcon className="w-4 h-4" />
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

export { PaymentMethods };