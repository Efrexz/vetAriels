import { createContext, useEffect, useState } from 'react';

const ClientsContext = createContext();

function ClientsProvider({ children }) {

    //clients Data
    const [clients, setClients] = useState(
        localStorage.getItem('clients') ? JSON.parse(localStorage.getItem('clients')) : [
        ]);


    //Pets Data
    const [petsData, setPetsData] = useState(
        localStorage.getItem('petsData') ? JSON.parse(localStorage.getItem('petsData')) : [
        ]
    );

    //Mascotas en cola de espera
    const [petsInQueueMedical, setPetsInQueueMedical] = useState(
        localStorage.getItem('petsInQueueMedical') ? JSON.parse(localStorage.getItem('petsInQueueMedical')) : []
    );

    //Mascotas en cola grooming
    const [petsInQueueGrooming, setPetsInQueueGrooming] = useState(
        localStorage.getItem('petsInQueueGrooming') ? JSON.parse(localStorage.getItem('petsInQueueGrooming')) : []
    );


    // Guardar en localStorage cada vez que cambien los estados
    useEffect(() => {
        localStorage.setItem('clients', JSON.stringify(clients));
    }, [clients]);

    useEffect(() => {
        localStorage.setItem('petsData', JSON.stringify(petsData));
    }, [petsData]);

    useEffect(() => {
        localStorage.setItem('petsInQueueGrooming', JSON.stringify(petsInQueueGrooming));
    }, [petsInQueueGrooming]);

    useEffect(() => {
        localStorage.setItem('petsInQueueMedical', JSON.stringify(petsInQueueMedical));
    }, [petsInQueueMedical]);

    //clients
    const addClient = (newClient) => {
        setClients([...clients, newClient]);
    };

    const updateClientData = (id, newData) => {
        setClients(clients.map(client => client.id === id ? { ...client, ...newData } : client));
    };

    const removeClient = (id) => {
        setClients(clients.filter(client => client.id !== id));
    };

    const addProductToClient = (clientId, product) => {
        setClients(clients.map(client =>
            client.id === clientId
                ? {
                    ...client,
                    products: [...(client.products || []), product]
                }
                : client
        ));
    };

    const removeProductFromClient = (clientId, productId) => {
        setClients(clients.map(client =>
            client.id === clientId
                ? {
                    ...client,
                    products: (client.products || []).filter(product => product.provisionalId !== productId)
                }
                : client
        ));
    };

    //pets data
    let historyCounter = localStorage.getItem('historyCounter') || 100;

    const addPet = (newPet, ownerId, ownerName) => {
        const petWithOwner = { ...newPet, ownerId, ownerName, hc: historyCounter, id: historyCounter };
        setPetsData([...petsData, petWithOwner]);
        historyCounter++;
        localStorage.setItem('historyCounter', historyCounter);
    };

    const updatePetData = (id, newData) => {
        setPetsData(petsData.map(pet => pet.id === id ? { ...pet, ...newData } : pet));

    };

    const removePet = (id) => {
        setPetsData(petsData.filter(pet => pet.id !== id));
    };

    //Mascotas en cola de espera

    const addPetToQueueMedical = (newPet) => {
        setPetsInQueueMedical([...petsInQueueMedical, newPet]);
    };

    const removePetFromQueueMedical = (id) => {
        setPetsInQueueMedical(petsInQueueMedical.filter(pet => pet.id !== id));
    };

    //Mascotas en cola grooming
    const addPetToQueueGrooming = (newPet) => {
        setPetsInQueueGrooming([...petsInQueueGrooming, newPet]);
    };

    const removePetFromQueueGrooming = (id) => {
        setPetsInQueueGrooming(petsInQueueGrooming.filter(pet => pet.id !== id));
    };

    return (
        <ClientsContext.Provider value={{
            clients,
            addClient,
            removeClient,
            updateClientData,
            addProductToClient,
            removeProductFromClient,
            petsData,
            addPet,
            updatePetData,
            removePet,
            historyCounter,
            petsInQueueMedical,
            addPetToQueueMedical,
            removePetFromQueueMedical,
            petsInQueueGrooming,
            addPetToQueueGrooming,
            removePetFromQueueGrooming,
        }}>
            {children}
        </ClientsContext.Provider>
    );
}

export { ClientsContext, ClientsProvider };