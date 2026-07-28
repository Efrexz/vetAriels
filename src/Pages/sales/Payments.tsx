import { useState } from 'react';
import { useFinancial } from '@context/FinancialContext';
import { Payment } from '@t/financial.types';
import { PaymentAndDepositModal } from '@components/modals/PaymentAndDepositModal';
import { ConfirmActionModal } from '@components/modals/ConfirmActionModal';
import TrashIcon from '@assets/trashIcon.svg?react';
import FileInvoiceIcon from '@assets/file-invoice.svg?react';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import ImageIcon from '@assets/imageIcon.svg?react';

const tableHeaders: string[] = ["ID", "Fecha", "Descripción", "Medio de Pago", "Entrada", "Salida", "Doc. Ref.", "Movimiento", "Opciones"];

type OperationType = 'ENTRADA' | 'SALIDA';

function Payments() {

    const { paymentsData } = useFinancial();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [paymentToEdit, setPaymentToEdit] = useState<Payment | null>(null);
    const [operationType, setOperationType] = useState<OperationType>('ENTRADA');
    return (
        <section className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    Caja
                </span>
                <h1 className="text-2xl font-bold font-display text-ink">
                    Entradas / Salidas de Caja
                </h1>
            </div>
            <div className="bg-paper rounded-2xl shadow-sm p-5 mb-6 border border-slate-200">
                <div className="p-4 rounded-xl mb-4 border border-slate-200 bg-slate-50/50">
                    <div className="flex flex-col md:flex-row md:items-center md:gap-3 mb-4">
                        <div className="flex flex-col md:flex-row gap-3 w-full">
                            <input
                                type="text"
                                placeholder="Buscar por ID..."
                                className="w-full py-2 px-4 bg-white border border-slate-200 rounded-lg text-sm text-ink placeholder:text-slate/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                            />
                            <input
                                type="text"
                                placeholder="Buscar descripci&oacute;n..."
                                className="w-full py-2 px-4 bg-white border border-slate-200 rounded-lg text-sm text-ink placeholder:text-slate/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                            />
                            <input
                                type="date"
                                className="w-full py-2 px-4 bg-white border border-slate-200 rounded-lg text-sm text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="w-full sm:w-[260px]">
                            <select
                                name="Metodo-de-pago"
                                className="w-full rounded-lg border border-slate-200 bg-white text-sm py-2 px-3 text-slate focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                            >
                                <option value="">M&eacute;todo de Pago</option>
                                <option value="AMERICAN EXPRESS">American Express</option>
                                <option value="VISA">VISA</option>
                                <option value="MASTERCARD">Mastercard</option>
                            </select>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                className="py-2 px-5 rounded-xl text-sm font-semibold font-display transition-colors w-full sm:w-auto bg-success text-white hover:opacity-90 shadow-sm shadow-success/25"
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setOperationType("ENTRADA");
                                }}
                            >
                                + Entrada
                            </button>
                            <button
                                className="py-2 px-5 rounded-xl text-sm font-semibold font-display transition-colors w-full sm:w-auto bg-danger text-white hover:opacity-90 shadow-sm shadow-danger/25"
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setOperationType("SALIDA");
                                }}
                            >
                                &minus; Salida
                            </button>
                        </div>
                    </div>
                </div>
                {
                    isModalOpen && (
                        <PaymentAndDepositModal onClose={() => setIsModalOpen(false)} typeOfOperation={operationType} />
                    )
                }
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-slate-200">
                                {tableHeaders.map((header) => (
                                    <th key={header} className="py-3 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paymentsData.map((payment) => (
                                <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 px-3 text-center text-xs font-mono text-slate">{payment.id.slice(0, 9).toUpperCase()}</td>
                                    <td className="py-3 px-3 text-center text-sm text-slate">{payment.date}</td>
                                    <td className="py-3 px-3 text-left text-sm text-ink font-medium">{payment.description}</td>
                                    <td className="py-3 px-3 text-center text-sm text-ink">{payment.paymentMethod}</td>
                                    <td className="py-3 px-3 text-center text-sm text-success font-semibold font-display">{payment.income}</td>
                                    <td className="py-3 px-3 text-center text-sm text-danger font-semibold font-display">{payment.expense}</td>
                                    <td className="py-3 px-3 text-center text-sm text-slate">{payment.docRef}</td>
                                    <td className="py-3 px-3 text-center text-sm text-slate">{payment.movementType}</td>
                                    <td className="py-3 px-3 text-center">
                                        <div className="flex justify-center items-center gap-1">
                                            <button className="p-1.5 rounded-lg text-slate hover:text-ink hover:bg-slate-100 transition-colors" title="Ver imagen">
                                                <ImageIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-1.5 rounded-lg text-slate hover:text-danger hover:bg-danger/10 transition-colors"
                                                onClick={() => {
                                                    setPaymentToEdit(payment)
                                                    setConfirmModalOpen(true)
                                                }}
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 rounded-lg text-slate hover:text-primary hover:bg-primary/10 transition-colors">
                                                <RoleUserIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {
                    isConfirmModalOpen && paymentToEdit && (
                        <ConfirmActionModal
                            elementData={paymentToEdit}
                            typeOfOperation="payments"
                            onClose={() => setConfirmModalOpen(false)}
                        />
                    )
                }
                <div className="flex flex-col sm:flex-row justify-between items-center mt-5 gap-4">
                    <p className="text-slate text-sm">
                        Registros 1&ndash;{paymentsData.length} de {paymentsData.length}
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

export { Payments };