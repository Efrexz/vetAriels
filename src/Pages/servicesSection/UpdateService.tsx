import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useProductsAndServices } from "@context/ProductsAndServicesContext";
import { Service } from "@t/inventory.types";
import { SuccessModal } from "@components/modals/SuccessModal";
import { ErrorModal } from "@components/modals/ErrorModal";
import { ActionButtons } from "@components/ui/ActionButtons";

interface UpdateServiceProps {
    serviceData: Service;
}

interface FormDataState {
    serviceName: string;
    line: string;
    category: string;
    availableForSale: "SI" | "NO";
    status: "ACTIVO" | "INACTIVO";
};

type FormErrors = Partial<Record<keyof FormDataState, string>>;


function UpdateService({ serviceData }: UpdateServiceProps) {
    const { updateServiceData } = useProductsAndServices();
    const navigate = useNavigate();

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormDataState>({
        serviceName: "",
        line: "Seleccione",
        category: "Seleccione",
        availableForSale: "NO",
        status: "INACTIVO",
    });
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (serviceData) {
        setFormData({
            serviceName: serviceData.serviceName || "",
            line: serviceData.line || "Seleccione",
            category: serviceData.category || "Seleccione",
            availableForSale: serviceData.availableForSale ? "SI" : "NO",
            status: serviceData.status ? "ACTIVO" : "INACTIVO",
        });
        setErrors({});
        }
    }, [serviceData]);

    // Validación de los campos
    function validateForm() {
        const newErrors: FormErrors = {};
        //Validamos si todos los campos son válidos
        if (formData.serviceName.trim().length < 4) {
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

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    }

    function updateService() {
        if (!validateForm()) {
            setIsErrorModalOpen(true);
            return;
        }
        const updatedServiceData: Partial<Service> = {
            ...serviceData,
            serviceName: formData.serviceName.trim(),
            line: formData.line,
            category: formData.category,
            // Devolvemos un valor booleano dependiendo lo que seleccione
            availableForSale: formData.availableForSale === "SI",
            status: formData.status === "ACTIVO",
        };
        setIsSuccessModalOpen(true);
        updateServiceData(serviceData.id, updatedServiceData);
    }

    const fields = [
        { label: "Nombre del servicio", name: "serviceName", type: "text" },
        { label: "Línea", name: "line", type: "select", options: ['Seleccione', 'Línea 1', 'Línea 2', 'Línea 3'] },
        { label: "Categoría", name: "category", type: "select", options: ['Seleccione', 'Categoría 1', 'Categoría 2', 'Categoría 3'] },
        { label: "Disponible para Ventas", name: "availableForSale", type: "select", options: ["SI", "NO"] },
        { label: "Estado", name: "status", type: "select", options: ["ACTIVO", "INACTIVO"] },
    ];

    return (
        <div className="bg-gray-900 rounded-lg shadow-xl p-4 mb-6 border border-gray-700">
            <form className="pt-4 bg-gray-900 p-6 shadow-xl rounded-lg border border-cyan-500/30">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                    {fields.map((field) => (
                        <div
                            key={field.name}
                            className={`mb-1 ${field.name === 'serviceName'
                                ? 'col-span-1 sm:col-span-2 md:col-span-4'
                                : 'col-span-1 sm:col-span-1 md:col-span-2'
                            }`}
                        >
                            <label className="block text-gray-300 font-medium mb-1" htmlFor={field.name}>
                                {field.label}
                            </label>
                            {field.type === 'text' ? (
                                <input
                                    type="text"
                                    id={field.name}
                                    name={field.name}
                                    value={formData.serviceName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-1 border rounded-md focus:outline-none bg-gray-700 text-gray-200 ${errors.serviceName ? 'border-rose-500' : 'border-gray-700 hover:border-cyan-500 focus:border-cyan-500'}`}
                                />
                            ) : (
                                <select
                                    id={field.name}
                                    name={field.name}
                                    value={formData[field.name as keyof Omit<FormDataState, 'serviceName'>]}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-1 border rounded-md focus:outline-none bg-gray-700 text-gray-200 ${errors[field.name as keyof Omit<FormDataState, 'serviceName'>] ? 'border-rose-500' : 'border-gray-700 hover:border-cyan-500 focus:border-cyan-500'}`}
                                >
                                    {field?.options?.map((option, i) => (
                                        <option key={i} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors[field.name as keyof FormErrors] && (
                                <p className="text-rose-500 text-sm mt-1">{errors[field.name as keyof FormErrors]}</p>
                            )}
                        </div>
                    ))}
                    {isSuccessModalOpen && <SuccessModal onClose={() => setIsSuccessModalOpen(false)} />}
                </div>
                {
                    isErrorModalOpen && (
                        <ErrorModal onClose={() => setIsErrorModalOpen(false)} typeOfError="form" />
                    )
                }
            </form>
            <ActionButtons
                    onCancel={() => navigate("/services")}
                    onSubmit={updateService}
                    submitText="ACTUALIZAR SERVICIO"
                    cancelText="REGRESAR"
                    mode="modal"
                />
        </div>
    );
}

export { UpdateService };

