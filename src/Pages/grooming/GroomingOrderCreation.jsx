import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClientsContext } from '@context/ClientsContext';
import { ProductSearchInput } from '@components/ProductSearchInput';
import { QuantityCounter } from '@components/QuantityCounter';
import { PriceModificationModal } from '@components/PriceModificationModal';
import { QuantityModificationModal } from '@components/QuantityModificationModal';
import { ClientSearchInput } from '@components/ClientSearchInput';
import { ActionButtons } from '@components/ActionButtons';
import { ErrorModal } from '@components/ErrorModal';
import BathIcon from '@assets/bathIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import TagIcon from '@assets/tagIcon.svg?react';

function GroomingOrderCreation() {

    const { clients, petsData, addPetToQueueGrooming, petsInQueueGrooming } = useContext(ClientsContext);

    //estado de productos seleccionados al escribir en nuestro input de busqueda
    const [selectedProducts, setSelectedProducts] = useState([]);

    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

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
    function addProductToTable(product) {
        const provisionalId = Date.now();
        const newProduct = {
            ...product,
            petSelected,
            provisionalId,
            quantity: 1,// por defecto siempre sera un producto al agregarlo a la lista
        };
        setSelectedProducts([...selectedProducts, newProduct]);
    }

    function removeProduct(id) {
        const updatedProducts = selectedProducts.filter((product) => product.provisionalId !== id);
        setSelectedProducts(updatedProducts);
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

    const totalPrice = selectedProducts.reduce(
        (acc, product) => acc + (product.salePrice || product.price) * product.quantity,
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

    const [petSelected, setPetSelected] = useState(petsByOwner[0]?.petName);//por defecto seleccionamos la primera mascota del propietario por si no cambia este select


    //estado de las observaciones del baño de la mascota
    const [notes, setNotes] = useState('');

    function handleChange(e) {
        const { value } = e.target;
        setNotes(value);
    }

    //Modales
    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
    const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);

    function sendInfoToQueueGrooming() {
        //depende la mascota seleccionada en el input de select, obtenemos toda la data de la mascota para enviarla a cola
        const petSelectedData = petsData.find(pet => pet.petName === petSelected);
        const now = new Date();
        const currentDate = now.toLocaleDateString(); //  "22/05/2023"
        const currentTime = now.toLocaleTimeString(); //    "07:43 PM"

        //Validamos que haya seleccionado al menos un producto agregado
        if (selectedProducts.length < 1) {
            setIsErrorModalOpen(true);
            return;
        }

        const dataToSend = {
            id: Date.now(),
            petData: petSelectedData,
            turn: petsInQueueGrooming.length > 0
                ? petsInQueueGrooming[petsInQueueGrooming.length - 1].turn + 1
                : 1, // Si la cola está vacía, el turno será 1
            systemCode: petSelectedData.hc,
            ownerName: ` ${isClientSelected.firstName} ${isClientSelected.lastName}`,
            notes,
            dateOfAttention: currentDate,
            timeOfAttention: currentTime,
            state: "Pendiente",
            productsAndServices: selectedProducts,
        };
        addPetToQueueGrooming(dataToSend);
        navigate("/grooming");
    }

    return (
        <section className="bg-white p-6 overflow-auto custom-scrollbar">
            <h1 className="text-xl md:text-2xl font-medium text-blue-400 mb-4 pb-4 border-b-2 border-gray-100 flex">
                <BathIcon className="w-6 sm:w-9 h-6 sm:h-9 text-blue-400 mr-2" />
                Peluquería
            </h1>
            <div className="bg-gray-100 p-4 rounded mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="col-span-2">
                        <label className="block text-gray-700 mb-2">Propietario</label>
                        <ClientSearchInput mode={"grooming"} />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-gray-700">Mascota</label>
                        {
                            isClientSelected ? (
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
                            ) :
                                (
                                    <input
                                        className="w-full mt-2 border-gray-300 rounded py-2 px-4 bg-gray-200"
                                        value=""
                                        disabled
                                    />
                                )
                        }
                    </div>

                    <div className="col-span-2">
                        <label className="block text-gray-700">Dirección</label>
                        <input
                            value={isClientSelected ? `${isClientSelected.address}, ${isClientSelected.distrit}, ${isClientSelected.city} ` : ''}
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">

                    <div className="col-span-1">
                        <label className="block text-gray-700 mb-2">Almacén de origen</label>
                        {isClientSelected ? (
                            <select className="w-full border-gray-300 border rounded py-2 px-4 hover:border-blue-300 focus-within:border-blue-300">
                                <option>ALMACEN PRODUCTOS P/VENTAS</option>
                            </select>
                        ) : (
                            <input
                                className="w-full border-gray-300 rounded py-2 px-4 bg-gray-200"
                                value="ALMACEN PRODUCTOS P/VENTAS"
                                disabled
                            />
                        )}
                    </div>
                    <div className="col-span-1 md:col-span-3">
                        <label className="block text-gray-700 mb-2">
                            Buscar y agregar productos y/o servicios:
                        </label>
                        {isClientSelected ? (
                            <ProductSearchInput addProductToTable={addProductToTable} mode="sales" />
                        ) : (
                            <input
                                className="w-full border-gray-300 rounded py-2 px-4 bg-gray-200"
                                value=""
                                disabled
                            />
                        )}
                    </div>
                </div>

                <div className='overflow-x-auto'>
                    <table className="w-full border border-gray-300 rounded-lg mt-8">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border border-gray-300 text-center">Concepto</th>
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
                                    <td className='py-2 px-4 border border-gray-300 text-center'>
                                        {product.productName || product.serviceName}
                                    </td>
                                    <td className='py-2 px-4  border border-gray-300 text-center'>
                                        <span
                                            className='border border-gray-300 bg-white px-4 py-1 rounded text-center w-12 cursor-pointer'
                                            onClick={() => {
                                                setProductToEdit(product)
                                                setIsPriceModalOpen(true)
                                                setIsQuantityModalOpen(false)
                                            }}
                                        >
                                            {product.salePrice || product.price}
                                        </span>
                                    </td>
                                    <td className='py-2 px-4  border border-gray-300 text-center'>
                                        <QuantityCounter
                                            itemCount={product.quantity}
                                            changeQuantity={(newQuantity) => {
                                                updateProductQuantity(product.provisionalId, newQuantity)
                                            }}
                                            maxQuantity={product.availableStock}
                                            mode="sales"
                                            openQuantityModal={() => {
                                                setIsQuantityModalOpen(true)
                                                setIsPriceModalOpen(false)
                                                setProductToEdit(product)
                                            }} />
                                    </td>
                                    <td className='py-2 px-4  border border-gray-300 text-center'>
                                        {(product.salePrice || product.price) * product.quantity}
                                    </td>
                                    <td className='py-2 px-4  border border-gray-300 text-center'>
                                        <span className='border border-gray-300 bg-white px-4 py-1 rounded text-center w-12 cursor-pointer'>
                                            0.00
                                        </span>
                                    </td>
                                    <td className='py-2 px-4  border border-gray-300 text-center'>
                                        {(product.salePrice || product.price) * product.quantity}
                                    </td>
                                    <td className='py-2 px-4  border border-gray-300 text-center'>{product.petSelected}</td>
                                    <td className='py-8 px-4 text-center border border-gray-300'>
                                        <div className="flex justify-center items-center h-full space-x-2">
                                            <TagIcon className='w-5 h-5 text-orange-400 cursor-pointer' />
                                            <TrashIcon
                                                onClick={() => removeProduct(product.provisionalId)}
                                                className='w-5 h-5 text-red-500 cursor-pointer' />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                {
                    isPriceModalOpen && (
                        <PriceModificationModal
                            onClose={() => setIsPriceModalOpen(false)}
                            productToEdit={productToEdit}
                            updateProductPrice={handleUpdateProductPrice}
                        />
                    )
                }
                {
                    isQuantityModalOpen && (
                        <QuantityModificationModal
                            quantity={productToEdit?.quantity}
                            maxQuantity={productToEdit?.availableStock}
                            mode="sales"
                            changeQuantity={(newQuantity) => {
                                updateProductQuantity(productToEdit.provisionalId, newQuantity)
                            }}
                            onClose={() => setIsQuantityModalOpen(false)}
                        />
                    )
                }

                {
                    isErrorModalOpen && (
                        <ErrorModal onClose={() => setIsErrorModalOpen(false)} typeOfError="emptyList" />
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
                <label htmlFor="note" className="block text-gray-700 ">Observaciones o comentarios de ésta orden de servicio</label>
                <textarea
                    className="w-full mt-3 border border-gray-300 rounded p-2 bg-white max-h-60 min-h-20 hover:border-blue-300 focus-within:border-blue-300 focus:outline-none"
                    id="note"
                    rows="3"
                    placeholder="Añadir observaciones..."
                    value={notes}
                    onChange={handleChange}
                ></textarea>
            </div>

            {/* recordatorio en agenda */}
            <div className="bg-gray-100 p-4 mb-4 mt-1 rounded shadow flex flex-col md:flex-row items-center gap-4">

                <div className="w-full">
                    <label htmlFor="date" className="block text-gray-700 ">Fecha de próximo servicio (recordatorio en agenda)</label>
                    <input
                        type="date"
                        id="date"
                        className="w-full py-2 px-4 mt-1.5 border-gray-200 border-2 rounded-lg hover:border-blue-300 focus:border-blue-300 focus:outline-none"
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="typeService" className="block text-gray-700 ">Tipo de evento</label>
                    <select
                        name="type"
                        id="typeService"
                        className="w-full py-2 px-4 mt-1.5 border-gray-200 border-2 rounded-lg hover:border-blue-300 focus:border-blue-300 focus:outline-none"
                    >
                        <option value="baño">Baño</option>
                    </select>
                </div>

                <div className="w-full">
                    <label htmlFor="client" className="block text-gray-700 ">Anotaciones</label>
                    <input
                        type="text"
                        placeholder="Anotaciones..."
                        className="w-full py-2 px-4 mt-1.5 border-gray-200 border-2 rounded-lg hover:border-blue-300 focus:border-blue-300 focus:outline-none"
                    />
                </div>
            </div>

            <ActionButtons
                onCancel={() => navigate(-1)}
                onSubmit={sendInfoToQueueGrooming}
                submitText="CREAR ORDEN DE SERVICIO"
            />
        </section >
    );
}


export { GroomingOrderCreation }