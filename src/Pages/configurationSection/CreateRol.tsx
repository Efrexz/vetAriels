import {  useState, ChangeEvent, } from "react";
import { useGlobal } from '@context/GlobalContext';
import { Role } from '@t/user.types';
import { useNavigate } from "react-router-dom";
import { ActionButtons } from "@components/ui/ActionButtons";
import { generateUniqueId } from '@utils/idGenerator';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';
import ReturnIcon from "@assets/returnIcon.svg?react";
import PlusIcon from "@assets/plusIcon.svg?react";

type FormDataState = Omit<Role, 'id'>;

function CreateRol() {
    const { addRole } = useGlobal()
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormDataState>({
        name: "",
        access: "NO",
    });
    const [error, setError] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name as keyof FormDataState]: e.target.value,
        });
    };


    function addNewRole() {
        if (formData.name.trim().length < 4) {
            setError(true);
            return;
        }

        const newRoleWithId = {
            ...formData,
            id: generateUniqueId(),
        };
        addRole(newRoleWithId);
        navigate("/config/roles")
    }

    return (
        <section className="w-full mx-auto p-6 bg-gray-950">
            <h1 className="text-xl sm:text-3xl font-medium mb-4 pb-4 border-b border-cyan-500 flex items-center">
                <RoleUserIcon className="w-6 sm:w-9 h-6 sm:h-9 mr-2 text-cyan-500" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">Crear Rol</span>
            </h1>
            <div className="bg-gray-900 rounded-lg shadow-xl p-3 mb-6">
                <form className="pt-4 bg-gray-900 p-6 shadow-xl rounded-t-lg border border-cyan-500/30 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="col-span-2 mb-4">
                            <label className="block text-gray-400 font-medium mb-2" htmlFor="name">
                                Nombre
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg bg-gray-800 text-gray-200 ${error ? "border-rose-500" : "border-gray-700"} hover:border-cyan-500 focus:border-cyan-500 outline-none`}
                            />
                            {error && (
                                <p className="text-rose-500 text-sm mt-1">
                                    El nombre debe tener al menos 4 caracteres
                                </p>
                            )}
                        </div>

                        <div className="col-span-2 mb-4">
                            <label className="block text-gray-400 font-medium mb-2" htmlFor="access">
                                Acceso a cuadre de caja
                            </label>
                            <select
                                name="access"
                                id="access"
                                value={formData.access}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg bg-gray-800 text-gray-200 border-gray-700 hover:border-cyan-500 focus:border-cyan-500 outline-none"
                            >
                                <option value="SI">SI</option>
                                <option value="NO">NO</option>
                            </select>
                        </div>
                    </div>
                </form>
                <div className='flex flex-col sm:flex-row justify-end items-center gap-4 p-4 border-t border-gray-700 shadow-xl rounded-b-lg'>
                    <button
                        className="bg-gray-700 border border-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-3 w-full sm:w-auto"
                        onClick={() => navigate(-1)}
                    >
                        <ReturnIcon className="w-5 h-5 text-gray-300" />
                        CANCELAR
                    </button>
                    <button className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-3 w-full sm:w-auto"
                        onClick={addNewRole}
                    >
                        <PlusIcon className="w-5 h-5" />
                        CREAR NUEVO USUARIO
                    </button>
                </div>
            </div>
        </section>
    );
}

export { CreateRol };