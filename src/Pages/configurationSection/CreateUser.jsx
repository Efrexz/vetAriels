import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";
import ReturnIcon from "../../assets/returnIcon.svg?react";
import PlusIcon from "../../assets/plusIcon.svg?react";
import RoleUserIcon from '../../assets/roleUserIcon.svg?react';

function CreateUser() {
    const { addUser } = useContext(GlobalContext);
    const fields = [
        { label: "Correo Electrónico:", name: "email", type: "email" },
        { label: "Contraseña", name: "password", type: "text" },
        { label: "Nombre", name: "name", type: "text" },
        { label: "Apellido", name: "lastName", type: "text" },
        { label: "Teléfono Móvil", name: "phone", type: "text" },
        { label: "Rol", name: "rol", type: "select", options: ["ADMINISTRADOR", "ASISTENTE ADMINISTRATIVO", "AUXILIAR VETERINARIO", "GROOMER", "MÉDICO", "RECEPCIONISTA"] },
    ];

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        lastName: "",
        phone: "",
        rol: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        console.log(formData);

    };

    const createNewUser = () => {
        const now = new Date();
        const currentDate = now.toLocaleDateString(); //  "22/05/2023"
        const currentTime = now.toLocaleTimeString(); //  "07:43 PM"

        const newUser = {
            id: Date.now(),
            email: formData.email,
            password: formData.password,
            name: formData.name,
            lastName: formData.lastName,
            phone: formData.phone,
            rol: formData.rol || "ADMINISTRADOR",
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
                                        className="w-full px-4 py-2 border rounded-md hover:border-blue-300 focus-within:border-blue-300"
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
                                        className="w-full px-4 py-2 border rounded-md hover:border-blue-300 focus-within:border-blue-300"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </form>
                <div className='flex justify-end items-center gap-4 p-4 border-t border-gray-200 bg-gray-50 shadow-md '>
                    <button
                        className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 flex items-center gap-3"
                        onClick={() => navigate(-1)}
                    >
                        <ReturnIcon className="w-5 h-5 text-gray-700" />
                        CANCELAR
                    </button>
                    <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3"
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