import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductsAndServicesContext } from "@context/ProductsAndServicesContext";
import { SuccessModal } from "../../components/SuccessModal";
import ReturnIcon from "@assets/returnIcon.svg?react";
import PlusIcon from "@assets/plusIcon.svg?react";
import PropTypes from "prop-types";

function UpdateService({ serviceData }) {
    const { updateServiceData } = useContext(ProductsAndServicesContext);

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [errors, setErrors] = useState(null);

    const navigate = useNavigate();


    const fields = [
        { label: "Nombre del servicio", name: "serviceName", type: "text" },
        { label: "Línea", name: "line", type: "select", options: ['Línea 1', 'Línea 2', 'Línea 3'] },
        { label: "Categoría", name: "category", type: "select", options: ['Categoría 1', 'Categoría 2', 'Categoría 3'] },
        { label: "Disponible para Ventas", name: "availableForSale", type: "select", options: ["SI", "NO"] },
        { label: "Estado", name: "status", type: "select", options: ["ACTIVO", "INACTIVO"] },
    ];

    const [formData, setFormData] = useState({
        serviceName: serviceData?.serviceName || "",
        line: serviceData?.line || "OTRO",
        category: serviceData?.category || "OTRA",
        availableForSale: serviceData?.availableForSale ? "SI" : "NO",
        status: serviceData?.status ? "ACTIVO" : "INACTIVO",
    });

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    function updateService() {
        if (formData.serviceName.length < 4) {
            setErrors("El nombre del servicio debe tener al menos 4 caracteres");
            return;
        }
        const updatedServiceData = {
            ...serviceData,
            serviceName: formData.serviceName,
            line: formData.line,
            category: formData.category,
            // Devolvemos un valor booleano dependiendo lo que seleccione
            availableForSale: formData.availableForSale === "SI",
            status: formData.status === "ACTIVO",
        };
        setErrors(null);
        setIsSuccessModalOpen(true);
        updateServiceData(serviceData.id, updatedServiceData);
    }

    return (
        <form className="pt-4 bg-gray-50 p-6 shadow-md rounded-t-md ">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {fields.map((field, index) => (
                    <div key={index} className={`mb-4 ${field.name === 'nombreServicio' ? 'col-span-4' : 'col-span-2'} `}>
                        <label className="block text-gray-500 font-medium mb-2" htmlFor={field.name}>
                            {field.label}
                        </label>
                        {field.type === "text" ? (
                            <>
                                <input
                                    type="text"
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none ${errors && field.name === "serviceName" ? "border-red-500" : "border-gray-200 hover:border-blue-300 focus-within:border-blue-300"}`}
                                />
                                {errors && field.name === "serviceName" && (
                                    <span className="text-red-500 text-sm">
                                        {errors}
                                    </span>
                                )}
                            </>
                        ) : (
                            <select
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md hover:border-blue-300 focus-within:border-blue-300"
                            >
                                {field?.options?.map((option, i) => (
                                    <option key={i} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                ))}
                {
                    isSuccessModalOpen && (
                        <SuccessModal onClose={() => setIsSuccessModalOpen(false)} />
                    )
                }
            </div>
            <div className='flex justify-end items-center gap-4 pt-4 px-4 border-t border-gray-200 bg-gray-50 '>
                <button
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 flex items-center gap-3"
                    type="button"
                    onClick={() => navigate("/services")}
                >
                    <ReturnIcon className="w-5 h-5 text-gray-700" />
                    REGRESAR
                </button>
                <button
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3"
                    type="button"
                    onClick={() => updateService()}
                >
                    <PlusIcon className="w-5 h-5 text-white" />
                    ACTUALIZAR SERVICIO
                </button>
            </div>
        </form>

    );
}

export { UpdateService };

UpdateService.propTypes = {
    serviceData: PropTypes.object
}