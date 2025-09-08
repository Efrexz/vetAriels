import { useState, useMemo , ChangeEvent} from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { PurchasedItem } from '@t/inventory.types';
import { ActionButtons } from '@components/ui/ActionButtons';
import {generateUniqueId } from '@utils/idGenerator';
import FileIcon from '@assets/file-invoice.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import LightbulbIcon from '@assets/lightbulb.svg?react';

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

const invoiceData: FormField[] = [
    { label: 'Fecha de emisión', value: new Date().toLocaleString(), type: "text", disabled: true },
    { label: 'Emisor', value: 'VETERINARIA ARIEL S E.I.R.L', type: "text", disabled: true },
    { label: 'Tipo de comprobante', type: "select", options: ["BOLETA DE VENTA ELECTRÓNICA", "RECIBO", "FACTURA ELECTRONICA"] },
    { label: 'Fecha de vencimiento', value: new Date().toLocaleDateString(), type: "text", disabled: true },
    { label: 'Serie de comprobante', value: 'BV01', type: "text", disabled: true },
    { label: 'Número de comprobante', value: '0004246', type: "text", disabled: true },
]


function CreateInvoice() {

    const { clients } = useClients();
    const { id: clientId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const clientData = useMemo(() => clients.find(client => client.id === clientId), [clients, clientId]);

    const { selectedProducts = [] } = (location.state as LocationState) || {};
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

    const clientInfo: FormField[] = [
        { label: 'Tipo de documento de identidad',type: "select", options: ["(DNI)","NÚMERO TRIBUTARIO (RUC)","CARNET DE EXTRANJERIA","PASAPORTE",]},
        { label: 'Número de documento', value: clientData?.dni, type: "number" },
        { label: 'Cliente', value: clientData ? `${clientData.firstName} ${clientData.lastName}` : 'N/A', type: "text" },
        { label: 'Email', value: clientData?.email || 'N/A', type: "email" },
        { label: 'Dirección', value: clientData?.address, type: "text", fullWidth: true },
    ]

    function handleAddPayment () {
        if (!methodOfPayment || !paymentAmount || parseFloat(paymentAmount) <= 0) {
            alert("Por favor, seleccione una forma de pago y un monto válido.");
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
    };

    if (!clientData) {
        return <div className="p-6">Error: Cliente no encontrado. Por favor, vuelva a la página de ventas.</div>;
    }

    return (
        <div className="p-6 bg-white">
            <h1 className="text-2xl font-medium text-blue-400 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <FileIcon className="w-7 h-7 text-blue-400 mr-2" />
                Comprobantes
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Primera Sección: Datos del Comprobante */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {invoiceData.map((data) => (
                            <div key={data.label} className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">{data.label}</label>
                                <div className="flex items-center mt-1">
                                    {data.type === "select" ? (
                                        <select className="w-full border rounded-md px-3 py-2 bg-white text-sm hover:border-blue-300 focus:border-blue-300 outline-none">
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
                                            className={`w-full border rounded-md px-3 py-2 ${data.disabled ? "bg-gray-200" : "bg-white"
                                                } text-sm`}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Segunda Sección: Datos del Cliente */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {clientInfo.map((data) => (
                            <div
                                key={data.label}
                                className={`flex flex-col ${data.fullWidth ? "sm:col-span-2" : ""}`}
                            >
                                <label className="text-sm font-medium text-gray-700">{data.label}</label>
                                <div className="flex items-center mt-1">
                                    {data.type === "select" ? (
                                        <select className="w-full border rounded-md px-3 py-2 bg-white text-sm hover:border-blue-300 focus:border-blue-300 outline-none">
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
                                            className="w-full border rounded-md px-3 py-2 bg-white text-sm hover:border-blue-300 focus:border-blue-300 outline-none"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-md shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md overflow-hidden">
                        <thead>
                            <tr>
                                {tableCategories.map((category) => (
                                    <th
                                        key={category}
                                        className="py-2 px-4 bg-gray-200 text-gray-600 font-bold uppercase text-xs border-gray-300 border-2"
                                    >
                                        {category}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {selectedProducts.map((product) => (
                                <tr key={product.provisionalId} className="border-b text-gray-600">
                                    <td className="py-2 px-4 border-gray-300 border-2 text-left">
                                        {product.productName || product.serviceName}
                                    </td>
                                    <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                        {product.salePrice}
                                    </td>
                                    <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                        {product.quantity}
                                    </td>
                                    <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                        {product.salePrice}
                                    </td>
                                    <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                        0.00
                                    </td>
                                    <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                        0.00
                                    </td>
                                    <td className="py-2 px-4 border-gray-300 border-2 text-center">
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
                                    <tr key={row.label} className={`border-t border-gray-300 ${row.bold ? "font-bold" : ""}`}>
                                        <td className="py-2 text-gray-600">{row.label}</td>
                                        <td className="py-2 text-right text-gray-600">{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Observaciones */}
                <div className="p-4">
                    <label className="block text-gray-700">Observaciones o comentarios para este comprobante</label>
                    <textarea
                        className="w-full mt-3 border border-gray-300 rounded p-2 bg-white max-h-60 min-h-14 hover:border-blue-300 focus:border-blue-300 outline-none"
                        rows={2}
                        placeholder="Añadir observaciones..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-4">
                {/* Controles de entrada */}
                <div className="flex flex-wrap gap-4 justify-end mb-4">
                    {paymentData.map((data) => (
                        <div key={data.label} className="flex flex-col w-full sm:w-auto">
                            <label className="text-sm font-medium text-gray-700">{data.label}</label>
                            <div className="flex items-center mt-1">
                                {data.type === "select" ? (
                                    <select
                                        className="w-full border rounded-md px-3 py-2 bg-white text-sm hover:border-blue-300 focus:border-blue-300 outline-none"
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
                                        className="w-full border rounded-md px-3 py-2 bg-white text-sm hover:border-blue-300 focus:border-blue-300 outline-none"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                    <div className="self-end w-full sm:w-auto">
                        <button
                            className="w-full sm:w-auto bg-orange-500 text-white font-medium px-4 py-2 rounded-md hover:bg-orange-600"
                            onClick={handleAddPayment}
                        >
                            + AGREGAR
                        </button>
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-700 border-collapse border-gray-300 border-2">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border border-gray-200 px-4 py-2">Forma de pago</th>
                                <th className="border border-gray-200 px-4 py-2">Descripción</th>
                                <th className="border border-gray-200 px-4 py-2 text-right">Amortización</th>
                                <th className="border border-gray-200 px-4 py-2 text-right">Dinero recibido</th>
                                <th className="border border-gray-200 px-4 py-2 text-center">Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {methodsOfPaymentList.map((method) => (
                                <tr key={method.id} className="border-b">
                                    <td className="border border-gray-200 px-4 py-2">{method.label}</td>
                                    <td className="border border-gray-200 px-4 py-2">{method.description}</td>
                                    <td className="border border-gray-200 px-4 py-2 text-right">{method.amortization.toFixed(2)}</td>
                                    <td className="border border-gray-200 px-4 py-2 text-right">{method.amount.toFixed(2)}</td>
                                    <td className="border border-gray-200 px-4 py-2 text-center">
                                        <button
                                            className="text-red-500 hover:text-red-600"
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
                                        className="border-y border-gray-300"
                                    >
                                        <td className="py-2 text-gray-600">{row.label}</td>
                                        <td className="py-2 text-right text-gray-600">{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ActionButtons
                onCancel={() => navigate(-1)}
                submitText="GENERAR COMPROBANTE"
                onSubmit= {() => console.log('Generando comprobante')}
            />

            <div className="mt-6 p-4 bg-blue-500 text-white rounded-lg m-3 flex gap-2">
                <LightbulbIcon className="w-5 h-5 text-white" />
                <p>
                    Cuando se registra más de una forma de pago, registrar primero los pagos con Visa, Mastercard, transferencia bancaria, nota de crédito, etc. para que se amortice el monto total y en último lugar el monto en efectivo para que calcule el vuelto de ser el caso.
                </p>
            </div>
        </div>
    )
}

export { CreateInvoice };