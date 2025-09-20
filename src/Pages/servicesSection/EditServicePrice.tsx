import { Service } from "@t/inventory.types";

interface EditServicePriceProps {
    serviceData: Service;
}

function EditServicePrice({ serviceData }: EditServicePriceProps) {
    console.log(serviceData);
    
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
        <div className="bg-gray-900 rounded-lg shadow-xl p-4 mb-6 border border-gray-700">
            <form className="pt-4 bg-gray-900 p-6 shadow-xl rounded-t-lg space-y-6 border border-cyan-500/30">
                {formFields.map((field, index) => (
                    <div key={index} className="space-y-1">
                        <label
                            htmlFor={field.id}
                            className="block text-sm font-medium text-gray-400"
                        >
                            {field.label}
                        </label>
                        <input
                            type={field.type}
                            id={field.id}
                            placeholder={field.placeholder}
                            disabled={field.disabled || false}
                            className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-0 focus:border-cyan-500 bg-gray-700 text-gray-200 sm:text-sm hover:border-cyan-500"
                        />
                        {field.extraCheckbox && (
                            <label className="flex items-center space-x-2 mt-2">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-cyan-500 border-gray-700 rounded bg-gray-800"
                                />
                                <span className="text-sm text-gray-500">{field.extraCheckbox}</span>
                            </label>
                        )}
                    </div>
                ))}
            </form>
        </div>
    );
}

export { EditServicePrice };