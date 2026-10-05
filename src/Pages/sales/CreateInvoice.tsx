import { useState, useMemo , ChangeEvent} from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { useGlobal } from '@context/GlobalContext';
import { useInvoicesMutations } from '@hooks/useInvoicesQuery';
import { PurchasedItem } from '@t/inventory.types';
import { ActionButtons } from '@components/ui/ActionButtons';
import {generateUniqueId } from '@utils/idGenerator';
import TrashIcon from '@assets/trashIcon.svg?react';
import LightbulbIcon from '@assets/lightbulb.svg?react';
import { useToast } from '@context/ToastContext';

// Tipo base con propiedades comunes a todos los campos
interface BaseField {
    label: string;
    fullWidth?: boolean;
}

// Tipo específico para campos de texto, número, email, etc.
interface InputField extends BaseField {
    type: 'text' | 'number' | 'email';
    value?: string | number; // El valor puede ser string o number
    disabled?: boolean;
    placeholder?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

//  Tipo específico para campos de selección
interface SelectField extends BaseField {
    type: 'select';
    value?: string;
    options: string[]; //  options para los select
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

// Unimos todo en un solo tipo. TypeScript sabrá cuál es cuál gracias a la propiedad 'type'.
type FormField = InputField | SelectField;

interface PaymentMethod {
    id: string;
    label: string;
    description: string;
    amortization: number;
    amount: number;
}

interface LocationState {
    selectedProducts: PurchasedItem[];
}

const tableCategories: string[] = ["Concepto", "Valor Unitario", "Cantidad", "SubTotal", "Descuento", "Impuestos", "Total"];


function CreateInvoice() {

    const { clients } = useClients();
    const { create: createInvoiceMutation } = useInvoicesMutations();
    const { id: clientId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const { companyData } = useGlobal();
    const clientData = useMemo(() => clients.find(client => client.id === clientId), [clients, clientId]);

    // El carrito via a sessionStorage (lo escribe Sales). location.state
    // queda como fallback para compatibilidad (deep links antiguos).
    const selectedProducts: PurchasedItem[] = useMemo(() => {
        try {
            const saved = clientId
                ? sessionStorage.getItem(`vetArielCart:${clientId}`)
                : null;
            if (saved) return JSON.parse(saved) as PurchasedItem[];
        } catch { // storage corrupto: estado vacio
        }
        return (location.state as LocationState | null)?.selectedProducts ?? [];
    }, [clientId, location.state]);
    // Tipo de comprobante: BOLETA/FACTURA mapean 1:1 a la DB. RECIBO se
    // emite como BOLETA (legalmente equivalente).
    const [tipoComprobante, setTipoComprobante] = useState<'BOLETA' | 'FACTURA'>('BOLETA');
    const [clienteDocTipo, setClienteDocTipo] = useState<'DNI' | 'RUC'>('DNI');
    const [clienteDocNumero, setClienteDocNumero] = useState(clientData?.dni || '');

    //observaciones del comprobante
    const [notes, setNotes] = useState<string>('');
    const [paymentNote, setPaymentNote] = useState<string>('');
    const [paymentAmount, setPaymentAmount] = useState<string>("");
    const [methodOfPayment, setMethodOfPayment] = useState<string>("");
    const [methodsOfPaymentList, setMethodsOfPaymentList] = useState<PaymentMethod[]>([]);

    //suma del total de los productos seleccionados
    const totalPrice = selectedProducts.reduce((acc, product) => acc + (product.salePrice || 0) * product.quantity, 0);

    const taxesData = [
        { label: 'SubTotal', value: totalPrice },
        { label: 'Descuento Global', value: '- 0.00' },
        { label: 'Valor de venta neto', value: '0.00' },
        { label: 'Valor venta de operaciones gravadas', value: '0.00' },
        { label: 'Impuestos', value: '0.00' },
        { label: 'TOTAL', value: totalPrice, bold: true },
    ];

    const amountReceived = methodsOfPaymentList.reduce(
        (acc, payment) => acc + payment.amount,
        0
    );

    const amountDue = Math.max(0, totalPrice - amountReceived);
    const change = Math.max(0, amountReceived - totalPrice)

    const paymentMethods = [
        { label: 'Dinero Recibido', value: amountReceived.toFixed(2) },
        { label: 'Saldo por pagar', value: amountDue.toFixed(2) },
        { label: 'Cambio / Vuelto', value: change.toFixed(2) },
    ];

    const paymentData : FormField[]= [
        {
            label: 'Forma de pago',
            type: "select",
            onChange: (e) => setMethodOfPayment(e.target.value),
            options: ["EFECTIVO", "VISA", "MASTERCARD", "AMEX", "DINERS CLUB", "TRANSFERENCIA", "OTRO"]
        },
        {
            label: 'Monto',
            type: "number",
            value: paymentAmount,
            onChange: (e) => setPaymentAmount(e.target.value),
            placeholder: "0.00"
        },
        {
            label: 'Motivo (descripción)',
            type: "text",
            value: paymentNote,
            onChange: (e) => setPaymentNote(e.target.value),
            placeholder: ""
        },
    ]

    // Datos del comprobante (dependen de company/companyData y del tipo
    // elegido; por eso viven dentro del componente).
    const invoiceData: FormField[] = [
        { label: 'Fecha de emisión', value: new Date().toLocaleString(), type: "text", disabled: true },
        { label: 'Emisor', value: companyData?.clinicName || 'Mi clinica', type: "text", disabled: true },
        { label: 'Tipo de comprobante', type: "select", options: ["BOLETA DE VENTA ELECTRÓNICA", "RECIBO", "FACTURA ELECTRONICA"], onChange: (e: { target: { value: string } }) => { const v = e.target.value; setTipoComprobante(v.includes('FACTURA') ? 'FACTURA' : 'BOLETA'); } },
        { label: 'Fecha de vencimiento', value: new Date().toLocaleDateString(), type: "text", disabled: true },
        { label: 'Serie de comprobante', value: tipoComprobante === 'FACTURA' ? 'F001' : 'B001', type: "text", disabled: true },
        { label: 'Número de comprobante', value: 'Se asigna al emitir', type: "text", disabled: true },
    ]

    const clientInfo: FormField[] = [
        { label: 'Tipo de documento de identidad',type: "select", options: ["(DNI)","NÚMERO TRIBUTARIO (RUC)","CARNET DE EXTRANJERIA","PASAPORTE",]},
        { label: 'Número de documento', value: clienteDocNumero, type: "text", onChange: (e: { target: { value: string } }) => setClienteDocNumero(e.target.value) },
        { label: 'Tipo de documento de identidad', type: "select", options: ["(DNI)","NÚMERO TRIBUTARIO (RUC)","CARNET DE EXTRANJERIA","PASAPORTE",], onChange: (e: { target: { value: string } }) => { setClienteDocTipo(e.target.value.includes('RUC') ? 'RUC' : 'DNI'); } },
        { label: 'Cliente', value: clientData ? `${clientData.firstName} ${clientData.lastName}` : 'N/A', type: "text" },
        { label: 'Email', value: clientData?.email || 'N/A', type: "email" },
        { label: 'Dirección', value: clientData?.address, type: "text", fullWidth: true },
    ]

    function handleAddPayment () {
        if (!methodOfPayment || !paymentAmount || parseFloat(paymentAmount) <= 0) {
            toast.error("Por favor, seleccione una forma de pago y un monto valido.");
            return;
        }
        const newPayment: PaymentMethod = {
            id: generateUniqueId(),
            label: methodOfPayment,
            description: paymentNote,
            amortization: parseFloat(paymentAmount),
            amount: parseFloat(paymentAmount),
        };
        setMethodsOfPaymentList(prev => [...prev, newPayment]);
        setPaymentAmount("");
        setPaymentNote("");
    }

    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleGenerateInvoice() {
        if (!clientData || !clientId) return;
        if (selectedProducts.length === 0) {
            toast.error('No hay items en el comprobante.');
            return;
        }

        setIsSubmitting(true);
        try {
            const created = await createInvoiceMutation.mutateAsync({
                clientId,
                tipoComprobante,
                clienteDocTipo,
                clienteDocNumero: clienteDocNumero || clientData.dni || '00000000',
                items: selectedProducts.map((item) => ({
                    itemType: item.productName !== undefined ? 'PRODUCTO' as const : 'SERVICIO' as const,
                    productId: item.productName !== undefined ? item.id : undefined,
                    serviceId: item.productName !== undefined ? undefined : item.id,
                    description: item.productName ?? item.serviceName ?? '',
                    quantity: item.quantity,
                    unitPrice: item.salePrice || 0,
                })),
                payments: methodsOfPaymentList.map((pm) => ({
                    paymentMethod: (pm.label === 'MASTERCARD' || pm.label === 'AMEX' || pm.label === 'DINERS CLUB'
                        ? 'VISA'      // la DB solo acepta VISA como tarjeta
                        : pm.label) as 'EFECTIVO' | 'VISA' | 'YAPE' | 'PLIN' | 'TRANSFERENCIA' | 'OTRO',
                    amount: pm.amount,
                    description: pm.description || `Cobro de venta`,
                })),
            });
            toast.success(`Comprobante ${created.comprobante} emitido por S/ ${created.total.toFixed(2)}.`);
            try { sessionStorage.removeItem(`vetArielCart:${clientId}`); } catch { /* noop */ }
            navigate('/sales/invoices');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'No se pudo generar el comprobante.';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!clientData) {
        return <div className="p-6">Error: Cliente no encontrado. Por favor, vuelva a la página de ventas.</div>;
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    Comprobante
                </span>
                <h1 className="text-2xl font-bold font-display text-ink">
                    Generar comprobante
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Datos del Comprobante */}
                <div className="bg-paper px-6 py-4 rounded-2xl shadow-sm border border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {invoiceData.map((data) => (
                            <div key={data.label} className="flex flex-col">
                                <label className="text-sm font-medium text-slate">{data.label}</label>
                                <div className="flex items-center mt-1">
                                    {data.type === "select" ? (
                                        <select className="w-full border border-slate-200 rounded-xl px-3 py-1 bg-paper text-ink text-sm focus:ring-1 focus:ring-primary/30 focus:border-primary focus:outline-none">
                                            {data.options.map((option, index) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={data.type}
                                            value={data.value}
                                            disabled={data.disabled}
                                            className={`w-full border border-slate-200 rounded-xl px-3 py-1 text-sm focus:ring-1 focus:ring-primary/30 focus:border-primary focus:outline-none ${data.disabled ? "bg-white text-slate" : "bg-paper text-ink"
                                                }`}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/*Datos del Cliente */}
                <div className="bg-paper px-6 py-4 rounded-2xl shadow-sm border border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {clientInfo.map((data) => (
                            <div
                                key={data.label}
                                className={`flex flex-col ${data.fullWidth ? "sm:col-span-2" : ""}`}
                            >
                                <label className="text-sm font-medium text-slate">{data.label}</label>
                                <div className="flex items-center mt-1">
                                    {data.type === "select" ? (
                                        <select className="w-full border border-slate-200 rounded-xl px-3 py-1 bg-paper text-ink text-sm focus:ring-1 focus:ring-primary/30 focus:border-primary focus:outline-none">
                                            {data.options.map((option, idx) => (
                                                <option key={idx} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={data.type}
                                            value={data.value}
                                            readOnly
                                            className="w-full border border-slate-200 rounded-xl px-3 py-1 bg-paper text-ink text-sm focus:ring-1 focus:ring-primary/30 focus:border-primary focus:outline-none"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

                <div className="mt-4 p-5 bg-paper rounded-2xl shadow-sm border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-paper shadow-md overflow-hidden">
                        <thead>
                            <tr>
                                {tableCategories.map((category) => (
                                    <th
                                        key={category}
                                        className="py-1 px-4 bg-paper text-ink font-bold uppercase text-xs border-slate-200 border"
                                    >
                                        {category}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {selectedProducts.map((product) => (
                                <tr key={product.provisionalId} className="border-b text-ink text-sm">
                                    <td className="py-1 px-4 border-slate-200 border text-left">
                                        {product.productName || product.serviceName}
                                    </td>
                                    <td className="py-1 px-4 border-slate-200 border text-center">
                                        {product.salePrice}
                                    </td>
                                    <td className="py-1 px-4 border-slate-200 border text-center">
                                        {product.quantity}
                                    </td>
                                    <td className="py-1 px-4 border-slate-200 border text-center">
                                        {product.salePrice}
                                    </td>
                                    <td className="py-1 px-4 border-slate-200 border text-center">
                                        0.00
                                    </td>
                                    <td className="py-1 px-4 border-slate-200 border text-center">
                                        0.00
                                    </td>
                                    <td className="py-1 px-4 border-slate-200 border text-center">
                                        {(product.salePrice || 0) * product.quantity}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Resumen de impuestos */}
                <div className="p-6">
                    <div className="w-full lg:w-1/2 ml-auto">
                        <table className="min-w-full">
                            <tbody>
                                {taxesData.map((row) => (
                                    <tr key={row.label} className={`border-t border-slate-200 text-sm${row.bold ? "font-bold" : ""}`}>
                                        <td className="py-1 text-slate">{row.label}</td>
                                        <td className="py-1 text-right text-slate">{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Observaciones */}
                <div className="p-4">
                    <label className="block text-slate">Observaciones o comentarios para este comprobante</label>
                    <textarea
                        className="w-full mt-3 border border-slate-200 rounded-xl p-2 bg-paper text-ink max-h-60 min-h-14 focus:ring-1 focus:ring-primary/30 focus:border-primary focus:outline-none"
                        rows={2}
                        placeholder="Añadir observaciones..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>
            </div>

            <div className="bg-paper p-6 rounded-2xl shadow-sm mt-4">
                {/* Controles de entrada */}
                <div className="flex flex-wrap gap-4 justify-end mb-4">
                    {paymentData.map((data) => (
                        <div key={data.label} className="flex flex-col w-full sm:w-auto">
                            <label className="text-sm font-medium text-slate">{data.label}</label>
                            <div className="flex items-center mt-1">
                                {data.type === "select" ? (
                                    <select
                                        className="w-full border border-slate-200 rounded-xl px-3 py-1 bg-paper text-ink text-sm focus:ring-1 focus:ring-primary/30 focus:border-primary focus:outline-none"
                                        defaultValue=""
                                        onChange={data.onChange}
                                    >
                                        <option value="" disabled>--- Seleccione ---</option>
                                        {data.options.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={data.type}
                                        value={data.value}
                                        onChange={data.onChange}
                                        placeholder={data.placeholder}
                                        className="w-full border border-slate-200 rounded-xl px-3 py-1 bg-paper text-ink text-sm focus:ring-1 focus:ring-primary/30 focus:border-primary focus:outline-none"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                    <div className="self-end w-full sm:w-auto">
                        <button
                            className="w-full sm:w-auto bg-primary text-white font-semibold font-display text-sm px-4 py-1.5 rounded-xl hover:opacity-90 shadow-sm shadow-primary/25 transition-colors"
                            onClick={handleAddPayment}
                        >
                            + AGREGAR
                        </button>
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto">
                    <table className="w-full text-xs font-bold text-left text-slate border-collapse border-slate-200 border">
                        <thead className="bg-paper">
                            <tr>
                                <th className="border border-slate-200 px-4 py-1.5">Forma de pago</th>
                                <th className="border border-slate-200 px-4 py-1.5">Descripción</th>
                                <th className="border border-slate-200 px-4 py-1.5 text-right">Amortización</th>
                                <th className="border border-slate-200 px-4 py-1.5 text-right">Dinero recibido</th>
                                <th className="border border-slate-200 px-4 py-1.5 text-center">Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {methodsOfPaymentList.map((method) => (
                                <tr key={method.id} className="border-b">
                                    <td className="border border-slate-200 px-4 py-1.5">{method.label}</td>
                                    <td className="border border-slate-200 px-4 py-1.5">{method.description}</td>
                                    <td className="border border-slate-200 px-4 py-1.5 text-right">{method.amortization.toFixed(2)}</td>
                                    <td className="border border-slate-200 px-4 py-1.5 text-right">{method.amount.toFixed(2)}</td>
                                    <td className="border border-slate-200 px-4 py-1.5 text-center">
                                        <button
                                            className="text-rose-500 hover:text-rose-600"
                                            onClick={() =>
                                                setMethodsOfPaymentList(
                                                    methodsOfPaymentList.filter(payment => method.id !== payment.id)
                                                )
                                            }
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Resumen */}
                <div className="p-6">
                    <div className="w-full lg:w-1/2 ml-auto">
                        <table className="min-w-full">
                            <tbody>
                                {paymentMethods.map((row) => (
                                    <tr
                                        key={row.label}
                                        className="border-y border-slate-200 text-sm"
                                    >
                                        <td className="py-1 text-slate">{row.label}</td>
                                        <td className="py-1 text-right text-slate">{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ActionButtons
                onCancel={() => navigate(-1)}
                submitText={isSubmitting ? 'Generando...' : 'Generar comprobante'}
                disabled={isSubmitting}
                onSubmit={handleGenerateInvoice}
            />

            <div className="mt-6 p-4 bg-primary/10 text-ink rounded-xl m-3 flex gap-2 border border-primary/20">
                <LightbulbIcon className="w-5 h-5 text-primary flex-shrink-0" />
                <p>
                    Cuando se registra más de una forma de pago, registrar primero los pagos con Visa, Mastercard, transferencia bancaria, nota de crédito, etc. para que se amortice el monto total y en último lugar el monto en efectivo para que calcule el vuelto de ser el caso.
                </p>
            </div>
        </div>
    )
}

export { CreateInvoice };