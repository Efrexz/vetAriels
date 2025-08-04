import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "@context/GlobalContext";
import { generateUniqueId } from '@utils/idGenerator';
import ReturnIcon from "@assets/returnIcon.svg?react";
import PlusIcon from "@assets/plusIcon.svg?react";
import RoleUserIcon from '@assets/roleUserIcon.svg?react';

function CreateUser() {
    const { addUser, roles } = useContext(GlobalContext);
    const roleNames = roles.map((role) => role.name);

    const fields = [
        { label: "Correo Electrónico:", name: "email", type: "email" },
        { label: "Contraseña", name: "password", type: "password" },
        { label: "Nombre", name: "name", type: "text" },
        { label: "Apellido", name: "lastName", type: "text" },
        { label: "Teléfono Móvil", name: "phone", type: "text" },
        { label: "Rol", name: "rol", type: "select", options: roleNames },
    ];
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        lastName: "",
        phone: "",
        rol: "",
    });

    // Validación de los campos
    function validateForm() {
        const newErrors = {};
        //Validamos si todos los campos son válidos
        if (!formData.name || formData.name.length < 4) {
            newErrors.name = 'El nombre del cliente debe tener al menos 4 caracteres';
        }
        if (!formData.lastName || formData.lastName.length < 4) {
            newErrors.lastName = 'El apellido del cliente debe tener al menos 4 caracteres';
        }
        if (!formData.email || formData.email.length < 4) {
            newErrors.email = 'El correo electrónico del usuario debe tener al menos 4 caracteres';
        }
        if (!formData.password || formData.password.length < 4) {
            newErrors.password = 'La contraseña del usuario debe tener al menos 6 caracteres';
        }
        if (!formData.phone || formData.phone.length < 9) {
            newErrors.phone = 'El número de teléfono del usuario debe tener al menos 9 caracteres';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, el formulario es válido
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const createNewUser = () => {
        if (!validateForm()) {
            return;
        }

        const now = new Date();
        const currentDate = now.toLocaleDateString(); //  "22/05/2023"
        const currentTime = now.toLocaleTimeString(); //  "07:43 PM"

        const newUser = {
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

    const navigate = useNavigate();

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
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2 border rounded-md focus:outline-none ${errors[field.name] ? 'border-red-500' : 'border-gray-300 hover:border-blue-300 focus-within:border-blue-300'}`}
                                    />
                                )}
                                {errors[field.name] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
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