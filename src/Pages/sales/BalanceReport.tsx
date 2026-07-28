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
        <section className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    Caja
                </span>
                <h1 className="text-2xl font-bold font-display text-ink">
                    Cuadre de caja
                </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 py-4 px-6 bg-paper rounded-2xl shadow-sm mb-8 border border-slate-200">
                <div className="flex items-center w-full md:w-[25%] rounded-lg border border-slate-200 focus-within:border-primary transition-colors">
                    <span className="bg-slate-50 p-2 flex items-center justify-center rounded-l-lg border-r border-slate-200">
                        <CalendarIcon className="w-4 h-4 text-slate" />
                    </span>
                    <input
                        type="date"
                        className="px-4 py-2 text-sm w-full bg-white text-ink rounded-r-lg focus:outline-none"
                    />
                </div>
                <select className="border border-slate-200 rounded-lg py-2 px-3 text-sm bg-white text-ink focus:outline-none focus:border-primary hover:border-primary transition-colors w-full md:w-[20%]">
                    <option value="">Seleccione empresa</option>
                </select>
                <button className="flex items-center gap-2 px-5 py-2 bg-transparent text-amber font-semibold rounded-lg border border-amber/40 w-full md:w-auto justify-center transition-all hover:bg-amber/10 text-sm">
                    Historial
                </button>
            </div>
            {sections.map((section, index) => {
                return !section.payments ? (
                    (
                        <div key={index} className="bg-paper shadow-sm rounded-2xl px-5 py-4 mb-6 border border-slate-200">
                            <h2 className="text-sm font-semibold font-display text-ink mb-3">{section.title}</h2>
                            {section.data.map((item, i) => (
                                <div
                                    key={i}
                                    className={`flex justify-between text-sm py-1.5 px-4 rounded-lg my-2
                                    ${item.highlight ? 'text-primary font-semibold bg-primary/5 border border-primary/20' : 'text-ink bg-slate-50/50 border border-slate-200'}
                                    hover:bg-slate-100/80 transition-all`}
                                >
                                    <span>{item.label}</span>
                                    <span>{item.value || item.value.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    )
                )
                    : (
                        <div key={index} className="bg-paper shadow-sm rounded-2xl px-5 py-4 mb-6 border border-slate-200">
                            <h2 className="text-sm text-ink font-semibold font-display mb-2">
                                Resumen de entradas y salidas de dinero directos de caja (no considera ventas):
                            </h2>
                            {section.data.map((section, index) => (
                                <div key={index} className="mb-1">
                                    <div className="flex justify-between items-center px-2 font-bold text-slate text-xs mb-1">
                                        <span>{section?.type}</span>
                                        <span>Monto</span>
                                    </div>
                                    <div className="grid grid-cols-2 bg-slate-50/50 rounded-lg text-sm items-center border border-slate-200">
                                        <span className="py-1 px-4 text-ink">EFECTIVO</span>
                                        <span className="py-1 px-4 text-right text-ink font-bold font-display">
                                            {section?.items[0]?.value}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
            })}
            <div className="bg-paper rounded-2xl px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center gap-3 md:gap-8 border border-slate-200">
                <button className="bg-transparent text-amber font-semibold py-2 px-5 rounded-lg border border-amber/40 w-full md:w-60 justify-center transition-all hover:bg-amber/10 flex items-center gap-2 text-sm">
                    <PDFIcon className="w-5 h-5" />
                    Imprimir
                </button>
                <button className="bg-transparent text-success font-semibold py-2 px-5 rounded-lg border border-success/40 w-full md:w-60 justify-center transition-all hover:bg-success/10 flex items-center gap-2 text-sm">
                    <ExcelIcon className="w-5 h-5" />
                    Exportar a Excel
                </button>
            </div>
        </section>
    );
}


export { BalanceReport };