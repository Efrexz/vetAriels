import FileInvoiceIcon from '../../assets/file-invoice.svg?react';

const sections = [
    {
        title: 'Resumen de comprobantes generados en el periodo',
        data: [
            { label: 'Sumatoria montos facturados de todos los comprobantes (no toma en cuenta notas de crédito)', value: 526.00 },
            { label: 'Sumatoria de notas de crédito aplicadas a comprobantes del periodo', value: 0.00 },
            { label: 'Facturación neta por ventas', value: 526.00 },
        ],
    },
    {
        title: 'Resumen de pagos de comprobantes',
        data: [
            { label: 'Sumatoria de pagos recibidos por comprobantes emitidos en el periodo (cualquier metodo de pago)', value: 526.00 },
            { label: 'Sumatoria de pagos pendientes de comprobantes emitidos al crédito en el periodo', value: 0.00, highlight: true },
            { label: 'Cobro de deudas (click aquí para ver el detalle de comprobantes)', value: 0.00, highlight: true },
            { label: 'Total', value: 526.00 },
        ],
    },
];

function BalanceReport() {
    return (
        <section className="container mx-auto p-6 overflow-auto">
            <h1 className="text-2xl font-medium text-blue-500 mb-4 pb-4 border-b-2 border-gray-100 flex items-center">
                <FileInvoiceIcon className="w-7 h-7 mr-2" />
                Cuadre de caja
            </h1>



            {sections.map((section, index) => (
                <div key={index} className="bg-gray-50 shadow rounded-md p-4 mb-4">
                    <h2 className="text-lg font-medium text-gray-700 mb-2">{section.title}</h2>
                    {section.data.map((item, i) => (
                        <div
                            key={i}
                            className={`flex justify-between py-2 px-4 ${item.highlight ? 'text-orange-500' : 'text-gray-700'
                                }`}
                        >
                            <span>{item.label}</span>
                            <span>{item.value.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            ))}

            <footer className="mt-6 text-center">
                <a href="#" className="text-blue-500 underline">
                    Ingresos por comprobantes (Click aquí para ver el detalle de comprobantes)
                </a>
            </footer>
        </section>
    );
}


export { BalanceReport };