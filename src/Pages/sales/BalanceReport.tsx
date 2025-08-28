import FileInvoiceIcon from '@assets/file-invoice.svg?react';
import CalendarIcon from '@assets/calendarIcon.svg?react';
import PDFIcon from '@assets/pdfIcon.svg?react';
import ExcelIcon from '@assets/fileExcelIcon.svg?react';

interface ReportDataItem {
    label: string;
    value: number;
    highlight?: boolean;
}

// Tipo para los items dentro de la sección de pagos (Entradas/Salidas)
interface PaymentItem {
    label: string;
    value: number;
}

// Tipo para el grupo de datos en la sección de pagos
interface PaymentSectionData {
    type: 'Entradas' | 'Salidas';
    items: PaymentItem[];
}

// Usamos una UNIÓN DISCRIMINADA para modelar los dos tipos de secciones

// Forma de una sección de reporte estándar
interface StandardReportSection {
    title: string;
    data: ReportDataItem[];
    payments?: false;
}

// Forma de la sección especial de pagos
interface PaymentsReportSection {
    title: string;
    data: PaymentSectionData[];
    payments: true;
}

type ReportSection = StandardReportSection | PaymentsReportSection;


const sections: ReportSection[] = [
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
    {
        title: 'Pagos recibidos por comprobantes emitidos en el periodo (cualquier medio de pago)',
        data: [
            { label: 'PLIN', value: 526.00 },
            { label: 'VISA', value: 410.00 },
            { label: 'EFECTIVO', value: 450.00 },
            { label: 'AMERICAN EXPRESS', value: 100.00 },
            { label: 'Sumatoria de pagos recibidos por comprobantes emitidos en el periodo (cualquier medio de pago)', value: 4000.00, highlight: true },
        ],
    },
    {
        title: 'Resumen de entradas de dinero directos de caja (no considera ventas):',
        payments: true,
        data: [
            {
                type: 'Entradas',
                items: [{ label: 'EFECTIVO', value: 474.7 }],
            },
            {
                type: 'Salidas',
                items: [{ label: 'EFECTIVO', value: 254.0 }],
            },
        ]
    },
    {
        title: 'Cierre de caja del periodo (Agrupado por método de pago)',
        data: [
            { label: 'EFECTIVO (Suma de entradas)', value: 713.20 },
            { label: 'PLIN (Suma de entradas)', value: 410.00 },
            { label: 'VISA (Suma de entradas)', value: 660.50 },
            { label: 'EFECTIVO (Suma de salidas)', value: -250.00 },
            { label: 'AMERICAN EXPRESS (Suma de entradas)', value: 261.00 },
            { label: 'Saldo en efectivo (en caja)', value: 4000.00, highlight: true },
        ],
    },
];

function BalanceReport() {
    return (
        <section className="container mx-auto p-6 ">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-500 mb-4 pb-4 border-b-2 border-gray-100 flex items-center">
                <FileInvoiceIcon className="w-7 h-7 mr-2" />
                Cuadre de caja
            </h1>

            <div className="flex flex-col sm:flex-row items-center gap-3 py-2 px-4 bg-gray-50 rounded-lg shadow mb-6 w-full">
                <div className="flex items-center border rounded w-full md:w-[25%]">
                    <span className="bg-gray-200 p-2 flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 text-gray-600" />
                    </span>
                    <input
                        type="date"
                        className="px-2 py-1.5 w-full text-sm text-gray-700 focus:outline-none focus:border-blue-500 hover:border-blue-400"
                    />
                </div>
                <select className="border rounded p-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500 hover:border-blue-400 w-full md:w-[20%]">
                    <option>Seleccione empresa</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 w-full md:w-auto justify-center">
                    HISTORIAL
                </button>
            </div>


            {sections.map((section, index) => {
                return !section.payments ? (
                    (
                        <div key={index} className="bg-gray-50 shadow rounded-md p-4 mb-4">
                            <h2 className="text-md font-medium text-gray-700 mb-2">{section.title}</h2>
                            {section.data.map((item, i) => (
                                <div
                                    key={i}
                                    className={`flex justify-between text-sm py-2 px-4 ${item.highlight ? 'text-blue-500 font-medium' : 'text-gray-700'} border border-gray-200 bg-white`}
                                >
                                    <span>{item.label}</span>
                                    <span>{item.value || item.value.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    )
                )
                    : (
                        <div className="bg-gray-50 shadow rounded-md p-4 mb-4">
                            <h2 className="text-gray-700 font-semibold text-lg mb-3">
                                Resumen de entradas y salidas de dinero directos de caja (no considera ventas):
                            </h2>
                            {section.data.map((section, index) => (
                                <div key={index} className="mb-2">
                                    <div className='flex justify-between items-center px-3 font-medium text-gray-600 mb-2 '>
                                        <span>{section?.type}</span>
                                        <span>Monto</span>
                                    </div>

                                    <div className="grid grid-cols-2 bg-white text-sm items-center">
                                        <span className="py-3 px-4 text-gray-700">EFECTIVO</span>
                                        <span className="py-3 px-4 text-right text-gray-700">
                                            {section?.items[0]?.value}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
            })}

            <div className="bg-gray-50 shadow rounded-md p-4 mb-4 flex flex-col sm:flex-row items-center gap-4 md:gap-8">
                <button className="bg-orange-400 text-white font-medium py-3 px-4 rounded hover:bg-orange-500 flex items-center justify-center gap-2 w-full md:w-60 text-sm">
                    <PDFIcon className="w-5 h-5" />
                    IMPRIMIR
                </button>
                <button className="bg-green-400 text-white font-medium py-3 px-4 rounded hover:bg-green-500 flex items-center justify-center gap-2 w-full md:w-60 text-sm">
                    <ExcelIcon className="w-5 h-5" />
                    EXPORTAR A EXCEL
                </button>
            </div>

        </section>
    );
}


export { BalanceReport };