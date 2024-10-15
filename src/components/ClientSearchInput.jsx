import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { ClientsContext } from "../context/ClientsContext";


function ClientSearchInput({ mode }) {

    const { clients, petsData } = useContext(ClientsContext);


    const { id } = useParams();
    const isClientSelected = clients.find(client => client.id === Number(id));

    //si existe un cliente seleccionado, mostramos su nombre en el buscador y asi evitamos el error que al cambiar de pagina y volver el input esta vacio
    const [searchTerm, setSearchTerm] = useState(isClientSelected ? `${isClientSelected?.firstName} ${isClientSelected?.lastName}` : '');

    //estado para saber cuando el input tiene el foco para mostrar la lista de clientes que coinciden con el buscador
    const [isFilteredListVisible, setIsFilteredListVisible] = useState(false);

    //filtramos los clientes que coinciden con el buscador por nombre de cliente, numero de telefono y datos de la mascota
    let filteredClients = clients.filter(client => {
        const fullName = `${client?.firstName} ${client?.lastName}`.toLowerCase();
        const phoneMatch = client?.phone1.includes(searchTerm) || client?.phone2.includes(searchTerm);

        const clientPets = petsData.filter(pet => pet.ownerId === client.id);
        // revisamos si coincide el hc o nombre de la mascota
        const petMatch = clientPets.some(pet =>
            pet.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pet.hc.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return fullName.includes(searchTerm.toLowerCase()) || phoneMatch || petMatch;
    });


    return (
        <div className="w-full relative">
            <input
                className="border rounded w-full py-2 px-4 text-gray-700 hover:border-blue-300 focus-within:border-blue-300"
                id="clientSearch"
                type="text"
                placeholder="Buscar cliente..."
                defaultValue={`${isClientSelected?.firstName} ${isClientSelected?.lastName}`}
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsFilteredListVisible(true); // Mostrar el dropdown cuando escribes
                }}
                onFocus={() => setIsFilteredListVisible(true)} // Mostrar cuando el input tiene el foco
                onBlur={() => setTimeout(() => setIsFilteredListVisible(false), 150)} // Ocultamos al perder foco con un poco de delay xD
            />

            {/*Filtrado de busqueda de clientes */}
            {(searchTerm.length >= 3 && isFilteredListVisible) && (
                <ul className="bg-white border rounded-b-lg shadow-lg max-h-60 overflow-y-auto absolute top-full right-0 z-40 w-full">
                    {filteredClients.map((client, index) => {
                        // Filtramos las mascotitass que pertenecen a este cliente
                        const clientPets = petsData.filter(pet => pet.ownerId === client.id);
                        const clientPetNames = clientPets.map(pet => pet.petName);
                        return (
                            <li
                                key={index}
                                className="p-2 cursor-pointer hover:bg-blue-100 border"
                                onClick={(e) => {
                                    e.preventDefault();// Evita que React Router intercepte la navegación.
                                    setSearchTerm(`${client.firstName} ${client.lastName}`);
                                    setIsFilteredListVisible(false); // Ocultar dropdown al seleccionar
                                    window.location.href = `${mode === "sales" ? "/sales/client" : "/grooming/order-creation"}/${client.id}`;//Usamos el window.location en vez del navigate para poder recargar la pagina al seleccionar un cliente para evitar el error que teniamos que quedaba el nombre del antiguo usuario en el input de busqueda

                                }}
                            >
                                <div className="font-bold text-black">{`${client.firstName} ${client.lastName}`}</div>
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
        </div>

    );
}

export { ClientSearchInput };