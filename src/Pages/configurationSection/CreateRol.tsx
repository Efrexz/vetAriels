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
        <section className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    Configuraci&oacute;n
                </span>
                <h1 className="text-2xl font-bold font-display text-ink">
                    Crear Rol
                </h1>
            </div>
            <div className="bg-paper rounded-2xl shadow-sm p-5 mb-6 border border-slate-200">
                <form className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <div>
                            <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="name">
                                Nombre
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 text-sm border rounded-lg bg-white text-ink focus:outline-none hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary/30 ${error ? "border-danger" : "border-slate-200"}`}
                            />
                            {error && (
                                <p className="text-danger text-xs mt-1">
                                    El nombre debe tener al menos 4 caracteres
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="access">
                                Acceso a cuadre de caja
                            </label>
                            <select
                                name="access"
                                id="access"
                                value={formData.access}
                                onChange={handleChange}
                                className="w-full px-4 py-2 text-sm border rounded-lg bg-white text-ink border-slate-200 focus:outline-none hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary/30"
                            >
                                <option value="SI">SI</option>
                                <option value="NO">NO</option>
                            </select>
                        </div>
                    </div>
                </form>
                <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4 border-t border-slate-100">
                    <button
                        className="bg-white text-slate border border-slate-200 py-2 px-4 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 w-full sm:w-auto text-sm font-medium"
                        onClick={() => navigate(-1)}
                    >
                        <ReturnIcon className="w-4 h-4 text-slate" />
                        Cancelar
                    </button>
                    <button className="bg-primary text-white py-2 px-5 rounded-xl hover:opacity-90 transition-colors flex items-center gap-2 w-full sm:w-auto text-sm font-semibold font-display shadow-sm shadow-primary/25"
                        onClick={addNewRole}
                    >
                        <PlusIcon className="w-4 h-4" />
                        Crear rol
                    </button>
                </div>
            </div>
        </section>
    );
}

export { CreateRol };