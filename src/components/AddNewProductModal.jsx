import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductsAndServicesContext } from '@context/ProductsAndServicesContext';
import ArrowDown from '@assets/arrowDown.svg?react';
import MoneyIcon from '@assets/moneyIcon.svg?react';
import ReturnIcon from '@assets/returnIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import PillsIcon from '@assets/pillsIcon.svg?react';
import PropTypes from "prop-types";


function AddNewProductModal({ onClose }) {
    const navigate = useNavigate();

    const { addProduct } = useContext(ProductsAndServicesContext);
    const [formData, setFormData] = useState({
        productName: '',
        brand: '',
        unitOfMeasurement: '',
        presentation: '',
        content: '',
        provider: '',
        barcode: '',
        line: '',
        category: '',
        subcategory: '',
        stockMinimum: '',
        cost: '',
        salePrice: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    function createProduct() {
        const generateId = () => {
            const part1 = Date.now().toString(35)
            const part2 = Math.random().toString(36).slice(2)
            return part1 + part2
        }
        const now = new Date();
        const currentDate = now.toLocaleDateString(); //  "22/05/2023"
        const currentTime = now.toLocaleTimeString(); //  "07:43 PM"

        const newService = {
            systemCode: generateId(),
            productName: formData.productName,
            brand: formData.brand,
            unitOfMeasurement: formData.unitOfMeasurement,
            presentation: formData.presentation,
            content: formData.content,
            provider: formData.provider,
            barcode: formData.barcode,
            line: formData.line,
            category: formData.category,
            subcategory: formData.subcategory,
            stockMinimum: formData.stockMinimum,
            availableStock: 0,
            cost: formData.cost,
            salePrice: formData.salePrice,
            registrationDate: currentDate,
            registrationTime: currentTime,
            status: true
        };
        addProduct(newService);
        onClose();
        navigate(`/products`);
    }

    const formFields = [
        {
            label: 'Nombre del Producto*',
            name: 'productName',
            type: 'text',
            placeholder: 'Ingrese nombre del producto',
            icon: PillsIcon,
            fullWidth: true,  // Para que ocupe toda la fila
        },
        {
            label: 'Marca *',
            name: 'brand',
            type: 'text',
            icon: PillsIcon,
            placeholder: 'Ingrese marca del producto',
        },
        {
            label: 'Unidad de Medida *',
            name: 'unitOfMeasurement',
            type: 'select',
            options: ['Seleccione', 'Unidad 1', 'Unidad 2', 'Unidad 3'],
        },
        {
            label: 'Presentación',
            name: 'presentation',
            type: 'select',
            options: ['Seleccione', 'Presentación 1', 'Presentación 2', 'Presentación 3'],
        },
        {
            label: 'Contenido',
            name: 'content',
            type: 'text',
        },
        {
            label: 'Proveedor',
            name: 'provider',
            type: 'select',
            options: ['Seleccione', 'Proveedor 1', 'Proveedor 2', 'Proveedor 3'],
        },
        {
            label: 'Codigo de barras',
            name: 'barcode',
            type: 'text',
        },
        {
            label: 'Linea',
            name: 'line',
            type: 'select',
            options: ['Seleccione', 'Linea 1', 'Linea 2', 'Linea 3'],
        },
        {
            label: 'Categoría *',
            name: 'category',
            type: 'select',
            options: ['Seleccione', 'Categoría 1', 'Categoría 2', 'Categoría 3'],
        },
        {
            label: 'Subcategoría',
            name: 'subcategory',
            type: 'select',
            options: ['Seleccione', 'Subcategoría 1', 'Subcategoría 2', 'Subcategoría 3'],
        },
        {
            label: 'Stock Minimo',
            name: 'stockMinimum',
            type: 'number',
            icon: ArrowDown,
            infoMessage: '¿Qué cantidad de este producto deberíamos tener como mínimo para evitar quedarnos sin stock?',
        },
        {
            label: 'Costo del servicio (incluido impuestos)',
            name: 'cost',
            type: 'number',
            icon: MoneyIcon,
        },
        {
            label: 'Precio del servicio (incluido impuestos)',
            name: 'salePrice',
            type: 'number',
            icon: MoneyIcon,
        },
    ];


    return (
        <div className="fixed inset-0 flex justify-center items-start bg-gray-800 bg-opacity-50">
            <div className="bg-white p-8 rounded-md w-full h-auto max-w-5xl mt-8 modal-appear">
                <h2 className="text-xl font-bold text-blue-500 mb-4">Agregar nuevo producto</h2>
                <form className="grid grid-cols-3 gap-4 border-b border-gray-300 pb-8">
                    {formFields.map((field, index) => (
                        <div
                            key={index}
                            className={`items - center ${field.fullWidth ? 'col-span-3' : 'col-span-1'}`}
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
                                <div className="rounded-lg overflow-hidden">
                                    <div className='flex w-full'>
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
                                            className={`border border-gray-300 ${field.icon ? 'rounded-r-lg' : 'rounded-lg'}
                                            py-2 px-4 w-full hover:border-blue-300 focus:border-blue-300 focus:outline-none`}
                                        />
                                    </div>

                                    {field.infoMessage && (
                                        <p className="text-xs text-gray-500 mt-1">{field.infoMessage}</p>
                                    )}
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
                        onClick={() => createProduct()}
                    >
                        <PlusIcon className="w-5 h-5 text-white" />
                        CREAR NUEVO PRODUCTO
                    </button>
                </div>
            </div>
        </div >
    )
}

export { AddNewProductModal };

AddNewProductModal.propTypes = {
    onClose: PropTypes.func
}