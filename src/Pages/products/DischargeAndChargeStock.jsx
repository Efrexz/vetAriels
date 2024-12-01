
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductsAndServicesContext } from '../../context/ProductsAndServicesContext';
import { QuantityCounter } from '../../components/QuantityCounter';
import { ProductSearchInput } from '../../components/ProductSearchInput';
import { QuantityModificationModal } from '../../components/QuantityModificationModal';
import { ErrorModal } from '../../components/ErrorModal';
import DocumentOutIcon from '../../assets/documentOutIcon.svg?react';
import DocumentJoinIcon from '../../assets/DocumentJoinIcon.svg?react';
import ReturnIcon from '../../assets/returnIcon.svg?react';
import PlusIcon from '../../assets/plusIcon.svg?react';
import TrashIcon from '../../assets/trashIcon.svg?react';
import PropTypes from "prop-types";



function DischargeAndChargeStock({ typeOfOperation }) {

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [isOpenErrorModal, setIsOpenErrorModal] = useState(false);

    const [formData, setFormData] = useState({
        requestor: "",
        reason: "",
        store: "",
        operationType: "",
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value
        }));
    };


    const { addDischarge } = useContext(ProductsAndServicesContext);

    const tableHeaders = ["Código de Barras", "Producto", "Precio Unitario de Compra", "Precio Unitario de Venta", `Cantidad a ${typeOfOperation === 'discharge' ? 'Descargar' : 'Cargar'}`, "Opciones"];

    //agregar productos a la tabla para descargar o cargar
    function addProductToTable(product) {
        const provisionalId = Date.now();
        const newProduct = {
            ...product,
            provisionalId,
            quantity: 1,// por defecto siempre sera un producto al agregarlo a la lista
        };
        setSelectedProducts([...selectedProducts, newProduct]);
    }

    //funcion para actualizar cantidad de productos en la lista de forma individual
    function updateProductQuantity(id, newQuantity) {
        const updatedProducts = selectedProducts.map((product) =>
            product.provisionalId === id
                ? { ...product, quantity: newQuantity }
                : product
        );
        setSelectedProducts(updatedProducts);
    }

    function validateForm() {
        const newErrors = {};

        // Validamos si todos los campos son válidos
        if (!formData.reason || formData.reason.length < 4) {
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

        // buscamos el último ID guardado en localStorage, o inicializarlo si no existe
        const lastId = localStorage.getItem('lastOrderId')
            ? parseInt(localStorage.getItem('lastOrderId'), 10)
            : 0;

        const newId = lastId + 1;
        localStorage.setItem('lastOrderId', newId);

        const now = new Date();
        const currentDate = now.toLocaleDateString(); //  "22/05/2023"
        const currentTime = now.toLocaleTimeString(); //  "07:43 PM"

        const newOrder = {
            id: newId,
            date: currentDate,
            time: currentTime,
            reason: formData.reason,
            responsible: formData.requestor,
            registeredBy: 'Juan Pérez',
            operationType: formData.operationType,
            store: formData.store,
            products: selectedProducts,
        };

        if (selectedProducts.length > 0) {
            if (typeOfOperation === 'discharge') {
                addDischarge(newOrder);
                navigate(`/discharges`);
            } else {
                // addCharge(newOrder);
                console.log("carga");
            }
        }
    }

    const navigate = useNavigate();

    const formFields = [
        {
            label: 'Responsable / Solicitante',
            id: 'requestor',
            type: 'select',
            options: ['NIOMARA TREMONT SANCHEZ', 'JUAN CARLOS PEREZ'],
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

    return (
        <section className="container mx-auto p-6 border-b-2 border-gray-100">
            <header className="flex items-center mb-6 border-b-2 border-gray-100 pb-4">
                <h1 className={`text-2xl font-medium flex items-center ${typeOfOperation === 'discharge' ? 'text-red-500' : 'text-green-500'}`}>
                    {typeOfOperation === 'discharge' ? <DocumentOutIcon className="w-9 h-9 mr-2" /> : <DocumentJoinIcon className="w-9 h-9 mr-2" />}
                    {typeOfOperation === 'discharge' ? 'Descargar Stock' : 'Cargar Stock'}
                </h1>
            </header>

            <div className="gap-4 mb-6 bg-gray-50 p-4 rounded-md ">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formFields.map((field, index) => (
                        <div key={index}>
                            <label className="block text-gray-700 font-medium mb-2" htmlFor={field.id}>{field.label}</label>
                            <div className={`flex w-full  border rounded-lg overflow-hidden hover:border-blue-300 focus-within:border-blue-300 ${errors[field.id] ? 'border-red-500' : 'border-gray-200'}`}>
                                {field.type === 'select' ? (
                                    <select
                                        id={field.id}
                                        className="w-full px-3 py-2 border-none focus:outline-none focus:ring-0"
                                        onChange={handleChange}
                                    >
                                        {field.options.map((option, i) => (
                                            <option key={i} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        id={field.id}
                                        value={formData[field.id]}
                                        onChange={handleChange}
                                        className="w-full py-2 px-4 focus:outline-none focus:ring-0 focus:border-transparent"
                                    />
                                )}
                            </div>
                            {errors[field.id] && (
                                <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
                            )}
                        </div>
                    ))}
                </form>
            </div>

            {isOpenErrorModal && <ErrorModal onClose={() => setIsOpenErrorModal(false)} />}

            <div className="mb-6 bg-gray-50 p-4 rounded-md">
                <div className='w-full flex flex-col justify-center mb-4'>
                    <label
                        htmlFor="search"
                        className="block text-gray-700 mb-2 pl-2">
                        Buscar y agregar productos a la lista:
                    </label>
                    <ProductSearchInput addProductToTable={addProductToTable} />
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
                                selectedProducts.map((product, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="px-6 py-4 whitespace-nowrap border text-center text-sm text-gray-900">{product.systemCode.slice(0, 9).toUpperCase()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap border text-center text-sm text-gray-900">{product.productName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap border text-center text-sm text-gray-900">{product.salePrice}</td>
                                        <td className="px-6 py-4 whitespace-nowrap border text-center text-sm text-gray-900">{product.salePrice}</td>
                                        <td className="px-6 py-4 whitespace-nowrap border text-center text-sm text-gray-900">
                                            {<QuantityCounter
                                                itemCount={product.quantity}
                                                changeQuantity={(newQuantity) => {
                                                    updateProductQuantity(product.provisionalId, newQuantity)
                                                }}
                                                openQuantityModal={() => {
                                                    setIsQuantityModalOpen(true)
                                                    setProductToEdit(product)
                                                }}
                                            />}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap border text-center text-sm text-gray-900">
                                            <button className="text-red-500 hover:text-red-600">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>

                {isQuantityModalOpen && (
                    <QuantityModificationModal
                        quantity={productToEdit?.quantity}
                        changeQuantity={(newQuantity) => {
                            updateProductQuantity(productToEdit.provisionalId, newQuantity)
                        }}
                        onClose={() => setIsQuantityModalOpen(false)}
                    />
                )
                }

                <div className="flex justify-between items-center mt-4">
                    <button
                        className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 flex items-center gap-3"
                        onClick={() => navigate(-1)}
                    >
                        <ReturnIcon className="w-5 h-5 text-gray-700" />
                        CANCELAR
                    </button>
                    <button
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3"
                        onClick={() => {
                            submitOrder()
                        }}
                    >
                        <PlusIcon className="w-5 h-5 text-white" />
                        {typeOfOperation === 'discharge' ? 'DESCARGAR PRODUCTOS' : 'CARGAR PRODUCTOS'}
                    </button>
                </div>
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

DischargeAndChargeStock.propTypes = {
    typeOfOperation: PropTypes.string
}