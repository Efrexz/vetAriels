import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClientsContext } from '@context/ClientsContext';
import { AddPatientToQueueModal } from '@components/modals/AddPatientToQueueModal';
import { ClientSearchInput } from '@components/search/ClientSearchInput';
import { ProductSearchInput } from '@components/search/ProductSearchInput';
import { QuantityCounter } from '@components/ui/QuantityCounter';
import { PriceModificationModal } from '@components/modals/PriceModificationModal';
import { QuantityModificationModal } from '@components/modals/QuantityModificationModal';
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


function Sales() {

    const { clients, petsData, removeProductFromClient } = useContext(ClientsContext);

    const tableCategories = [
        "Concepto",
        "Valor Unitario",
        "Cantidad",
        "Sub Total",
        "Impuestos",
        "Total",
        "Mascota",
        "Opciones"
    ];

    const navigate = useNavigate();
    const { id: clientId } = useParams();
    const isClientSelected = clients.find(client => client.id === Number(clientId));

    //obtenemos las mascotas que pertenecen al cliente seleccionado
    const petsByOwner = petsData.filter(pet => pet.ownerId === Number(clientId)).sort((a, b) => Number(a.hc) - Number(b.hc));

    //estado para el evento de hover sobre el nombre de las mascotas que aparecen al seleccionar un cliente
    const [hoveredPetId, setHoveredPetId] = useState(null);

    // estado para saber cual menu de mascota está visible
    const [activePetMenu, setActivePetMenu] = useState(null);

    //calcular la edad de la mascotas
    function calculateAge(birthDate) {
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

    //opciones para el menú desplegable de la mascota
    const menuOptions = [
        { icon: Stethoscope, iconColor: "text-red-500", tooltip: 'Enviar a la cola médica' },
        // { icon: ClockIcon, iconColor: "text-gray-400", tooltip: 'Ver historíal de compras', path: '/sales/invoices' },
        { icon: PenIcon, iconColor: "text-gray-700", tooltip: 'Actualizar datos', path: '/pets/pet/id/update' },
        { icon: Stethoscope, iconColor: "text-blue-400", tooltip: 'Ir a la historia clínica', path: '/pets/pet/id/clinical-records' },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);


    //estado de productos seleccionados al escribir en nuestro input de busqueda
    const [selectedProducts, setSelectedProducts] = useState(isClientSelected?.products || []);

    //agregar producto o servicio a nuestra tabla de productos a cargar al usuario para la venta
    function addProductToTable(product) {
        const provisionalId = Date.now();
        const newProduct = {
            ...product,
            provisionalId,
            quantity: 1,// por defecto siempre sera un producto al agregarlo a la lista
        };
        setSelectedProducts([...selectedProducts, newProduct]);
    }

    //creamos estado que al hacer click en editar el precio o la cantidad. Se agregue al productToEdit y tener la data de cual producto seleccionamos para hacer sus modificaciones en los modales correspondientes
    const [productToEdit, setProductToEdit] = useState(null);


    // funcion para modificar el precio de un item por el modal de editar el precio
    function handleUpdateProductPrice(updatedProduct) {
        const updatedProducts = selectedProducts.map(product =>
            product.provisionalId === updatedProduct.provisionalId ? updatedProduct : product
        );
        setSelectedProducts(updatedProducts);
    }

    function removeProduct(productId) {
        const updatedProducts = selectedProducts.filter((product) => product.provisionalId !== productId);
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
        //coloco salePrice o price porque en los servicio el precio esta como price y en los productos salePrice
        (acc, product) => acc + (product.salePrice) * product.quantity,
        0
    );

    const taxesData = [
        { label: 'Valor de venta bruto (sin descuentos)', value: totalPrice },
        { label: 'Total descuentos', value: '- 0.00' },
        { label: 'Valor de venta incluyendo descuentos', value: '0.00' },
        { label: 'Impuestos', value: '0.00' },
        { label: 'TOTAL', value: totalPrice, bold: true },
    ];
    // const [petSelected, setPetSelected] = useState(petsByOwner[0]?.petName);//por defecto seleccionamos la primera mascota del propietario por si no cambia este select


    //Modales
    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
    const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);

    return (
        <section className="w-full max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-8 overflow-auto custom-scrollbar ">
            <h1 className="text-xl sm:text-2xl font-bold text-[#4CAF50] flex items-center mb-4 mt-6 border-b-2 border-gray-100 pb-5">
                <ShoppingCartPlusIcon className="w-6 sm:w-9 h-6 sm:h-9 mr-2" />
                Ventas
            </h1>

            <div className="bg-gray-100 rounded-lg px-6 py-4 mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientSearch">
                    Buscar y seleccionar cliente:
                </label>

                <div className="flex flex-col md:flex-row items-center gap-4">
                    <ClientSearchInput mode={"sales"} />
                    <button
                        className={`${isClientSelected ? "bg-green-500 hover:bg-green-700" : "bg-[#72D78A]"
                            } flex justify-center items-center text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full md:w-[200px] `}
                        type="button"
                        disabled={!isClientSelected}
                        onClick={() => navigate(`/clients/client/${isClientSelected.id}/update`)}
                    >
                        <UserPenIcon className="w-5 h-5" />
                    </button>
                    <button
                        className="bg-purple-500 hover:bg-purple-700 flex justify-center items-center text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full md:w-[200px]"
                        type="button"
                        onClick={() => navigate("/clients/create")}
                    >
                        <NewUserIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Mascotas del cliente seleccionado */}
                {isClientSelected && (
                    <div className="flex flex-wrap gap-4 mt-6">
                        {petsByOwner.map((pet, index) => {
                            const petAge = calculateAge(pet.birthDate); // Calcula la edad de cada mascota

                            return (
                                <div key={index} className="relative">
                                    <button
                                        onMouseEnter={() => setHoveredPetId(pet.id)}
                                        onMouseLeave={() => setHoveredPetId(null)}
                                        className="py-2 px-4 bg-white hover:bg-gray-100 text-gray-600 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300 flex gap-1 items-center w-full md:w-auto"
                                        onClick={() => setActivePetMenu(activePetMenu === pet.id ? null : pet.id)}
                                    >
                                        {pet.petName}
                                        <AngleDown className="w-5 h-5" />
                                    </button>

                                    {/* Menú desplegable */}
                                    {activePetMenu === pet.id && (
                                        <div className="absolute left-0 w-[200px] bg-white border rounded-lg shadow-lg z-10 ">
                                            <ul className="py-2">
                                                {menuOptions.map((option, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex gap-1 px-2 py-2 hover:bg-gray-100 cursor-pointer border-b-2 text-sm"
                                                        onClick={() => {
                                                            if (option.path) {
                                                                const updatedPath = option.path.replace('/id', `/${pet.id}`);
                                                                navigate(updatedPath);
                                                            }
                                                            else {
                                                                setIsModalOpen(true);
                                                                setActivePetMenu(null)
                                                            }
                                                        }}
                                                    >
                                                        <option.icon className={`w-5 h-5 ${option.iconColor}`} />
                                                        {option.tooltip}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Información al hacer hover */}
                                    {hoveredPetId === pet.id && (
                                        <div className="absolute left-0 bottom-full w-[160px] md:w-52 bg-black text-white p-4 rounded shadow-lg">
                                            <span className="block">#HC: {pet.hc}</span>
                                            <span className="block">
                                                {petAge.years} {petAge.years === 1 ? "año" : "años"} y{" "}
                                                {petAge.months} {petAge.months === 1 ? "mes" : "meses"}
                                            </span>
                                            <span className="block">ESPECIE: {pet.species}</span>
                                            <span className="block">RAZA: {pet.breed}</span>
                                            <span className="block">SEXO: {pet.sex}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Botón para agregar mascotas */}
                        <button
                            className="py-2 px-4 bg-orange-400 hover:bg-orange-500 flex gap-1 items-center rounded-md ml-0 md:ml-5"
                            onClick={() => navigate(`/pets/create/${clientId}`)}
                        >
                            <PetIcon className="w-5 h-5 text-white" />
                            <PlusIcon className="w-3 h-3 text-white" />
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-gray-100 rounded-lg px-6 py-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <button
                    className={`${isClientSelected ? "bg-blue-500 hover:bg-blue-700" : "bg-[#70D0EE]"} text-white font-medium py-1 rounded focus:outline-none focus:shadow-outline mx-1 w-full`}
                    disabled={!isClientSelected}
                    onClick={() => setIsModalOpen(true)}
                >
                    Enviar a la cola médica
                </button>
                <button
                    className={`${isClientSelected ? "bg-green-500 hover:bg-green-700" : "bg-[#72D78A]"} text-white font-medium py-1 rounded focus:outline-none focus:shadow-outline mx-1 w-full`}
                    disabled={!isClientSelected}
                    onClick={() => navigate(`/grooming/order-creation/${isClientSelected.id}`)}
                >
                    Enviar a cola de grooming
                </button>
            </div>
            {
                isModalOpen && (
                    <AddPatientToQueueModal
                        onClose={() => setIsModalOpen(false)}
                        petsByOwner={petsByOwner}
                        clientData={isClientSelected}
                    />
                )
            }

            <div className="bg-white shadow-md rounded-lg p-6">
                {
                    isClientSelected && (
                        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
                            <div className=' col-span-1'>
                                <label htmlFor="store" className="block text-gray-700 mb-2 pl-2">Almacén de origen</label>
                                <select
                                    id='store'
                                    name="store"
                                    className="w-full rounded border-gray-200 border text-gray-700 sm:text-sm py-2 px-4 hover:border-blue-300  focus:border-blue-300 focus:outline-none"
                                >
                                    <option value="">VET ARIEL</option>
                                </select>
                            </div>

                            <div className='col-span-1 md:col-span-3'>
                                <label
                                    htmlFor="search"
                                    className="block text-gray-700 mb-2 pl-2">
                                    Buscar y agregar productos y servicios a la cuenta del cliente:
                                </label>
                                <ProductSearchInput addProductToTable={addProductToTable} mode={"sales"} />
                            </div>
                        </div>
                    )
                }
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 text-center bg-gray-100 border-gray-300 border-2">
                                    <input type="checkbox" className="form-checkbox" />
                                </th>
                                {tableCategories.map((category, index) => (
                                    <th
                                        key={index}
                                        className="py-2 px-4 bg-gray-100 text-gray-600 font-bold uppercase text-sm border-gray-300 border-2"
                                    >
                                        {category}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {selectedProducts.map((product) => (
                                <tr key={product.provisionalId} className="border-b">
                                    <td className="py-2 px-4 text-center border-gray-300 border-2">
                                        <input type="checkbox" className="form-checkbox" />
                                    </td>
                                    <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                        {product.productName || product.serviceName}
                                    </td>
                                    <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                        <span
                                            className='border border-gray-300 bg-white px-4 py-1 rounded text-center w-12 cursor-pointer'
                                            onClick={() => {
                                                setProductToEdit(product)
                                                setIsPriceModalOpen(true)
                                                setIsQuantityModalOpen(false)
                                            }}
                                        >
                                            {product.salePrice}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-gray-300 border-2 text-center">
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
                                    <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                        {(product.salePrice) * product.quantity}
                                    </td>
                                    <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                        <span className='border border-gray-300 bg-white px-4 py-1 rounded text-center w-12 cursor-pointer'>
                                            0.00
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                        {(product.salePrice) * product.quantity}
                                    </td>
                                    <td className="py-2 px-4 border-gray-300 border-2 text-center">
                                        <select className="border rounded p-1">
                                            {
                                                petsByOwner.map((pet, index) => (
                                                    <option key={index} value={pet.petName}>{pet.petName}</option>
                                                ))
                                            }
                                        </select>
                                    </td>
                                    <td className="py-8 px-4 text-center border-2 border-gray-300" >
                                        <div className="flex justify-center items-center h-full space-x-2">
                                            <button className="text-orange-400 hover:text-orange-500">
                                                <GiftIcon className='w-4 h-4 cursor-pointer' />
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => {
                                                    removeProductFromClient(Number(clientId), product.provisionalId);
                                                    removeProduct(product.provisionalId)
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
                            changeQuantity={(newQuantity) => {
                                updateProductQuantity(productToEdit.provisionalId, newQuantity)
                            }}
                            maxQuantity={productToEdit?.availableStock}
                            mode="sales"
                            onClose={() => setIsQuantityModalOpen(false)}
                        />
                    )
                }

                <div className=" p-6">
                    <div className="w-full lg:w-1/2 ml-auto">
                        <table className="min-w-full ">
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

            <div className="bg-gray-100 rounded-lg px-6 py-4 mt-6 flex justify-center md:justify-end">
                <button
                    className={`${!isClientSelected || selectedProducts.length < 1 ? "bg-green-400" : "bg-green-500 hover:bg-green-600"} text-white font-bold py-2 px-4 rounded`}
                    type="button"
                    onClick={() => navigate(`/sales/invoices/create/${isClientSelected.id}`, { state: { selectedProducts } })}
                    disabled={!isClientSelected || selectedProducts.length < 1}>
                    Ir a caja y generar comprobante
                </button>
            </div>
        </section>
    )
}

export { Sales };
