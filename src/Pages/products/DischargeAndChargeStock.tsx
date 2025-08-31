import { useState, ChangeEvent } from "react";
import { useNavigate } from 'react-router-dom';
import { useGlobal } from "@context/GlobalContext";
import { useProductsAndServices } from "@context/ProductsAndServicesContext";
import { Product, Service, PurchasedItem, InventoryOperation } from "@t/inventory.types";
import { User } from "@t/user.types";
import { QuantityCounter } from '@components/ui/QuantityCounter';
import { ProductSearchInput } from '@components/search/ProductSearchInput';
import { QuantityModificationModal } from '@components/modals/QuantityModificationModal';
import { ErrorModal } from '@components/modals/ErrorModal';
import { generateUniqueId } from '@utils/idGenerator';
import { ActionButtons } from '@components/ui/ActionButtons';
import DocumentOutIcon from '@assets/documentOutIcon.svg?react';
import DocumentJoinIcon from '@assets/documentJoinIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';

type OperationMode = 'discharge' | 'restock';

interface DischargeAndChargeStockProps {
    typeOfOperation: OperationMode;
}

type FormDataState = {
    requestor: string;
    reason: string;
    store: string;
    operationType: string;
};

type FormErrors = Partial<Record<keyof FormDataState | 'products', string>>;

