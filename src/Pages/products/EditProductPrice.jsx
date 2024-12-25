import DollarIcon from '@assets/dollarIcon.svg?react';
import PercentIcon from '@assets/percentIcon.svg?react';
import ReturnIcon from '@assets/returnIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import { useNavigate } from 'react-router-dom';

function EditProductPrice() {
    const formFields = [
        {
            label: "Valor de venta (no incluye impuestos)",
            type: "number",
            id: "valorVenta",
            icon: DollarIcon,
        },
        {
            label: "Impuesto a las ventas en porcentaje (%)",
            type: "number",
            id: "impuestoPorcentaje",
            icon: PercentIcon,
            extraCheckbox: "¿Exonerado de impuestos?",
        },
        {
            label: "Impuesto a las ventas monto",
            type: "number",
            id: "impuestoMonto",
            icon: DollarIcon,
            disabled: true,
        },
        {
            label: "Precio de venta al público (incluido impuestos)",
            type: "number",
            id: "precioVentaPublico",
            icon: DollarIcon,
        },
        {
            label: "Costo del servicio (no incluye impuestos)",
            type: "number",
            id: "costoServicioSinImpuestos",
            icon: DollarIcon,
            extraCheckbox: "¿Exonerado de impuestos?",
        },
        {
            label: "Costo del servicio (incluye impuestos)",
            type: "number",
            id: "costoServicioConImpuestos",
            icon: DollarIcon,
        },
        {
            label: "Porcentaje máximo de descuento (%)",
            type: "number",
            id: "porcentajeDescuento",
            icon: PercentIcon,
        },
        {
            label: "Margen bruto",
            type: "number",
            id: "margenBruto",
            icon: DollarIcon,
            disabled: true,
        },
        {
            label: "Margen de utilidad porcentual",
            type: "number",
            id: "margenUtilidad",
            icon: PercentIcon,
            disabled: true,
        },
    ];

    const navigate = useNavigate();
    return (
        <form className="pt-4 bg-gray-50 p-6 shadow-md rounded-t-md space-y-6">
            {formFields.map((field, index) => (
                <div key={index} className="space-y-1">
                    <label
                        htmlFor={field.id}
                        className="block text-sm font-medium text-gray-700"
                    >
                        {field.label}
                    </label>
                    <div className="flex w-full border-gray-200 border rounded-lg overflow-hidden text-gray-600">
                        {
                            field.icon && (
                                <div className="flex items-center justify-center bg-gray-100 px-3">
                                    <field.icon className="w-5 h-5 text-gray-600" />
                                </div>
                            )
                        }
                        <input
                            type={field.type}
                            id={field.id}
                            placeholder={field.placeholder}
                            disabled={field.disabled || false}
                            className="w-full px-4 py-2 border rounded-r-lg hover:border-blue-300 focus-within:border-blue-300 focus:outline-none"
                        />
                    </div>
                    {field.extraCheckbox && (
                        <label className="flex items-center space-x-2 mt-2">
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-600">{field.extraCheckbox}</span>
                        </label>
                    )}

                </div>
            ))}
            <div className='flex justify-between items-center gap-4 pt-4 px-4 border-t border-gray-200 bg-gray-50 '>
                <button
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 flex items-center gap-3"
                    type="button"
                    onClick={() => navigate("/products")}
                >
                    <ReturnIcon className="w-5 h-5 text-gray-700" />
                    REGRESAR AL LISTADO
                </button>
                <button
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3"
                    type="button"
                // onClick={() => updateProduct()}
                >
                    <PlusIcon className="w-5 h-5 text-white" />
                    ACTUALIZAR PRODUCTO
                </button>
            </div>
        </form>
    );
}

export { EditProductPrice };