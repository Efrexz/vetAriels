import { useState, useEffect, useMemo} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClients } from '@context/ClientsContext';
import { Client, Pet} from '@t/client.types';
import { PurchasedItem, Product, Service } from '@t/inventory.types';
import { AddPatientToQueueModal } from '@components/modals/AddPatientToQueueModal';
import { ClientSearchInput } from '@components/search/ClientSearchInput';
import { ProductSearchInput } from '@components/search/ProductSearchInput';
import { QuantityCounter } from '@components/ui/QuantityCounter';
import { PriceModificationModal } from '@components/modals/PriceModificationModal';
import { QuantityModificationModal } from '@components/modals/QuantityModificationModal';
import { generateUniqueId } from '@utils/idGenerator';
import ShoppingCartPlusIcon from '@assets/shoppingCartPlus.svg?react';
import NewUserIcon from '@assets/newUserIcon.svg?react';
import UserPenIcon from '@assets/userPenIcon.svg?react';
import AngleDown from '@assets/angleDown.svg?react';
import PetIcon from '@assets/petIcon.svg?react';
import PlusIcon from '@assets/plusIcon.svg?react';
import Stethoscope from '@assets/stethoscope.svg?react';
import PenIcon from '@assets/penIcon.svg?react';
// import ClockIcon from '@assets/clockIcon.svg?react';
import TrashIcon from '@assets/trashIcon.svg?react';
import GiftIcon from '@assets/giftIcon.svg?react';

interface PetAge { years: number; months: number; days: number;}

const tableCategories: string[] = ["Concepto", "Valor Unitario", "Cantidad", "Sub Total", "Impuestos", "Total", "Mascota", "Opciones"];

//opciones para el menú desplegable de la mascota
const menuOptions = [
    { icon: Stethoscope, iconColor: "text-red-500", tooltip: 'Enviar a la cola médica' },
    // { icon: ClockIcon, iconColor: "text-gray-400", tooltip: 'Ver historíal de compras', path: '/sales/invoices' },
    { icon: PenIcon, iconColor: "text-gray-700", tooltip: 'Actualizar datos', path: '/pets/pet/id/update' },
    { icon: Stethoscope, iconColor: "text-blue-400", tooltip: 'Ir a la historia clínica', path: '/pets/pet/id/clinical-records' },
];


