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

    const tableHeaders = ["Código de Barras", "Producto", "Precio de Compra", "Precio de Venta", `Cantidad a ${typeOfOperation === 'discharge' ? 'Descargar' : 'Cargar'}`, "Opciones"];

    return (
        <section className="w-full p-1 md:p-6 bg-gray-950 text-gray-200">
            <header className="flex items-center mb-4 border-b-2 border-cyan-500 pb-4">
                <h1 className="text-xl md:text-2xl font-medium flex items-center">
                    {typeOfOperation === 'discharge' ? <DocumentOutIcon className="w-6 sm:w-9 h-6 sm:h-9 mr-2 text-rose-500" /> : <DocumentJoinIcon className="w-6 sm:w-9 h-6 sm:h-9 mr-2 text-emerald-500" />}
                    <span className={typeOfOperation === 'discharge' ? 'text-rose-500' : 'text-emerald-500'}>
                        {typeOfOperation === 'discharge' ? 'Descargar Stock' : 'Cargar Stock'}
                    </span>
                </h1>
            </header>

            <div className="gap-4 mb-6 bg-gray-900 p-4 rounded-md border border-gray-700 shadow-xl">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formFields.map((field, index) => (
                        <div key={index}>
                            <label className="block text-gray-300 font-medium mb-1" htmlFor={field.id}>{field.label}</label>
                            <div className={`flex w-full border rounded-lg overflow-hidden hover:border-cyan-500 focus-within:border-cyan-500 ${errors[field.id as keyof FormErrors] ? 'border-rose-500' : 'border-gray-600'}`}>
                                {field.type === 'select' ? (
                                    <select
                                        id={field.id}
                                        className="w-full px-3 py-1 bg-gray-700 text-gray-200 border-none focus:outline-none focus:ring-0"
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
                                        className="w-full py-1 px-4 bg-gray-700 text-gray-200 focus:outline-none focus:ring-0 focus:border-transparent"
                                    />
                                )}
                            </div>
                            {errors[field.id as keyof FormErrors] && (
                                <p className="text-rose-500 text-sm mt-1">{errors[field.id as keyof FormErrors]}</p>
                            )}
                        </div>
                    ))}
                </form>
            </div>

            {isOpenErrorModal && <ErrorModal onClose={() => setIsOpenErrorModal(false)} typeOfError="form" />}

            <div className="mb-6 bg-gray-900 p-4 rounded-md border border-gray-700 shadow-xl">
                <div className='w-full flex flex-col justify-center mb-4'>
                    <label
                        htmlFor="search"
                        className="block text-gray-300 mb-2 pl-2">
                        Buscar y agregar productos a la lista:
                    </label>
                    <ProductSearchInput addProductToTable={addProductToTable} mode={typeOfOperation} stockMode={true} />
                    {errors.products && <p className="text-rose-500 text-sm mt-1">{errors.products}</p>}
                </div>

                <div className="overflow-x-auto border border-gray-700 rounded-lg mb-6 mt-6">
                    <table className="min-w-full bg-gray-800 shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-700">
                            <tr>
                                {
                                    tableHeaders.map((header) => (
                                        <th key={header} className="p-1 border border-gray-600 text-center text-sm font-medium text-gray-300">
                                            {header}
                                        </th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                selectedProducts.map((product) => (
                                    <tr key={product.provisionalId} className="hover:bg-gray-700 text-sm">
                                        <td className="px-6 whitespace-nowrap border border-gray-600 text-center text-gray-400">{product.systemCode?.slice(0, 8).toUpperCase()}</td>
                                        <td className="px-6 whitespace-nowrap border border-gray-600 text-left text-gray-400">{product.productName}</td>
                                        <td className="px-6 whitespace-nowrap border border-gray-600 text-center text-gray-400">{product.salePrice}</td>
                                        <td className="px-6 whitespace-nowrap border border-gray-600 text-center text-gray-400">{product.salePrice}</td>
                                        <td className="px-6 whitespace-nowrap border border-gray-600 text-center text-gray-400">
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
                                        <td className="py-3 px-4 text-center border border-gray-600">
                                            <div className="flex justify-center items-center h-full">
                                                <TrashIcon
                                                    className="w-4 h-4 text-rose-500 hover:text-rose-600 cursor-pointer"
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

            <div className="mt-6 p-4 bg-gray-800 text-gray-400 rounded-lg border border-gray-700">
                <p>
                    Puedes usar esta herramienta para descargar el stock de productos directamente.
                </p>
            </div>
        </section >
    );
}

export { DischargeAndChargeStock };
