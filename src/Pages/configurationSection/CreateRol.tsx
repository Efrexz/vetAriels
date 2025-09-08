import {  useState, ChangeEvent, } from "react";
import { useGlobal } from '@context/GlobalContext';
import { Role } from '@t/user.types';
import { useNavigate } from "react-router-dom";
import { ActionButtons } from "@components/ui/ActionButtons";
import { generateUniqueId } from '@utils/idGenerator';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';

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
        <main className="w-full mx-auto p-6 bg-white">
            <h2 className="text-xl sm:text-3xl font-light text-gray-500 mb-4 pb-4 border-b-2 border-gray-100 flex items-center">
                <RoleUserIcon className="w-6 sm:w-9 h-6 sm:h-9 mr-2" />
                Crear Rol
            </h2>
            <section>
                <form className="pt-4 bg-gray-50 p-6 shadow-md rounded-t-md">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="col-span-2 mb-4">
                            <label className="block text-gray-500 font-medium mb-2" htmlFor="name">
                                Nombre
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-md ${error ? "border-red-500" : "border-gray-300"} hover:border-blue-300 focus-within:border-blue-300 outline-none`}
                            />
                            {error && (
                                <p className="text-red-500 text-sm mt-1">
                                    El nombre debe tener al menos 4 caracteres
                                </p>
                            )}
                        </div>

                        <div className="col-span-2 mb-4">
                            <label className="block text-gray-500 font-medium mb-2" htmlFor="access">
                                Acceso a cuadre de caja
                            </label>
                            <select
                                name="access"
                                id="access"
                                value={formData.access}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md hover:border-blue-300 focus-within:border-blue-300 outline-none"
                            >
                                <option value="SI">SI</option>
                                <option value="NO">NO</option>
                            </select>
                        </div>
                    </div>
                </form>
                <ActionButtons
                    onCancel={() => navigate(-1)}
                    onSubmit={addNewRole}
                    submitText="CREAR NUEVO ROL"
                />
            </section>
        </main>
    );
}

export { CreateRol };