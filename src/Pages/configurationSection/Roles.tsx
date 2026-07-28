import { useNavigate } from 'react-router-dom';
import { useGlobal } from '@context/GlobalContext';
import PlusIcon from '@assets/plusIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import KeyIcon from '@assets/keyIcon.svg?react';
import EditIcon from '@assets/editIcon.svg?react';

function Roles() {

    const { roles, removeRole } = useGlobal();
    const navigate = useNavigate();

    return (
        <section className="w-full text-ink">
            <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">Configuración</span>
            <h1 className="text-2xl font-bold font-display text-ink">Roles</h1>
            <div className="bg-paper rounded-2xl shadow-sm border border-slate-200 p-3 mb-6 mt-4">
                <div className="overflow-x-auto rounded-lg">
                    <button
                        className="border text-white bg-primary py-1 px-3 rounded-xl hover:opacity-90 font-semibold font-display shadow-sm shadow-primary/25 flex items-center gap-2 m-3 transition-colors"
                        onClick={() => navigate("/config/roles/create")}
                    >
                        <PlusIcon className="w-5 h-5" />
                        Crear nuevo rol
                    </button>
                    <div className="overflow-x-auto">
                        <table className="w-full bg-paper">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-slate">Nombre</th>
                                    <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-slate">Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.map((role) => (
                                    <tr key={role.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3 px-4 text-sm text-slate">{role.name}</td>
                                        <td className="py-3 px-4 text-sm text-center">
                                            <button
                                                className="text-amber-500 hover:text-amber-400 mx-2 transition-colors"
                                                onClick={() => navigate(`/config/role/permissions/${role.name}`)}
                                            >
                                                <KeyIcon className="w-4 h-4" />
                                            </button>
                                            <button className="text-primary hover:opacity-90 mx-2 transition-colors">
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

                    <div className="mt-6 p-4 bg-primary/10 text-primary rounded-lg m-3">
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
