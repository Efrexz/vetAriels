import { useContext, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ClientsContext } from '../../context/ClientsContext';
import FileIcon from '../../assets/file-invoice.svg?react';
import TrashIcon from '../../assets/trashIcon.svg?react';
import ReturnIcon from '../../assets/returnIcon.svg?react';
import PlusIcon from '../../assets/plusIcon.svg?react';
import LightbulbIcon from '../../assets/lightbulb.svg?react';

function CreateInvoice() {
    const { id } = useParams();

    const { clients } = useContext(ClientsContext);
    const clientData = clients.find(client => client.id === Number(id));

    const invoiceData = [
        { label: 'Fecha de emisión', value: '29-10-2024 12:21 PM', type: "text", disabled: true },
        { label: 'Emisor', value: 'VETERINARIA ARIEL S E.I.R.L', type: "text", disabled: true },
        { label: 'Tipo de comprobante', type: "select", options: ["BOLETA DE VENTA ELECTRÓNICA", "RECIBO", "FACTURA ELECTRONICA"] },
        { label: 'Fecha de vencimiento', value: '29-10-2024 12:21 PM', type: "text", disabled: true },
        { label: 'Serie de comprobante', value: 'BV01', type: "text", disabled: true },
        { label: 'Número de comprobante', value: '0004246', type: "text", disabled: true },
    ]

    const clientInfo = [
        {
            label: 'Tipo de documento de identidad',
            type: "select",
            options: ["DOCUMENTO NACIONAL DE IDENTIDAD (DNI)",
                "VARIOS - VENTAS MENORES A 700",
                "NÚMERO TRIBUTARIO (RUC)",
                "CARNET DE EXTRANJERIA",
                "PASAPORTE",
            ]
        },
        { label: 'Número de documento', value: clientData?.dni, type: "number" },
        { label: 'Cliente', value: `${clientData?.firstName} ${clientData?.lastName}`, type: "text" },
        { label: 'Email', value: clientData?.email, type: "email" },
        { label: 'Dirección', value: clientData?.address, type: "text", fullWidth: true },
    ]

    const tableCategories = [
        "Concepto",
        "Valor Unitario",
        "Cantidad",
        "SubTotal",
        "Descuento Unitario",
        "Impuestos",
        "Total",
    ];

    const location = useLocation();
    const { selectedProducts } = location.state || [];

    const totalPrice = selectedProducts.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
    );

    const taxesData = [
        { label: 'SubTotal', value: totalPrice },
        { label: 'Descuento Global', value: '- 0.00' },
        { label: 'Valor de venta neto', value: '0.00' },
        { label: 'Valor venta de operaciones gravadas', value: '0.00' },
        { label: 'Impuestos', value: '0.00' },
        { label: 'TOTAL', value: totalPrice, bold: true },
    ];

    //observaciones del comprobante
    const [notes, setNotes] = useState('');

    const [paymentNote, setPaymentNote] = useState('');

    const [paymentAmount, setPaymentAmount] = useState("");

    const [methodOfPayment, setMethodOfPayment] = useState("");

    const paymentData = [
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

    const [methodsOfPaymentList, setMethodsOfPaymentList] = useState([]);

    const amountReceived = methodsOfPaymentList.reduce(
        (acc, payment) => acc + payment.amount,
        0
    );

    const amountDue = (totalPrice - amountReceived) < 0 ? "0.00" : (totalPrice - amountReceived).toFixed(2);

    const change = (amountReceived - totalPrice) < 0 ? "0.00" : (amountReceived - totalPrice).toFixed(2);

    const paymentMethods = [
        { label: 'Dinero Recibido', value: amountReceived.toFixed(2) },
        {
            label: 'Saldo por pagar',
            value: amountDue
        },
        { label: 'Cambio / Vuelto', value: change },
    ];

    return (
        <div className="p-6 bg-white">
            <h1 className="text-2xl font-medium text-blue-400 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <FileIcon className="w-7 h-7 text-blue-400 mr-2" />
                Comprobantes
            </h1>

            {/* Contenedor general del formulario */}
            <div className="grid grid-cols-2 gap-8">
                {/* Primera Sección: Datos del Comprobante */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                        {
                            invoiceData.map((data, index) => (
                                <div key={index} className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700">{data.label}</label>
                                    <div className="flex items-center mt-1">
                                        {
                                            data.type === "select" ? (
                                                <select className="w-full border rounded-md px-3 py-2 bg-white text-sm hover:border-blue-300 focus-within:border-blue-300">
                                                    {
                                                        data.options.map((option, index) => (
                                                            <option key={index} value={option}>{option}</option>
                                                        ))
                                                    }
                                                </select>
                                            ) : (

                                                <input
                                                    type={data.type}
                                                    value={data.value}
                                                    disabled={data.disabled}
                                                    className={`w-full border rounded-md px-3 py-2 ${data.disabled ? "bg-gray-200" : "bg-white"} text-sm`}
                                                />
                                            )
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* Segunda Sección: Datos del Cliente */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                        {clientInfo.map((data, index) => (
                            <div
                                key={index}
                                className={`flex flex-col ${data.fullWidth ? "col-span-2" : ""}`}
                            >
                                <label className="text-sm font-medium text-gray-700">{data.label}</label>
                                <div className={`flex items-center mt-1 ${data.fullWidth ? "w-full" : ""}`}>
                                    {data.type === "select" ? (
                                        <select className="w-full border rounded-md px-3 py-2 bg-white text-sm hover:border-blue-300 focus-within:border-blue-300">
                                            {data.options.map((option, index) => (
                                                <option key={index} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    ) : (

                                        <input
                                            type={data.type}
                                            value={data.value}
                                            readOnly
                                            className={`w-full border rounded-md px-3 py-2 bg-white text-sm hover:border-blue-300 focus-within:border-blue-300`}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto mt-4 p-4 bg-gray-50 rounded-md shadow-md">
                <table className="min-w-full bg-white shadow-md  overflow-hidden ">
                    <thead>
                        <tr>
                            {tableCategories.map((category, index) => (
                                <th
                                    key={index}
                                    className="py-2 px-4 bg-gray-200 text-gray-600 font-bold uppercase text-xs border-gray-300 border-2"
                                >
                                    {category}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {selectedProducts.map((product, index) => (
                            <tr key={index} className="border-b text-gray-600">
                                <td className="py-2 px-4 border-gray-300 border-2 text-left">
                                    {product.name || product.serviceName}
                                </td>
                                <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                    {product.price}
                                </td>
                                <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                    {product.quantity}
                                </td>
                                <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                    {product.price}
                                </td>
                                <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                    0.00
                                </td>
                                <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                    0.00
                                </td>
                                <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                    {product.price * product.quantity}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="p-6">
                    <div className="w-full lg:w-1/2 ml-auto">
                        <table className="min-w-full ">
                            <tbody>
                                {taxesData.map((row, index) => (
                                    <tr key={index} className={`border-t border-gray-300 ${row.bold ? 'font-bold' : ''}`}>
                                        <td className="py-2 text-gray-600">{row.label}</td>
                                        <td className="py-2 text-right text-gray-600">{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Observaciones */}
                <div className='p-4 '>
                    <label className="block text-gray-700">Observaciones o comentarios para este comprobante</label>
                    <textarea
                        className="w-full mt-3 border border-gray-300 rounded p-2 bg-white max-h-60 min-h-14 hover:border-blue-300 focus-within:border-blue-300"
                        rows="2"
                        placeholder="Añadir observaciones..."
                        value={notes}
                        onChange={(e) => setNotes(e.targetvalue)}
                    ></textarea>
                </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-4 ">
                <div className="flex gap-4 justify-end mb-4 ">
                    {
                        paymentData.map((data, index) => (
                            <div key={index} className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">{data.label}</label>
                                <div className={`flex items-center mt-1`}>
                                    {data.type === "select" ? (
                                        <select
                                            className="w-full border rounded-md px-3 py-2 bg-white text-sm hover:border-blue-300 focus-within:border-blue-300"
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
                                            className={`w-full border rounded-md px-3 py-2 bg-white text-sm hover:border-blue-300 focus-within:border-blue-300`}
                                        />
                                    )}
                                </div>
                            </div>
                        ))
                    }
                    <div className="self-end">
                        <button
                            className="bg-orange-500 text-white font-medium px-4 py-2 rounded-md hover:bg-orange-600"
                            onClick={() => {
                                let paymentData = {
                                    id: Date.now(),
                                    label: methodOfPayment,
                                    description: paymentNote,
                                    amortization: Number(paymentAmount),
                                    amount: Number(paymentAmount)
                                }
                                setMethodsOfPaymentList([...methodsOfPaymentList, paymentData]);
                                setPaymentAmount("");
                                setPaymentNote("");
                            }
                            }
                        >
                            + AGREGAR
                        </button>
                    </div>
                </div>

                {/* Table */}
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
                            {
                                methodsOfPaymentList.map((method, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="border border-gray-200 px-4 py-2">{method.label}</td>
                                        <td className="border border-gray-200 px-4 py-2">{method.description}</td>
                                        <td className="border border-gray-200 px-4 py-2 text-right">{method.amortization.toFixed(2)}</td>
                                        <td className="border border-gray-200 px-4 py-2 text-right">{method.amount.toFixed(2)}</td>
                                        <td className="border border-gray-200 px-4 py-2 text-center">
                                            <button
                                                className="text-red-500 hover:text-red-600"
                                                onClick={() => setMethodsOfPaymentList(methodsOfPaymentList.filter(payment => method.id !== payment.id))}
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <div className="p-6">
                    <div className="w-full lg:w-1/2 ml-auto">
                        <table className="min-w-full ">
                            <tbody>
                                {paymentMethods.map((row, index) => (
                                    <tr key={index} className={`border-y border-gray-300 ${row.bold ? 'font-bold' : ''}`}>
                                        <td className="py-2 text-gray-600">{row.label}</td>
                                        <td className="py-2 text-right text-gray-600">{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className='flex justify-between items-center bg-gray-50 py-3 px-4 shadow-md rounded-b-lg mt-4'>
                <button
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 flex items-center gap-3"
                >
                    <ReturnIcon className="w-5 h-5 text-gray-700" />
                    CANCELAR
                </button>
                <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3"
                >
                    <PlusIcon className="w-5 h-5 text-white" />
                    GENERAR COMPROBANTE
                </button>
            </div>

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
