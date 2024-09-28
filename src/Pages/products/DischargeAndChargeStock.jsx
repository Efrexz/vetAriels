import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DocumentOutIcon from '../../assets/documentOutIcon.svg?react';
import DocumentJoinIcon from '../../assets/DocumentJoinIcon.svg?react';
import ReturnIcon from '../../assets/returnIcon.svg?react';
import PlusIcon from '../../assets/plusIcon.svg?react';
import TrashIcon from '../../assets/trashIcon.svg?react';

const QuantityCounter = () => {
    const [quantity, setQuantity] = useState(1);

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <div className="flex items-center justify-center space-x-2">
            <button
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:outline-none"
                onClick={decreaseQuantity}
            >
                <PlusIcon className="w-4 h-4" />
            </button>

            <div className="border border-gray-300 px-4 py-1 rounded text-center w-12">
                {quantity}
            </div>

            <button
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 focus:outline-none"
                onClick={increaseQuantity}
            >
                <PlusIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

function DischargeAndChargeStock({ typeOfOperation }) {
    const formFields = [
        {
            label: 'Responsable / Solicitante',
            id: 'requestor',
            type: 'select',
            options: ['NIOMARA TREMONT SANCHEZ', 'JUAN CARLOS PEREZ'],
            required: true
        },
        {
            label: 'Motivo',
            id: 'reason',
            type: 'text',
            required: true
        },
        {
            label: 'Almacén desde donde se descargarán los productos',
            id: 'requestor',
            type: 'select',
            options: ['ALMACEN CENTRAL', 'VET ARIEL'],
            required: true
        },
        {
            label: 'Tipo de Operación',
            id: 'operationType',
            type: 'select',
            options: ['Seleccione', 'Ajuste por diferencia de inventario', 'Devolución de productos', 'Donación '],
            required: true
        },
    ]

    const tableHeaders = ["Código de Barras", "Producto", "Precio Unitario de Compra", "Precio Unitario de Venta", `Cantidad a ${typeOfOperation === 'discharge' ? 'Descargar' : 'Cargar'}`, "Opciones"];

    const dischargeData = [
        { codeBars: '123456789', concept: 'Producto A', price: '$10.00', priceVenta: '$15.00', quantity: '5', options: 'Opciones' },
    ];

    const navigate = useNavigate();

    return (
        <section className="container mx-auto p-6 border-b-2 border-gray-100">
            <header className="flex items-center mb-6 border-b-2 border-gray-100 pb-4">
                <h1 className={`text-2xl font-medium flex items-center ${typeOfOperation === 'discharge' ? 'text-red-500' : 'text-green-500'}`}>
                    {typeOfOperation === 'discharge' ? <DocumentOutIcon className="w-9 h-9 mr-2" /> : <DocumentJoinIcon className="w-9 h-9 mr-2" />}
                    {typeOfOperation === 'discharge' ? 'Descargar Stock' : 'Cargar Stock'}
                </h1>
            </header>

            <div className="gap-4 mb-6 bg-gray-50 p-4 rounded-md ">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formFields.map((field, index) => (
                        <div key={index}>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor={field.id}>{field.label}</label>
                            <div className="flex w-full border-gray-200 border rounded-lg overflow-hidden hover:border-blue-300 focus-within:border-blue-300">

                                {field.type === 'select' ? (
                                    <select
                                        id={field.id}
                                        className="w-full px-3 py-2 border-none focus:outline-none focus:ring-0"
                                    >
                                        {field.options.map((option, i) => (
                                            <option key={i} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        id={field.id}
                                        // value={formData[field.id]}
                                        // onChange={handleChange}
                                        className="w-full py-2 px-4 focus:outline-none focus:ring-0 focus:border-transparent"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </form>
            </div>

            <div className="mb-6 bg-gray-50 p-4 rounded-md">
                <div className="mb-6">
                    <label htmlFor="search">Buscar y agregar productos a la lista:</label>
                    <div className="bg-white border border-gray-300 rounded p-2 mt-2">
                        <input
                            id="search"
                            type="text"
                            placeholder="Buscar producto..."
                            className="w-full border-none outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                {
                                    tableHeaders.map((header) => (
                                        <th key={header} className="px-6 py-3 border text-center text-sm font-medium text-gray-700">
                                            {header}
                                        </th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dischargeData.map((discharge, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="px-6 py-4 whitespace-nowrap border text-center text-sm text-gray-900">{discharge.codeBars}</td>
                                        <td className="px-6 py-4 whitespace-nowrap border text-center text-sm text-gray-900">{discharge.concept}</td>
                                        <td className="px-6 py-4 whitespace-nowrap border text-center text-sm text-gray-900">{discharge.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap border text-center text-sm text-gray-900">{discharge.priceVenta}</td>
                                        <td className="px-6 py-4 whitespace-nowrap border text-center text-sm text-gray-900">
                                            {<QuantityCounter />}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap border text-center text-sm text-gray-900">
                                            <button className="text-red-500 hover:text-red-600">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <button
                        className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 flex items-center gap-3"
                        onClick={() => navigate(-1)}
                    >
                        <ReturnIcon className="w-5 h-5 text-gray-700" />
                        CANCELAR
                    </button>
                    <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3">
                        <PlusIcon className="w-5 h-5 text-white" />
                        {typeOfOperation === 'discharge' ? 'DESCARGAR PRODUCTOS' : 'CARGAR PRODUCTOS'}
                    </button>
                </div>
            </div>


            {/* Información Adicional */}
            <div className="mt-6 p-4 bg-blue-100 text-blue-700 rounded-lg">
                <p>
                    Puedes usar esta herramienta para descargar el stock de productos directamente.
                </p>
            </div>
        </section >
    );
}

export { DischargeAndChargeStock };