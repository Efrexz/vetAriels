import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '@context/GlobalContext';
import { User } from '@t/user.types';
import { ConfirmActionModal } from '@components/modals/ConfirmActionModal';
import TrashIcon from '@assets/trashIcon.svg?react';
import RefreshIcon from '@assets/refreshIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import UserGroupIcon from '@assets/userGroupIcon.svg?react';
import KeyIcon from '@assets/keyIcon.svg?react';


const tableHeaders = ["Fecha de creación", "Nombre y Apellidos", "Correo", "Rol", "Estado", "Opciones"];

function Users() {
    const { users } = useGlobal();
    const navigate = useNavigate();
    const [isConfirmActionModalOpen, setIsConfirmActionModalOpen] = useState<boolean>(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    return (
        <section className="container mx-auto p-6">
            <h1 className="text-xl sm:text-3xl font-ligth text-gray-500 mb-4 pb-4 border-b-2 border-gray-100 flex items-center">
                <UserGroupIcon className="w-6 sm:w-9 h-6 sm:h-9  mr-2" />
                Usuarios
            </h1>
            <div className="bg-white rounded-lg shadow p-3 mb-6">
                <div className="overflow-x-auto border border-gray-300 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-4">
                        <button
                            className="flex items-center gap-2 py-2 px-4 border border-gray-300 text-white bg-green-500 rounded hover:bg-green-600"
                            onClick={() => navigate("/config/user-subsidiaries/create")}
                        >
                            <PlusIcon className="w-5 h-5" />
                            AGREGAR USUARIO
                        </button>
                        <button
                            className="flex items-center gap-2 py-2 px-4 border border-gray-300 text-gray-700 bg-transparent rounded hover:bg-gray-200"
                            onClick={() => window.location.reload()}
                        >
                            <RefreshIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <table className="min-w-full bg-white border rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                {tableHeaders.map((header) => (
                                    <th key={header} className="py-2 px-4 text-center border font-medium text-gray-700">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 text-center border">
                                        {user?.registrationDate} {user?.registrationTime}
                                    </td>
                                    <td className="py-2 px-4 text-center border">
                                        {user?.name} {user?.lastName}
                                    </td>
                                    <td className="py-2 px-4 text-center border">{user?.email}</td>
                                    <td className="py-2 px-4 text-center border">{user?.rol}</td>
                                    <td className="py-2 px-4 text-center border ">
                                        <span
                                            className={`inline-block  py-0.5 px-4 text-white rounded-full ${user?.status === "ACTIVO" ? "bg-green-500" : "bg-red-500"}`}
                                        >
                                            {user?.status === "ACTIVO" ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td className="py-8 px-4 text-center border">
                                        <div className="flex justify-center items-center h-full space-x-2">
                                            <KeyIcon
                                                className="w-5 h-5 text-orange-400 hover:text-orange-500 cursor-pointer"
                                                onClick={() => navigate(`/config/user-subsidiaries/edit/${user.id}`)}
                                            />
                                            <TrashIcon
                                                className="w-5 h-5 text-red-400  hover:text-red-500 cursor-pointer"
                                                onClick={() => {
                                                    setUserToDelete(user);
                                                    setIsConfirmActionModalOpen(true);
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
                    isConfirmActionModalOpen && userToDelete && (
                        <ConfirmActionModal
                            elementData={userToDelete}
                            typeOfOperation={"deleteUser"}
                            onClose={() => setIsConfirmActionModalOpen(false)}
                        />
                    )
                }
                <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
                    <p className="text-gray-600 text-center md:text-left">
                        Página: 1 de 1 | Registros del 1 al {users.length} | Total{" "}
                        {users.length}
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
        </section >
    );
}

export { Users };