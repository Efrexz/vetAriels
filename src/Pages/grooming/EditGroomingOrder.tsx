import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { type Client } from '@t/client.types';
import { Product, Service, PurchasedItem } from '@t/inventory.types';
import { GroomingQueueItem } from '@t/clinical.types';
import { ProductSearchInput } from '@components/search/ProductSearchInput';
import { QuantityCounter } from '@components/ui/QuantityCounter';
import { PriceModificationModal } from '@components/modals/PriceModificationModal';
import { QuantityModificationModal } from '@components/modals/QuantityModificationModal';
import { ActionButtons } from '@components/ui/ActionButtons';
import { useToast } from '@context/ToastContext';
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
    const { toast } = useToast();

    const petInQueueGrommingData : GroomingQueueItem | undefined = petsInQueueGrooming.find((pet) => pet.id === clientId);

    const clientData : Client | undefined = clients.find((client) => client.id === petInQueueGrommingData?.petData?.ownerId);

    const [productToEdit, setProductToEdit] = useState<PurchasedItem | null>(null);


    const [isPriceModalOpen, setIsPriceModalOpen] = useState<boolean>(false);
    const [isQuantityModalOpen, setIsQuantityModalOpen] = useState<boolean>(false);

    const [selectedProducts, setSelectedProducts] = useState<PurchasedItem[]>([]);

    function handleUpdateProductPrice(updatedProduct: PurchasedItem) {
        const updatedProducts = selectedProducts.map(product =>
            product.provisionalId === updatedProduct.provisionalId
                ? updatedProduct
                : product
        );
        setSelectedProducts(updatedProducts);
    }

    function updateProductQuantity(id: string, newQuantity: number) {
        const updatedProducts = selectedProducts.map((product) =>
            product.provisionalId === id
                ? { ...product, quantity: newQuantity }
                : product
        );
        setSelectedProducts(updatedProducts);
    }

    const now = new Date();
    function addProductToTable(item: Product | Service) {
        const newItem: PurchasedItem = {
            ...item,
            petSelected: petInQueueGrommingData?.petData?.petName,
            provisionalId: generateUniqueId(),
            quantity: 1,
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

    const [notes, setNotes] = useState<string>('');

    function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
        const { value } = e.target;
        setNotes(value);
    }
    const [selectedObservations, setSelectedObservations] = useState<string[]>([]);

    function handleObservationChange(observation: string) {
        if (selectedObservations.includes(observation)) {
            setSelectedObservations(selectedObservations.filter(item => item !== observation));
        } else {
            setSelectedObservations([...selectedObservations, observation]);
        }
    }

    async function updateGroomingOrder() {
        if (selectedProducts.length < 1) {
            toast.error("Debe seleccionar al menos un producto o servicio");
            return;
        }
        const dataToSend: Partial<GroomingQueueItem> = {
            ...petInQueueGrommingData,
            productsAndServices: selectedProducts,
            notes,
            healthObservations: selectedObservations,
        };
        if (petInQueueGrommingData?.id) {
            try {
                // BUG corregido: antes pasaba clientId (el id del CLIENTE)
                // como id de la fila de cola; la orden nunca se actualizaba.
                await updatePetInQueueGrooming(petInQueueGrommingData.id, dataToSend);
                toast.success('Orden de servicio actualizada');
                navigate('/grooming');
            } catch (err) {
                const message = err instanceof Error ? err.message : 'No se pudo actualizar la orden.';
                toast.error(message);
            }
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
        <section className=" w-full bg-paper p-6 overflow-auto custom-scrollbar">
            <div className="mb-4 pb-4 border-b border-slate-200">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber mb-1">Peluquería</p>
                <h1 className="text-xl md:text-2xl font-medium text-ink flex items-center">
                    <BathIcon className="w-6 sm:w-9 h-6 sm:h-9 text-amber mr-2" />
                </h1>
            </div>
            <div className="bg-paper px-4 py-2 rounded-2xl mb-4 border border-slate-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-ink mb-1">Propietario</label>
                        <input
                            className="w-full border-slate-200 focus:outline-none"
                            value={petInQueueGrommingData?.ownerName}
                            disabled
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-ink mb-1">Mascota</label>
                        <input
                            className="w-full border-slate-200 focus:outline-none"
                            value={`${petInQueueGrommingData?.petData?.petName} (${petInQueueGrommingData?.petData?.species} | ${petInQueueGrommingData?.petData?.breed} | #HC: ${petInQueueGrommingData?.petData?.hc})`}
                            disabled
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-ink mb-1">Telefonos</label>
                        <input
                            className="w-full border-slate-200 focus:outline-none"
                            value={`${clientData?.phone1} | ${clientData?.phone2}`}
                            disabled
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-ink mb-1">Dirección</label>
                        <input
                            value={clientData?.address}
                            className=" w-full border border-slate-200 rounded-xl text-slate py-1 px-4 bg-white focus:outline-none"
                            disabled
                        />
                    </div>
                    <div className='col-span-2'>
                        <label className="block text-sm font-medium text-ink mb-1">Referencias</label>
                        <input
                            type="text"
                            className=" w-full border border-slate-200 rounded-xl text-slate py-1 px-4 bg-white focus:outline-none"
                            value={clientData?.reference}
                            disabled
                        />
                    </div>

                    <div className='col-span-2'>
                        <label className="block text-sm font-medium text-ink mb-1">Empresa</label>
                        <select className="w-full border border border-slate-200 rounded-xl py-1 px-4 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary text-sm">
                            <option>{"VETERINARIA ARIEL'S E.I.R.L 0000 - 20608438719"}</option>
                        </select>
                        <span className="text-sm text-slate mt-1">
                            Los datos de la empresa seleccionada se utilizarán en el ticket de la orden de servicio.
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-paper p-4 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                    <div className='w-full md:w-[420px]'>
                        <label className="block text-sm font-medium text-ink mb-1">Almacén de origen</label>
                        <select className="w-full border border border-slate-200 rounded-xl py-1 px-4 bg-white text-ink focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary">
                            <option>ALMACEN PRODUCTOS P/VENTAS</option>
                        </select>
                    </div>
                    <div className='w-full'>
                        <label className="block text-sm font-medium text-ink mb-1">Buscar y agregar productos y/o servicios:</label>
                        <ProductSearchInput addProductToTable={addProductToTable} mode="sales" />
                    </div>
                </div>

                <div className='overflow-x-auto'>
                    <table className="min-w-full rounded-xl mt-8">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wider text-slate">Concepto</th>
                                <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wider text-slate">Valor Unitario</th>
                                <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wider text-slate">Cantidad</th>
                                <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wider text-slate">Sub Total</th>
                                <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wider text-slate">Impuestos</th>
                                <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wider text-slate">Total</th>
                                <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wider text-slate">Mascota</th>
                                <th className="py-2 px-4 text-center text-xs font-semibold uppercase tracking-wider text-slate">Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedProducts.map((product) => (
                                <tr key={product.provisionalId} className="border-b border-slate-100 hover:bg-slate-50/50 text-ink text-sm">
                                    <td className='py-2 px-4 text-center'>
                                        {product.productName || product.serviceName}
                                    </td>
                                    <td className='py-2 px-4 text-center'>
                                        <span
                                            className='border border-slate-200 bg-white px-2 py-1 rounded-xl text-center w-12 cursor-pointer text-primary font-medium'
                                            onClick={() => {
                                                setProductToEdit(product)
                                                setIsPriceModalOpen(true)
                                                setIsQuantityModalOpen(false)
                                            }}
                                        >
                                            {product.salePrice}
                                        </span>
                                    </td>
                                    <td className='py-2 px-4 text-center'>
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
                                    <td className='py-2 px-4 text-center'>
                                        {(product.salePrice || 0) * product.quantity}
                                    </td>
                                    <td className='py-2 px-4 text-center'>
                                        <span className='border border-slate-200 bg-white px-2 py-1 rounded-xl text-center w-12 cursor-pointer text-ink'>
                                            0.00
                                        </span>
                                    </td>
                                    <td className='py-2 px-4 text-center'>
                                        {(product.salePrice || 0) * product.quantity}
                                    </td>
                                    <td className='py-2 px-4 text-center text-slate'>{product.petSelected}</td>
                                    <td className='px-4 text-center'>
                                        <div className="flex justify-center items-center h-full space-x-2">
                                            <TagIcon className='w-5 h-5 text-amber cursor-pointer' />
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

                <div className="bg-paper pt-6 pb-1 rounded-xl mt-4">
                    <div className="w-full lg:w-1/2 ml-auto">
                        <table className="min-w-full bg-white">
                            <tbody>
                                {taxesData.map((row, index) => (
                                    <tr key={index} className={`border-t border-slate-200 text-sm ${row.bold ? 'font-bold text-ink' : 'text-slate'}`}>
                                        <td className="py-1">{row.label}</td>
                                        <td className="py-1 text-right">{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="w-full bg-paper px-6 py-3 rounded-2xl mt-4 border border-slate-200">
                <h2 className="text-xl font-semibold text-amber mb-2">Observaciones de Salud de la mascota</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {healthObservations.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-ink mb-2">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.items.map((item, idx) => (
                                    <li key={idx} className="flex items-center text-slate text-sm">
                                        <input
                                            type="checkbox"
                                            id={`${section.title}-${item}`}
                                            onChange={() => handleObservationChange(item)}
                                            checked={selectedObservations.includes(item)}
                                            className="mr-2 h-4 w-4 text-primary bg-white border-slate-200 rounded focus:ring-primary/30 focus:border-primary"
                                        />
                                        <label htmlFor={`${section.title}-${item}`}>{item}</label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div >

            <div className='bg-paper px-4 py-2 mb-4 mt-4 rounded-2xl border border-slate-200'>
                <label className="block text-sm font-medium text-ink">Observaciones o comentarios de esta orden de servicio</label>
                <textarea
                    className="w-full mt-3 border border border-slate-200 rounded-xl p-3 bg-white text-ink placeholder-slate max-h-60 min-h-20 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
                    rows={3}
                    placeholder="Añadir observaciones..."
                    value={notes}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className='bg-paper px-4 py-3 mb-4 mt-1 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-4' >

                <div className="w-full">
                    <label htmlFor="date" className="text-slate">Fecha de próximo servicio (recordatorio en agenda)</label>
                    <input
                        type="date"
                        id="date"
                        className="w-full py-1 px-4 mt-1.5 border border border-slate-200 rounded-xl bg-white text-ink focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
                    />
                </div>

                <div className=" w-full">
                    <label htmlFor="typeService" className="text-slate">Tipo de evento</label>
                    <select
                        name="type"
                        id="typeService"
                        className="w-full py-1 px-4 mt-1.5 border border border-slate-200 rounded-xl bg-white text-ink focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
                    >
                        <option value="baño">Baño</option>
                    </select>
                </div>

                <div className='w-full'>
                    <label htmlFor="client" className="text-slate">Anotaciones</label>
                    <input
                        type="text"
                        placeholder="Anotaciones..."
                        className="w-full py-1 px-4 mt-1.5 border border border-slate-200 rounded-xl bg-white text-ink placeholder-slate focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
                    />
                </div>
            </div>

            <ActionButtons
                onCancel={() => navigate(-1)}
                cancelText="Regresar al listado de órdenes de servicio"
                onSubmit={updateGroomingOrder}
                submitText="Guardar cambios"
            />
        </section >
    );
}


export { EditGroomingOrder }
