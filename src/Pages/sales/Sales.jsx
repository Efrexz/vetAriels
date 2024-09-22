import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClientsContext } from '../../context/ClientsContext';
import { AddPatientToQueueModal } from '../../components/AddPatientToQueueModal';
import ShoppingCartPlusIcon from '../../assets/shoppingCartPlus.svg?react';
import NewUserIcon from '../../assets/newUserIcon.svg?react';
import UserPenIcon from '../../assets/userPenIcon.svg?react';
import AngleDown from '../../assets/angleDown.svg?react';
import PetIcon from '../../assets/petIcon.svg?react';
import PlusIcon from '../../assets/plusIcon.svg?react';
import SearchIcon from '../../assets/searchIcon.svg?react';
import Stethoscope from '../../assets/stethoscope.svg?react';
import PenIcon from '../../assets/penIcon.svg?react';
import ClockIcon from '../../assets/clockIcon.svg?react';


function Sales() {

    const { clients, petsData } = useContext(ClientsContext);

    const tableCategories = [
        "Select",
        "Concepto",
        "Valor Unitario",
        "Cantidad",
        "Sub Total",
        "Impuestos",
        "Total",
        "Mascota",
        "Opciones"
    ];

    const tableData = [
        { label: 'Valor de venta bruto (sin descuentos)', value: '0.00' },
        { label: 'Total descuentos', value: '- 0.00' },
        { label: 'Valor de venta incluyendo descuentos', value: '0.00' },
        { label: 'Impuestos', value: '0.00' },
        { label: 'ICBPER', value: '0.00' },
        { label: 'TOTAL', value: '0.00', bold: true },
    ];
    const navigate = useNavigate();
    const { id } = useParams();
    const isClientSelected = clients.find(client => client.id === Number(id));

    //si existe un cliente seleccionado, mostramos su nombre en el buscador y asi evitamos el error que al cambiar de pagina y volver el input esta vacio
    const [searchTerm, setSearchTerm] = useState(isClientSelected ? `${isClientSelected.firstName} ${isClientSelected.lastName}` : '');

    //estado para saber cuando el input tiene el foco para mostrar la lista de clientes que coinciden con el buscador
    const [isFilteredListVisible, setIsFilteredListVisible] = useState(false);

    //filtramos los clientes que coinciden con el buscador
    const filteredClients = clients.filter(client =>
        `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );



    //obtenemos las mascotas que pertenecen al cliente seleccionado
    const petsByOwner = petsData.filter(pet => pet.ownerId === Number(id));

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

        return { years: ageYears, months: ageMonths, days: ageDays };
    }

    //opciones para el menú desplegable de la mascota
    const menuOptions = [
        { icon: Stethoscope, iconColor: "text-red-500", tooltip: 'Enviar a la cola médica', path: '/sales/active-orders' },
        { icon: ClockIcon, iconColor: "text-gray-400", tooltip: 'Ver historíal de compras', path: '/sales/invoices' },
        { icon: ClockIcon, iconColor: "text-gray-700", tooltip: 'Ver historial de grooming', path: '/sales/payments' },
        { icon: PenIcon, iconColor: "text-gray-700", tooltip: 'Actualizar datos', path: '/sales/payments' },
        { icon: Stethoscope, iconColor: "text-blue-400", tooltip: 'Ir a la historia clínica', path: '/sales/payments' },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-[#4CAF50] flex items-center mb-4 border-b-2 border-gray-100 pb-5">
                <ShoppingCartPlusIcon className="h-8 w-8 mr-2" />
                Ventas
            </h1>

            <div className="bg-gray-100 rounded-lg px-6 py-4 mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientSearch">
                    Buscar y seleccionar cliente:
                </label>
                <div className="flex gap-4">
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="clientSearch"
                        type="text"
                        placeholder="Buscar cliente..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsFilteredListVisible(true); // Mostrar el dropdown cuando escribes
                        }}
                        onFocus={() => setIsFilteredListVisible(true)} // Mostrar cuando el input tiene el foco
                        onBlur={() => setTimeout(() => setIsFilteredListVisible(false), 150)} // Ocultamos al perder foco con un poco de delay xD
                    />
                    <button
                        className={`ml-2 ${isClientSelected ? "bg-green-500 hover:bg-green-700" : "bg-[#72D78A]"} text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline px-24`}
                        type="button"
                        disabled={!isClientSelected}
                        onClick={() => navigate(`/clients/client/${isClientSelected.id}/update`)}
                    >
                        <UserPenIcon className="w-5 h-5" />
                    </button>
                    <button
                        className="ml-2 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 rounded focus:outline-none focus:shadow-outline px-24"
                        type="button"
                        onClick={() => navigate("/clients/create")}>
                        <NewUserIcon className="w-5 h-5" />
                    </button>
                </div>

                {/*Filtrado de busqueda de clientes */}
                {(searchTerm.length >= 3 && isFilteredListVisible) && (
                    <ul className="bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredClients.map((client, index) => {
                            // Filtramos las mascotitass que pertenecen a este cliente
                            const clientPets = petsData.filter(pet => pet.ownerId === client.id);
                            const clientPetNames = clientPets.map(pet => pet.petName);
                            return (
                                <li
                                    key={index}
                                    className="p-2 cursor-pointer hover:bg-blue-100"
                                    onClick={() => {
                                        setSearchTerm(`${client.firstName} ${client.lastName}`);
                                        setIsFilteredListVisible(false); // Ocultar dropdown al seleccionar
                                        navigate(`/sales/client/${client.id}`);
                                    }}
                                >
                                    <div className="font-bold">{`${client.firstName} ${client.lastName}`}</div>
                                    <div className="text-sm text-gray-500">{`${client.phone1} ${client.phone2}`}</div>
                                    <div className="text-sm text-gray-500">
                                        Mascotas: {clientPetNames.join(', ')}
                                    </div>
                                </li>
                            );
                        })}
                        {filteredClients.length === 0 && (
                            <li className="p-2 text-gray-500">No se encontraron coincidencias</li>
                        )}
                    </ul>
                )}

                {/* Mascotas del cliente seleccionado */}
                {
                    isClientSelected &&
                    (<div className='flex gap-2 mt-6'>
                        {
                            petsByOwner.map((pet, index) => {
                                //calculamos la edad de cada mascotita para poder mostrarla en el cuadro de información
                                const petAge = calculateAge(pet.birthDate);

                                return (
                                    <div key={index} className="relative">
                                        <button
                                            onMouseEnter={() => setHoveredPetId(pet.id)}
                                            onMouseLeave={() => setHoveredPetId(null)}
                                            className='py-2 px-4 bg-white hover:bg-gray-100 text-gray-600 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-300 flex gap-1 items-center'
                                            onClick={() => setActivePetMenu(activePetMenu === pet.id ? null : pet.id)}
                                        >
                                            {pet.petName}
                                            <AngleDown className='w-5 h-5' />
                                        </button>

                                        {/* Menu desplegable por mascota*/}
                                        {activePetMenu === pet.id && (
                                            <div className="absolute left-0 w-52 bg-white border rounded-lg shadow-lg z-10">
                                                <ul className="py-2">
                                                    {
                                                        menuOptions.map((option, index) => (
                                                            <li key={index} className="flex gap-1 px-2 py-2 hover:bg-gray-100 cursor-pointer border-b-2 text-sm">
                                                                <option.icon className={`w-5 h-5 ${option.iconColor}`} />
                                                                {option.tooltip}
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                        )}

                                        {/* Cuadro de información al hacer hover */}
                                        {
                                            hoveredPetId === pet.id && (
                                                <div className="absolute left-0 bottom-full w-52 bg-black text-white p-4 rounded shadow-lg">
                                                    <span className='block'>#HC: {pet.hc}</span>
                                                    <span
                                                        className='block'>
                                                        {petAge.years} {petAge.years === 1 ? "año" : "años"} y {petAge.months} {petAge.months === 1 ? "mes" : "meses"}
                                                    </span>
                                                    <span className='block'>ESPECIE: {pet.species}</span>
                                                    <span className='block'>RAZA: {pet.breed}</span>
                                                    <span className='block'>SEXO: {pet.sex}</span>
                                                </div>
                                            )}
                                    </div>
                                )
                            })
                        }
                        <button
                            className='py-2 px-4 bg-orange-400 hover:bg-orange-500 flex gap-1 items-center rounded-md ml-5'
                            onClick={() => navigate(`/pets/create/${id}`)}
                        >
                            <PetIcon className='w-5 h-5 text-white' />
                            <PlusIcon className='w-3 h-3 text-white' />
                        </button>
                    </div>)
                }
            </div>

            <div className="bg-gray-100 rounded-lg px-6 py-4 mb-6 flex justify-between items-center gap-4">
                <button
                    className={`${isClientSelected ? "bg-blue-500 hover:bg-blue-700" : "bg-[#70D0EE]"} text-white font-medium py-1 rounded focus:outline-none focus:shadow-outline mx-1 w-full`}
                    disabled={!isClientSelected}
                    onClick={() => setIsModalOpen(true)}
                >
                    Enviar a la cola médica
                </button>
                <button
                    className={`${isClientSelected ? "bg-green-500 hover:bg-green-700" : "bg-[#72D78A]"} text-white font-medium py-1 rounded focus:outline-none focus:shadow-outline mx-1 w-full`}
                    disabled={!isClientSelected} >
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
                        <div className='flex gap-4 mb-6 items-center'>
                            <div className='w-[40%]'>
                                <label htmlFor="store" className="block text-gray-700 mb-2 pl-2">Almacén de origen</label>
                                <select
                                    id='store'
                                    name="store"
                                    className="w-full rounded-lg border-gray-200 border text-gray-700 sm:text-sm py-2 px-4 hover:border-blue-300  focus:border-blue-300"
                                >
                                    <option value="">VET ARIEL</option>
                                </select>
                            </div>

                            <div className='w-full flex flex-col justify-center'>
                                <label
                                    htmlFor="search"
                                    className="block text-gray-700 mb-2 pl-2">
                                    Buscar y agregar productos y servicios a la cuenta del cliente:
                                </label>
                                <div className="flex w-full border-gray-200 border rounded-lg overflow-hidden hover:border-blue-300 focus-within:border-blue-300">
                                    <div className="flex items-center justify-center bg-gray-100 px-3">
                                        <SearchIcon className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <input
                                        id='search'
                                        type="text"
                                        placeholder="Buscar producto..."
                                        className="w-full py-2 px-4 focus:outline-none focus:ring-0 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    )
                }
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead>
                            <tr>
                                {
                                    tableCategories.map((category, index) => (
                                        <th className="py-2 px-4 bg-gray-100 text-gray-600 font-bold uppercase text-sm border-gray-300 border-2" key={index}>{category}</th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>

                <div className="bg-white p-6 mb-6">
                    <div className="w-full lg:w-1/2 ml-auto">
                        <table className="min-w-full bg-white">
                            <tbody>
                                {tableData.map((row, index) => (
                                    <tr key={index} className={`border-t border-gray-200 ${row.bold ? 'font-bold' : ''}`}>
                                        <td className="py-2 text-gray-600">{row.label}</td>
                                        <td className="py-2 text-right text-gray-600">{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 rounded-lg px-6 py-4 mt-6 flex justify-end">
                <button className="bg-[#72D78A] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" disabled={true}>
                    Ir a caja y generar comprobante
                </button>
            </div>
        </section>
    )
}

export { Sales };
