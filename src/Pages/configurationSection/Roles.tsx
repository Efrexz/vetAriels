import { useNavigate } from 'react-router-dom';
import { useGlobal } from '@context/GlobalContext';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import KeyIcon from '@assets/keyIcon.svg?react';
import EditIcon from '@assets/editIcon.svg?react';

function Roles() {

    const { roles, removeRole } = useGlobal();
    const navigate = useNavigate();

    return (
        <section className="w-full p-6 bg-gray-950 text-gray-200">
            <h1 className="text-xl sm:text-3xl font-medium mb-4 pb-4 border-b border-cyan-500 flex items-center">
                <RoleUserIcon className="w-6 sm:w-9 h-6 sm:h-9 mr-2 text-cyan-500" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">Roles</span>
            </h1>
            <div className="bg-gray-900 rounded-lg shadow-xl p-3 mb-6">
                <div className="overflow-x-auto border border-cyan-500/30 rounded-lg">
                    <button
                        className="border border-gray-700 text-white bg-emerald-600 py-2 px-4 rounded-lg hover:bg-emerald-700 flex items-center gap-2 m-3 transition-colors"
                        onClick={() => navigate("/config/roles/create")}
                    >
                        <PlusIcon className="w-5 h-5" />
                        CREAR NUEVO ROL
                    </button>
                    <div className="overflow-x-auto">
                        <table className="w-full bg-gray-900">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 border-b border-r border-gray-700">Nombre</th>
                                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-300 border-b border-r border-gray-700">Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map((role) => (
                                    <tr key={role.id} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-300 border-r border-gray-700">{role.name}</td>
                                        <td className="py-3 text-sm font-medium border-r border-gray-700 text-center">
                                            <button
                                                className="text-amber-500 hover:text-amber-400 mx-2 transition-colors"
                                                onClick={() => navigate(`/config/role/permissions/${role.name}`)}
                                            >
                                                <KeyIcon className="w-4 h-4" />
                                            </button>
                                            <button className="text-cyan-500 hover:text-cyan-600 mx-2 transition-colors">
                                                <EditIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="text-rose-500 hover:text-rose-600 mx-2 transition-colors"
                                                onClick={() => removeRole(role.id)}
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 p-4 bg-cyan-900 text-cyan-200 rounded-lg m-3">
                        <p>
                            Los roles equivalen a los puestos de trabajo dentro de la clínica. Cada usuario del sistema debe asumir un rol. Cada rol debe tener permisos de acceso a las diferentes áreas del sistema. Por ejemplo: si creamos un usuario llamado Pedro Cavas y le asignamos el rol de "recepcionista", los permisos de Pedro dependerán del rol recepcionista. Otro usuario llamado Juan también podría asumir el rol de recepcionista y tendría los mismos permisos que Pedro.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { Roles };