import { useState } from "react";
function EditServicePrice() {
    const formFields = [
        {
            label: "Valor de venta (no incluye impuestos)",
            type: "number",
            id: "valorVenta",
            placeholder: "$",
        },
        {
            label: "Impuesto a las ventas en porcentaje (%)",
            type: "number",
            id: "impuestoPorcentaje",
            placeholder: "%",
            extraCheckbox: "¿Exonerado de impuestos?",
        },
        {
            label: "Impuesto a las ventas monto",
            type: "number",
            id: "impuestoMonto",
            placeholder: "$",
            disabled: true,
        },
        {
            label: "Precio de venta al público (incluido impuestos)",
            type: "number",
            id: "precioVentaPublico",
            placeholder: "$",
        },
        {
            label: "Costo del servicio (no incluye impuestos)",
            type: "number",
            id: "costoServicioSinImpuestos",
            placeholder: "$",
            extraCheckbox: "¿Exonerado de impuestos?",
        },
        {
            label: "Costo del servicio (incluye impuestos)",
            type: "number",
            id: "costoServicioConImpuestos",
            placeholder: "$",
        },
        {
            label: "Porcentaje máximo de descuento (%)",
            type: "number",
            id: "porcentajeDescuento",
            placeholder: "%",
        },
        {
            label: "Margen bruto",
            type: "number",
            id: "margenBruto",
            placeholder: "$",
            disabled: true,
        },
        {
            label: "Margen de utilidad porcentual",
            type: "number",
            id: "margenUtilidad",
            placeholder: "%",
            disabled: true,
        },
    ];

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
                    <input
                        type={field.type}
                        id={field.id}
                        placeholder={field.placeholder}
                        disabled={field.disabled || false}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
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

export { EditServicePrice };