function DischargeAndChargeStock({ typeOfOperation }: DischargeAndChargeStockProps) {

    const { addDischarge, addRestock } = useProductsAndServices();
    const { users, activeUser } = useGlobal();
    const navigate = useNavigate();


    const [selectedProducts, setSelectedProducts] = useState<PurchasedItem[]>([]);
    const [isQuantityModalOpen, setIsQuantityModalOpen] = useState<boolean>(false);
    const [productToEdit, setProductToEdit] = useState<PurchasedItem | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isOpenErrorModal, setIsOpenErrorModal] = useState<boolean>(false);

    // obtenemos los nombres de los usuarios registrados
    const userOptions = users.map((user: User) => `${user.name} ${user.lastName}`);

    const [formData, setFormData] = useState<FormDataState>({
        requestor: userOptions[0] || "",
        reason: "",
        store: "ALMACEN CENTRAL",
        operationType: "Seleccione",
    });

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value
        }));
    }

    //agregar productos a la tabla para descargar o cargar
    function addProductToTable(item: Product | Service) {
        const newProduct: PurchasedItem = {
            ...item,
            provisionalId: generateUniqueId(),
            quantity: 1,// por defecto siempre sera un producto al agregarlo a la lista
            additionDate: new Date().toLocaleDateString(),
            additionTime: new Date().toLocaleTimeString(),
        };
        setSelectedProducts(prev => [...prev, newProduct]);
    }

    //funcion para actualizar cantidad de productos en la lista de forma individual
    function updateProductQuantity(provisionalId: string, newQuantity: number) {
        const updatedProducts = selectedProducts.map((product) =>
            product.provisionalId === provisionalId
                ? { ...product, quantity: newQuantity }
                : product
        );
        setSelectedProducts(updatedProducts);
    }

    function removeProduct(provisionalId: string) {
        setSelectedProducts(prev => prev.filter(p => p.provisionalId !== provisionalId));
    }

    //Validación de los campos
    function validateForm() {
        const newErrors: FormErrors = {};

        // Validamos si todos los campos son válidos
        if (formData.reason.trim().length < 4) {
            newErrors.reason = 'El motivo debe tener al menos 4 letras.';
        }
        if (!formData.operationType || formData.operationType === 'Seleccione') {
            newErrors.operationType = 'Debe seleccionar un tipo de operación válido.';
        }
        if (selectedProducts.length === 0) {
            newErrors.products = 'Debe seleccionar al menos un producto.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Si no hay errores, el formulario es válido
    }

    function submitOrder() {
        if (!validateForm()) {
            setIsOpenErrorModal(true);
            return; // detener el envío si hay errores
        }

        const now = new Date();
        const newOrder = {
            id: generateUniqueId(),
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString(),
            reason: formData.reason.trim(),
            responsible: formData.requestor,
            registeredBy: `${activeUser?.name} ${activeUser?.lastName}` || "Usuario Desconocido",
            operationType: formData.operationType,
            store: formData.store,
            products: selectedProducts,
        };

        if (selectedProducts.length > 0) {
            if (typeOfOperation === 'discharge') {
                addDischarge(newOrder);
                navigate(`/discharges`);
            } else if (typeOfOperation === 'restock') {
                addRestock(newOrder);
                navigate(`/charges`);
            }
        }
    }

    const formFields = [
        {
            label: 'Responsable / Solicitante',
            id: 'requestor',
            type: 'select',
            options: userOptions,
            required: true
        },
        {
            label: 'Motivo',
            id: 'reason',
            type: 'text',
            required: true
        },
        {
            label: 'Almacén desde donde se descargarán los productos',
            id: 'store',
            type: 'select',
            options: ['ALMACEN CENTRAL', 'VET ARIEL'],
            required: true
        },
        {
            label: 'Tipo de Operación',
            id: 'operationType',
            type: 'select',
            options: ['Seleccione', 'Ajuste por diferencia de inventario', 'Devolución de productos', 'Donación '],
            required: true
        },
    ]

    const tableHeaders = ["Código de Barras", "Producto", "Precio Unitario de Compra", "Precio Unitario de Venta", `Cantidad a ${typeOfOperation === 'discharge' ? 'Descargar' : 'Cargar'}`, "Opciones"];

    return (
        <section className="container mx-auto p-6 border-b-2 border-gray-100">
            <header className="flex items-center mb-6 border-b-2 border-gray-100 pb-4">
                <h1 className={`text-xl md:text-3xl font-medium flex items-center ${typeOfOperation === 'discharge' ? 'text-red-500' : 'text-green-500'}`}>
                    {typeOfOperation === 'discharge' ? <DocumentOutIcon className="w-6 sm:w-9 h-6 sm:h-9 mr-2" /> : <DocumentJoinIcon className="w-6 sm:w-9 h-6 sm:h-9 mr-2" />}
                    {typeOfOperation === 'discharge' ? 'Descargar Stock' : 'Cargar Stock'}
                </h1>
            </header>

            <div className="gap-4 mb-6 bg-gray-50 p-4 rounded-md ">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formFields.map((field, index) => (
                        <div key={index}>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor={field.id}>{field.label}</label>
                            <div className={`flex w-full  border rounded-lg overflow-hidden hover:border-blue-300 focus-within:border-blue-300 ${errors[field.id as keyof FormErrors] ? 'border-red-500' : 'border-gray-200'}`}>
                                {field.type === 'select' ? (
                                    <select
                                        id={field.id}
                                        className="w-full px-3 py-2 border-none focus:outline-none focus:ring-0"
                                        onChange={handleChange}
                                    >
                                        {field.options?.map((option, i) => (
                                            <option key={i} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        id={field.id}
                                        value={formData[field.id as keyof FormDataState]}
                                        onChange={handleChange}
                                        className="w-full py-2 px-4 focus:outline-none focus:ring-0 focus:border-transparent"
                                    />
                                )}
                            </div>
                            {errors[field.id as keyof FormErrors] && (
                                <p className="text-red-500 text-sm mt-1">{errors[field.id as keyof FormErrors]}</p>
                            )}
                        </div>
                    ))}
                </form>
            </div>

            {isOpenErrorModal && <ErrorModal onClose={() => setIsOpenErrorModal(false)} typeOfError="form" />}

            <div className="mb-6 bg-gray-50 p-4 rounded-md">
                <div className='w-full flex flex-col justify-center mb-4'>
                    <label
                        htmlFor="search"
                        className="block text-gray-700 mb-2 pl-2">
                        Buscar y agregar productos a la lista:
                    </label>
                    <ProductSearchInput addProductToTable={addProductToTable} mode={typeOfOperation} stockMode={true} />
                    {errors.products && <p className="text-red-500 text-sm mt-1">{errors.products}</p>}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                {
                                    tableHeaders.map((header) => (
                                        <th key={header} className="px-6 py-3 border text-center text-sm font-medium text-gray-700">
                                            {header}
                                        </th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                selectedProducts.map((product) => (
                                    <tr key={product.provisionalId} className="hover:bg-gray-100">
                                        <td className="px-6 py-4 whitespace-nowrap border text-center text-sm text-gray-900">{product.systemCode?.slice(0, 8).toUpperCase()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap border text-center text-sm text-gray-900">{product.productName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap border text-center text-sm text-gray-900">{product.salePrice}</td>
                                        <td className="px-6 py-4 whitespace-nowrap border text-center text-sm text-gray-900">{product.salePrice}</td>
                                        <td className="px-6 py-4 whitespace-nowrap border text-center text-sm text-gray-900">
                                            {<QuantityCounter
                                                itemCount={product.quantity}
                                                changeQuantity={(newQuantity) => {
                                                    updateProductQuantity(product.provisionalId, newQuantity)
                                                }}
                                                maxQuantity={product.availableStock}
                                                mode={typeOfOperation}
                                                openQuantityModal={() => {
                                                    setIsQuantityModalOpen(true)
                                                    setProductToEdit(product)
                                                }}
                                            />}
                                        </td>
                                        <td className="py-6 px-4 text-center border">
                                            <div className="flex justify-center items-center h-full">
                                                <TrashIcon
                                                    className="w-4 h-4 text-red-500 hover:text-red-600 cursor-pointer"
                                                    onClick={() => {
                                                        removeProduct(product.provisionalId)
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>

                {isQuantityModalOpen && productToEdit && (
                    <QuantityModificationModal
                        quantity={productToEdit.quantity}
                        changeQuantity={(newQuantity) => {
                            updateProductQuantity(productToEdit.provisionalId, newQuantity)
                        }}
                        maxQuantity={productToEdit.availableStock}
                        mode={typeOfOperation}
                        onClose={() => setIsQuantityModalOpen(false)}
                    />
                )
                }

                <ActionButtons
                    onCancel={() => navigate(-1)}
                    onSubmit={submitOrder}
                    submitText="CREAR ORDEN DE SERVICIO"
                />

            </div>

            <div className="mt-6 p-4 bg-blue-100 text-blue-700 rounded-lg">
                <p>
                    Puedes usar esta herramienta para descargar el stock de productos directamente.
                </p>
            </div>
        </section >
    );
}

export { DischargeAndChargeStock };
