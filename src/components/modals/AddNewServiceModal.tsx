import { useState, ChangeEvent, ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductsAndServices } from '@context/ProductsAndServicesContext';
import { generateUniqueId } from '@utils/idGenerator';
import { Service } from '@t/inventory.types';
import { ActionButtons } from '@components/ui/ActionButtons';
import MoneyIcon from '@assets/moneyIcon.svg?react';
import PillsIcon from '@assets/pillsIcon.svg?react';

interface AddNewServiceModalProps {
    onClose: () => void;
}

interface FormDataState {
    serviceName: string;
    line: string;
    category: string;
    cost: string;
    salePrice: string;
}

interface FormFieldConfig {
    label: string;
    name: keyof FormDataState;
    type: 'text' | 'number' | 'select';
    placeholder?: string;
    options?: string[];
    icon?: ComponentType<React.SVGProps<SVGSVGElement>>;
    fullWidth?: boolean;
    smallWidth?: boolean;
}

const formFields : FormFieldConfig[] = [
    { label: 'Nombre del servicio', name: 'serviceName', type: 'text', placeholder: 'Ingrese nombre del servicio', icon: PillsIcon, fullWidth: true },
    { label: 'Línea *', name: 'line', type: 'select', options: ['Seleccione', 'Línea 1', 'Línea 2', 'Línea 3'] },
    { label: 'Categoría *', name: 'category', type: 'select', options: ['Seleccione', 'Categoría 1', 'Categoría 2', 'Categoría 3'] },
    { label: 'Costo del servicio (incluido impuestos)', name: 'cost', type: 'number', icon: MoneyIcon, smallWidth: true },
    { label: 'Precio del servicio (incluido impuestos)', name: 'salePrice', type: 'number', icon: MoneyIcon, smallWidth: true },
];

function AddNewServiceModal({ onClose }: AddNewServiceModalProps) {
    const navigate = useNavigate();
    const { addNewService } = useProductsAndServices();

    const [formData, setFormData] = useState<FormDataState>({
        serviceName: '',
        line: 'Seleccione',
        category: 'Seleccione',
        cost: "0",
        salePrice: "0",
    });
    console.log(formData);


    const [errors, setErrors] = useState<Record<string, string>>({});

    function handleChange (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Validación de los campos
    function validateForm(): boolean {
        const newErrors: Record<string, string> = {};
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
        if (Number(formData.salePrice) <= 0) {
            newErrors.salePrice = 'El precio del servicio no puede ser menor a 0';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, el formulario es válido
    }


    function createService() {
        if (!validateForm()) {
            return;
        }
        const now = new Date();
        const currentDate = now.toLocaleDateString(); //  "22/05/2023"
        const currentTime = now.toLocaleTimeString(); //  "07:43 PM"

        const newService: Service = {
            id: generateUniqueId(),
            serviceName: formData.serviceName,
            line: formData.line,
            category: formData.category,
            cost: Number(formData.cost),
            salePrice: Number(formData.salePrice),
            registrationDate: currentDate,
            registrationTime: currentTime,
            status: true,
            availableForSale: true,
        };
        addNewService(newService);
        onClose();
        navigate(`/services`);
    }

    return (
        <div className="fixed inset-0 flex justify-center items-start bg-gray-950 bg-opacity-75 z-50 overflow-y-scroll custom-scrollbar">
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 w-full h-auto max-w-5xl mt-8 mx-4 shadow-2xl modal-appear">
                <h2 className="text-xl font-bold text-cyan-500 border-b border-gray-700 pb-2 mb-4">Agregar nuevo servicio</h2>
                <form className="grid gird-cols-1 sm:grid-cols-4 gap-4 border-b border-gray-700 pb-6 mb-4">
                    {formFields.map((field, index) => (
                        <div
                            key={index}
                            className={`${field.fullWidth ? 'sm:col-span-4' : field.smallWidth ? 'sm:col-span-1' : 'sm:col-span-2'}`}
                        >
                            <label className="block text-sm font-medium text-gray-400 mb-2">{field.label}</label>
                            {field.type === 'select' ? (
                                <select
                                    name={field.name}
                                    value={formData[field.name as keyof FormDataState]}
                                    onChange={handleChange}
                                    className={`border rounded-lg p-2 w-full bg-gray-800 text-gray-200 ${errors[field.name] ? 'border-rose-500' : 'border-gray-700 hover:border-cyan-500 focus-within:border-cyan-500 focus:outline-none'}`}
                                >
                                    {field.options?.map((option, i) => (
                                        <option key={i} value={option}>{option}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="flex w-full rounded-lg border border-gray-700 hover:border-cyan-500 focus-within:border-cyan-500">
                                    {field.icon && (
                                        <div className="flex items-center justify-center bg-gray-800 px-3">
                                            <field.icon className="w-5 h-5 text-gray-400" />
                                        </div>
                                    )}
                                    <input
                                        name={field.name}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        value={formData[field.name as keyof FormDataState]}
                                        onChange={handleChange}
                                        className={`py-2 px-4 w-full bg-gray-800 text-gray-200 focus:outline-none focus:ring-0 focus:border-transparent border-l border-gray-600 ${errors[field.name] ? 'border border-rose-500' : ''}`}
                                    />
                                </div>
                            )}
                            {errors[field.name] && (
                                <p className="text-rose-500 text-sm mt-1">{errors[field.name]}</p>
                            )}
                        </div>
                    ))}
                </form>

                <ActionButtons
                    onCancel={onClose}
                    onSubmit={() => createService()}
                    submitText="CREAR NUEVO SERVICIO"
                    mode="modal"
                />
            </div>
        </div>
    )
}

export { AddNewServiceModal };
