import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import KeyIcon from '@assets/keyIcon.svg?react';
import EditIcon from '@assets/editIcon.svg?react';

function Roles() {

    const [roles, setRoles] = useState([
        'Administrador',
        'Asistente Administrativo',
        'Auxiliar Veterinario',
        'Groomer',
        'Médico',
        'Recepcionista',
    ]);

    const navigate = useNavigate();
    return (
        <section className="container mx-auto p-6">
            <h1 className="text-2xl font-ligth text-gray-500 mb-4 pb-4 border-b-2 border-gray-100 flex items-center">
                <RoleUserIcon className="w-6 h-6 mr-2" />
                Roles
            </h1>
            <div className="bg-white rounded-lg shadow p-3 mb-6">
                <div className="overflow-x-auto border border-gray-300 rounded-lg">
                    <button
                        className="border border-gray-300 text-white bg-green-500 py-2 px-4 rounded hover:bg-green-600 flex items-center gap-2 m-3"
                        onClick={() => navigate("/config/roles/create")}
                    >
                        <PlusIcon className="w-5 h-5" />
                        CREAR NUEVO ROL
                    </button>
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white shadow-md overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 border">Nombre</th>
                                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 border ">Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map((role, index) => (
                                    <tr key={index} className="border hover:bg-gray-50">
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-700 border">{role}</td>
                                        <td className="py-3 text-sm font-medium border text-center">
                                            <button
                                                className="text-yellow-500 hover:text-yellow-600 mx-2"
                                                onClick={() => navigate(`/config/role/permissions/${role}`)}
                                            >
                                                <KeyIcon className="w-4 h-4" />
                                            </button>
                                            <button className="text-green-500 hover:text-green-600 mx-2">
                                                <EditIcon className="w-4 h-4" />
                                            </button>
                                            <button className="text-red-500 hover:text-red-600 mx-2">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 p-4 bg-blue-100 text-blue-700 rounded-lg m-3">
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