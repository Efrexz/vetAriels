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
        <section className="w-full p-4 sm:p-6 bg-gray-950 text-gray-50 min-h-screen">
            <h1 className="text-xl sm:text-2xl font-medium text-white mb-4  border-b border-cyan-500 pb-3 flex items-center">
                <FileInvoiceIcon className="w-8 h-8 sm:w-9 sm:h-9 mr-3 text-cyan-400 drop-shadow-lg" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">Cuadre de caja</span>
            </h1>
            <div className="flex flex-col sm:flex-row items-center gap-4 py-4 px-6 bg-gray-900 rounded-2xl shadow-xl mb-8 border border-gray-700">
                <div className="flex items-center w-full md:w-[25%] rounded-xl border-2 border-gray-600 focus-within:border-cyan-500 transition-colors">
                    <span className="bg-gray-700 p-2 flex items-center justify-center rounded-l-xl">
                        <CalendarIcon className="w-4 h-4 text-gray-400 group-focus-within:text-cyan-400" />
                    </span>
                    <input
                        type="date"
                        className="px-4 py-1 w-full text-base bg-gray-800 text-gray-200 rounded-r-xl focus:outline-none"
                    />
                </div>
                <select className="border-2 border-gray-600 rounded-xl py-1 px-3 text-base bg-gray-800 text-gray-200 focus:outline-none focus:border-cyan-500 hover:border-cyan-500 transition-colors w-full md:w-[20%]">
                    <option className="bg-gray-700" value="">Seleccione empresa</option>
                </select>
                <button className="flex items-center gap-2 px-6 py-1 bg-transparent text-white font-bold rounded-xl border-2 border-orange-500 w-full md:w-auto justify-center transition-all shadow-md shadow-orange-500/50 hover:bg-orange-500 hover:text-white hover:shadow-orange-400/80">
                    HISTORIAL
                </button>
            </div>
            {sections.map((section, index) => {
                return !section.payments ? (
                    (
                        <div key={index} className="bg-gray-800 shadow-lg rounded-xl px-4 py-2 mb-6 border border-gray-700">
                            <h2 className="text-xl font-medium text-gray-300 mb-4">{section.title}</h2>
                            {section.data.map((item, i) => (
                                <div
                                    key={i}
                                    className={`flex justify-between text-base py-1 px-4 rounded-lg my-2
                                    ${item.highlight ? 'text-cyan-400 font-bold bg-gray-700 border-2 border-cyan-500/50' : 'text-gray-200 bg-gray-700 border border-gray-600'}
                                    hover:bg-gray-700/50 transition-all`}
                                >
                                    <span>{item.label}</span>
                                    <span>{item.value || item.value.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    )
                )
                    : (
                        <div key={index} className="bg-gray-800 shadow-lg rounded-xl px-4 py-2 mb-6 border border-gray-700">
                            <h2 className="text-xl text-gray-300 font-semibold mb-1">
                                Resumen de entradas y salidas de dinero directos de caja (no considera ventas):
                            </h2>
                            {section.data.map((section, index) => (
                                <div key={index} className="mb-1">
                                    <div className='flex justify-between items-center px-2 font-bold text-gray-400 mb-1'>
                                        <span>{section?.type}</span>
                                        <span>Monto</span>
                                    </div>
                                    <div className="grid grid-cols-2 bg-gray-700 rounded-lg text-base items-center border border-gray-600">
                                        <span className="py-1 px-4 text-gray-200">EFECTIVO</span>
                                        <span className="py-1 px-4 text-right text-gray-200 font-bold">
                                            {section?.items[0]?.value}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
            })}
            <div className="bg-gray-800 rounded-xl px-4 sm:px-6 py-2 flex flex-col sm:flex-row items-center gap-4 md:gap-8 border border-gray-700">
                <button className="bg-transparent text-white font-bold py-2 px-2 rounded-xl border-2 border-orange-500 w-full md:w-60 justify-center transition-all shadow-md shadow-orange-500/50 hover:bg-orange-500 hover:text-white hover:shadow-orange-400/80 flex items-center gap-2">
                    <PDFIcon className="w-6 h-6" />
                    IMPRIMIR
                </button>
                <button className="bg-transparent text-white font-bold py-2 px-2 rounded-xl border-2 border-green-500 w-full md:w-60 justify-center transition-all shadow-md shadow-green-500/50 hover:bg-green-500 hover:text-white hover:shadow-green-400/80 flex items-center gap-2">
                    <ExcelIcon className="w-6 h-6" />
                    EXPORTAR A EXCEL
                </button>
            </div>
        </section>
    );
}


export { BalanceReport };