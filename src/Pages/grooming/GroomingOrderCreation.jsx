import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClientsContext } from '../../context/ClientsContext';
import { ProductSearchInput } from '../../components/ProductSearchInput';
import { QuantityCounter } from '../../components/QuantityCounter';
import { PriceModificationModal } from '../../components/PriceModificationModal';
import { QuantityModificationModal } from '../../components/QuantityModificationModal';
import BathIcon from '../../assets/bathIcon.svg?react';
import ReturnIcon from '../../assets/returnIcon.svg?react';
import PlusIcon from '../../assets/plusIcon.svg?react';
import TrashIcon from '../../assets/trashIcon.svg?react';
import TagIcon from '../../assets/tagIcon.svg?react';


function GroomingOrderCreation() {

    const { clients, petsData } = useContext(ClientsContext);

    const [petSelected, setPetSelected] = useState(petsData[0].petName);//por defecto seleccionamos la primera mascota del propietario por si no cambia este select

    //estado de productos seleccionados al escribir en nuestro input de busqueda
    const [selectedProducts, setSelectedProducts] = useState([]);

    //creamos estado que al hacer click en editar el precio o la cantidad. Se agregue al productToEdit y tener la data de cual producto seleccionamos para hacer sus modificaciones en los modales correspondientes
    const [productToEdit, setProductToEdit] = useState(null);

    // funcion para modificar el precio de un item por el modal de editar el precio
    function handleUpdateProductPrice(updatedProduct) {
        const updatedProducts = selectedProducts.map(product =>
            product.provisionalId === updatedProduct.provisionalId ? updatedProduct : product
        );
        setSelectedProducts(updatedProducts);
    }

    //agregar producto o servicio a nuestra tabla de productos a cargar al usuario para la venta
    const addProductToTable = (product) => {
        const provisionalId = Date.now();
        const newProduct = {
            ...product,
            petSelected,
            provisionalId,
            quantity: 1,// por defecto siempre sera un producto al agregarlo a la lista
        };
        setSelectedProducts([...selectedProducts, newProduct]);
    };

    //funcion para actualizar cantidad de productos en la lista de forma individual
    const updateProductQuantity = (id, newQuantity) => {
        const updatedProducts = selectedProducts.map((product) =>
            product.provisionalId === id
                ? { ...product, quantity: newQuantity }
                : product
        );
        setSelectedProducts(updatedProducts);
    };

    const totalPrice = selectedProducts.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
    );

    // const totalPrice = selectedProducts.reduce((acc, curr) => acc + curr.price, 0);

    const taxesData = [
        { label: 'Valor de venta bruto (sin descuentos)', value: totalPrice },
        { label: 'Total descuentos', value: '- 0.00' },
        { label: 'Valor de venta incluyendo descuentos', value: '0.00' },
        { label: 'Impuestos', value: '0.00' },
        { label: 'TOTAL', value: totalPrice, bold: true },
    ];

    const navigate = useNavigate();
    const { id } = useParams();
    const isClientSelected = clients.find(client => client.id === Number(id));

    //obtenemos las mascotas del propietario para poder mostrarlos en la lista del select
    const petsByOwner = petsData.filter(pet => pet.ownerId === Number(id));


    //Modales
    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
    const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);

    return (
        <section className="bg-white p-6">
            <h1 className="text-2xl font-medium text-blue-400 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <BathIcon className="w-7 h-7 text-blue-400 mr-2" />
                Peluquería
            </h1>
            <div className="bg-gray-100 p-4 rounded mb-4">

                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-2">
                        <label className="block text-gray-700">Propietario</label>
                        <input
                            className="w-full mt-2 bg-gray-200 py-2 px-4 rounded"
                            value={isClientSelected ? `${isClientSelected.firstName} ${isClientSelected.lastName}` : ''}
                            disabled
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-gray-700">Mascota</label>
                        <select
                            className="w-full mt-2 border-gray-300 border rounded py-2 px-4 hover:border-blue-300 focus-within:border-blue-300"
                            onChange={(e) => setPetSelected(e.target.value)}
                        >
                            {
                                petsByOwner.map((pet, index) => (
                                    <option key={index} value={pet.petName}>{pet.petName}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-gray-700">Dirección</label>
                        <input
                            value={isClientSelected ? `${isClientSelected.address}, ${isClientSelected.distrit}, ${isClientSelected.city}` : ''}
                            className="mt-2 w-full border-gray-300 rounded py-2 px-4 bg-gray-200"
                            disabled
                        />
                    </div>
                    <div className='col-span-2'>
                        <label className="block text-gray-700">Referencias</label>
                        <input
                            type="text"
                            className="mt-2 w-full border-gray-300 rounded p-2 bg-gray-200"
                            value={isClientSelected ? `${isClientSelected.reference}` : ''}
                            disabled
                        />
                    </div>

                    <div className='col-span-2'>
                        <label className="block text-gray-700">Empresa</label>
                        <select className="w-full mt-2 border border-gray-300 rounded p-2 bg-white hover:border-blue-300 focus-within:border-blue-300">
                            <option>VETERINARIA ARIEL`S E.I.R.L 0000 - 20608438719</option>
                        </select>
                        <span className="text-sm text-gray-500 mt-1">
                            Los datos de la empresa seleccionada se utilizarán en el ticket de la orden de servicio.
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 p-4 rounded shadow">
                <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className='col-span-1'>
                        <label className="block text-gray-700 mb-2">Almacén de origen</label>
                        <select className="w-full  border-gray-300 border rounded py-2 px-4 hover:border-blue-300 focus-within:border-blue-300" >
                            <option>ALMACEN PRODUCTOS P/VENTAS</option>
                        </select>
                    </div>
                    <div className='col-span-3'>
                        <label className="block text-gray-700 mb-2">Buscar y agregar productos y/o servicios:</label>
                        <ProductSearchInput addProductToTable={addProductToTable} />
                    </div>
                </div>

                <table className="w-full border border-gray-300 rounded-lg mt-8">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border border-gray-300 text-center">Concepto</th>
                            <th className="py-2 px-4 border  border-gray-300  text-center">Especificaciones</th>
                            <th className="py-2 px-4 border  border-gray-300 text-center">Valor Unitario</th>
                            <th className="py-2 px-4 border  border-gray-300 text-center">Cantidad</th>
                            <th className="py-2 px-4 border  border-gray-300 text-center">Sub Total</th>
                            <th className="py-2 px-4 border  border-gray-300 text-center">Impuestos</th>
                            <th className="py-2 px-4 border border-gray-300  text-center">Total</th>
                            <th className="py-2 px-4 border border-gray-300  text-center">Mascota</th>
                            <th className="py-2 px-4 border  border-gray-300 text-center">Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedProducts.map((product) => (
                            <tr key={product.provisionalId}>
                                <td className='py-2 px-4 border border-gray-300 text-center'>{product.name || product.serviceName}</td>
                                <td className='py-2 px-4  border border-gray-300 text-center'>Descripción detallada</td>
                                <td className='py-2 px-4  border border-gray-300 text-center'>
                                    <span
                                        className='border border-gray-300 bg-white px-4 py-1 rounded text-center w-12 cursor-pointer'
                                        onClick={() => {
                                            setProductToEdit(product)
                                            setIsPriceModalOpen(true)
                                            setIsQuantityModalOpen(false)
                                        }}
                                    >
                                        {product.price}
                                    </span>
                                </td>
                                <td className='py-2 px-4  border border-gray-300 text-center'>
                                    <QuantityCounter
                                        itemCount={product.quantity}
                                        changeQuantity={(newQuantity) => {
                                            updateProductQuantity(product.provisionalId, newQuantity)
                                        }}
                                        openQuantityModal={() => {
                                            setIsQuantityModalOpen(true)
                                            setIsPriceModalOpen(false)
                                        }} />
                                </td>
                                <td className='py-2 px-4  border border-gray-300 text-center'>
                                    {product.price}
                                </td>
                                <td className='py-2 px-4  border border-gray-300 text-center'>
                                    <span className='border border-gray-300 bg-white px-4 py-1 rounded text-center w-12 cursor-pointer'>
                                        0.00
                                    </span>
                                </td>
                                <td className='py-2 px-4  border border-gray-300 text-center'>
                                    {product.price * product.quantity}
                                </td>
                                <td className='py-2 px-4  border border-gray-300 text-center'>{product.petSelected}</td>
                                <td className='py-4 px-4  border border-gray-300 text-center flex justify-center gap-2'>
                                    <TagIcon className='w-5 h-5 text-orange-400 cursor-pointer' />
                                    <TrashIcon className='w-5 h-5 text-red-500 cursor-pointer' />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {
                    isPriceModalOpen && (
                        <PriceModificationModal
                            onClose={() => setIsPriceModalOpen(false)}
                            productToEdit={productToEdit}
                            updateProductPrice={handleUpdateProductPrice}
                        />
                    )}
                {
                    isQuantityModalOpen && (
                        <QuantityModificationModal
                            onClose={() => setIsQuantityModalOpen(false)}
                        />
                    )
                }

                <div className="bg-gray-100 pt-6 pb-6">
                    <div className="w-full lg:w-1/2 ml-auto">
                        <table className="min-w-full bg-gray-100">
                            <tbody>
                                {taxesData.map((row, index) => (
                                    <tr key={index} className={`border-t border-gray-300 ${row.bold ? 'font-bold' : ''}`}>
                                        <td className="py-2 text-gray-600">{row.label}</td>
                                        <td className="py-2 text-right text-gray-600">{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Observaciones */}
            <div className='bg-gray-100 p-4 mb-4 mt-4 rounded shadow'>
                <label className="block text-gray-700">Observaciones o comentarios de ésta orden de servicio</label>
                <textarea
                    className="w-full mt-3 border border-gray-300 rounded p-2 bg-white max-h-60 min-h-20 hover:border-blue-300 focus-within:border-blue-300"
                    rows="3"
                    placeholder="Añadir observaciones..."
                ></textarea>
            </div>

            {/* recordatorio en agenda */}
            <div className='bg-gray-100 p-4 mb-4 mt-1 rounded shadow flex  items-center gap-4'>

                <div className="w-full">
                    <label htmlFor="date">Fecha de próximo servicio (recordatorio en agenda)</label>
                    <input
                        type="date"
                        id="date"
                        className="w-full py-2 px-4 mt-1.5 border-gray-200 border-2 rounded-lg hover:border-blue-300 focus-within:border-blue-300"
                    />
                </div>

                <div className=" w-full">
                    <label htmlFor="typeService">Tipo de evento </label>
                    <select
                        name="type"
                        id="typeService"
                        className="w-full py-2 px-4 mt-1.5 border-gray-200 border-2 rounded-lg hover:border-blue-300 focus-within:border-blue-300"
                    >
                        <option value="baño">Baño</option>
                    </select>
                </div>

                <div className='w-full'>
                    <label htmlFor="client">Anotaciones</label>
                    <input
                        type="text"
                        placeholder="Anotaciones..."
                        className="w-full py-2 px-4 mt-1.5 border-gray-200 border-2 rounded-lg hover:border-blue-300 focus-within:border-blue-300"
                    />
                </div>
            </div>
            <div className="flex justify-between items-center bg-gray-100 p-4 mb-4 mt-1 rounded shadow ">
                <button
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 flex items-center gap-3"
                    onClick={() => navigate(-1)}
                >
                    <ReturnIcon className="w-5 h-5 text-gray-700" />
                    CANCELAR
                </button>
                <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center gap-3">
                    <PlusIcon className="w-5 h-5 text-white" />
                    CREAR ORDEN DE SERVICIO
                </button>
            </div>
        </section>
    );
}


export { GroomingOrderCreation }