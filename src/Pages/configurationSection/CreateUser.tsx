import { useState, ChangeEvent, } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobal } from '@context/GlobalContext';
import { User, Role } from '@t/user.types';
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
        <main className="w-full mx-auto p-6 bg-white">
            <h2 className="text-3xl font-light text-gray-500 mb-4 pb-4 border-b-2 border-gray-100 flex items-center">
                <RoleUserIcon className="w-7 h-7 mr-2" />
                Crear Usuario
            </h2>
            <section >
                <form className="pt-4 bg-gray-50 p-6 shadow-md rounded-t-md ">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {fields.map((field, index) => (
                            <div key={index} className={`mb-4 ${field.name === 'nombreServicio' ? 'col-span-4' : 'col-span-2'} `}>
                                <label className="block text-gray-500 font-medium mb-2" htmlFor={field.name}>
                                    {field.label}
                                </label>
                                {field.type === "select" ? (
                                    <select
                                        name={field.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none hover:border-blue-300 focus-within:border-blue-300"
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
                                        className={`w-full px-4 py-2 border rounded-md focus:outline-none ${errors[field.name as keyof FormErrors] ? 'border-red-500' : 'border-gray-300 hover:border-blue-300 focus-within:border-blue-300'}`}
                                    />
                                )}
                                {errors[field.name as keyof FormErrors] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[field.name as keyof FormErrors]}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </form>
                <div className='flex flex-col sm:flex-row justify-end items-center gap-4 p-4 border-t border-gray-200 bg-gray-50 shadow-md '>
                    <button
                        className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 flex items-center gap-3 w-full sm:w-auto"
                        onClick={() => navigate(-1)}
                    >
                        <ReturnIcon className="w-5 h-5 text-gray-700" />
                        CANCELAR
                    </button>
                    <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3 w-full sm:w-auto"
                        onClick={createNewUser}
                    >
                        <PlusIcon className="w-5 h-5 text-white" />
                        CREAR NUEVO USUARIO
                    </button>
                </div>
            </section>
        </main>
    );
}

export { CreateUser };