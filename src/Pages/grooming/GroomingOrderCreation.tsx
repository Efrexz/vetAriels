import { useState, useMemo, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { Client, Pet } from '@t/client.types';
import { Product, Service, PurchasedItem } from '@t/inventory.types';
import { GroomingQueueItem } from '@t/clinical.types';
import { ProductSearchInput } from '@components/search/ProductSearchInput';
import { QuantityCounter } from '@components/ui/QuantityCounter';
import { PriceModificationModal } from '@components/modals/PriceModificationModal';
import { QuantityModificationModal } from '@components/modals/QuantityModificationModal';
import { ClientSearchInput } from '@components/search/ClientSearchInput';
import { ActionButtons } from '@components/ui/ActionButtons';
import { ErrorModal } from '@components/modals/ErrorModal';
import { generateUniqueId } from '@utils/idGenerator';
import BathIcon from '@assets/bathIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import TagIcon from '@assets/tagIcon.svg?react';

function GroomingOrderCreation() {

    const { clients, petsData, addPetToQueueGrooming, petsInQueueGrooming } = useClients();
    const navigate = useNavigate();
    const { id: clientId } = useParams<{ id: string }>();

    //estado de productos seleccionados al escribir en nuestro input de busqueda
    const [selectedProducts, setSelectedProducts] = useState<PurchasedItem[]>([]);

    const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);

    //creamos estado que al hacer click en editar el precio o la cantidad. Se agregue al productToEdit y tener la data de cual producto seleccionamos para hacer sus modificaciones en los modales correspondientes
    const [productToEdit, setProductToEdit] = useState<PurchasedItem | null>(null);

    const clientData: Client | undefined =  clients.find(client => client.id === clientId)

    //agregar producto o servicio a nuestra tabla de productos a cargar al usuario para la venta
    function addProductToTable(item: Product | Service) {
        const newProduct: PurchasedItem = {
            ...item,
            petSelected: petSelectedName,
            provisionalId: generateUniqueId(),
            quantity: 1,
            additionDate: new Date().toLocaleDateString(),
            additionTime: new Date().toLocaleTimeString(),
        };
        setSelectedProducts(prev => [...prev, newProduct]);
    }

    function removeProduct(itemId: string) {
        const updatedProducts = selectedProducts.filter((product) => product.provisionalId !== itemId);
        setSelectedProducts(updatedProducts);
    }

    //funcion para actualizar cantidad de productos en la lista de forma individual
    function updateProductQuantity(itemId: string, newQuantity: number) {
        const updatedProducts = selectedProducts.map((product) =>
            product.provisionalId === itemId
                ? { ...product, quantity: newQuantity }
                : product
        );
        setSelectedProducts(updatedProducts);
    }

    // funcion para modificar el precio de un item por el modal de editar el precio
    function handleUpdateProductPrice(updatedProduct: PurchasedItem) {
        const updatedProducts = selectedProducts.map(product =>
            product.provisionalId === updatedProduct.provisionalId ? updatedProduct : product
        );
        setSelectedProducts(updatedProducts);
    }

    const totalPrice = selectedProducts.reduce(
        (acc, product) => acc + (product.salePrice || 0) * product.quantity,
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

    //obtenemos las mascotas del propietario para poder mostrarlos en la lista del select
    const petsByOwner: Pet[] = useMemo(() =>
        clientId ? petsData.filter(pet => pet.ownerId === clientId) : [],
    [petsData, clientId]);

    useEffect(() => {
        if (petsByOwner.length > 0) {
            setPetSelectedName(petsByOwner[0].petName);
        } else {
            setPetSelectedName('');
        }
    }, [petsByOwner]);

    const [petSelectedName, setPetSelectedName] = useState<string>('');

    //estado de las observaciones del baño de la mascota
    const [notes, setNotes] = useState<string>('');

    function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
        const { value } = e.target;
        setNotes(value);
    }

    //Modales
    const [isPriceModalOpen, setIsPriceModalOpen] = useState<boolean>(false);
    const [isQuantityModalOpen, setIsQuantityModalOpen] = useState<boolean>(false);

    function sendInfoToQueueGrooming() {
        //Validamos que haya seleccionado al menos un producto agregado
        if (selectedProducts.length < 1) {
            setIsErrorModalOpen(true);
            return;
        }
        //depende la mascota seleccionada en el input de select, obtenemos toda la data de la mascota para enviarla a cola
        const petSelectedData = petsData.find(pet => pet.petName === petSelectedName);

        if (!petSelectedData || !clientData) {
            console.error("No se encontró el cliente o la mascota seleccionada");
            return;
        }

        const now = new Date();
        const dataToSend: GroomingQueueItem  = {
            id: generateUniqueId(),
            petData: petSelectedData,
            turn: petsInQueueGrooming.length > 0
                ? petsInQueueGrooming[petsInQueueGrooming.length - 1].turn + 1
                : 1, // Si la cola está vacía, el turno será 1
            systemCode: petSelectedData.hc,
            ownerName: `${clientData.firstName} ${clientData.lastName}`,
            notes,
            dateOfAttention: now.toLocaleDateString(),
            timeOfAttention: now.toLocaleTimeString(),
            state: "Pendiente",
            productsAndServices: selectedProducts,
            healthObservations: [], // las observaciones por defecto van vacias
        };
        addPetToQueueGrooming(dataToSend);
        navigate("/grooming");
    }

    return (
        <section className="bg-gray-950 p-1 md:p-6 overflow-auto custom-scrollbar rounded-xl">
            <h1 className="text-xl md:text-2xl font-medium  mb-4 pb-4 border-b-2 border-cyan-500 flex items-center">
                <BathIcon className="w-6 sm:w-9 h-6 sm:h-9 text-cyan-500 mr-2" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400"> Peluquería</span>
            </h1>
            <div className="bg-gray-800 px-4 py-3 rounded-xl mb-4 border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="col-span-2">
                        <label className="block text-gray-400 mb-2">Propietario</label>
                        <ClientSearchInput mode={"grooming"} />
                    </div>
                    <div className="col-span-2 ">
                        <label className="block text-gray-400">Mascota</label>
                        {
                            clientData ? (
                                <select
                                    className="w-full mt-2 bg-gray-700 border-gray-600 border rounded-lg py-1 px-4 text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 hover:border-cyan-500"
                                    value={petSelectedName}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setPetSelectedName(e.target.value)}
                                >
                                    {petsByOwner.length > 0 ? (
                                        petsByOwner.map((pet) => (
                                            <option key={pet.id} value={pet.petName}>{pet.petName}</option>
                                        ))
                                    ) : (
                                        // Si no hay mascotas
                                        <option value="">No hay mascotas para este cliente</option>
                                    )}
                                </select>
                            ) :
                                (
                                    <input
                                        className="w-full mt-2 border-gray-600 border rounded-lg py-1 px-4 bg-gray-700 text-gray-400 hover:border-cyan-500"
                                        value=""
                                        disabled
                                    />
                                )
                        }
                    </div>

                    <div className="col-span-2">
                        <label className="block text-gray-400">Dirección</label>
                        <input
                            value={clientData ? `${clientData.address}, ${clientData.district} ` : ''}
                            className="mt-2 w-full border-gray-600 border rounded-lg py-1 px-4 bg-gray-700 text-gray-400"
                            disabled
                        />
                    </div>
                    <div className='col-span-2'>
                        <label className="block text-gray-400">Referencias</label>
                        <input
                            type="text"
                            className="mt-2 w-full border-gray-600 border rounded-lg py-1 px-4 bg-gray-700 text-gray-400"
                            value={clientData ? `${clientData.reference}` : ''}
                            disabled
                        />
                    </div>

                    <div className='col-span-2'>
                        <label className="block text-gray-400">Empresa</label>
                        <select className="w-full mt-2 border border-gray-600 rounded-lg py-1 px-3  bg-gray-700 text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 hover:border-cyan-500">
                            <option>VETERINARIA ARIEL`S E.I.R.L 0000 - 20608438719</option>
                        </select>
                        <span className="text-sm text-gray-500 mt-1">
                            Los datos de la empresa seleccionada se utilizarán en el ticket de la orden de servicio.
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 px-4 py-3 rounded-xl shadow border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="col-span-1">
                        <label className="block text-gray-400 mb-2">Almacén de origen</label>
                        {clientData ? (
                            <select className="w-full bg-gray-700 border-gray-600 border rounded-lg py-1 px-4 text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 hover:border-cyan-500">
                                <option>ALMACEN PRODUCTOS P/VENTAS</option>
                            </select>
                        ) : (
                            <input
                                className="w-full bg-gray-700 border-gray-600 rounded-lg py-1 px-4 text-gray-400"
                                value="ALMACEN PRODUCTOS P/VENTAS"
                                disabled
                            />
                        )}
                    </div>
                    <div className="col-span-1 md:col-span-3">
                        <label className="block text-gray-400 mb-2">
                            Buscar y agregar productos y/o servicios:
                        </label>
                        {clientData ? (
                            <ProductSearchInput addProductToTable={addProductToTable} mode="sales" />
                        ) : (
                            <input
                                className="w-full bg-gray-700 border-gray-600 rounded-lg py-1 px-4 text-gray-400"
                                value=""
                                disabled
                            />
                        )}
                    </div>
                </div>

                <div className='overflow-x-auto border border-gray-700 rounded-xl'>
                    <table className="min-w-full bg-gray-800 rounded-xl mt-2">
                        <thead>
                            <tr className="bg-gray-700 border-gray-600 border text-sm ">
                                <th className="py-1 px-4 border-gray-600 border-r text-center text-gray-300">Concepto</th>
                                <th className=" px-4 border-gray-600 border-r text-center text-gray-300">Valor Unitario</th>
                                <th className=" px-4 border-gray-600 border-r text-center text-gray-300">Cantidad</th>
                                <th className=" px-4 border-gray-600 border-r text-center text-gray-300">Sub Total</th>
                                <th className=" px-4 border-gray-600 border-r text-center text-gray-300">Impuestos</th>
                                <th className=" px-4 border-gray-600 border-r text-center text-gray-300">Total</th>
                                <th className=" px-4 border-gray-600 border-r text-center text-gray-300">Mascota</th>
                                <th className=" px-4 border-gray-600 border-r text-center text-gray-300">Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedProducts.map((product) => (
                                <tr key={product.provisionalId} className="hover:bg-gray-700 transition-colors text-sm">
                                    <td className='py-2 px-4 border border-gray-600 text-center text-gray-200'>
                                        {product.productName || product.serviceName}
                                    </td>
                                    <td className='py-2 px-4 border border-gray-600 text-center text-gray-200'>
                                        <span
                                            className='border border-gray-600 bg-gray-800 px-2 py-1 rounded-lg text-center w-12 cursor-pointer text-gray-200 hover:border-cyan-500'
                                            onClick={() => {
                                                setProductToEdit(product)
                                                setIsPriceModalOpen(true)
                                                setIsQuantityModalOpen(false)
                                            }}
                                        >
                                            {product.salePrice}
                                        </span>
                                    </td>
                                    <td className='py-2 px-4 border border-gray-600 text-center text-gray-200'>
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
                                    <td className='py-2 px-4 border border-gray-600 text-center text-gray-200'>
                                        {(product.salePrice || 0) * product.quantity}
                                    </td>
                                    <td className='py-3 px-3 border border-gray-600 text-center text-gray-200'>
                                        <span className='border border-gray-600 bg-gray-800 px-2 py-1 rounded-lg text-center w-12 cursor-pointer hover:border-cyan-500'>
                                            0.00
                                        </span>
                                    </td>
                                    <td className='py-2 px-4 border border-gray-600 text-center text-gray-200'>
                                        {(product.salePrice || 0) * product.quantity}
                                    </td>
                                    <td className='py-2 px-4 border border-gray-600 text-center text-gray-200'>{product.petSelected}</td>
                                    <td className='py-2 px-4 text-center border border-gray-600'>
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

                <div className="bg-gray-800 pt-6 ">
                    <div className="w-full lg:w-1/2 ml-auto">
                        <table className="min-w-full bg-gray-800">
                            <tbody>
                                {taxesData.map((row, index) => (
                                    <tr key={index} className={`border-t border-gray-700 ${row.bold ? 'font-bold' : ''}`}>
                                        <td className="py-2 text-gray-400">{row.label}</td>
                                        <td className="py-2 text-right text-gray-400">{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Observaciones */}
            <div className='bg-gray-800 px-4 py-3 mb-4 mt-4 rounded-xl shadow border border-gray-700'>
                <label htmlFor="note" className="block text-gray-400">Observaciones o comentarios de esta orden de servicio</label>
                <textarea
                    className="w-full mt-3 border border-gray-600 rounded-lg p-3 bg-gray-700 text-gray-200 placeholder-gray-400 max-h-60 min-h-20 focus:outline-none focus:ring-1 focus:ring-cyan-500 hover:border-cyan-500"
                    id="note"
                    rows={3}
                    placeholder="Añadir observaciones..."
                    value={notes}
                    onChange={handleChange}
                ></textarea>
            </div>

            {/* recordatorio en agenda */}
            <div className="bg-gray-800 px-4 py-3 mb-4 mt-1 rounded-xl shadow flex flex-col md:flex-row items-center gap-4 border border-gray-700">
                <div className="w-full">
                    <label htmlFor="date" className="block text-gray-400">Fecha de próximo servicio</label>
                    <input
                        type="date"
                        id="date"
                        className="w-full py-1 px-4 mt-1.5 bg-gray-700 border-gray-600 border rounded-lg text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 hover:border-cyan-500"
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="typeService" className="block text-gray-400">Tipo de evento</label>
                    <select
                        name="type"
                        id="typeService"
                        className="w-full py-1 px-4 mt-1.5 bg-gray-700 border-gray-600 border rounded-lg text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 hover:border-cyan-500"
                    >
                        <option className="bg-gray-700" value="baño">Baño</option>
                    </select>
                </div>

                <div className="w-full">
                    <label htmlFor="client" className="block text-gray-400">Anotaciones</label>
                    <input
                        type="text"
                        placeholder="Anotaciones..."
                        className="w-full py-1 px-4 mt-1.5 bg-gray-700 border-gray-600 border rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 hover:border-cyan-500"
                    />
                </div>

                {
                    isPriceModalOpen && productToEdit && (
                        <PriceModificationModal
                            onClose={() => setIsPriceModalOpen(false)}
                            productToEdit={productToEdit}
                            updateProductPrice={handleUpdateProductPrice}
                        />
                    )
                }
                {
                    isQuantityModalOpen && productToEdit && (
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