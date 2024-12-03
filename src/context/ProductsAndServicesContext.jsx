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

    //Cargar productos 

    const isRestockData = localStorage.getItem('restockData');
    if (!isRestockData) {
        localStorage.setItem('restockData', JSON.stringify([]));
    }

    const [restockData, setRestockData] = useState(localStorage.getItem('restockData') ? JSON.parse(localStorage.getItem('restockData')) : []);

    function addRestock(restock) {
        // Iteramos sobre los productos incluidos en el restock
        setProductsData((prevProducts) =>
            prevProducts.map((product) => {
                const restockProduct = restock.products.find(
                    (p) => p.systemCode === product.systemCode
                );
                if (restockProduct) {
                    return {
                        ...product,
                        availableStock: product.availableStock + restockProduct.quantity,
                    };
                }

                return product;
            })
        );
        setRestockData([restock, ...restockData]);
    }

    useEffect(() => {
        localStorage.setItem('restockData', JSON.stringify(restockData));
    }, [restockData]);


    //Descargas de Productos

    const isDischargesData = localStorage.getItem('dischargesData');
    if (!isDischargesData) {
        localStorage.setItem('dischargesData', JSON.stringify([]));
    }

    const [dischargesData, setDischargesData] = useState(localStorage.getItem('dischargesData') ? JSON.parse(localStorage.getItem('dischargesData')) : []);

    function addDischarge(discharge) {
        setProductsData((prevProducts) =>
            prevProducts.map((product) => {
                const dischargeProduct = discharge.products.find(
                    (p) => p.systemCode === product.systemCode
                );

                if (dischargeProduct) {
                    return {
                        ...product,
                        availableStock:
                            product.availableStock >= dischargeProduct.quantity
                                ? product.availableStock - dischargeProduct.quantity
                                : product.availableStock = 0, // Evitar valores negativos
                    };
                }
                return product;
            })
        );
        setDischargesData([discharge, ...dischargesData]);
    }

    useEffect(() => {
        localStorage.setItem('dischargesData', JSON.stringify(dischargesData));
    }, [dischargesData]);



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
        <ProductsAndServicesContext.Provider value={{
            productsData,
            addProduct,
            removeProduct,
            servicesData,
            addNewService,
            removeService,
            dischargesData,
            addDischarge,
            restockData,
            addRestock,
        }}>
            {children}
        </ProductsAndServicesContext.Provider>
    );
}

export { ProductsAndServicesContext, ProductsAndServicesProvider };

ProductsAndServicesProvider.propTypes = {
    children: PropTypes.node
}