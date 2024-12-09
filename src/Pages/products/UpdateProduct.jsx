import { useState } from "react";
import PillsIcon from "@assets/pillsIcon.svg?react";
import ArrowDown from "@assets/arrowDown.svg?react";
import ArrowUp from "@assets/arrowUp.svg?react";
import BarCodeIcon from "@assets/barCodeIcon.svg?react";
import PropTypes from "prop-types";

function UpdateProduct({ productData }) {
    const fields = [
        { label: "Nombre del Producto *", name: "productName", type: "text", icon: PillsIcon, columsNumber: 4 },
        { label: "Marca", name: "brand", type: "text", icon: PillsIcon, columsNumber: 1 },
        { label: "Código de Sistema", name: "systemCode", type: "text", icon: BarCodeIcon, disabled: true, columsNumber: 1 },
        { label: "Presentación", name: "presentation", type: "select", options: ["Unidad", "Caja", "Paquete"], columsNumber: 2 },
        { label: "Contenido", name: "content", type: "text", columsNumber: 1 },
        { label: "Unidad de Medida", name: "unitOfMeasure", type: "select", options: ["N.A.", "Litros", "Kilogramos", "Unidades"], columsNumber: 1 },
        { label: "Proveedor", name: "supplier", type: "select", options: ["CENTRO", "OTRO"], columsNumber: 2 },
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
        unitOfMeasure: productData?.unitOfMeasure || '',
        presentation: productData?.presentation || '',
        content: productData?.content || '',
        supplier: productData?.supplier || '',
        line: productData?.line || '',
        category: productData?.category || '',
        subcategory: productData?.subcategory || '',
        stockMinimum: productData?.stockMinimum || '',
        cost: productData?.cost || '',
        salePrice: productData?.salePrice || '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
    };

    return (
        <form onSubmit={handleSubmit} className="pt-4 bg-gray-50 p-6 shadow-md rounded-t-md ">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
                {fields.map((field, index) => (
                    <div key={index} className={`mb-4 col-span-${field.columsNumber} `}>
                        <label className="block text-gray-500 font-medium mb-2" htmlFor={field.name}>
                            {field.label}
                        </label>
                        <div className="flex w-full border-gray-200 border rounded-lg overflow-hidden text-gray-600">
                            {
                                field.icon && (
                                    <div className="flex items-center justify-center bg-gray-100 px-3">
                                        <field.icon className="w-5 h-5 text-gray-600" />
                                    </div>
                                )
                            }
                            {field.type === "text" || field.type === "number" ? (
                                <input
                                    type="text"
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    disabled={field.disabled}
                                    className="w-full px-4 py-2 border rounded-md hover:border-blue-300 focus-within:border-blue-300 focus:outline-none"
                                />
                            ) : (
                                <select
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md hover:border-blue-300 focus-within:border-blue-300"
                                >
                                    {field?.options?.map((option, i) => (
                                        <option key={i} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        {
                            field.tooltip && (
                                <p className="text-xs text-gray-500 mt-1">{field.tooltip}</p>
                            )
                        }
                    </div>
                ))}
            </div>
        </form>
    );
}

export { UpdateProduct };

UpdateProduct.propTypes = {
    productData: PropTypes.object
}