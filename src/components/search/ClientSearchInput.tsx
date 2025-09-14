import { useContext, useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClients } from '@context/ClientsContext';
import { Client } from '@t/client.types';

type SearchMode = 'sales' | 'grooming' | 'pets';

interface ClientSearchInputProps {
    mode: SearchMode;
}

const baseUrl: Record<SearchMode, string> = {
    sales: "/sales/client",
    grooming: `/grooming/order-creation`,
    pets: `/pets/create`
};

function ClientSearchInput({ mode }: ClientSearchInputProps) {

    const { clients, petsData } = useClients();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const selectedClient = useMemo(() => {
        return id ? clients.find(client => client.id === id) : undefined;
    }, [clients, id]);

    const [searchTerm, setSearchTerm] = useState<string>("");

    //estado para saber cuando el input tiene el foco para mostrar la lista de clientes que coinciden con el buscador
    const [isFilteredListVisible, setIsFilteredListVisible] = useState<boolean>(false);

    useEffect(() => {
        if (selectedClient) {
            //si existe un cliente seleccionado, mostramos su nombre en el buscador y asi evitamos el error que al cambiar de pagina y volver el input esta vacio
            setSearchTerm(`${selectedClient.firstName} ${selectedClient.lastName}`);
        } else {
            // Si no hay cliente en la URL (o se navega a una página sin id), limpia el input.
            setSearchTerm('');
        }
    }, [selectedClient]);

    //filtramos los clientes que coinciden con el buscador por nombre de cliente, numero de telefono, dni y datos de la mascota
    const filteredClients = useMemo((): Client[] => {
        if (searchTerm.length < 3) return []; // No buscar si el valor de busqueda es muy corto

        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        return clients.filter(client => {
            const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
            const phoneMatch = client.phone1.includes(lowerCaseSearchTerm) || (client.phone2 && client.phone2.includes(lowerCaseSearchTerm));
            const documentMatch = client.dni.includes(lowerCaseSearchTerm);

            const clientPets = petsData.filter(pet => pet.ownerId === client.id);
            const petMatch = clientPets.some(pet =>
                pet.petName.toLowerCase().includes(lowerCaseSearchTerm)
            );

            return fullName.includes(lowerCaseSearchTerm) || phoneMatch || petMatch || documentMatch;
        });
    }, [searchTerm, clients, petsData]);


    return (
        <div className="w-full relative">
            <input
                className="bg-gray-700 border border-gray-600 rounded-lg w-full py-3 px-4 text-gray-200 placeholder-gray-400 focus:ring-1 focus:ring-cyan-500 focus:outline-none hover:border-cyan-500 "
                id="clientSearch"
                type="search"
                placeholder="Buscar cliente..."
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
                <ul className="bg-gray-800 border border-gray-700 rounded-b-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar absolute top-full right-0 z-40 w-full">
                    {filteredClients.map((client) => {
                        // Filtramos las mascotitass que pertenecen a este cliente
                        const clientPets = petsData.filter(pet => pet.ownerId === client.id);
                        const clientPetNames = clientPets.map(pet => pet.petName);
                        return (
                            <li
                                key={client.id}
                                className="p-3 cursor-pointer hover:bg-gray-700 border-b border-gray-700 transition-colors"
                                onClick={(e) => {
                                    e.preventDefault();// Evita que React Router intercepte la navegación.
                                    setSearchTerm(`${client.firstName} ${client.lastName}`);
                                    setIsFilteredListVisible(false); // Ocultar dropdown al seleccionar
                                    window.location.href = `${baseUrl[mode]}/${client.id}`;//Usamos el window.location en vez del navigate para poder recargar la pagina al seleccionar un cliente para evitar el error que teniamos que quedaba el nombre del antiguo usuario en el input de busqueda
                                }}
                            >
                                <div className="font-bold text-cyan-400">{`${client.firstName} ${client.lastName}`}</div>
                                <div className="text-sm text-gray-400">{`Tel: ${client.phone1}${client.phone2 ? ' / ' + client.phone2 : ''}`}</div>
                                {clientPetNames && (
                                    <div className="text-sm text-gray-400">{`Mascotas: ${clientPetNames}`}</div>
                                )}
                            </li>
                        );
                    })}
                    {isFilteredListVisible && searchTerm.length >= 3 && filteredClients.length === 0 && (
                        <li className="p-3 text-gray-500">No se encontraron coincidencias</li>
                    )}
                </ul>
            )}
        </div>
    );
}

export { ClientSearchInput };
