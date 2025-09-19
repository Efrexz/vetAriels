import { useState, useEffect, ChangeEvent, ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import { useProductsAndServices } from "@context/ProductsAndServicesContext";
import { Product } from "@t/inventory.types";
import { ErrorModal } from "@components/modals/ErrorModal";
import { ActionButtons } from "@components/ui/ActionButtons";
import PillsIcon from "@assets/pillsIcon.svg?react";
import ArrowDown from "@assets/arrowDown.svg?react";
import ArrowUp from "@assets/arrowUp.svg?react";
import BarCodeIcon from "@assets/barCodeIcon.svg?react";

interface UpdateProductProps {
    productData: Product;
}

type FormDataState = {
    productName: string;
    brand: string;
    systemCode: string;
    unitOfMeasurement: string;
    presentation: string;
    content: string;
    provider: string;
    line: string;
    category: string;
    subcategory: string;
    minStock: number | string;
    currentStock: number | undefined;
    status: "ACTIVO" | "INACTIVO";
    maxStock: number | string;
    availableForSales: "SI" | "NO";
    frequency: number | string;
    icbperTax: "SI" | "NO";
};

type FormErrors = Partial<Record<keyof FormDataState, string>>;

function UpdateProduct({ productData }: UpdateProductProps) {
    const { updateProductData } = useProductsAndServices();
        const navigate = useNavigate();

    const [isOpenErrorModal, setIsOpenErrorModal] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormDataState>({
        productName: '', brand: '', systemCode: '', unitOfMeasurement: '', presentation: '',
        content: '', provider: '', line: '', category: '', subcategory: '', minStock: 0,
        currentStock: undefined, status: 'INACTIVO', maxStock: 0, availableForSales: 'NO',
        frequency: 0, icbperTax: 'NO',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (productData) {
            setFormData({
                productName: productData.productName || '',
                brand: productData.brand || '',
                systemCode: productData.systemCode?.slice(0, 9).toUpperCase() || '',
                unitOfMeasurement: productData.unitOfMeasurement || '',
                presentation: productData.presentation || '',
                content: productData.content || '',
                provider: productData.provider || '',
                line: productData.line || '',
                category: productData.category || '',
                subcategory: productData.subcategory || '',
                minStock: productData.minStock || 0,
                currentStock: productData.availableStock,
                status: productData.status ? "ACTIVO" : "INACTIVO",
                maxStock: 0, // Suponiendo que no viene en productData
                availableForSales: "SI", // Suponiendo
                frequency: 0, // Suponiendo
                icbperTax: "NO", // Suponiendo
            });
            setErrors({});
        }
    }, [productData]);

    function handleChange (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>){
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    // Validación de los campos
    function validateForm() {
        const newErrors: FormErrors = {};
        //Validamos si todos los campos son válidos
        if (formData.productName.trim().length < 4) {
            newErrors.productName = 'El nombre del producto debe tener al menos 4 caracteres';
        }
        if (formData.brand.trim().length < 2) {
            newErrors.brand = 'La marca debe tener al menos 2 caracteres';
        }
        if (!formData.line || formData.line === "Seleccionar línea") {
            newErrors.line = 'Este campo es obligatorio';
        }
        if (!formData.category || formData.category === "Seleccionar categoría") {
            newErrors.category = 'Este campo es obligatorio';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, el formulario es válido
    }

    function updateProduct() {
        if (!validateForm()) {
            setIsOpenErrorModal(true);
            return;
        }
        const updatedProductData: Partial<Product> = {
            ...productData,
            productName: formData.productName.trim(),
            brand: formData.brand.trim(),
            unitOfMeasurement: formData.unitOfMeasurement,
            presentation: formData.presentation,
            content: formData.content,
            provider: formData.provider,
            line: formData.line,
            category: formData.category,
            subcategory: formData.subcategory,
            minStock: Number(formData.minStock),
            status: formData.status === "ACTIVO",
        };
        if (productData.systemCode) {
            updateProductData(productData.systemCode, updatedProductData);
            navigate("/products");
        }
    }

    interface Field {
        label: string;
        name: keyof FormDataState;
        type: "text" | "number" | "select";
        icon?: ComponentType<React.SVGProps<SVGSVGElement>>;
        options?: string[];
        disabled?: boolean;
        tooltip?: string;
        columsNumber: number;
    }

    const fields: Field[] = [
        { label: "Nombre del Producto *", name: "productName", type: "text", icon: PillsIcon, columsNumber: 4 },
        { label: "Marca", name: "brand", type: "text", icon: PillsIcon, columsNumber: 1 },
        { label: "Código de Sistema", name: "systemCode", type: "text", icon: BarCodeIcon, disabled: true, columsNumber: 1 },
        { label: "Presentación", name: "presentation", type: "select", options: ["Unidad", "Caja", "Paquete"], columsNumber: 2 },
        { label: "Contenido", name: "content", type: "text", columsNumber: 1 },
        { label: "Unidad de Medida", name: "unitOfMeasurement", type: "select", options: ["N.A.", "Litros", "Kilogramos", "Unidades"], columsNumber: 1 },
        { label: "Proveedor", name: "provider", type: "select", options: ["CENTRO", "OTRO"], columsNumber: 2 },
        { label: "Línea *", name: "line", type: "select", options: ["Seleccionar línea", "PET SHOP", "OTRA"], columsNumber: 2 },
        { label: "Categoría *", name: "category", type: "select", options: ["Seleccionar categoría", "ACCESORIOS", "OTRA"], columsNumber: 2 },
        { label: "Subcategoría", name: "subcategory", type: "select", options: ["Seleccionar subcategoría", "SUB1", "SUB2"], columsNumber: 2 },
        { label: "Stock Actual", name: "currentStock", type: "number", disabled: true, columsNumber: 2 },
        { label: "Stock Mínimo *", name: "minStock", type: "number", tooltip: "¿Qué cantidad de este producto deberíamos tener como mínimo para evitar quedarnos sin stock?", icon: ArrowDown, columsNumber: 2 },
        { label: "Stock Máximo *", name: "maxStock", type: "number", tooltip: "¿Qué cantidad de este producto deberíamos tener como máximo para evitar sobrestock?", icon: ArrowUp, columsNumber: 2 },
        { label: "Disponible para Ventas *", name: "availableForSales", type: "select", options: ["SI", "NO"], columsNumber: 2 },
        { label: "Frecuencia de aplicación o venta (en número de días)", name: "frequency", type: "number", columsNumber: 2 },
        { label: "Estado", name: "status", type: "select", options: ["ACTIVO", "INACTIVO"], columsNumber: 1 },
        { label: "Gravado por ICBPER", name: "icbperTax", type: "select", options: ["SI", "NO"], tooltip: "Es un impuesto que grava la compra o adquisición gratuita de bolsas plásticas", columsNumber: 1 },
    ];


    return (
        <form className="pt-4 bg-gray-900 py-4 px-6 shadow-xl rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                {fields.map((field) => (
                    <div
                        key={field.name}
                        className={`mb-4 col-span-1 sm:col-span-${Math.min(
                            field.columsNumber,
                            2
                        )} md:col-span-${Math.min(
                            field.columsNumber,
                            4
                        )} lg:col-span-${field.columsNumber}`}
                    >
                        <label className="block text-gray-300 font-medium mb-2" htmlFor={field.name}>
                            {field.label}
                        </label>
                        <div className="flex w-full border border-gray-600 rounded-lg overflow-hidden focus-within:border-cyan-500 hover:border-cyan-500 transition-colors">
                            {field.icon && (
                                <div className="flex items-center justify-center bg-gray-700 px-3">
                                    <field.icon className="w-5 h-5 text-gray-400" />
                                </div>
                            )}
                            {field.type === "text" || field.type === "number" ? (
                                <input
                                    type={field.type}
                                    id={field.name}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    disabled={field.disabled}
                                    className={`w-full px-4 py-2 bg-gray-700 text-gray-200 focus:outline-none ${errors[field.name]
                                        ? "border-red-500"
                                        : ""
                                        }`}
                                />
                            ) : (
                                <select
                                    id={field.name}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 bg-gray-700 text-gray-200 focus:outline-none ${errors[field.name]
                                        ? "border-red-500"
                                        : ""
                                        }`}
                                >
                                    {field?.options?.map((option, i) => (
                                        <option key={i} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        {field.tooltip && (
                            <p className="text-xs text-gray-400 mt-1">{field.tooltip}</p>
                        )}
                        {errors[field.name] && (
                            <p className="text-red-500 text-sm mt-1 whitespace-nowrap">{errors[field.name]}</p>
                        )}
                    </div>
                ))}
            </div>
            {
                isOpenErrorModal && <ErrorModal onClose={() => setIsOpenErrorModal(false)} typeOfError="form" />
            }

            <ActionButtons
                onCancel={() => navigate("/products")}
                onSubmit={updateProduct}
                submitText="ACTUALIZAR PRODUCTO"
                cancelText="REGRESAR AL LISTADO"
            />
        </form>
    );
}

export { UpdateProduct };
