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
import { ActionButtons } from '@components/ui/ActionButtons';
import { SuccessModal } from '@components/modals/SuccessModal';
import { ErrorModal } from '@components/modals/ErrorModal';
import { generateUniqueId } from '@utils/idGenerator';
import { NotFound } from '@components/ui/NotFound';
import BathIcon from '@assets/bathIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import TagIcon from '@assets/tagIcon.svg?react';


const healthObservations = [
    {
        title: "Alteraciones en",
        items: ["Oído", "Nariz", "Ojos", "Boca", "Cola", "Piel"],
    },
    {
        title: "Presencia de",
        items: ["Sarro", "Parásitos Internos", "Garrapatas", "Pulgas", "Sobrepeso", "Masas / Crecimientos corporales"],
    },
    {
        title: "Pendientes",
        items: [
            "Vacuna de cachorro",
            "Refuerzo Vacuna Leptospira",
            "Vacuna anual",
            "Aplicación de antipulgas",
            "Refuerzo Vacuna KC",
            "Aplicación de antiparasitario",
        ],
    },
];

function EditGroomingOrder() {

    const { petsInQueueGrooming, updatePetInQueueGrooming, clients } = useClients();
    const { id: clientId } = useParams<{ id: string }>();
    const navigate = useNavigate()

    //obtenemos los datos del paciente en cola de la cola de grooming
    const petInQueueGrommingData : GroomingQueueItem | undefined = petsInQueueGrooming.find((pet) => pet.id === clientId);

    //de acuerdo a los datos del paciente, accedemos a la propiedad ownerId para obtener los datos del propietario del paciente
    const clientData : Client | undefined = clients.find((client) => client.id === petInQueueGrommingData?.petData?.ownerId);

    //creamos estado que al hacer click en editar el precio o la cantidad. Se agregue al productToEdit y tener la data de cual producto seleccionamos para hacer sus modificaciones en los modales correspondientes
    const [productToEdit, setProductToEdit] = useState<PurchasedItem | null>(null);


    //Modales
    const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
    const [isPriceModalOpen, setIsPriceModalOpen] = useState<boolean>(false);
    const [isQuantityModalOpen, setIsQuantityModalOpen] = useState<boolean>(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

    //productos y servicios seleccionados
    const [selectedProducts, setSelectedProducts] = useState<PurchasedItem[]>([]);

    // funcion para modificar el precio de un item por el modal de editar el precio
    function handleUpdateProductPrice(updatedProduct: PurchasedItem) {
        const updatedProducts = selectedProducts.map(product =>
            product.provisionalId === updatedProduct.provisionalId
                ? updatedProduct
                : product
        );
        setSelectedProducts(updatedProducts);
    }

    //funcion para actualizar cantidad de productos en la lista de forma individual
    function updateProductQuantity(id: string, newQuantity: number) {
        const updatedProducts = selectedProducts.map((product) =>
            product.provisionalId === id
                ? { ...product, quantity: newQuantity }
                : product
        );
        setSelectedProducts(updatedProducts);
    }

    //agregar producto o servicio a nuestra tabla de productos a cargar al usuario para la venta
    const now = new Date();
    function addProductToTable(item: Product | Service) {
        const newItem: PurchasedItem = {
            ...item,
            //ENVIAMOS por defecto el nombre del paciente seleccionado
            petSelected: petInQueueGrommingData?.petData?.petName,
            provisionalId: generateUniqueId(),
            quantity: 1,// por defecto siempre sera un producto al agregarlo a la lista
            additionDate: now.toLocaleDateString(),
            additionTime: now.toLocaleTimeString(),
        };
        setSelectedProducts([...selectedProducts, newItem]);
    }

    function removeProduct(productId: string) {
        const updatedProducts = selectedProducts.filter((product) => product.provisionalId !== productId);
        setSelectedProducts(updatedProducts);
    }

    const totalPrice = selectedProducts.reduce(
        (acc, product) => acc + (product.salePrice || 0) * product.quantity,
        0
    );

    const taxesData = [
        { label: 'Valor de venta bruto (sin descuentos)', value: totalPrice },
        { label: 'Total descuentos', value: '- 0.00' },
        { label: 'Valor de venta incluyendo descuentos', value: '0.00' },
        { label: 'Impuestos', value: '0.00' },
        { label: 'TOTAL', value: totalPrice, bold: true },
    ];

    //notas del baño de la mascota
    const [notes, setNotes] = useState<string>('');

    function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
        const { value } = e.target;
        setNotes(value);
    }
    //observaciones medicas seleccionadas
    const [selectedObservations, setSelectedObservations] = useState<string[]>([]);

    // cambios en las checkbox de las observaciones
    function handleObservationChange(observation: string) {
        if (selectedObservations.includes(observation)) {
            setSelectedObservations(selectedObservations.filter(item => item !== observation));
        } else {
            setSelectedObservations([...selectedObservations, observation]);
        }
    }

    //actualizar la orden de servicio
    function updateGroomingOrder() {
        if (selectedProducts.length < 1) {
            setIsErrorModalOpen(true);
            return;
        }
        const dataToSend: Partial<GroomingQueueItem> = {
            ...petInQueueGrommingData,
            productsAndServices: selectedProducts,
            notes,
            healthObservations: selectedObservations,
        };
        if(clientId){
            updatePetInQueueGrooming(clientId, dataToSend);
            setIsSuccessModalOpen(true);
        }
    }

    useEffect(() => {
    if (petInQueueGrommingData) {
        setSelectedProducts(petInQueueGrommingData.productsAndServices || []);
        setNotes(petInQueueGrommingData.notes || '');
        setSelectedObservations(petInQueueGrommingData.healthObservations || []);
    }
    }, [petInQueueGrommingData]);

    if (!petInQueueGrommingData) {
        return <NotFound entityName="Orden de Peluquería" searchId={clientId!} returnPath="/grooming" />;
    }


    return (
        <section className=" w-full bg-gray-900 p-6 overflow-auto custom-scrollbar">
            <h1 className="text-xl md:text-2xl font-medium mb-4 pb-4 border-b-2 border-cyan-500 flex items-center">
                <BathIcon className="w-6 sm:w-9 h-6 sm:h-9 text-cyan-500 mr-2" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400"> Peluquería</span> 
            </h1>
            <div className="bg-gray-800 px-4 py-2 rounded-xl mb-4 border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="col-span-2">
                        <label className="block text-gray-400 mb-1">Propietario</label>
                        <input
                            className="w-full bg-gray-700 py-1 px-4 rounded-lg text-gray-400 border border-gray-600 focus:outline-none"
                            value={petInQueueGrommingData?.ownerName}
                            disabled
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-gray-400 mb-1">Mascota</label>
                        <input
                            className="w-full bg-gray-700 py-1 px-4 rounded-lg text-gray-400 border border-gray-600 focus:outline-none"
                            value={`${petInQueueGrommingData?.petData?.petName} (${petInQueueGrommingData?.petData?.species} | ${petInQueueGrommingData?.petData?.breed} | #HC: ${petInQueueGrommingData?.petData?.hc})`}
                            disabled
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-gray-400 mb-1">Telefonos</label>
                        <input
                            className="w-full bg-gray-700 py-1 px-4 rounded-lg text-gray-400 border border-gray-600 focus:outline-none"
                            value={`${clientData?.phone1} | ${clientData?.phone2}`}
                            disabled
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-gray-400 mb-1">Dirección</label>
                        <input
                            value={clientData?.address}
                            className=" w-full border-gray-600 rounded-lg text-gray-400 py-1 px-4 bg-gray-700 focus:outline-none"
                            disabled
                        />
                    </div>
                    <div className='col-span-2'>
                        <label className="block text-gray-400 mb-1">Referencias</label>
                        <input
                            type="text"
                            className=" w-full border-gray-600 rounded-lg text-gray-400 py-1 px-4 bg-gray-700 focus:outline-none"
                            value={clientData?.reference}
                            disabled
                        />
                    </div>

                    <div className='col-span-2'>
                        <label className="block text-gray-400 mb-1">Empresa</label>
                        <select className="w-full border border-gray-600 rounded-lg py-1 px-4 bg-gray-700 text-gray-200 hover:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none text-sm">
                            <option>VETERINARIA ARIEL'S E.I.R.L 0000 - 20608438719</option>
                        </select>
                        <span className="text-sm text-gray-500 mt-1">
                            Los datos de la empresa seleccionada se utilizarán en el ticket de la orden de servicio.
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-xl shadow border border-gray-700">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                    <div className='w-full md:w-[420px]'>
                        <label className="block text-gray-400 mb-1">Almacén de origen</label>
                        <select className="w-full border-gray-600 border rounded-lg py-1 px-4 bg-gray-700 text-gray-200 hover:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none">
                            <option>ALMACEN PRODUCTOS P/VENTAS</option>
                        </select>
                    </div>
                    <div className='w-full'>
                        <label className="block text-gray-400 mb-1">Buscar y agregar productos y/o servicios:</label>
                        <ProductSearchInput addProductToTable={addProductToTable} mode="sales" />
                    </div>
                </div>

                <div className='overflow-x-auto'>
                    <table className="w-full border border-gray-700 rounded-lg mt-8">
                        <thead>
                            <tr className="bg-gray-700 text-gray-400 py-2 px-4 ">
                                <th className="border border-gray-600 text-center ">Concepto</th>
                                <th className="border border-gray-600 text-center ">Valor Unitario</th>
                                <th className="border border-gray-600 text-center ">Cantidad</th>
                                <th className="border border-gray-600 text-center ">Sub Total</th>
                                <th className="border border-gray-600 text-center ">Impuestos</th>
                                <th className="border border-gray-600 text-center ">Total</th>
                                <th className="border border-gray-600 text-center ">Mascota</th>
                                <th className=" border border-gray-600 text-center ">Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedProducts.map((product) => (
                                <tr key={product.provisionalId} className="bg-gray-800 text-gray-200 text-sm">
                                    <td className='py-2 px-4 border border-gray-700 text-center'>
                                        {product.productName || product.serviceName}
                                    </td>
                                    <td className='py-2 px-4 border border-gray-700 text-center'>
                                        <span
                                            className='border border-gray-600 bg-gray-700 px-2 py-1 rounded-lg text-center w-12 cursor-pointer text-cyan-400 font-medium'
                                            onClick={() => {
                                                setProductToEdit(product)
                                                setIsPriceModalOpen(true)
                                                setIsQuantityModalOpen(false)
                                            }}
                                        >
                                            {product.salePrice}
                                        </span>
                                    </td>
                                    <td className='py-2 px-4 border border-gray-700 text-center'>
                                        <QuantityCounter
                                            itemCount={product.quantity}
                                            changeQuantity={(newQuantity) => {
                                                updateProductQuantity(product.provisionalId, newQuantity)
                                            }}
                                            maxQuantity={product?.availableStock}
                                            mode="sales"
                                            openQuantityModal={() => {
                                                setIsQuantityModalOpen(true)
                                                setIsPriceModalOpen(false)
                                                setProductToEdit(product)
                                            }}
                                        />
                                    </td>
                                    <td className='py-2 px-4 border border-gray-700 text-center'>
                                        {(product.salePrice || 0) * product.quantity}
                                    </td>
                                    <td className='py-2 px-4 border border-gray-700 text-center'>
                                        <span className='border border-gray-600 bg-gray-700 px-2 py-1 rounded-lg text-center w-12 cursor-pointer text-gray-200'>
                                            0.00
                                        </span>
                                    </td>
                                    <td className='py-2 px-4 border border-gray-700 text-center'>
                                        {(product.salePrice || 0) * product.quantity}
                                    </td>
                                    <td className='py-2 px-4 border border-gray-700 text-center text-gray-400'>{product.petSelected}</td>
                                    <td className='px-4 text-center border border-gray-700'>
                                        <div className="flex justify-center items-center h-full space-x-2">
                                            <TagIcon className='w-5 h-5 text-cyan-500 cursor-pointer' />
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
                            changeQuantity={(newQuantity) => {
                                updateProductQuantity(productToEdit.provisionalId, newQuantity)
                            }}
                            maxQuantity={productToEdit?.availableStock}
                            mode="sales"
                            onClose={() => setIsQuantityModalOpen(false)}
                        />
                    )
                }
                {
                    isSuccessModalOpen && (
                        <SuccessModal
                            onClose={() => setIsSuccessModalOpen(false)}
                        />
                    )
                }

                {
                    isErrorModalOpen && (
                        <ErrorModal onClose={() => setIsErrorModalOpen(false)} typeOfError="emptyList" />
                    )
                }

                <div className="bg-gray-800 pt-6 pb-1 rounded-xl mt-4">
                    <div className="w-full lg:w-1/2 ml-auto">
                        <table className="min-w-full bg-gray-800">
                            <tbody>
                                {taxesData.map((row, index) => (
                                    <tr key={index} className={`border-t border-gray-700 text-sm ${row.bold ? 'font-bold text-gray-200' : 'text-gray-400'}`}>
                                        <td className="py-1">{row.label}</td>
                                        <td className="py-1 text-right">{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Observaciones de Salud de la mascota */}
            <div className="w-full bg-gray-800 px-6 py-3 rounded-xl mt-4 border border-gray-700">
                <h2 className="text-xl font-semibold text-cyan-500 mb-2">Observaciones de Salud de la mascota</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {healthObservations.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-gray-400 mb-2">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.items.map((item, idx) => (
                                    <li key={idx} className="flex items-center text-gray-300 text-sm">
                                        <input
                                            type="checkbox"
                                            id={`${section.title}-${item}`}
                                            onChange={() => handleObservationChange(item)}
                                            checked={selectedObservations.includes(item)}
                                            className="mr-2 h-3 w-3 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                                        />
                                        <label htmlFor={`${section.title}-${item}`}>{item}</label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div >

            {/* Observaciones */}
            <div className='bg-gray-800 px-4 py-2 mb-4 mt-4 rounded-xl border border-gray-700'>
                <label className="block text-gray-400">Observaciones o comentarios de esta orden de servicio</label>
                <textarea
                    className="w-full mt-3 border border-gray-600 rounded-lg p-3 bg-gray-700 text-gray-200 placeholder-gray-500 max-h-60 min-h-20 hover:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                    rows={3}
                    placeholder="Añadir observaciones..."
                    value={notes}
                    onChange={handleChange}
                ></textarea>
            </div>

            {/* recordatorio en agenda */}
            <div className='bg-gray-800 px-4 py-3 mb-4 mt-1 rounded-xl shadow border border-gray-700 flex flex-col md:flex-row items-center gap-4' >

                <div className="w-full">
                    <label htmlFor="date" className="text-gray-400">Fecha de próximo servicio (recordatorio en agenda)</label>
                    <input
                        type="date"
                        id="date"
                        className="w-full py-1 px-4 mt-1.5 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 hover:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                    />
                </div>

                <div className=" w-full">
                    <label htmlFor="typeService" className="text-gray-400">Tipo de evento</label>
                    <select
                        name="type"
                        id="typeService"
                        className="w-full py-1 px-4 mt-1.5 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 hover:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                    >
                        <option value="baño">Baño</option>
                    </select>
                </div>

                <div className='w-full'>
                    <label htmlFor="client" className="text-gray-400">Anotaciones</label>
                    <input
                        type="text"
                        placeholder="Anotaciones..."
                        className="w-full py-1 px-4 mt-1.5 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-500 hover:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                    />
                </div>
            </div>

            <ActionButtons
                onCancel={() => navigate(-1)}
                cancelText="REGRESAR AL LISTADO DE ORDENES DE SERVICIO"
                onSubmit={updateGroomingOrder}
                submitText="GUARDAR CAMBIOS"
            />
        </section >
    );
}


export { EditGroomingOrder }