import { createContext, useState } from 'react';

const ClientsContext = createContext();

const ClientsProvider = ({ children }) => {

    const [clients, setClients] = useState([
        {
            id: 1,
            firstName: 'Efrain',
            lastName: 'Andrade',
            email: 'zyzz_448@gmail.com',
            dni: '002959161',
            phone1: '+55 (11) 9988-7766',
            phone2: '+55 (11) 9988-7766',
            address: 'av. proceres 115',
            distrit: 'San miguel',
            city: 'Lima',
            reference: 'es una veterinaria'
        },
        {
            id: 2,
            firstName: 'Isabel',
            lastName: 'Quintero',
            email: 'isaquintisa@gmail.com',
            dni: '003028128',
            phone1: '+55 (11) 9988-7766',
            phone2: '+55 (11) 9988-7766',
            address: 'av. proceres 115',
            distrit: 'San miguel',
            city: 'Lima',
            reference: 'es una veterinaria'
        },
        {
            id: 3,
            firstName: 'Olga',
            lastName: 'Bustinza',
            email: 'olgabustin@gmail.com',
            dni: '123456789',
            phone1: '+55 (11) 9988-7766',
            phone2: '+55 (11) 9988-7766',
            address: 'av. proceres 115',
            distrit: 'San miguel',
            city: 'Lima',
            reference: 'es una veterinaria'
        },
    ]);

    const addClient = (newClient) => {
        setClients([...clients, newClient]);
    };

    const removeClient = (id) => {
        setClients(clients.filter(client => client.id !== id));
    };

    return (
        <ClientsContext.Provider value={{ clients, addClient, removeClient }}>
            {children}
        </ClientsContext.Provider>
    );
};

export { ClientsContext, ClientsProvider };