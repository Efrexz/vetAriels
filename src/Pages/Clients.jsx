import { useContext } from 'react';
import { ClientsContext } from '../context/ClientsContext';
import EraserIcon from '../assets/eraserIcon.svg?react';
import RefreshIcon from '../assets/refreshIcon.svg?react';
import PDFIcon from '../assets/pdfIcon.svg?react';
import ExcelIcon from '../assets/fileExcelIcon.svg?react';
import PlusIcon from '../assets/plusIcon.svg?react';
import PenIcon from '../assets/penIcon.svg?react';
import TrashIcon from '../assets/trashIcon.svg?react';
import UserGroupIcon from '../assets/userGroupIcon.svg?react';
import SearchIcon from '../assets/searchIcon.svg?react';
import PawIcon from '../assets/pawIcon.svg?react';


const clientsData = [
    { id: '20497', date: '31-07-2024', hour: '07:43PM', name: 'Efrain Andrade', phone: '917104426', address: 'Av. Proceres 115', email: "efrain@gmail.com" },
    { id: '20498', date: '30-07-2024', hour: '07:43PM', name: 'Efrain Andrade', phone: '917104426', address: 'Av. Proceres 115', email: "efrain@gmail.com" },
    { id: '20499', date: '30-07-2024', hour: '07:43PM', name: 'Efrain Andrade', phone: '917104426', address: 'CALLE LOS ROSALES 230 SAN MIGUEL', email: "efrain@gmail.com" },
];


const tableHeaders = ["Fecha de registro", "Nombres y Apellidos", "Teléfono", "Email", "Direccion", "Opciones"];

function Clients() {

    const { clients } = useContext(ClientsContext);

    return (
        <section className="container mx-auto p-6">
            <h1 className="text-3xl font-medium text-blue-500 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <UserGroupIcon className="w-9 h-9 text-blue-500 mr-2" />
                Clientes
            </h1>
            <div className="bg-white rounded-lg shadow p-3 mb-6">
                <div className="p-3 rounded-lg mb-1">
                    <div className="flex items-center space-x-2 mb-3">
                        <div className="w-[55%] flex gap-2">
                            <div className="flex w-[50%] border-gray-200 border rounded-lg overflow-hidden hover:border-blue-300 focus-within:border-blue-300">
                                <div className="flex items-center justify-center bg-gray-100 px-3">
                                    <SearchIcon className="w-5 h-5 text-gray-600" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    className="w-[40%] py-2 px-4 focus:outline-none focus:ring-0 focus:border-transparent"
                                />
                            </div>
                            <input
                                type="date"
                                className="w-[350px] py-2 px-4 border-gray-200 border rounded-lg focus:outline-none focus:border-blue-300"
                            />
                        </div>
                        <div>
                            <button className="bg-transparent border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-200">
                                <EraserIcon className="w-5 h-5" />
                            </button>
                            <button className="bg-transparent border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-200">
                                <RefreshIcon className="w-5 h-5" />
                            </button>
                            <button className="bg-transparent border border-gray-300 text-orange-500 py-2 px-4 rounded hover:bg-gray-200">
                                <PDFIcon className="w-5 h-5" />
                            </button>
                            <button className="bg-transparent border border-gray-300 text-green-600 py-2 px-4 rounded hover:bg-gray-200">
                                <ExcelIcon className="w-5 h-5" />
                            </button>
                            <button className="bg-transparent border border-gray-300 text-black py-2 px-4 rounded hover:bg-gray-200">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <button className="border border-gray-300 text-white bg-green-500 py-2 px-4 rounded hover:bg-green-600 flex items-center gap-2">
                            <PlusIcon className="w-5 h-5" />
                            CREAR NUEVO CLIENTE
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto border border-gray-300 rounded-lg">
                    <table className="min-w-full bg-white border rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 text-left border">
                                    <input type="checkbox" className="form-checkbox" />
                                </th>
                                {tableHeaders.map((header) => (
                                    <th key={header} className={`py-2 px-4 ${header === "Mascota" ? "text-left" : "text-center"} border font-medium text-gray-700`}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((userData, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 text-center border">
                                        <input type="checkbox" className="form-checkbox" />
                                    </td>
                                    <td className="py-2 px-4 text-center border">
                                        <div>{userData.date}</div>
                                        <div>{userData.hour}</div>
                                    </td>
                                    <td className="py-2 px-4 text-center border">{userData.firstName + ", " + userData.lastName}</td>
                                    <td className="py-2 px-4 text-center border">{userData.phone1}</td>
                                    <td className="py-2 px-4 text-center border">{userData.email}</td>
                                    <td className="py-2 px-4 text-center border">{userData.address}</td>
                                    <td className="py-10 px-4 text-center border flex justify-center space-x-2">
                                        <PenIcon className="w-4 h-4 text-green-500 cursor-pointer" />
                                        <PawIcon className="w-4 h-4 text-[#7266BA] cursor-pointer" />
                                        <TrashIcon className="w-4 h-4 text-red-500 cursor-pointer" />
                                    </td>
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

export { Clients };