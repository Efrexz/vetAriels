import { useState, ChangeEvent, } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from '@context/GlobalContext';
import { User } from '@t/user.types';
import { generateUniqueId } from '@utils/idGenerator';
import ReturnIcon from "@assets/returnIcon.svg?react";
import PlusIcon from "@assets/plusIcon.svg?react";
import RoleUserIcon from '@assets/roleUserIcon.svg?react';

type FormDataState = Omit<User, 'id' | 'userName' | 'registrationDate' | 'registrationTime' | 'status' | 'active'>;

type FormErrors = Partial<Record<keyof FormDataState, string>>;


function CreateUser() {
    const { addUser, roles } = useGlobal();
    const navigate = useNavigate();

    const roleNames = roles.map((role) => role.name);

    const [formData, setFormData] = useState<FormDataState>({
        email: "",
        password: "",
        name: "",
        lastName: "",
        phone: "",
        rol: roleNames[0] || "",
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validación de los campos
    function validateForm(): boolean {
        const newErrors: FormErrors = {};
        //Validamos si todos los campos son válidos
        if (!formData.name || formData.name.trim().length < 3) {
            newErrors.name = 'El nombre del cliente debe tener al menos 3 caracteres';
        }
        if (!formData.lastName || formData.lastName.trim().length < 3) {
            newErrors.lastName = 'El apellido del cliente debe tener al menos 3 caracteres';
        }
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'El correo electrónico del usuario debe tener al menos 4 caracteres';
        }
        if (!formData.password || formData.password.length < 6) {
            newErrors.password = 'La contraseña del usuario debe tener al menos 6 caracteres';
        }
        if (!/^\d{9}$/.test(formData.phone)) {
            newErrors.phone = 'El número de teléfono del usuario debe tener al menos 9 caracteres';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, el formulario es válido
    }

    function handleChange (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    function createNewUser () {
        if (!validateForm()) {
            return;
        }

        const now = new Date();
        const currentDate = now.toLocaleDateString(); //  "22/05/2023"
        const currentTime = now.toLocaleTimeString(); //  "07:43 PM"

        const newUser: User  = {
            id: generateUniqueId(),
            email: formData.email,
            password: formData.password,
            name: formData.name,
            lastName: formData.lastName,
            userName: `${formData.lastName.toUpperCase()} ${formData.name.toUpperCase()}`,
            phone: formData.phone,
            rol: formData.rol || roleNames[0],
            registrationDate: currentDate,
            registrationTime: currentTime,
            status: "ACTIVO",
        };

        addUser(newUser);
        navigate(`/config/user-subsidiaries`);
    };

    const fields = [
        { label: "Correo Electrónico:", name: "email", type: "email" },
        { label: "Contraseña", name: "password", type: "password" },
        { label: "Nombre", name: "name", type: "text" },
        { label: "Apellido", name: "lastName", type: "text" },
        { label: "Teléfono Móvil", name: "phone", type: "text" },
        { label: "Rol", name: "rol", type: "select", options: roleNames },
    ];

    return (
        <section className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    Configuraci&oacute;n
                </span>
                <h1 className="text-2xl font-bold font-display text-ink">
                    Crear Usuario
                </h1>
            </div>
            <div className="bg-paper rounded-2xl shadow-sm p-5 mb-6 border border-slate-200">
                <form className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {fields.map((field, index) => (
                            <div key={index} className="mb-2">
                                <label className="block text-sm font-medium text-ink mb-1.5" htmlFor={field.name}>
                                    {field.label}
                                </label>
                                {field.type === "select" ? (
                                    <select
                                        name={field.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none bg-white text-ink border-slate-200 hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary/30"
                                    >
                                        {field.options?.map((option, i) => (
                                            <option key={i} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name as keyof Omit<FormDataState, 'rol'>]}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 text-sm border rounded-lg focus:outline-none bg-white text-ink ${errors[field.name as keyof FormErrors] ? 'border-danger' : 'border-slate-200 hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary/30'}`}
                                    />
                                )}
                                {errors[field.name as keyof FormErrors] && (
                                    <p className="text-danger text-xs mt-1">{errors[field.name as keyof FormErrors]}</p>
                                )}
                            </div>
                        ))}
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
                        onClick={createNewUser}
                    >
                        <PlusIcon className="w-4 h-4" />
                        Crear usuario
                    </button>
                </div>
            </div>
        </section>
    );
}

export { CreateUser };