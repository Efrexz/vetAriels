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
        <section className="w-full mx-auto p-6 bg-gray-950">
            <h2 className="text-3xl font-medium mb-4 pb-4 border-b-2 border-cyan-500 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
                <RoleUserIcon className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-cyan-400 drop-shadow-lg" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">Crear Usuario</span>
            </h2>
            <div className="bg-gray-900 rounded-lg shadow-xl p-4 mb-6 border border-gray-700">
                <form className="pt-4 bg-gray-900 p-6 shadow-xl rounded-t-lg border border-cyan-500/30">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {fields.map((field, index) => (
                            <div key={index} className={`mb-4 ${field.name === 'nombreServicio' ? 'col-span-4' : 'col-span-2'} `}>
                                <label className="block text-gray-300 font-medium mb-2" htmlFor={field.name}>
                                    {field.label}
                                </label>
                                {field.type === "select" ? (
                                    <select
                                        name={field.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none bg-gray-700 text-gray-200 border-gray-700 hover:border-cyan-500 focus:border-cyan-500"
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
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none bg-gray-700 text-gray-200 ${errors[field.name as keyof FormErrors] ? 'border-rose-500' : 'border-gray-700 hover:border-cyan-500 focus:border-cyan-500'}`}
                                    />
                                )}
                                {errors[field.name as keyof FormErrors] && (
                                    <p className="text-rose-500 text-sm mt-1">{errors[field.name as keyof FormErrors]}</p>
                                )}
                            </div>
                        ))}
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
                        onClick={createNewUser}
                    >
                        <PlusIcon className="w-5 h-5" />
                        CREAR NUEVO USUARIO
                    </button>
                </div>
            </div>
        </section>
    );
}

export { CreateUser };