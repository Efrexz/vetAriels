import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientsContext } from '@context/ClientsContext';
import { DeleteModal } from '@components/DeleteModal';
import PlusIcon from '@assets/plusIcon.svg?react';
import PenIcon from '@assets/penIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import UserGroupIcon from '@assets/userGroupIcon.svg?react';
import SearchIcon from '@assets/searchIcon.svg?react';
import PawIcon from '@assets/pawIcon.svg?react';



const tableHeaders = ["Fecha de registro", "Nombres y Apellidos", "Teléfono", "Email", "Direccion", "Opciones"];

function Clients() {

    const { clients } = useContext(ClientsContext);
    const [clientDataToDelete, setClientDataToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <section className="container mx-auto p-6">
            <h1 className="text-xl md:text-3xl font-medium text-blue-500 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <UserGroupIcon className="w-6 md:w-9 h-6 md:h-9 text-blue-500 mr-2" />
                Clientes
            </h1>
            <div className="bg-white rounded-lg shadow p-3 mb-6">
                <div className="p-3 rounded-lg mb-1">
                    <div className="flex flex-wrap items-center space-y-3 md:space-y-0 md:space-x-2 mb-3">
                        <div className="w-full md:w-auto flex flex-wrap md:flex-nowrap gap-2">
                            <div className="flex w-full md:w-auto border-gray-200 border rounded-lg overflow-hidden hover:border-blue-300 focus-within:border-blue-300 ">
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
                                type="date"
                                className="w-full md:w-[250px] py-2 px-4 border-gray-200 border rounded-lg focus:outline-none focus:border-blue-300"
                            />
                        </div>
                        <button
                            className="w-full md:w-auto border border-gray-300 text-white bg-green-500 py-2 px-4 rounded hover:bg-green-600 flex items-center gap-2"
                            onClick={() => navigate("/clients/create")}
                        >
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
                                    <td className="py-8 px-4 text-center border">
                                        <div className="flex justify-center items-center h-full space-x-2">
                                            <PenIcon
                                                className="w-4 h-4 text-green-500 cursor-pointer"
                                                onClick={() => navigate(`/clients/client/${userData.id}/update`)} />
                                            <PawIcon
                                                className="w-4 h-4 text-[#7266BA] cursor-pointer"
                                                onClick={() => navigate(`/clients/client/${userData.id}/pets`)} />
                                            <TrashIcon
                                                className="w-4 h-4 text-red-500 cursor-pointer"
                                                onClick={() => {
                                                    setClientDataToDelete(userData)
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
                    isDeleteModalOpen && (
                        <DeleteModal
                            elementToDelete={clientDataToDelete}
                            onClose={() => setIsDeleteModalOpen(false)}
                            mode="clients"
                        />
                    )
                }
                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                    <p className="text-gray-600 text-center md:text-left">
                        Página: 1 de 1 | Registros del 1 al {clients.length} | Total{" "}
                        {clients.length}
                    </p>
                    <div className="flex flex-wrap md:flex-row justify-center space-x-2 md:space-x-4">
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