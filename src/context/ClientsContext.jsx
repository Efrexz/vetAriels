import { createContext, useState } from 'react';

const ClientsContext = createContext();

function ClientsProvider({ children }) {

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
            pets: [
                {
                    id: 1,
                    name: 'Pedro',
                    age: 1,
                    sex: 'M',
                    color: 'rojo',
                    breed: 'corgi',
                    img: 'https://i.imgur.com/v8y0k4B.jpg',
                },
                {
                    id: 2,
                    name: 'Macarena',
                    age: 10,
                    sex: 'F',
                    color: 'rojo',
                    breed: 'chihuahua',
                    img: 'https://i.imgur.com/v8y0k4B.jpg',
                },
                {
                    id: 3,
                    name: 'Frack',
                    age: 2,
                    sex: 'M',
                    color: 'rojo',
                    breed: 'bulldog',
                    img: 'https://i.imgur.com/v8y0k4B.jpg',
                },
                {
                    id: 4,
                    name: 'Miguelito',
                    age: 2,
                    sex: 'M',
                    weight: 10,
                    height: 10,
                    color: 'rojo',
                    breed: 'corgi',
                    img: 'https://i.imgur.com/v8y0k4B.jpg',
                },
            ]
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
            pets: [
                {
                    id: 1,
                    name: 'Cataleya',
                    age: 4,
                    sex: 'F',
                    color: 'rojo',
                    breed: 'Bulldog frances',
                    img: 'https://i.imgur.com/v8y0k4B.jpg',
                },
            ]
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
            pets: [
                {
                    id: 1,
                    name: 'Cataleya',
                    age: 4,
                    sex: 'F',
                    color: 'rojo',
                    breed: 'Bulldog frances',
                    img: 'https://i.imgur.com/v8y0k4B.jpg',
                },
            ]
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
}

export { ClientsContext, ClientsProvider };