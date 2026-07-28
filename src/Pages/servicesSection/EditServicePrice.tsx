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
        <div className="bg-paper rounded-2xl shadow-sm p-5 mb-6 border border-slate-200">
            <form className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
                {formFields.map((field, index) => (
                    <div key={index} className="space-y-1">
                        <label
                            htmlFor={field.id}
                            className="block text-sm font-medium text-ink"
                        >
                            {field.label}
                        </label>
                        <input
                            type={field.type}
                            id={field.id}
                            placeholder={field.placeholder}
                            disabled={field.disabled || false}
                            className="block w-full px-4 py-2 text-sm border border-slate-200 rounded-lg bg-white text-ink hover:border-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                        />
                        {field.extraCheckbox && (
                            <label className="flex items-center space-x-2 mt-2">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-primary border-slate-300 rounded bg-white"
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

export { EditServicePrice };