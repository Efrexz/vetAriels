import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReturnIcon from "@assets/returnIcon.svg?react";
import PlusIcon from "@assets/plusIcon.svg?react";
import RoleUserIcon from '@assets/roleUserIcon.svg?react';

function CreateRol() {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
    };

    const navigate = useNavigate();

    return (
        <main className="w-full mx-auto p-6 bg-white">
            <h2 className="text-3xl font-light text-gray-500 mb-4 pb-4 border-b-2 border-gray-100 flex items-center">
                <RoleUserIcon className="w-7 h-7 mr-2" />
                Crear Rol
            </h2>
            <section >
                <form onSubmit={handleSubmit} className="pt-4 bg-gray-50 p-6 shadow-md rounded-t-md ">
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
                    // onClick={createNewPet}
                    >
                        <PlusIcon className="w-5 h-5 text-white" />
                        CREAR NUEVO ROL
                    </button>
                </div>
            </section>
        </main>
    );
}

export { CreateRol }; 