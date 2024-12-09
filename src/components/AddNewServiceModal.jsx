import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductsAndServicesContext } from '@context/ProductsAndServicesContext';
import MoneyIcon from '@assets/moneyIcon.svg?react';
import ReturnIcon from '@assets/returnIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import PillsIcon from '@assets/pillsIcon.svg?react';
import PropTypes from "prop-types";


function AddNewServiceModal({ onClose }) {
    const navigate = useNavigate();

    const { addNewService } = useContext(ProductsAndServicesContext);
    const [formData, setFormData] = useState({
        serviceName: '',
        line: '',
        category: '',
        cost: 0,
        price: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    function createService() {
        const now = new Date();
        const currentDate = now.toLocaleDateString(); //  "22/05/2023"
        const currentTime = now.toLocaleTimeString(); //  "07:43 PM"

        const newService = {
            serviceName: formData.serviceName,
            line: formData.line,
            category: formData.category,
            cost: formData.cost,
            price: formData.price,
            registrationDate: currentDate,
            registrationTime: currentTime,
            status: true,
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
        <div className="fixed inset-0 flex justify-center items-start bg-gray-800 bg-opacity-50">
            <div className="bg-white p-8 rounded-md w-full h-auto max-w-5xl mt-8 modal-appear">
                <h2 className="text-xl font-bold text-blue-500 mb-4">Agregar nuevo servicio</h2>
                <form className="grid grid-cols-4 gap-4 border-b border-gray-300 pb-8">
                    {formFields.map((field, index) => (
                        <div
                            key={index}
                            className={`items - center ${field.fullWidth ? 'col-span-4' : field.smallWidth ? 'col-span-1' : 'col-span-2'}`}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                            {field.type === 'select' ? (
                                <select
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md p-2 w-full hover:border-blue-300 focus-within:border-blue-300 focus:outline-none"
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
                                        className="border border-gray-300 rounded-r-lg py-2 px-4 w-full hover:border-blue-300 focus-within:border-blue-300 focus:outline-none"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </form>

                <div className="flex justify-end mt-6 gap-4">
                    <button
                        className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 flex items-center gap-3"
                        onClick={() => onClose()}
                    >
                        <ReturnIcon className="w-5 h-5 text-gray-700" />
                        CANCELAR
                    </button>
                    <button
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3"
                        onClick={() => createService()}
                    >
                        <PlusIcon className="w-5 h-5 text-white" />
                        CREAR NUEVO SERVICIO
                    </button>
                </div>
            </div>
        </div >
    )
}

export { AddNewServiceModal };

AddNewServiceModal.propTypes = {
    onClose: PropTypes.func
}