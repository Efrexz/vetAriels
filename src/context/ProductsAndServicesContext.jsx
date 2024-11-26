import { createContext, useEffect, useState } from 'react';
import PropTypes from "prop-types";

const ProductsAndServicesContext = createContext();

function ProductsAndServicesProvider({ children }) {

    const isProductsData = localStorage.getItem('productsData');
    if (!isProductsData) {
        localStorage.setItem('productsData', JSON.stringify([]));
    }

    const [productsData, setProductsData] = useState(localStorage.getItem('productsData') ? JSON.parse(localStorage.getItem('productsData')) : []);

    function addProduct(product) {
        setProductsData([...productsData, product]);
    }

    function removeProduct(id) {
        setProductsData(productsData.filter((product) => product.systemCode !== id));
    }

    // Guardar en localStorage cada vez que cambien los estados
    useEffect(() => {
        localStorage.setItem('productsData', JSON.stringify(productsData));
    }, [productsData]);

    //Servicios

    const isServiceData = localStorage.getItem('servicesData');
    if (!isServiceData) {
        localStorage.setItem('servicesData', JSON.stringify([]));
    }

    const [servicesData, setServicesData] = useState(localStorage.getItem('servicesData') ? JSON.parse(localStorage.getItem('servicesData')) : []);


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

    // Guardar en localStorage cada vez que cambien los estados
    useEffect(() => {
        localStorage.setItem('servicesData', JSON.stringify(servicesData));
    }, [servicesData]);

    return (
        <ProductsAndServicesContext.Provider value={{ productsData, addProduct, removeProduct, servicesData, addNewService, removeService }}>
            {children}
        </ProductsAndServicesContext.Provider>
    );
}

export { ProductsAndServicesContext, ProductsAndServicesProvider };

ProductsAndServicesProvider.propTypes = {
    children: PropTypes.node
}