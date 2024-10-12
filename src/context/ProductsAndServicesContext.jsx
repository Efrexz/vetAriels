import { createContext, useState } from 'react';

const ProductsAndServicesContext = createContext();

function ProductsAndServicesProvider({ children }) {

    const [productsData, setProductsData] = useState([
        {
            id: 1,
            name: 'Vacuna de rabia',
            price: 55,
            category: 'Vacunas',
            quantity: 10,
        },
        {
            id: 2,
            name: 'Vacuna de kc',
            price: 35,
            category: 'Vacunas',
            quantity: 10,
        },
        {
            id: 3,
            name: 'Vacuna de leptospirosis',
            price: 45,
            category: 'Vacunas',
            quantity: 10,
        },
        {
            id: 4,
            name: 'Vacuna triple felina',
            price: 55,
            category: 'Vacunas',
            quantity: 10,
        },
        {
            id: 5,
            name: 'Vacuna de sextuple',
            price: 65,
            category: 'Vacunas',
            quantity: 10,
        },
        {
            id: 8,
            name: 'Vacuna de sextuple',
            price: 65,
            category: 'Vacunas',
            quantity: 10,
        },
        {
            id: 9,
            name: 'Vacuna de sextuple',
            price: 65,
            category: 'Vacunas',
            quantity: 10,
        },
    ]);

    function addProduct(product) {
        setProductsData([...productsData, product]);
    }

    function removeProduct(id) {
        setProductsData(productsData.filter((product) => product.id !== id));
    }

    const [servicesData, setServicesData] = useState([
        {
            id: 1,
            serviceName: "Consulta",
            cost: 0,
            price: 20,
            line: "medica",
            category: 'Consultas',
            registrationDate: '2023-07-01',
            registrationTime: '07:43 PM',
            status: true
        },
        {
            id: 2,
            serviceName: "Baño Tradicional",
            cost: 0,
            price: 30,
            line: "spa",
            category: 'baño',
            registrationDate: '2023-07-01',
            registrationTime: '07:43 PM',
            status: true
        },
        {
            id: 3,
            serviceName: "Hemograma",
            cost: 0,
            price: 40,
            line: "laboratorio",
            category: 'Hemogramas',
            registrationDate: '2023-07-01',
            registrationTime: '07:43 PM',
            status: true
        }
    ])

    let serviceId = localStorage.getItem('serviceId') || 100;

    function addNewService(newService) {
        const newServiceData = { ...newService, id: serviceId }
        setServicesData([...servicesData, newServiceData]);
        serviceId++;
        localStorage.setItem('serviceId', serviceId);
    }

    function removeService(id) {
        setServicesData(servicesData.filter((newService) => newService.id !== id));
    }

    return (
        <ProductsAndServicesContext.Provider value={{ productsData, addProduct, removeProduct, servicesData, addNewService, removeService }}>
            {children}
        </ProductsAndServicesContext.Provider>
    );
}

export { ProductsAndServicesContext, ProductsAndServicesProvider };