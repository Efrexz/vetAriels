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
        <section className="container mx-auto p-6">
            <h1 className="text-3xl font-medium text-gray-400 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <ConfigurationIcon className="w-9 h-9 mr-2" />
                Datos Fiscales
            </h1>
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="overflow-x-auto border border-gray-300 rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                {tableHeaders.map((header) => (
                                    <th key={header} className="py-2 px-4 border text-gray-500 text-center">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {fiscalData.map((userData, index) => (
                                <tr key={index} className="hover:bg-gray-100 text-sm">
                                    <td className="py-2 px-4 border-b text-center border ">{userData.date}</td>
                                    <td className="py-2 px-4 border-b text-center border ">{userData.name}</td>
                                    <td className="py-2 px-4 border-b text-center border ">{userData.taxRegistrationNumber}</td>
                                    <td className="py-2 px-4 border-b text-center border ">{userData.address}</td>
                                    <td className="py-2 px-4 border-b text-center border ">{userData.email}</td>
                                    <td className="py-2 px-4 border-b text-center border ">{userData.establishmentCode}</td>
                                    <td className="py-2 px-4 border-2 text-center align-center pt-5">
                                        <span className="inline-flex items-center justify-center px-2 py-1 font-medium leading-none text-white bg-green-500 rounded-full">
                                            {userData.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-b text-center border">
                                        <button className="text-orange-400 hover:text-orange-500">
                                            <EditIcon className="w-5 h-5" />
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