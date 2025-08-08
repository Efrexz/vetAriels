import { useState, ChangeEvent, ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductsAndServices } from '@context/ProductsAndServicesContext';
import { Product } from '@t/inventory.types';
import { ActionButtons } from '@components/ui/ActionButtons';
import { generateUniqueId } from '@utils/idGenerator';
import ArrowDown from '@assets/arrowDown.svg?react';
import MoneyIcon from '@assets/moneyIcon.svg?react';
import PillsIcon from '@assets/pillsIcon.svg?react';

interface AddNewProductModalProps {
    onClose: () => void;
}

interface FormDataState {
    productName: string;
    brand: string;
    unitOfMeasurement: string;
    presentation: string;
    content: string;
    provider: string;
    barcode: string;
    line: string;
    category: string;
    subcategory: string;
    minStock: string;
    cost: string;
    salePrice: string;
}

interface FormFieldConfig {
    label: string;
    name: keyof FormDataState;
    type: 'text' | 'number' | 'select';
    placeholder: string;
    icon?: ComponentType<React.SVGProps<SVGSVGElement>>;
    fullWidth?: boolean;
    options?: string[];
    infoMessage?: string;
}

const formFields: FormFieldConfig[] = [
    {label: 'Nombre del Producto*',name: 'productName',type: 'text',placeholder: 'Ingrese nombre del producto',icon: PillsIcon,fullWidth: true},
    {label: 'Marca*',name: 'brand',type: 'text',placeholder: 'Ingrese marca del producto',icon: PillsIcon },
    {label: 'Unidad de Medida',name: 'unitOfMeasurement',type: 'select',options: ['N.A.', 'Unidad', 'Caja', 'Lote'],placeholder: 'Seleccione unidad de medida',icon: ArrowDown},
    {label: 'Presentación',name: 'presentation',type: 'select',options: ['Unidad', 'Caja', 'Paquete'],placeholder: 'Seleccione presentación',icon: ArrowDown},
    {label: 'Contenido',name: 'content',type: 'text',placeholder: 'Ingrese contenido',icon: ArrowDown},
    {label: 'Proveedor',name: 'provider',type: 'select',options: ['CENTRO', 'OTRO'],placeholder: 'Seleccione proveedor',icon: ArrowDown},
    {label: 'Codigo de barras',name: 'barcode',type: 'text',placeholder: 'Ingrese codigo de barras',icon: ArrowDown},
    {label: 'Linea*',name: 'line',type: 'select',options: ['Seleccionar línea', 'PET SHOP', 'OTRA'],placeholder: 'Seleccione línea',icon: ArrowDown},
    {label: 'Categoría*',name: 'category',type: 'select',options: ['Seleccionar categoría', 'ACCESORIOS', 'OTRA'],placeholder: 'Seleccione categoría',icon: ArrowDown},
    {label: 'Subcategoría',name: 'subcategory',type: 'select',options: ['Seleccionar subcategoría', 'SUB1', 'SUB2'],placeholder: 'Seleccione subcategoría',icon: ArrowDown},
    {label: 'Stock Minimo',name: 'minStock',type: 'number',placeholder: 'Ingrese stock mínimo',icon: ArrowDown, infoMessage: '¿Qué cantidad de este producto deberíamos tener como mínimo para evitar quedarnos sin stock?'},
    {label: 'Costo del servicio (incluido impuestos)',name: 'cost',type: 'number',placeholder: 'Ingrese costo del servicio',icon: MoneyIcon},
    {label: 'Precio del servicio (incluido impuestos)',name: 'salePrice',type: 'number',placeholder: 'Ingrese precio del servicio',icon: MoneyIcon},
];



function AddNewProductModal({ onClose }: AddNewProductModalProps) {
    const navigate = useNavigate();

    const { addProduct } = useProductsAndServices();
    const [formData, setFormData] = useState<FormDataState>({
        productName: '',
        brand: '',
        unitOfMeasurement: 'N.A.',
        presentation: 'Unidad',
        content: '',
        provider: 'CENTRO',
        barcode: '',
        line: 'Seleccionar línea',
        category: 'Seleccionar categoría',
        subcategory: 'Seleccionar subcategoría',
        minStock: '0',
        cost: '0',
        salePrice: '0',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    function handleChange (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>)  {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    // Validación de los campos
    function validateForm() {
        const newErrors: Record<string, string> = {};
        //Validamos si todos los campos son válidos
        if (!formData.productName || formData.productName.length < 4) {
            newErrors.productName = 'El nombre del producto debe tener al menos 4 caracteres';
        }
        if (!formData.brand || formData.brand.length < 2) {
            newErrors.brand = 'El nombre de la marca debe tener al menos 2 caracteres';
        }
        if (!formData.line || formData.line === "Seleccionar línea") {
            newErrors.line = 'Este campo es obligatorio';
        }
        if (!formData.category || formData.category === "Seleccionar categoría") {
            newErrors.category = 'Este campo es obligatorio';
        }
        if (Number(formData.salePrice) <= 0) {
            newErrors.salePrice = 'El precio del producto no puede ser menor a 0';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, el formulario es válido
    }


    function createProduct() {
        if (!validateForm()) {
            return;
        }

        const now = new Date();
        const currentDate = now.toLocaleDateString(); //  "22/05/2023"
        const currentTime = now.toLocaleTimeString(); //  "07:43 PM"

        const newService: Product = {
            systemCode: generateUniqueId(),
            id: generateUniqueId(),
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


    return (
        <div className="fixed inset-0 flex justify-center items-start bg-gray-800 bg-opacity-50 z-50 overflow-y-scroll custom-scrollbar" >
            <div className="bg-white py-4 px-8 rounded-md w-full h-auto max-w-5xl mt-6 mx-4 modal-appear">
                <h2 className="text-xl font-bold text-blue-500 mb-2">Agregar nuevo producto</h2>
                <form onSubmit={createProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-b border-gray-300 pb-6 mb-4">
                    {formFields.map((field) => (
                        <div
                            key={field.name}
                            className={`${field.fullWidth ? 'lg:col-span-3 sm:col-span-2' : 'col-span-1'}`}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                            {field.type === 'select' && field.options  ? (
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
                                            className={`border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors[field.name] ? 'border-red-500' : ''}`}
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
