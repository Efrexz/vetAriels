import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActionButtons } from "@components/ActionButtons";
import { GlobalContext } from '@context/GlobalContext';
import RoleUserIcon from '@assets/roleUserIcon.svg?react';

function CreateRol() {
    const { addRole, roles } = useContext(GlobalContext);
    const fields = [
        { label: "Nombre", name: "name", type: "text" },
        { label: "Acceso a cuadre de caja", name: "access", type: "select", options: ["SI", "NO"] },
    ];

    const [formData, setFormData] = useState({
        name: "",
        access: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    function addNewRole() {
        addRole(formData);
        console.log(roles);
        console.log("hola");

    }

    const navigate = useNavigate();

    return (
        <main className="w-full mx-auto p-6 bg-white">
            <h2 className="text-xl sm:text-3xl font-light text-gray-500 mb-4 pb-4 border-b-2 border-gray-100 flex items-center">
                <RoleUserIcon className="w-6 sm:w-9 h-6 sm:h-9 mr-2" />
                Crear Rol
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
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-md hover:border-blue-300 focus-within:border-blue-300 outline-none"
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
                                        className="w-full px-4 py-2 border rounded-md hover:border-blue-300 focus-within:border-blue-300 outline-none"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </form>
                <ActionButtons
                    onCancel={() => navigate(-1)}
                    onConfirm={() => addNewRole()}
                    submitText="CREAR NUEVO ROL"
                />
            </section>
        </main>
    );
}

export { CreateRol };