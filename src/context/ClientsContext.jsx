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
            lastName: 'Bustinza',
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
            ownerName: "Olga Bustinza",
            registrationDate: '31-07-2024',
            registrationTime: '07:43 PM',
            petName: 'FRAC',
            birthDate: '01/01/2023',
            hc: '1',
            microchip: '123456',
            species: 'Canino',
            breed: 'Mestizo',
            sex: 'MACHO',
            active: true,
            img: 'https://i.imgur.com/v8y0k4B.jpg',
        },
        {
            id: 2,
            ownerId: 2,
            ownerName: "Isabel Bustinza",
            registrationDate: '31-07-2024',
            registrationTime: '07:43 PM',
            petName: 'FRAC',
            birthDate: '01/01/2023',
            hc: '2',
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
            ownerName: "Olga Bustinza",
            registrationDate: '31-07-2024',
            registrationTime: '07:43 PM',
            petName: 'Macarena',
            birthDate: '01/01/2023',
            hc: '3',
            microchip: '123456',
            species: 'Canino',
            breed: 'Mestizo',
            sex: 'HEMBRA',
            active: true,
            img: 'https://i.imgur.com/v8y0k4B.jpg',
        },
    ]);

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

    return (
        <ClientsContext.Provider value={{ clients, addClient, removeClient, updateClientData, petsData, addPet, updatePetData, removePet, historyCounter }}>
            {children}
        </ClientsContext.Provider>
    );
}

export { ClientsContext, ClientsProvider };