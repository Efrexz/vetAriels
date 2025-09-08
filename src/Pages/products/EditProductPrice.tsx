import { Product } from "@t/inventory.types";
import DollarIcon from '@assets/dollarIcon.svg?react';
import PercentIcon from '@assets/percentIcon.svg?react';

interface EditProductPriceProps {
    productData: Product;
}

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

function EditProductPrice({ productData }: EditProductPriceProps) {
    console.log(productData);
    return (
        <form className="pt-4 bg-gray-50 p-6 shadow-md rounded-t-md space-y-6">
            {formFields.map((field) => (
                <div key={field.label} className="space-y-1">
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
        </form>
    );
}

export { EditProductPrice };