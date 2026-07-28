import RefreshIcon from '@assets/refreshIcon.svg?react';
import EraserIcon from '@assets/eraserIcon.svg?react';
import PDFIcon from '@assets/pdfIcon.svg?react';
import ExcelIcon from '@assets/fileExcelIcon.svg?react';
import HospitalIcon from '@assets/hospitalIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';


interface InternmentEntry {
    id: string;
    date: string;
    patient: string;
    owner: string;
    note: string;
    status: 'Internado' | 'De Alta';
}

const userInfo : InternmentEntry[] = [
    {
        id: 'intern-1',
        date: '29-07-2024 07:33 PM',
        patient: 'Toffe',
        owner: 'GLORIA CAROLINA ESPINOZA BORJA',
        note: "Vomitos/ Abdomen Agudo",
        status: 'Internado'
    },
    {
        id: 'intern-2',
        date: '29-07-2024 07:33 PM',
        patient: 'Bobby',
        owner: 'JUAN PÉREZ GONZÁLEZ',
        note: "Cirugía programada",
        status: 'Internado'
    },
    {
        id: 'intern-3',
        date: '28-07-2024 10:15 AM',
        patient: 'Luna',
        owner: 'MARÍA LÓPEZ',
        note: "Observación post-tratamiento",
        status: 'De Alta'
    }
];

const tableHeaders: string[] = [
    "Fecha y hora de ingreso",
    "Paciente / Propietario / Notas",
    "Contacto Propietario",
    "Estado",
];

function Internments() {
    return (
        <section className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    Hospitalizaci&oacute;n
                </span>
                <h1 className="text-2xl font-bold font-display text-ink">
                    Internados
                </h1>
            </div>
            <div className="bg-paper rounded-2xl shadow-sm p-5 mb-6 border border-slate-200">
                <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
                    <button className="bg-primary/10 text-primary py-2 px-4 rounded-lg text-sm font-semibold font-display">Pacientes</button>
                    <button className="text-slate py-2 px-4 rounded-lg text-sm hover:bg-slate-50 transition-colors font-medium">Tratamientos</button>
                </div>
                <div className="p-4 rounded-xl mb-4 border border-slate-200 bg-slate-50/50">
                    <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
                        <div className="flex w-full gap-3">
                            <div className="flex flex-1 items-center border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-primary">
                                <div className="flex items-center justify-center px-3">
                                    <SearchIcon className="w-4 h-4 text-slate" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    className="w-full py-2 px-2 focus:outline-none focus:ring-0 bg-white text-sm text-ink placeholder:text-slate/70"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="N&uacute;mero de historia cl&iacute;nica..."
                                className="flex-1 py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="border border-slate-200 text-slate py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                                <PDFIcon className="w-5 h-5" />
                            </button>
                            <button className="border border-slate-200 text-slate py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                                <ExcelIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="flex w-full gap-3">
                            <input
                                type="date"
                                className="flex-1 py-2 px-3 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                            />
                            <select
                                name="status"
                                className="flex-1 rounded-lg border border-slate-200 bg-white text-sm py-2 px-3 text-slate focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                            >
                                <option value="">Cualquier Estado</option>
                                <option value="hospitalized">Internado</option>
                                <option value="discharged ">De Alta</option>
                            </select>
                            <div className="flex gap-2">
                                <button className="border border-slate-200 text-slate py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <EraserIcon className="w-5 h-5" />
                                </button>
                                <button className="border border-slate-200 text-slate py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <RefreshIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-slate-200">
                                {tableHeaders.map((header) => (
                                    <th key={header} className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-slate">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {userInfo.map((userData) => (
                                <tr key={userData.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 px-4 text-center text-sm text-slate">{userData.date}</td>
                                    <td className="py-3 px-4">
                                        <div>
                                            <span className="cursor-pointer text-sm font-semibold text-primary hover:underline">{userData.patient}</span>
                                        </div>
                                        <div className="text-slate text-xs mt-0.5">{userData.owner}</div>
                                        <div className="text-slate text-xs italic">{userData.note}</div>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="cursor-pointer text-sm text-primary hover:underline">{userData.owner}</span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            userData.status === 'Internado' ? 'bg-amber/10 text-amber' : 'bg-success/10 text-success'
                                        }`}>
                                            {userData.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center mt-5 gap-4">
                    <p className="text-slate text-sm">
                        Registros 1&ndash;4 de 4
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">Primera</button>
                        <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">Anterior</button>
                        <button className="py-1.5 px-3 rounded-lg text-sm bg-primary text-white font-semibold transition-colors">1</button>
                        <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">Siguiente</button>
                        <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate bg-paper hover:bg-slate-50 transition-colors font-medium">&Uacute;ltima</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { Internments };