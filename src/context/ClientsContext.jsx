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
    function addClient(newClient) {
        setClients([...clients, newClient]);
    }

    function updateClientData(id, newData) {
        setClients(clients.map(client => client.id === id ? { ...client, ...newData } : client));
    }

    function removeClient(id) {
        setClients(clients.filter(client => client.id !== id));
    }

    function addProductToClient(clientId, product) {
        setClients(clients.map(client =>
            client.id === clientId
                ? {
                    ...client,
                    products: [...(client.products || []), product]
                }
                : client
        ));
    }

    function removeProductFromClient(clientId, productId) {
        setClients(clients.map(client =>
            client.id === clientId
                ? {
                    ...client,
                    products: (client.products || []).filter(product => product.provisionalId !== productId)
                }
                : client
        ));
    }

    //pets data
    let historyCounter = localStorage.getItem('historyCounter') || 100;

    function addPet(newPet, ownerId, ownerName) {
        const petWithOwner = { ...newPet, ownerId, ownerName, hc: historyCounter, id: historyCounter };
        setPetsData([...petsData, petWithOwner]);
        historyCounter++;
        localStorage.setItem('historyCounter', historyCounter);
    }

    function updatePetData(id, newData) {
        setPetsData(petsData.map(pet => pet.id === id ? { ...pet, ...newData } : pet));
    }

    function removePet(id) {
        setPetsData(petsData.filter(pet => pet.id !== id));
    }

    //Mascotas en cola de espera clinica

    function addPetToQueueMedical(newPet) {
        setPetsInQueueMedical([...petsInQueueMedical, newPet]);
    }

    function updatePetInQueueMedical(id, newData) {
        setPetsInQueueMedical(petsInQueueMedical.map(pet => pet.id === id ? { ...pet, ...newData } : pet));
    }

    function removePetFromQueueMedical(id) {
        setPetsInQueueMedical(petsInQueueMedical.filter(pet => pet.id !== id));
    }

    //Mascotas en cola grooming
    function addPetToQueueGrooming(newPet) {
        setPetsInQueueGrooming([...petsInQueueGrooming, newPet]);
    }

    function updatePetInQueueGrooming(id, newData) {
        setPetsInQueueGrooming(petsInQueueGrooming.map(pet => pet.id === id ? { ...pet, ...newData } : pet));
    }

    function removePetFromQueueGrooming(id) {
        setPetsInQueueGrooming(petsInQueueGrooming.filter(pet => pet.id !== id));
    }

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
            updatePetInQueueMedical,
            removePetFromQueueMedical,
            petsInQueueGrooming,
            addPetToQueueGrooming,
            updatePetInQueueGrooming,
            removePetFromQueueGrooming,
        }}>
            {children}
        </ClientsContext.Provider>
    );
}

export { ClientsContext, ClientsProvider };