import { useState } from "react";

function UpdateService() {
    const fields = [
        { label: "Nombre del servicio", name: "nombreServicio", type: "text" },
        { label: "Línea", name: "linea", type: "select", options: ["MEDICA", "OTRO"] },
        { label: "Categoría", name: "categoria", type: "select", options: ["VACUNA", "OTRA"] },
        { label: "Disponible para Ventas", name: "disponibleVentas", type: "select", options: ["SI", "NO"] },
        { label: "Estado", name: "estado", type: "select", options: ["ACTIVO", "INACTIVO"] },
    ];

    const [formData, setFormData] = useState({
        nombreServicio: "",
        linea: "",
        categoria: "",
        subcategoria: "",
        disponibleVentas: "",
        estado: "",
        puntos: "",
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

    return (
        <form onSubmit={handleSubmit} className="pt-4 bg-gray-50 p-6 shadow-md rounded-t-md ">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {fields.map((field, index) => (
                    <div key={index} className={`mb-4 ${field.name === 'nombreServicio' ? 'col-span-4' : 'col-span-2'} `}>
                        <label className="block text-gray-500 font-medium mb-2" htmlFor={field.name}>
                            {field.label}
                        </label>
                        {field.type === "text" ? (
                            <input
                                type="text"
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md hover:border-blue-300 focus-within:border-blue-300"
                            />
                        ) : (
                            <select
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md hover:border-blue-300 focus-within:border-blue-300"
                            >
                                {field.options.map((option, i) => (
                                    <option key={i} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                ))}
            </div>
        </form>
    );
}

export { UpdateService };