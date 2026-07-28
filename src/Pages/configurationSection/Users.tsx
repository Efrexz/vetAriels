import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '@context/GlobalContext';
import { User } from '@t/user.types';
import { ConfirmActionModal } from '@components/modals/ConfirmActionModal';
import TrashIcon from '@assets/trashIcon.svg?react';
import RefreshIcon from '@assets/refreshIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import KeyIcon from '@assets/keyIcon.svg?react';


const tableHeaders = ["Fecha de creación", "Nombre y Apellidos", "Correo", "Rol", "Estado", "Opciones"];

function Users() {
    const { users } = useGlobal();
    const navigate = useNavigate();
    const [isConfirmActionModalOpen, setIsConfirmActionModalOpen] = useState<boolean>(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    return (
        <section className="w-full text-ink">
            <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">Configuración</span>
            <h1 className="text-2xl font-bold font-display text-ink">Usuarios</h1>
            <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 mt-4">
                <div className="overflow-x-auto rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <button
                            className="flex items-center gap-2 py-1 px-3 text-white bg-primary rounded-xl hover:opacity-90 font-semibold font-display shadow-sm shadow-primary/25 transition-colors"
                            onClick={() => navigate("/config/user-subsidiaries/create")}
                        >
                            <PlusIcon className="w-5 h-5" />
                            Agregar usuario
                        </button>
                        <button
                            className="flex items-center gap-2 py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-primary hover:bg-slate-50 font-medium transition-colors"
                            onClick={() => window.location.reload()}
                        >
                            <RefreshIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <table className="min-w-full bg-white">
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
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 px-4 text-center text-sm text-slate">
                                        {user?.registrationDate} {user?.registrationTime}
                                    </td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">
                                        {user?.name} {user?.lastName}
                                    </td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">{user?.email}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">{user?.rol}</td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">
                                        <span
                                            className={`inline-block py-0.5 px-4 rounded-full ${user?.status === "ACTIVO" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}
                                        >
                                            {user?.status === "ACTIVO" ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center text-sm text-slate">
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
                    <p className="text-slate text-center md:text-left text-sm">
                        Página: 1 de 1 | Registros del 1 al {users.length} | Total{" "}
                        {users.length}
                    </p>
                    <div className="flex flex-wrap md:flex-row justify-center space-x-2 md:space-x-4">
                        <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate hover:bg-slate-50 font-medium">Primera</button>
                        <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate hover:bg-slate-50 font-medium">Anterior</button>
                        <button className="py-1.5 px-3 bg-primary text-white rounded-lg text-sm font-medium">1</button>
                        <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate hover:bg-slate-50 font-medium">Siguiente</button>
                        <button className="py-1.5 px-3 border border-slate-200 rounded-lg text-sm text-slate hover:bg-slate-50 font-medium">Última</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { Users };
