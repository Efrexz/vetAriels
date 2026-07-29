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
import { useToast } from '@context/ToastContext';
import { generateUniqueId } from '@utils/idGenerator';
import BathIcon from '@assets/bathIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import TagIcon from '@assets/tagIcon.svg?react';

function GroomingOrderCreation() {

    const { clients, petsData, addPetToQueueGrooming, petsInQueueGrooming } = useClients();
    const navigate = useNavigate();
    const { id: clientId } = useParams<{ id: string }>();
    const { toast } = useToast();

    const [selectedProducts, setSelectedProducts] = useState<PurchasedItem[]>([]);

    const [productToEdit, setProductToEdit] = useState<PurchasedItem | null>(null);

    const clientData: Client | undefined =  clients.find(client => client.id === clientId)

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

    function updateProductQuantity(itemId: string, newQuantity: number) {
        const updatedProducts = selectedProducts.map((product) =>
            product.provisionalId === itemId
                ? { ...product, quantity: newQuantity }
                : product
        );
        setSelectedProducts(updatedProducts);
    }

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

    const taxesData = [
        { label: 'Valor de venta bruto (sin descuentos)', value: totalPrice },
        { label: 'Total descuentos', value: '- 0.00' },
        { label: 'Valor de venta incluyendo descuentos', value: '0.00' },
        { label: 'Impuestos', value: '0.00' },
        { label: 'TOTAL', value: totalPrice, bold: true },
    ];

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

    const [notes, setNotes] = useState<string>('');

    function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
        const { value } = e.target;
        setNotes(value);
    }

    const [isPriceModalOpen, setIsPriceModalOpen] = useState<boolean>(false);
    const [isQuantityModalOpen, setIsQuantityModalOpen] = useState<boolean>(false);

    function sendInfoToQueueGrooming() {
        if (selectedProducts.length < 1) {
            toast.error("Debe seleccionar al menos un producto o servicio");
            return;
        }
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
                : 1,
            systemCode: petSelectedData.hc,
            ownerName: `${clientData.firstName} ${clientData.lastName}`,
            notes,
            dateOfAttention: now.toLocaleDateString(),
            timeOfAttention: now.toLocaleTimeString(),
            state: "Pendiente",
            productsAndServices: selectedProducts,
            healthObservations: [],
        };
        addPetToQueueGrooming(dataToSend);
        navigate("/grooming");
    }

    return (
        <section className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">Peluquería</span>
                <h1 className="text-2xl font-bold font-display text-ink">
                    Nueva orden de servicio
                </h1>
            </div>
            <div className="bg-paper px-4 py-3 rounded-2xl mb-4 border border-slate-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-ink mb-2">Propietario</label>
                        <ClientSearchInput mode={"grooming"} />
                    </div>
                    <div className="col-span-2 ">
                        <label className="block text-sm font-medium text-ink">Mascota</label>
                        {
                            clientData ? (
                                <select
                                    className="w-full mt-2 bg-white border border-slate-200 rounded-xl py-1 px-4 text-ink focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
                                    value={petSelectedName}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setPetSelectedName(e.target.value)}
                                >
                                    {petsByOwner.length > 0 ? (
                                        petsByOwner.map((pet) => (
                                            <option key={pet.id} value={pet.petName}>{pet.petName}</option>
                                        ))
                                    ) : (
                                        <option value="">No hay mascotas para este cliente</option>
                                    )}
                                </select>
                            ) :
                                (
                                    <input
                                        className="w-full mt-2 border border-slate-200 rounded-xl py-1 px-4 bg-white text-slate hover:border-primary/60"
                                        value=""
                                        disabled
                                    />
                                )
                        }
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-ink">Dirección</label>
                        <input
                            value={clientData ? `${clientData.address}, ${clientData.district} ` : ''}
                            className="mt-2 w-full border border-slate-200 rounded-xl py-1 px-4 bg-white text-slate"
                            disabled
                        />
                    </div>
                    <div className='col-span-2'>
                        <label className="block text-sm font-medium text-ink">Referencias</label>
                        <input
                            type="text"
                            className="mt-2 w-full border border-slate-200 rounded-xl py-1 px-4 bg-white text-slate"
                            value={clientData ? `${clientData.reference}` : ''}
                            disabled
                        />
                    </div>

                    <div className='col-span-2'>
                        <label className="block text-sm font-medium text-ink">Empresa</label>
                        <select className="w-full mt-2 border border-slate-200 rounded-xl py-1 px-3  bg-white text-ink focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary">
                            <option>VETERINARIA ARIEL`S E.I.R.L 0000 - 20608438719</option>
                        </select>
                        <span className="text-sm text-slate mt-1">
                            Los datos de la empresa seleccionada se utilizarán en el ticket de la orden de servicio.
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-paper px-4 py-3 rounded-2xl shadow-sm border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-ink mb-2">Almacén de origen</label>
                        {clientData ? (
                            <select className="w-full bg-white border border-slate-200 rounded-xl py-1 px-4 text-ink focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary">
                                <option>ALMACEN PRODUCTOS P/VENTAS</option>
                            </select>
                        ) : (
                            <input
                                className="w-full bg-white border border-slate-200 rounded-xl py-1 px-4 text-slate"
                                value="ALMACEN PRODUCTOS P/VENTAS"
                                disabled
                            />
                        )}
                    </div>
                    <div className="col-span-1 md:col-span-3">
                        <label className="block text-sm font-medium text-ink mb-2">
                            Buscar y agregar productos y/o servicios:
                        </label>
                        {clientData ? (
                            <ProductSearchInput addProductToTable={addProductToTable} mode="sales" />
                        ) : (
                            <input
                                className="w-full bg-white border border-slate-200 rounded-xl py-1 px-4 text-slate"
                                value=""
                                disabled
                            />
                        )}
                    </div>
                </div>

                <div className='overflow-x-auto rounded-xl'>
                    <table className="min-w-full bg-white rounded-xl mt-2">
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
                                <tr key={product.provisionalId} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors text-sm">
                                    <td className='py-2 px-4 text-center text-ink'>
                                        {product.productName || product.serviceName}
                                    </td>
                                    <td className='py-2 px-4 text-center text-ink'>
                                        <span
                                            className='border border-slate-200 bg-paper px-2 py-1 rounded-xl text-center w-12 cursor-pointer text-ink hover:border-primary/60'
                                            onClick={() => {
                                                setProductToEdit(product)
                                                setIsPriceModalOpen(true)
                                                setIsQuantityModalOpen(false)
                                            }}
                                        >
                                            {product.salePrice}
                                        </span>
                                    </td>
                                    <td className='py-2 px-4 text-center text-ink'>
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
                                    <td className='py-2 px-4 text-center text-ink'>
                                        {(product.salePrice || 0) * product.quantity}
                                    </td>
                                    <td className='py-3 px-3 text-center text-ink'>
                                        <span className='border border-slate-200 bg-paper px-2 py-1 rounded-xl text-center w-12 cursor-pointer hover:border-primary/60'>
                                            0.00
                                        </span>
                                    </td>
                                    <td className='py-2 px-4 text-center text-ink'>
                                        {(product.salePrice || 0) * product.quantity}
                                    </td>
                                    <td className='py-2 px-4 text-center text-ink'>{product.petSelected}</td>
                                    <td className='py-2 px-4 text-center'>
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

                <div className="bg-paper pt-6 ">
                    <div className="w-full lg:w-1/2 ml-auto">
                        <table className="min-w-full bg-white">
                            <tbody>
                                {taxesData.map((row, index) => (
                                    <tr key={index} className={`border-t border-slate-200 ${row.bold ? 'font-bold' : ''}`}>
                                        <td className="py-2 text-slate">{row.label}</td>
                                        <td className="py-2 text-right text-slate">{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className='bg-paper px-4 py-3 mb-4 mt-4 rounded-2xl shadow-sm border border-slate-200'>
                <label htmlFor="note" className="block text-sm font-medium text-ink">Observaciones o comentarios de esta orden de servicio</label>
                <textarea
                    className="w-full mt-3 border border-slate-200 rounded-xl p-3 bg-white text-ink placeholder-slate max-h-60 min-h-20 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
                    id="note"
                    rows={3}
                    placeholder="Añadir observaciones..."
                    value={notes}
                    onChange={handleChange}
                ></textarea>
            </div>

            <div className="bg-paper px-4 py-3 mb-4 mt-1 rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-4 border border-slate-200">
                <div className="w-full">
                    <label htmlFor="date" className="block text-sm font-medium text-ink">Fecha de próximo servicio</label>
                    <input
                        type="date"
                        id="date"
                        className="w-full py-1 px-4 mt-1.5 bg-white border border-slate-200 rounded-xl text-ink focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="typeService" className="block text-sm font-medium text-ink">Tipo de evento</label>
                    <select
                        name="type"
                        id="typeService"
                        className="w-full py-1 px-4 mt-1.5 bg-white border border-slate-200 rounded-xl text-ink focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
                    >
                        <option className="bg-white" value="baño">Baño</option>
                    </select>
                </div>

                <div className="w-full">
                    <label htmlFor="client" className="block text-sm font-medium text-ink">Anotaciones</label>
                    <input
                        type="text"
                        placeholder="Anotaciones..."
                        className="w-full py-1 px-4 mt-1.5 bg-white border border-slate-200 rounded-xl text-ink placeholder-slate focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
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

            </div>

            <ActionButtons
                onCancel={() => navigate(-1)}
                onSubmit={sendInfoToQueueGrooming}
                submitText="Crear orden de servicio"
            />
        </section >
    );
}


export { GroomingOrderCreation }
