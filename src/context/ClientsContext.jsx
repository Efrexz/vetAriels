import { createContext, useState } from 'react';

const ClientsContext = createContext();

function ClientsProvider({ children }) {

    //clients Data
    const [clients, setClients] = useState([
        {
            id: 1,
            firstName: 'Efrain',
            lastName: 'Andrade',
            email: 'zyzz_448@gmail.com',
            dni: '002959161',
            date: '31-07-2024',
            hour: '07:43PM',
            phone1: '+55 (11) 9988-7766',
            phone2: '+55 (11) 9988-7766',
            address: 'av. proceres 115',
            distrit: 'San miguel',
            city: 'Lima',
            reference: 'es una veterinaria',
        },
        {
            id: 2,
            firstName: 'Isabel',
            lastName: 'Quintero',
            email: 'isaquintisa@gmail.com',
            dni: '003028128',
            date: '31-07-2024',
            hour: '07:43PM',
            phone1: '+55 (11) 9988-7766',
            phone2: '+55 (11) 9988-7766',
            address: 'av. proceres 115',
            distrit: 'San miguel',
            city: 'Lima',
            reference: 'es una veterinaria',
        },
        {
            id: 3,
            firstName: 'Olga',
            lastName: 'Bustinza',
            email: 'olgabustin@gmail.com',
            dni: '123456789',
            date: '31-07-2024',
            hour: '07:43PM',
            phone1: '+55 (11) 9988-7766',
            phone2: '+55 (11) 9988-7766',
            address: 'CALLE LOS ROSALES 230 SAN MIGUEL',
            distrit: 'San miguel',
            city: 'Lima',
            reference: 'es una veterinaria',
        },
    ]);

    const addClient = (newClient) => {
        setClients([...clients, newClient]);
    };

    const updateClientData = (id, newData) => {
        setClients(clients.map(client => client.id === id ? { ...client, ...newData } : client));
    };

    const removeClient = (id) => {
        setClients(clients.filter(client => client.id !== id));
    };

    //Pets Data
    const [petsData, setPetsData] = useState([
        {
            id: 1,
            ownerId: 3,
            registrationDate: '31-07-2024',
            registrationTime: '07:43 PM',
            petName: 'FRAC',
            birthDate: '31-07-2024',
            hc: '123456',
            microchip: '123456',
            species: 'Canino',
            breed: 'Mestizo',
            sex: 'MACHO',
            active: true,
            img: 'https://i.imgur.com/v8y0k4B.jpg',
        },
        {
            id: 2,
            ownerId: 3,
            registrationDate: '31-07-2024',
            registrationTime: '07:43 PM',
            petName: 'FRAC',
            birthDate: '31-07-2024',
            hc: '123456',
            microchip: '123456',
            species: 'Canino',
            breed: 'Mestizo',
            sex: 'MACHO',
            active: true,
            img: 'https://i.imgur.com/v8y0k4B.jpg',
        },
        {
            id: 3,
            ownerId: 3,
            registrationDate: '31-07-2024',
            registrationTime: '07:43 PM',
            petName: 'Macarena',
            birthDate: '31-07-2024',
            hc: '123456',
            microchip: '123456',
            species: 'Canino',
            breed: 'Mestizo',
            sex: 'HEMBRA',
            active: true,
            img: 'https://i.imgur.com/v8y0k4B.jpg',
        },
    ]);

    let historyCounter = 100;

    const addPet = (newPet, ownerId, ownerName) => {
        const petWithOwner = { ...newPet, ownerId, ownerName, hc: historyCounter };
        setPetsData([...petsData, petWithOwner]);
        historyCounter++;
        console.log(petsData);
    };

    const updatePetData = (id, newData) => {
        setPetsData(petsData.map(pet => pet.id === id ? { ...pet, ...newData } : pet));
        console.log(petsData);
    };

    const removePet = (id) => {
        setPetsData(petsData.filter(pet => pet.id !== id));
    };

    return (
        <ClientsContext.Provider value={{ clients, addClient, removeClient, updateClientData, petsData, addPet, updatePetData, removePet, historyCounter }}>
            {children}
        </ClientsContext.Provider>
    );
}

export { ClientsContext, ClientsProvider };