function Sales() {

    const { clients, petsData, removeProductFromClient, addProductToClient } = useClients();
    const navigate = useNavigate();
    const { id: clientId } = useParams<{ id: string }>();

    const clientData: Client | undefined = useMemo(() => clients.find(client => client.id === clientId), [clients, clientId]);

    //obtenemos las mascotas que pertenecen al cliente seleccionado
    const petsByOwner: Pet[] = useMemo(() =>
        clientData  ? petsData.filter(pet => pet.ownerId === clientData.id).sort((a, b) => Number(a.hc) - Number(b.hc)) : [],
    [petsData, clientData]);

    //estado de productos seleccionados al escribir en nuestro input de busqueda
    const [selectedProducts, setSelectedProducts] = useState<PurchasedItem[]>([]);
    //creamos estado que al hacer click en editar el precio o la cantidad. Se agregue al productToEdit y tener la data de cual producto seleccionamos para hacer sus modificaciones en los modales correspondientes
    const [productToEdit, setProductToEdit] = useState<PurchasedItem | null>(null);
    //estado para el evento de hover sobre el nombre de las mascotas que aparecen al seleccionar un cliente
    const [hoveredPetId, setHoveredPetId] = useState<string | null>(null);
    // estado para saber cual menu de mascota está visible
    const [activePetMenu, setActivePetMenu] = useState<string | null>(null);

    //Modales
    const [isQueueModalOpen, setQueueModalOpen] = useState(false);
    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
    const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);

    // sincroniza el estado local selectedProducts con los datos del cliente cuando el clientId cambia.
    useEffect(() => {
        setSelectedProducts(clientData?.products || []);
    }, [clientData]);


    //calcular la edad de la mascotas
    function calculateAge(birthDate: string): PetAge {
        if (!birthDate) return { years: 0, months: 0, days: 0 };
        const today = new Date();
        const birth = new Date(birthDate);

        let ageYears = today.getFullYear() - birth.getFullYear();
        let ageMonths = today.getMonth() - birth.getMonth();
        let ageDays = today.getDate() - birth.getDate();

        // Ajustar los días y meses si es necesario
        if (ageDays < 0) {
            ageMonths -= 1; // Quitar un mes
            // Obtener los días del mes anterior
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            ageDays += lastMonth.getDate(); // Sumar días del mes anterior
        }

        if (ageMonths < 0) {
            ageYears -= 1; // Quitar un año
            ageMonths += 12; // Ajustar los meses
        }
        return { years: ageYears, months: ageMonths, days: ageDays };
    }

    //agregar producto o servicio a nuestra tabla de productos a cargar al usuario para la venta
    function handleAddProduct(item: Product | Service) {
        const newProduct: PurchasedItem = {
            ...item,
            provisionalId: generateUniqueId(),
            quantity: 1, // por defecto siempre sera un producto al agregarlo a la lista
            additionDate: new Date().toLocaleDateString(),
            additionTime: new Date().toLocaleTimeString(),
        };
        // Actualizamos tanto el estado local como el contexto global
        setSelectedProducts(prev => [...prev, newProduct]);
        if (clientData) {
            addProductToClient(clientData.id, newProduct);
        }
    }

    // funcion para modificar el precio de un item por el modal de editar el precio
    function updateProductPriceInTable (updatedProduct: PurchasedItem){
        const updatedList = selectedProducts.map(product => product.provisionalId === updatedProduct.provisionalId ? updatedProduct : product);
        setSelectedProducts(updatedList);
    };

    function updateProductQuantity (id: string, newQuantity: number) {
        const updatedList = selectedProducts.map(product => product.provisionalId === id ? { ...product, quantity: newQuantity } : product);
        setSelectedProducts(updatedList);
    };

    function removeProductFromTable (provisionalId: string) {
        setSelectedProducts(prev => prev.filter(product => product.provisionalId !== provisionalId));
        if (clientData) {
            removeProductFromClient(clientData.id, provisionalId);
        }
    };

    const totalPrice = useMemo(() =>
        selectedProducts.reduce((acc, product) => acc + (product.salePrice || 0) * product.quantity, 0),
    [selectedProducts]);

    const taxesData = [
        { label: 'Valor de venta bruto', value: totalPrice.toFixed(2) },
        { label: 'Total descuentos', value: '- 0.00' },
        { label: 'Impuestos', value: '0.00' },
        { label: 'TOTAL', value: totalPrice.toFixed(2), bold: true },
    ];
    // const [petSelected, setPetSelected] = useState(petsByOwner[0]?.petName);//por defecto seleccionamos la primera mascota del propietario por si no cambia este select

    if (!clientData && clientId !== 'no_client') {
        return (
            <section className="w-full text-center mt-10">
                <h2 className="text-2xl font-semibold text-gray-700">Cliente no encontrado</h2>
                <p className="text-gray-500 mt-2">El cliente con el ID especificado no existe. Por favor, seleccione uno nuevo.</p>
                <div className='max-w-md mx-auto mt-4'><ClientSearchInput mode={"sales"} /></div>
            </section>
        );
    }

    return (
        <section className="w-full p-4 sm:px-6 lg:px-8 bg-gray-950 text-gray-50 min-h-screen">
            <h1 className="text-xl sm:text-3xl font-medium text-white mb-6 tracking-wide border-b border-cyan-500 pb-3 flex items-center">
                <ShoppingCartPlusIcon className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-cyan-400 drop-shadow-lg" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">Ventas</span>
            </h1>

            <div className="bg-gray-900 rounded-2xl px-6 py-3 mb-6 border border-gray-700 shadow-xl">
                <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="clientSearch">
                    Buscar y seleccionar cliente:
                </label>
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <ClientSearchInput mode={"sales"} />
                    <button
                        className={`flex justify-center items-center text-white font-bold py-1.5 px-4 rounded-xl focus:outline-none focus:shadow-outline w-full md:w-[200px] transition-all
                            ${clientData ? "bg-green-600 hover:bg-green-700 shadow-md shadow-green-500/50" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
                        type="button"
                        disabled={!clientData}
                        onClick={() => navigate(`/clients/client/${clientData?.id}/update`)}
                    >
                        <UserPenIcon className="w-5 h-5 mr-2" />
                    </button>
                    <button
                        className="flex justify-center items-center text-white font-bold py-1.5 px-4 rounded-xl focus:outline-none focus:shadow-outline w-full md:w-[200px] bg-purple-600 hover:bg-purple-700 transition-all shadow-md shadow-purple-500/50"
                        type="button"
                        onClick={() => navigate("/clients/create")}
                    >
                        <NewUserIcon className="w-5 h-5 mr-2" />
                    </button>
                </div>
                {/* Mascotas del cliente seleccionado */}
                {clientData && (
                    <div className="flex flex-wrap gap-4 mt-4">
                        {petsByOwner.map((pet) => {
                            const petAge = calculateAge(pet.birthDate); // Calcula la edad de cada mascota

                            return (
                                <div key={pet.id} className="relative">
                                    <button
                                        onMouseEnter={() => setHoveredPetId(pet.id)}
                                        onMouseLeave={() => setHoveredPetId(null)}
                                        className="py-1 px-4 bg-gray-800 hover:bg-gray-700 text-cyan-400 rounded-xl border border-gray-600 focus:outline-none focus:border-cyan-500 flex gap-1 items-center w-full md:w-auto transition-all"
                                        onClick={() => setActivePetMenu(activePetMenu === pet.id ? null : pet.id)}
                                    >
                                        {pet.petName}
                                        <AngleDown className="w-4 h-4" />
                                    </button>

                                    {/* Menú desplegable */}
                                    {activePetMenu === pet.id && (
                                        <div className="absolute left-0 w-[200px] bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-10 animate-fade-in-down">
                                            <ul className="py-2">
                                                {menuOptions.map((option, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 cursor-pointer text-sm border-b border-gray-700 last:border-b-0 transition-colors"
                                                        onClick={() => {
                                                            //si tiene ruta navegamos a ese lado y si no es que esta queriendo abrir el modal de enviar a cola
                                                            if (option.path) {
                                                                const updatedPath = option.path.replace('/id', `/${pet.id}`);
                                                                navigate(updatedPath);
                                                            } else {
                                                                setQueueModalOpen(true);
                                                                setActivePetMenu(null)
                                                            }
                                                        }}
                                                    >
                                                        <option.icon className={`w-5 h-5 ${option.iconColor} drop-shadow-lg`} />
                                                        <span className="text-gray-200">{option.tooltip}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Información al hacer hover */}
                                    {hoveredPetId === pet.id && (
                                        <div className="absolute left-0 bottom-full w-[160px] md:w-52 bg-gray-700 text-gray-200 p-4 rounded-lg shadow-xl mb-2 z-20">
                                            <span className="block text-sm">#HC: {pet.hc}</span>
                                            <span className="block text-sm">
                                                {petAge.years} {petAge.years === 1 ? "año" : "años"} y{" "}
                                                {petAge.months} {petAge.months === 1 ? "mes" : "meses"}
                                            </span>
                                            <span className="block text-sm">ESPECIE: {pet.species}</span>
                                            <span className="block text-sm">RAZA: {pet.breed}</span>
                                            <span className="block text-sm">SEXO: {pet.sex}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {/* Botón para agregar mascotas */}
                        <button
                            className="py-1 px-3 bg-orange-600 hover:bg-orange-700 flex gap-1 items-center rounded-xl transition-all shadow-md shadow-orange-500/50"
                            onClick={() => navigate(`/pets/create/${clientId}`)}
                        >
                            <PetIcon className="w-5 h-5 text-white" />
                            <PlusIcon className="w-3 h-3 text-white" />
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-gray-900 rounded-2xl px-20 py-2.5 mb-6 flex flex-col md:flex-row justify-between items-center gap-4 border border-cyan-500 shadow-xl ">
                <button
                    className={`text-white font-bold py-1 px-28 rounded-xl focus:outline-none w-full md:w-auto transition-all
                    ${petsByOwner.length !== 0 ? "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/50" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
                    disabled={ petsByOwner.length === 0}
                    onClick={() => setQueueModalOpen(true)}
                >
                    Enviar a la cola médica
                </button>
                <button
                    className={`text-white font-bold py-1 px-28 rounded-xl focus:outline-none w-full md:w-auto transition-all
                    ${petsByOwner.length !== 0 ? "bg-green-600 hover:bg-green-700 shadow-md shadow-green-500/50" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
                    disabled={petsByOwner.length === 0}
                    onClick={() => {
                        //esto para evitar el error que lanza vscode de que clientData puede ser undefined
                        if (clientData) {
                            navigate(`/grooming/order-creation/${clientData.id}`)
                        }
                    }}
                >
                    Enviar a cola de grooming
                </button>
            </div>

            {
                isQueueModalOpen && clientData && (
                    <AddPatientToQueueModal
                        onClose={() => setQueueModalOpen(false)}
                        petsByOwner={petsByOwner}
                        clientData={clientData}
                    />
                )
            }

            <div className="bg-gray-900 shadow-xl rounded-2xl px-4 py-3 border border-gray-700">
                {clientData && (
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-6'>
                        <div className='col-span-1'>
                            <label htmlFor="store" className="block text-gray-400 mb-1 pl-2">Almacén de origen</label>
                            <select
                                id='store'
                                name="store"
                                className="w-full rounded-xl border-gray-600 border-2 bg-gray-800 text-gray-200 py-1 px-4 hover:border-cyan-500 focus:border-cyan-500 focus:outline-none transition-colors"
                            >
                                <option value="">VET ARIEL</option>
                            </select>
                        </div>
                        <div className='col-span-1 md:col-span-3'>
                            <label
                                htmlFor="search"
                                className="block text-gray-400 mb-1 pl-1">
                                Buscar y agregar productos y servicios a la cuenta del cliente:
                            </label>
                            <ProductSearchInput addProductToTable={handleAddProduct} mode={"sales"} />
                        </div>
                    </div>
                )}
                <div className="overflow-x-auto custom-scrollbar border border-gray-700 rounded-xl">
                    <table className="min-w-full rounded-xl overflow-hidden">
                        <thead>
                            <tr className="bg-gray-700 text-gray-300 uppercase text-xs font-bold">
                                <th className="py-2 px-3 text-center border-gray-600 border-r">
                                    <input type="checkbox" className="form-checkbox text-blue-500 rounded-sm focus:ring-blue-500" />
                                </th>
                                {tableCategories.map((category, index) => (
                                    <th
                                        key={index}
                                        className="py-2 px-3 text-center font-bold border-r border-gray-600"
                                    >
                                        {category}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-gray-200 text-xs sm:text-sm font-light ">
                            {selectedProducts.map((product) => (
                                <tr key={product.provisionalId} className="hover:bg-gray-700/50 transition-colors border-b border-gray-700">
                                    <td className="py-2 px-3 text-center border-x border-gray-700">
                                        <input type="checkbox" className="form-checkbox text-blue-500 rounded-sm focus:ring-blue-500" />
                                    </td>
                                    <td className="py-2 px-3 border-r border-gray-700 text-center whitespace-nowrap">{product.productName || product.serviceName}</td>
                                    <td className="py-2 px-3 border-r border-gray-700 text-center ">
                                        <span
                                            className='inline-block bg-gray-800 border border-gray-600 px-2 py-1 rounded-lg cursor-pointer hover:border-cyan-500 transition-colors text-xs'
                                            onClick={() => {
                                                setProductToEdit(product)
                                                setIsPriceModalOpen(true)
                                                setIsQuantityModalOpen(false)
                                            }}
                                        >
                                            {product.salePrice}
                                        </span>
                                    </td>
                                    <td className="py-2 px-3 border-r border-gray-700 text-center">
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
                                    <td className="py-2 px-3 border-r border-gray-700 text-center">
                                        {(product.salePrice || 0) * product.quantity}
                                    </td>
                                    <td className="py-2 px-3 border-r border-gray-700 text-center">
                                        <span className='inline-block bg-gray-800 border border-gray-600 px-2 py-1 rounded-lg text-xs'>
                                            0.00
                                        </span>
                                    </td>
                                    <td className="py-2 px-3 border-r border-gray-700 text-center">
                                        {(product.salePrice || 0) * product.quantity}
                                    </td>
                                    <td className="py-2 px-3 border-r border-gray-700 text-center">
                                        <select className="bg-gray-800 border border-gray-600 rounded-lg p-1 text-sm focus:outline-none focus:border-cyan-500 transition-colors">
                                            {
                                                petsByOwner.map((pet, index) => (
                                                    <option key={index} value={pet.petName}>{pet.petName}</option>
                                                ))
                                            }
                                        </select>
                                    </td>
                                    <td className="py-2 px-3 border-r border-gray-700 text-center">
                                        <div className="flex justify-center items-center space-x-2">
                                            <button className="text-orange-400 hover:text-orange-500 transition-colors">
                                                <GiftIcon className='w-4 h-4 cursor-pointer' />
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-600 transition-colors"
                                                onClick={() => {
                                                    if (clientId) {
                                                        removeProductFromClient(clientId, product.provisionalId);
                                                    }
                                                }}
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {
                    isPriceModalOpen && productToEdit && (
                        <PriceModificationModal
                            onClose={() => setIsPriceModalOpen(false)}
                            productToEdit={productToEdit}
                            updateProductPrice={updateProductPriceInTable}
                        />
                    )
                }
                {
                    isQuantityModalOpen && (
                        <QuantityModificationModal
                            quantity={Number(productToEdit?.quantity)}
                            changeQuantity={(newQuantity) => {
                                if(productToEdit)
                                updateProductQuantity(productToEdit.provisionalId, newQuantity)
                            }}
                            maxQuantity={productToEdit?.availableStock}
                            mode="sales"
                            onClose={() => setIsQuantityModalOpen(false)}
                        />
                    )
                }

                <div className="p-6">
                    <div className="w-full lg:w-1/2 ml-auto">
                        <table className="min-w-full">
                            <tbody>
                                {taxesData.map((row, index) => (
                                    <tr key={index} className={`border-t border-gray-700 text-sm ${row.bold ? 'font-bold' : ''}`}>
                                        <td className="py-1 text-gray-400">{row.label}</td>
                                        <td className="py-1 text-right text-gray-200">{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            <div className="bg-gray-900 rounded-2xl px-6 py-3 mt-4 flex justify-center md:justify-end border border-gray-700 shadow-xl">
                <button
                    className={`font-bold py-1.5 px-6 rounded-xl transition-all shadow-md
                    ${!clientData || selectedProducts.length < 1 ? "bg-green-700 text-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white shadow-green-500/50"}`}
                    type="button"
                    onClick={() => {
                        if (clientData) {
                            navigate(`/sales/invoices/create/${clientData.id}`, { state: { selectedProducts } })
                        }
                    }}
                    disabled={!clientData || selectedProducts.length < 1}>
                    Ir a caja y generar comprobante
                </button>
            </div>
        </section>
    )
}

export { Sales };