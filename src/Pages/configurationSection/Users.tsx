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
        <section className="w-full p-6 bg-gray-950 text-gray-200">
            <h1 className="text-xl sm:text-3xl font-medium text-white mb-6 border-b border-cyan-500 pb-3 flex items-center">
                <UserGroupIcon className="w-6 sm:w-9 h-6 sm:h-9 mr-2 text-cyan-500" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">Usuarios</span>
            </h1>
            <div className="bg-gray-900 rounded-lg shadow-xl p-4 mb-6">
                <div className="overflow-x-auto border border-cyan-500/30 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <button
                            className="flex items-center gap-2 py-2 px-4 border border-gray-700 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                            onClick={() => navigate("/config/user-subsidiaries/create")}
                        >
                            <PlusIcon className="w-5 h-5" />
                            AGREGAR USUARIO
                        </button>
                        <button
                            className="flex items-center gap-2 py-2 px-4 border border-gray-700 text-cyan-400 bg-gray-800 rounded-lg hover:bg-gray-700 hover:text-cyan-500 transition-colors"
                            onClick={() => window.location.reload()}
                        >
                            <RefreshIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
                        <thead className="bg-gray-700">
                            <tr>
                                {tableHeaders.map((header) => (
                                    <th key={header} className="py-2 px-4 text-center border border-gray-600 font-medium text-gray-300">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-700 transition-colors">
                                    <td className="px-4 text-center border border-gray-600">
                                        {user?.registrationDate} {user?.registrationTime}
                                    </td>
                                    <td className="px-4 text-center border border-gray-600">
                                        {user?.name} {user?.lastName}
                                    </td>
                                    <td className="px-4 text-center border border-gray-600">{user?.email}</td>
                                    <td className="px-4 text-center border border-gray-600">{user?.rol}</td>
                                    <td className="px-4 text-center border border-gray-600">
                                        <span
                                            className={`inline-block py-0.5 px-4 text-white rounded-full ${user?.status === "ACTIVO" ? "bg-emerald-500" : "bg-rose-500"}`}
                                        >
                                            {user?.status === "ACTIVO" ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td className="py-5 px-4 text-center border border-gray-600">
                                        <div className="flex justify-center items-center h-full space-x-2">
                                            <KeyIcon
                                                className="w-5 h-5 text-amber-500 hover:text-amber-400 cursor-pointer transition-colors"
                                                onClick={() => navigate(`/config/user-subsidiaries/edit/${user.id}`)}
                                            />
                                            <TrashIcon
                                                className="w-5 h-5 text-rose-500 hover:text-rose-600 cursor-pointer transition-colors"
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
                    <p className="text-gray-400 text-center md:text-left">
                        Página: 1 de 1 | Registros del 1 al {users.length} | Total{" "}
                        {users.length}
                    </p>
                    <div className="flex flex-wrap md:flex-row justify-center space-x-2 md:space-x-4">
                        <button className="py-2 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Primera</button>
                        <button className="py-2 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Anterior</button>
                        <button className="py-2 px-4 border border-gray-600 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors">1</button>
                        <button className="py-2 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Siguiente</button>
                        <button className="py-2 px-4 border border-gray-600 rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition-colors">Última</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { Users };