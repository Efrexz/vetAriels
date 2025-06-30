import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductsAndServicesContext } from '@context/ProductsAndServicesContext';
import { ActionButtons } from '@components/ui/ActionButtons';
import ArrowDown from '@assets/arrowDown.svg?react';
import MoneyIcon from '@assets/moneyIcon.svg?react';
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
        minStock: '',
        cost: '',
        salePrice: '',
    });

    const [errors, setErrors] = useState({});

    // Validación de los campos
    function validateForm() {
        const newErrors = {};
        //Validamos si todos los campos son válidos
        if (!formData.productName || formData.productName.length < 4) {
            newErrors.productName = 'El nombre del producto debe tener al menos 4 caracteres';
        }
        if (!formData.brand || formData.brand < 2) {
            newErrors.brand = 'El nombre de la marca debe tener al menos 2 caracteres';
        }
        if (!formData.line || formData.line === "Seleccionar línea") {
            newErrors.line = 'Este campo es obligatorio';
        }
        if (!formData.category || formData.category === "Seleccionar categoría") {
            newErrors.category = 'Este campo es obligatorio';
        }
        if (!formData.salePrice || formData.salePrice <= 0) {
            newErrors.salePrice = 'El precio del producto no puede ser menor a 0';
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

    function createProduct() {
        if (!validateForm()) {
            return;
        }
        function generateId() {
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
            provider: formData.provider || 'CENTRO',
            barcode: formData.barcode,
            line: formData.line,
            category: formData.category,
            subcategory: formData.subcategory,
            minStock: Number(formData.minStock),
            availableStock: 0,
            cost: Number(formData.cost),
            salePrice: Number(formData.salePrice),
            registrationDate: currentDate,
            registrationTime: currentTime,
            status: true
        };
        addProduct(newService);
        onClose();
        navigate("/products");
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
            options: ["N.A.", "Litros", "Kilogramos", "Unidades"],
        },
        {
            label: 'Presentación',
            name: 'presentation',
            type: 'select',
            options: ["Unidad", "Caja", "Paquete"],
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
            options: ["CENTRO", "OTRO"],
        },
        {
            label: 'Codigo de barras',
            name: 'barcode',
            type: 'text',
        },
        {
            label: 'Linea *',
            name: 'line',
            type: 'select',
            options: ["Seleccionar línea", "PET SHOP", "OTRA"],
        },
        {
            label: 'Categoría *',
            name: 'category',
            type: 'select',
            options: ["Seleccionar categoría", "ACCESORIOS", "OTRA"],
        },
        {
            label: 'Subcategoría',
            name: 'subcategory',
            type: 'select',
            options: ["Seleccionar subcategoría", "SUB1", "SUB2"],
        },
        {
            label: 'Stock Minimo',
            name: 'minStock',
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
        <div className="fixed inset-0 flex justify-center items-start bg-gray-800 bg-opacity-50 z-50 overflow-y-scroll custom-scrollbar" >
            <div className="bg-white py-4 px-8 rounded-md w-full h-auto max-w-5xl mt-6 mx-4 modal-appear">
                <h2 className="text-xl font-bold text-blue-500 mb-2">Agregar nuevo producto</h2>
                <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-b border-gray-300 pb-6 mb-4">
                    {formFields.map((field, index) => (
                        <div
                            key={index}
                            className={`items-center ${field.fullWidth ? 'col-span-1 sm:col-span-2 lg:col-span-3' : 'col-span-1'}`}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                            {field.type === 'select' ? (
                                <select
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    className={`border border-gray-300 rounded-md p-2 w-full ${errors[field.name] ? 'border-red-500' : 'border-gray-300 hover:border-blue-300 focus:border-blue-300 '} focus:outline-none`}
                                >
                                    {field.options.map((option, i) => (
                                        <option key={i} value={option}>{option}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="rounded-lg overflow-hidden">
                                    <div className="flex w-full">
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
                                            className={`border border-gray-300 ${field.icon ? 'rounded-r-lg' : 'rounded-lg'} py-2 px-4 w-full ${errors[field.name] ? 'border-red-500' : 'border-gray-300 hover:border-blue-300 focus:border-blue-300 '} focus:outline-none`}
                                        />
                                    </div>
                                    {field.infoMessage && (
                                        <p className="text-xs text-gray-500 mt-1">{field.infoMessage}</p>
                                    )}
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
                    onSubmit={createProduct}
                    submitText="CREAR NUEVO PRODUCTO"
                    mode="modal"
                />
            </div>
        </div >
    )
}

export { AddNewProductModal };

AddNewProductModal.propTypes = {
    onClose: PropTypes.func
}