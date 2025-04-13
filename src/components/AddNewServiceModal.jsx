import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductsAndServicesContext } from '@context/ProductsAndServicesContext';
import { ActionButtons } from '@components/ActionButtons';
import MoneyIcon from '@assets/moneyIcon.svg?react';
import ReturnIcon from '@assets/returnIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import PillsIcon from '@assets/pillsIcon.svg?react';
import PropTypes from "prop-types";


function AddNewServiceModal({ onClose }) {
    const navigate = useNavigate();

    const { addNewService } = useContext(ProductsAndServicesContext);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        serviceName: '',
        line: '',
        category: '',
        cost: 0,
        price: 0,
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
        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'El precio del servicio no puede ser menor a 0';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, el formulario es válido
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    function createService() {
        if (!validateForm()) {
            return;
        }
        const now = new Date();
        const currentDate = now.toLocaleDateString(); //  "22/05/2023"
        const currentTime = now.toLocaleTimeString(); //  "07:43 PM"

        const newService = {
            serviceName: formData.serviceName,
            line: formData.line,
            category: formData.category,
            cost: Number(formData.cost),
            salePrice: Number(formData.price),
            registrationDate: currentDate,
            registrationTime: currentTime,
            status: true,
            availableForSale: true,
        };
        addNewService(newService);
        onClose();
        navigate(`/services`);
    }

    const formFields = [
        {
            label: 'Nombre del servicio',
            name: 'serviceName',
            type: 'text',
            placeholder: 'Ingrese nombre del servicio',
            icon: PillsIcon,
            fullWidth: true,  // Para que ocupe toda la fila
        },
        {
            label: 'Línea *',
            name: 'line',
            type: 'select',
            options: ['Seleccione', 'Línea 1', 'Línea 2', 'Línea 3'],
        },
        {
            label: 'Categoría *',
            name: 'category',
            type: 'select',
            options: ['Seleccione', 'Categoría 1', 'Categoría 2', 'Categoría 3'],
        },
        {
            label: 'Costo del servicio (incluido impuestos)',
            name: 'cost',
            type: 'number',
            icon: MoneyIcon,
            smallWidth: true,
        },
        {
            label: 'Precio del servicio (incluido impuestos)',
            name: 'price',
            type: 'number',
            icon: MoneyIcon,
            smallWidth: true,
        },
    ];

    return (
        <div className="fixed inset-0 flex justify-center items-start bg-gray-800 bg-opacity-50 z-50 overflow-y-scroll custom-scrollbar">
            <div className="bg-white p-8 rounded-md w-full h-auto max-w-5xl mt-8 mx-4  modal-appear">
                <h2 className="text-xl font-bold text-blue-500 mb-4">Agregar nuevo servicio</h2>
                <form className="grid  gird-cols-1 sm:grid-cols-4 gap-4 border-b border-gray-300 pb-6 mb-4">
                    {formFields.map((field, index) => (
                        <div
                            key={index}
                            className={`${field.fullWidth ? 'sm:col-span-4' : field.smallWidth ? 'sm:col-span-1' : 'sm:col-span-2'}`}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                            {field.type === 'select' ? (
                                <select
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    className={`border border-gray-300 rounded-md p-2 w-full ${errors[field.name] ? 'border-red-500' : 'border-gray-200 hover:border-blue-300 focus-within:border-blue-300 focus:outline-none'}`}
                                >
                                    {field.options.map((option, i) => (
                                        <option key={i} value={option}>{option}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="flex w-full rounded-lg overflow-hidden ">
                                    {field.icon && (
                                        <div className="flex items-center justify-center bg-gray-100 px-3">
                                            <field.icon className="w-5 h-5 text-gray-600" />
                                        </div>
                                    )}
                                    <input
                                        name={field.name}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className={`border border-gray-300 rounded-r-lg py-2 px-4 w-full ${errors[field.name] ? 'border-red-500' : 'border-gray-200 hover:border-blue-300 focus-within:border-blue-300 focus:outline-none'}`}
                                    />
                                </div>
                            )}
                            {errors[field.name] && (
                                <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
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
        </div >
    )
}

export { AddNewServiceModal };

AddNewServiceModal.propTypes = {
    onClose: PropTypes.func
}