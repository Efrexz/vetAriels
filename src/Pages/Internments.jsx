import RefreshIcon from '../assets/refreshIcon.svg?react';
import EraserIcon from '../assets/eraserIcon.svg?react';
import PDFIcon from '../assets/pdfIcon.svg?react';
import ExcelIcon from '../assets/fileExcelIcon.svg?react';
import HospitalIcon from '../assets/hospitalIcon.svg?react';
import SearchIcon from '../assets/searchIcon.svg?react';



const userInfo = [
    {
        date: '29-07-2024 07:33 PM',
        patient: 'Toffe',
        owner: 'GLORIA CAROLINA ESPINOZA BORJA',
        note: "Vomitos/ Abdomen Agudo",
        status: 'Internado'
    },
    {
        date: '29-07-2024 07:33 PM',
        patient: 'Toffe',
        owner: 'GLORIA CAROLINA ESPINOZA BORJA',
        note: "Vomitos/ Abdomen Agudo",
        status: 'Internado'
    },
    {
        date: '29-07-2024 07:33 PM',
        patient: 'Toffe',
        owner: 'GLORIA CAROLINA ESPINOZA BORJA',
        note: "Vomitos/ Abdomen Agudo",
        status: 'Internado'
    }
];

const tableHeaders = [
    "Fecha y hora de ingreso",
    "Paciente",
    "Propietario",
    "Estado",
];

function Internments() {
    return (
        <section className="container mx-auto p-6">
            <h1 className="text-3xl font-medium text-blue-500 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <HospitalIcon className="w-9 h-9 mr-2" />
                Internados
            </h1>
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex items-center space-x-4 mb-4">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded">Pacientes</button>
                    <button className="bg-transparent text-blue-400 py-2 px-4 rounded hover:bg-gray-100 hover:text-blue-600">Tratamientos</button>
                </div>
                <div className="p-4 rounded-lg mb-2">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className=" w-[60%] flex gap-2">
                            <div className="flex w-full border-gray-200 border rounded-lg overflow-hidden hover:border-blue-300 focus-within:border-blue-300">
                                <div className="flex items-center justify-center bg-gray-100 px-3">
                                    <SearchIcon className="w-5 h-5 text-gray-600" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    className="w-full py-2 px-4 focus:outline-none focus:ring-0 focus:border-transparent"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Numero de historia clinica..."
                                className="w-full py-2 px-4 border-gray-200 border-2 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <button className="bg-transparent border border-gray-300 text-orange-500 py-2 px-4 rounded hover:bg-gray-200">
                                <PDFIcon className="w-5 h-5" />
                            </button>
                            <button className="bg-transparent border border-gray-300 text-green-600 py-2 px-4 rounded hover:bg-gray-200">
                                <ExcelIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                        <div className=" w-[80%] flex gap-2">
                            <input
                                type="date"
                                className="w-full py-2 px-4 border-gray-200 border-2 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <select
                                name="status"
                                className="w-full rounded-lg border-gray-200 border-2 text-gray-700 sm:text-sm p-2"
                            >
                                <option value="">Cualquier Estado</option>
                                <option value="hospitalized">Internado</option>
                                <option value="discharged ">De Alta</option>
                            </select>
                            <div className='flex'>
                                <button className="bg-transparent border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-200">
                                    <EraserIcon className="w-5 h-5" />
                                </button>
                                <button className="bg-transparent border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-200">
                                    <RefreshIcon className="w-5 h-5" />
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto border border-gray-300 rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                {tableHeaders.map((header) => (
                                    <th key={header} className="py-2 px-4 border text-gray-700 text-center">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {userInfo.map((userData, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b text-center border ">{userData.date}</td>
                                    <td className="py-2 px-4 border">
                                        <div>
                                            <span className='cursor-pointer text-lg text-green-500 hover:underline hover:text-green-600'>{userData.patient}</span>
                                        </div>
                                        <div className="text-gray-500 text-sm">{userData.owner}</div>
                                        <div className="text-gray-500 text-sm italic">{userData.note}</div>
                                    </td>
                                    <td className="py-2 px-4 border-b text-center border">
                                        <span className="text-md  cursor-pointer text-blue-500 hover:underline">{userData.owner}</span>
                                    </td>
                                    <td className="py-2 px-4 border-b text-center border text-white bg-green-500 rounded">{userData.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-gray-600">Página: 1 de 1 | Registros del 1 al 4 | Total 4</p>
                    <div className="flex space-x-2">
                        <button className="py-2 px-4 border rounded">Primera</button>
                        <button className="py-2 px-4 border rounded">Anterior</button>
                        <button className="py-2 px-4 border rounded bg-blue-500 text-white">1</button>
                        <button className="py-2 px-4 border rounded">Siguiente</button>
                        <button className="py-2 px-4 border rounded">Última</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { Internments };