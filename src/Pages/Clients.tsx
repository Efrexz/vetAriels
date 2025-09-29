import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { DeleteModal } from '@components/modals/DeleteModal';
import { Client } from '@t/client.types';
import PlusIcon from '@assets/plusIcon.svg?react';
import PenIcon from '@assets/penIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import UserGroupIcon from '@assets/userGroupIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';
import PawIcon from '@assets/pawIcon.svg?react';

const tableHeaders = ["Fecha de registro", "Nombres y Apellidos", "Teléfono", "Email", "Direccion", "Opciones"];

function Clients() {
    const { clients } = useClients();
    const [clientDataToDelete, setClientDataToDelete] = useState<Client | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <section className="bg-gray-950 w-full p-6">
            <h1 className="text-xl sm:text-2xl font-medium text-cyan-500 mb-4 pb-4 border-b-2 border-cyan-500 flex items-center">
                <UserGroupIcon className="w-6 sm:w-9 h-6 sm:h-9 text-cyan-500 mr-2" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400"> Clientes</span>
            </h1>
            <div className="bg-gray-900 rounded-xl shadow-lg p-4 mb-6 border border-gray-700">
                <div className="p-3 rounded-lg border border-cyan-500/30 mb-4">
                    <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
                        <div className="flex flex-wrap md:flex-nowrap gap-2">
                        <div className="flex border-gray-600 border rounded-lg overflow-hidden bg-gray-700 focus-within:border-cyan-500">
                            <div className="flex items-center justify-center bg-gray-700 px-3">
                            <SearchIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                            type="text"
                            placeholder="Buscar..."
                            className="w-full py-1 px-4 focus:outline-none focus:ring-0 focus:border-transparent bg-gray-700 text-gray-200 placeholder-gray-500"
                            />
                        </div>
                        <input
                            type="date"
                            className="w-full md:w-[250px] py-1 px-4 border-gray-600 border rounded-lg focus:outline-none bg-gray-700 text-gray-200 focus:border-cyan-500"
                        />
                        </div>

                        <button
                        className="border border-gray-700 text-white bg-emerald-600 py-1 px-4 rounded-xl hover:bg-emerald-700 flex items-center justify-center gap-2 transition-colors"
                        onClick={() => navigate("/clients/create")}
                        >
                        <PlusIcon className="w-5 h-5" />
                        CREAR NUEVO CLIENTE
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto border border-gray-700 rounded-lg">
                    <table className="min-w-full bg-gray-800 border rounded-lg">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="py-1 px-4 text-center border border-gray-600">
                                    <input type="checkbox" className="form-checkbox h-3 w-3 bg-gray-600 border-gray-500 rounded" />
                                </th>
                                {tableHeaders.map((header) => (
                                    <th key={header} className={`py-1 px-4 ${header === "Mascota" ? "text-left" : "text-center"} border border-gray-600 font-bold text-gray-300 text-sm`}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((clientData) => (
                                <tr key={clientData.id} className="bg-gray-800 hover:bg-gray-700 transition-colors duration-200 text-sm">
                                    <td className=" px-4 text-center border border-gray-600">
                                        <input type="checkbox" className="form-checkbox h-3 w-3 bg-gray-600 border-gray-500 rounded" />
                                    </td>
                                    <td className=" px-4 text-center border border-gray-600 text-gray-400">
                                        <div>{clientData.date}</div>
                                        <div>{clientData.hour}</div>
                                    </td>
                                    <td className=" px-4 text-center border border-gray-600 text-gray-400">{clientData.firstName + ", " + clientData.lastName}</td>
                                    <td className=" px-4 text-center border border-gray-600 text-gray-400">{clientData.phone1}</td>
                                    <td className=" px-4 text-center border border-gray-600 text-gray-400">{clientData.email}</td>
                                    <td className=" px-4 text-center border border-gray-600 text-gray-400">{clientData.address}</td>
                                    <td className="py-2 px-4 text-center border border-gray-600">
                                        <div className="flex justify-center items-center h-full space-x-2">
                                            <PenIcon
                                                className="w-4 h-4 text-yellow-500 cursor-pointer hover:scale-110 transition-transform"
                                                onClick={() => navigate(`/clients/client/${clientData.id}/update`)} />
                                            <PawIcon
                                                className="w-4 h-4 text-purple-500 cursor-pointer hover:scale-110 transition-transform"
                                                onClick={() => navigate(`/clients/client/${clientData.id}/pets`)} />
                                            <TrashIcon
                                                className="w-4 h-4 text-red-500 cursor-pointer hover:scale-110 transition-transform"
                                                onClick={() => {
                                                    setClientDataToDelete(clientData)
                                                    setIsDeleteModalOpen(true)
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {
                    isDeleteModalOpen && clientDataToDelete && (
                        <DeleteModal
                            elementToDelete={clientDataToDelete}
                            onClose={() => setIsDeleteModalOpen(false)}
                            mode="clients"
                        />
                    )
                }
                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                    <p className="text-gray-400 text-center md:text-left text-sm">
                        Página: 1 de 1 | Registros del 1 al {clients.length} | Total{" "}
                        {clients.length}
                    </p>
                    <div className="flex flex-wrap md:flex-row justify-center space-x-2 md:space-x-4">
                        <button className="py-1 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Primera</button>
                        <button className="py-1 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Anterior</button>
                        <button className="py-1 px-4 border border-gray-600 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors">1</button>
                        <button className="py-1 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Siguiente</button>
                        <button className="py-1 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Última</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { Clients };