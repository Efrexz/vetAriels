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
        <div className="bg-paper rounded-2xl shadow-sm p-5 mb-6 border border-slate-200">
            <form className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
                {formFields.map((field) => (
                    <div key={field.label} className="space-y-1">
                        <label
                            htmlFor={field.id}
                            className="block text-sm font-medium text-ink"
                        >
                            {field.label}
                        </label>
                        <div className="flex w-full border border-slate-200 rounded-lg overflow-hidden text-ink hover:border-primary focus-within:border-primary transition-colors">
                            {
                                field.icon && (
                                    <div className="flex items-center justify-center bg-white px-3 border-r border-slate-200">
                                        <field.icon className="w-5 h-5 text-slate" />
                                    </div>
                                )
                            }
                            <input
                                type={field.type}
                                id={field.id}
                                disabled={field.disabled || false}
                                className="w-full px-4 py-2 text-sm bg-white focus:outline-none"
                            />
                        </div>
                        {field.extraCheckbox && (
                            <label className="flex items-center space-x-2 mt-2">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-primary border-slate-300 rounded bg-white focus:ring-primary/30 transition-colors"
                                />
                                <span className="text-sm text-slate">{field.extraCheckbox}</span>
                            </label>
                        )}
                    </div>
                ))}
            </form>
        </div>
    );
}

export { EditProductPrice };