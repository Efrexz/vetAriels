import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductsAndServicesContext } from "@context/ProductsAndServicesContext";
import { SuccessModal } from "@components/SuccessModal";
import { ErrorModal } from "@components/ErrorModal";
import { ActionButtons } from "@components/ActionButtons";
import PropTypes from "prop-types";

function UpdateService({ serviceData }) {
    const { updateServiceData } = useContext(ProductsAndServicesContext);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();


    const fields = [
        { label: "Nombre del servicio", name: "serviceName", type: "text" },
        { label: "Línea", name: "line", type: "select", options: ['Seleccione', 'Línea 1', 'Línea 2', 'Línea 3'] },
        { label: "Categoría", name: "category", type: "select", options: ['Seleccione', 'Categoría 1', 'Categoría 2', 'Categoría 3'] },
        { label: "Disponible para Ventas", name: "availableForSale", type: "select", options: ["SI", "NO"] },
        { label: "Estado", name: "status", type: "select", options: ["ACTIVO", "INACTIVO"] },
    ];

    const [formData, setFormData] = useState({
        serviceName: serviceData?.serviceName || "",
        line: serviceData?.line || "Seleccione",
        category: serviceData?.category || "Seleccione",
        availableForSale: serviceData?.availableForSale ? "SI" : "NO",
        status: serviceData?.status ? "ACTIVO" : "INACTIVO",
    });

    // Validación de los campos
    function validateForm() {
        const newErrors = {};
        //Validamos si todos los campos son válidos
        if (!formData.serviceName || formData.serviceName.length < 4) {
            newErrors.serviceName = 'El nombre del servicio debe tener al menos 4 caracteres';
        }
        if (!formData.line || formData.line === "Seleccione") {
            newErrors.line = 'Este campo es obligatorio';
        }
        if (!formData.category || formData.category === "Seleccione") {
            newErrors.category = 'Este campo es obligatorio';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, el formulario es válido
    }

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    function updateService() {
        if (!validateForm()) {
            setIsErrorModalOpen(true);
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
        setIsSuccessModalOpen(true);
        updateServiceData(serviceData.id, updatedServiceData);
    }

    return (
        <form className="pt-4 bg-gray-50 p-6 shadow-md rounded-t-md ">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {fields.map((field, index) => (
                    <div
                        key={index}
                        className={`mb-4 ${field.name === 'serviceName'
                                ? 'col-span-1 sm:col-span-2 md:col-span-4'
                                : 'col-span-1 sm:col-span-1 md:col-span-2'
                            }`}
                    >
                        <label className="block text-gray-500 font-medium mb-2" htmlFor={field.name}>
                            {field.label}
                        </label>
                        {field.type === 'text' ? (
                            <input
                                type="text"
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none ${errors[field.name]
                                        ? 'border-red-500'
                                        : 'border-gray-200 hover:border-blue-300 focus:border-blue-300'
                                    }`}
                            />
                        ) : (
                            <select
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none ${errors[field.name]
                                        ? 'border-red-500'
                                        : 'border-gray-200 hover:border-blue-300 focus:border-blue-300'
                                    }`}
                            >
                                {field?.options?.map((option, i) => (
                                    <option key={i} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        )}
                        {errors[field.name] && (
                            <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                        )}
                    </div>
                ))}
                {isSuccessModalOpen && <SuccessModal onClose={() => setIsSuccessModalOpen(false)} />}
            </div>

            <ActionButtons
                onCancel={() => navigate("/services")}
                onSubmit={updateService}
                submitText="ACTUALIZAR SERVICIO"
                cancelText="REGRESAR"
                mode="modal"
            />
            {
                isErrorModalOpen && (
                    <ErrorModal onClose={() => setIsErrorModalOpen(false)} typeOfError="form" />
                )
            }
        </form>
    );
}

export { UpdateService };

UpdateService.propTypes = {
    serviceData: PropTypes.object
}