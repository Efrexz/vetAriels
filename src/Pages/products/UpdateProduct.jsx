import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductsAndServicesContext } from "@context/ProductsAndServicesContext";
import { ErrorModal } from "@components/modals/ErrorModal";
import PillsIcon from "@assets/pillsIcon.svg?react";
import ArrowDown from "@assets/arrowDown.svg?react";
import ArrowUp from "@assets/arrowUp.svg?react";
import BarCodeIcon from "@assets/barCodeIcon.svg?react";
import { ActionButtons } from "@components/ui/ActionButtons";
import PropTypes from "prop-types";

function UpdateProduct({ productData }) {
    const { updateProductData } = useContext(ProductsAndServicesContext);
    const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);
    const fields = [
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

    const [formData, setFormData] = useState({
        productName: productData?.productName || '',
        brand: productData?.brand || '',
        systemCode: productData?.systemCode.slice(0, 9).toUpperCase() || '',
        unitOfMeasurement: productData?.unitOfMeasurement || '',
        presentation: productData?.presentation || '',
        content: productData?.content || '',
        provider: productData?.provider || '',
        line: productData?.line || '',
        category: productData?.category || '',
        subcategory: productData?.subcategory || '',
        minStock: productData?.minStock || '',
        currentStock: productData?.availableStock,
        cost: productData?.cost || '',
        salePrice: productData?.salePrice || '',
        status: productData?.status ? "ACTIVO" : "INACTIVO",
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

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    function updateProduct() {
        if (!validateForm()) {
            setIsOpenErrorModal(true);
            return;
        }
        const updatedProduct = {
            ...productData,
            productName: formData.productName,
            brand: formData.brand,
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
        updateProductData(productData.systemCode, updatedProduct);
        navigate("/products");
    }

    const navigate = useNavigate();

    return (
        <form className="pt-4 bg-gray-50 py-4 px-6 shadow-md rounded-t-md ">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                {fields.map((field, index) => (
                    <div
                        key={index}
                        className={`mb-4 col-span-1 sm:col-span-${Math.min(
                            field.columsNumber,
                            2
                        )} md:col-span-${Math.min(
                            field.columsNumber,
                            4
                        )} lg:col-span-${field.columsNumber}`}
                    >
                        <label className="block text-gray-500 font-medium mb-2" htmlFor={field.name}>
                            {field.label}
                        </label>
                        <div className="flex w-full border-gray-200 border rounded-lg overflow-hidden text-gray-600">
                            {field.icon && (
                                <div className="flex items-center justify-center bg-gray-100 px-3">
                                    <field.icon className="w-5 h-5 text-gray-600" />
                                </div>
                            )}
                            {field.type === "text" || field.type === "number" ? (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    disabled={field.disabled}
                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none ${errors[field.name]
                                        ? "border-red-500"
                                        : "border-gray-200 hover:border-blue-300 focus:border-blue-300"
                                        }`}
                                />
                            ) : (
                                <select
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none ${errors[field.name]
                                        ? "border-red-500"
                                        : "border-gray-200 hover:border-blue-300 focus:border-blue-300"
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
                            <p className="text-xs text-gray-500 mt-1">{field.tooltip}</p>
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

UpdateProduct.propTypes = {
    productData: PropTypes.object
}