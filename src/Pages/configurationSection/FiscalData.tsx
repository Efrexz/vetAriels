import ConfigurationIcon from '@assets/configurationIcon.svg?react';
import EditIcon from '@assets/editIcon.svg?react';

const fiscalData = [
    {
        date: '29-07-2024 07:33 PM',
        name: 'VETERINARIA ARIEL`S E.I.R.L',
        taxRegistrationNumber: '20608438719',
        address: "Av. Los Proceres Nro. 115 Urb. Condevilla Señor y Valdivieso Et. Dos Sc. Dos LIMA - SAN MARTIN DE PORRES",
        email: 'Admvetarielscv@outlook.es',
        establishmentCode: '20608438719',
        status: 'Activo'
    },
];

const tableHeaders = [
    "Fecha de registro",
    "Nombre",
    "Número de Registro Tributario",
    "Dirección",
    "Correo",
    "Cod. establecimiento",
    "Estado",
    "Opciones",
];

function FiscalData() {
    return (
        <section className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    Configuraci&oacute;n
                </span>
                <h1 className="text-2xl font-bold font-display text-ink">
                    Datos Fiscales
                </h1>
            </div>
            <div className="bg-paper rounded-2xl shadow-sm p-5 mb-6 border border-slate-200">
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
                            {fiscalData.map((userData, index) => (
                                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 px-4 text-center text-sm text-slate">{userData.date}</td>
                                    <td className="py-3 px-4 text-center text-sm text-ink font-medium">{userData.name}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">{userData.taxRegistrationNumber}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">{userData.address}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">{userData.email}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">{userData.establishmentCode}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                                            {userData.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <button className="p-1.5 rounded-lg text-slate hover:text-ink hover:bg-slate-100 transition-colors">
                                            <EditIcon className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export { FiscalData };