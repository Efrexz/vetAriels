import { createContext, useEffect, useState, ReactNode, useContext  } from 'react';
import { Product, Service, InventoryOperation } from '@t/inventory.types';

interface ProductsAndServicesContextType {
  // Productos
    productsData: Product[];
    addProduct: (product: Product) => void;
    updateProductData: (id: string, newData: Partial<Product>) => void;//usamos el partial porque no actualizamos todos los campos
    removeProduct: (id: string) => void;

    // Servicios
    servicesData: Service[];
    addNewService: (newService: Service) => void;
    updateServiceData: (id: string , newData: Partial<Service>) => void;
    removeService: (id: string ) => void;

    // Operaciones de Inventario
    dischargesData: InventoryOperation[];
    addDischarge: (discharge: InventoryOperation) => void;
    restockData: InventoryOperation[];
    addRestock: (restock: InventoryOperation) => void;
}

const ProductsAndServicesContext = createContext<ProductsAndServicesContextType | undefined>(undefined);

interface ProductsAndServicesProviderProps {
    children: ReactNode;
}
function ProductsAndServicesProvider({ children }: ProductsAndServicesProviderProps) {

    const isProductsData = localStorage.getItem('productsData');
    if (!isProductsData) {
        localStorage.setItem('productsData', JSON.stringify([]));
    }

    const [productsData, setProductsData] = useState<Product[]>(() => {
        const saved = localStorage.getItem('productsData');
        return saved ? (JSON.parse(saved) as Product[]) : [];
    });

    function addProduct(product: Product) {
        setProductsData([...productsData, product]);
    }

    function updateProductData(id: string, newData: Partial<Product>) {
        setProductsData(productsData.map(product => product.systemCode === id ? { ...product, ...newData } : product));
    }

    function removeProduct(id : string) {
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

    const [restockData, setRestockData] = useState<InventoryOperation[]>(() => {
        const saved = localStorage.getItem('restockData');
        return saved ? (JSON.parse(saved) as InventoryOperation[]) : [];
    });

    function addRestock(restock: InventoryOperation) {
        setProductsData(prevProducts =>
            prevProducts.map(product => {
                const restockProduct = restock.products.find(p => p.systemCode === product.systemCode);
                if (restockProduct && product.availableStock !== undefined) {
                    return {
                        ...product,
                        availableStock: product.availableStock + restockProduct.quantity,
                    };
                }
                return product;
            })
        );
        setRestockData(prevRestocks => [restock, ...prevRestocks]);
    }

    useEffect(() => {
        localStorage.setItem('restockData', JSON.stringify(restockData));
    }, [restockData]);


    //Descargas de Productos
    const isDischargesData = localStorage.getItem('dischargesData');
        if (!isDischargesData) {
            localStorage.setItem('dischargesData', JSON.stringify([]));
    }

    const [dischargesData, setDischargesData] = useState<InventoryOperation[]>(() => {
        const saved = localStorage.getItem('dischargesData');
        return saved ? (JSON.parse(saved) as InventoryOperation[]) : [];
    });

    function addDischarge(discharge: InventoryOperation) {
    setProductsData(prevProducts =>
        prevProducts.map(product => {
            const dischargeProduct = discharge.products.find(p => p.systemCode === product.systemCode);
            if (dischargeProduct && product.availableStock !== undefined) {
                return {
                    ...product,
                    availableStock: product.availableStock >= dischargeProduct.quantity
                        ? product.availableStock - dischargeProduct.quantity
                        : 0,
                };
            }
            return product;
        })
    );
    setDischargesData(prevDischarges => [discharge, ...prevDischarges]);
}

    useEffect(() => {
        localStorage.setItem('dischargesData', JSON.stringify(dischargesData));
    }, [dischargesData]);


    //Servicios
    const isServiceData = localStorage.getItem('servicesData');
    if (!isServiceData) {
        localStorage.setItem('servicesData', JSON.stringify([]));
    }

    const [servicesData, setServicesData] = useState<Service[]>(() => {
        const saved = localStorage.getItem('servicesData');
        return saved ? (JSON.parse(saved) as Service[]) : [];
    });

    function addNewService(newService: Service) {
        setServicesData(prevServices => [...prevServices, newService]);
    }

    function updateServiceData(id: string, newData: Partial<Service>) {
        setServicesData(servicesData.map(service => service.id === id ? { ...service, ...newData } : service));
    }

    function removeService(id: string) {
        setServicesData(servicesData.filter((newService) => newService.id !== id));
    }

    // Guardar en localStorage cada vez que cambien los estados
    useEffect(() => {
        localStorage.setItem('servicesData', JSON.stringify(servicesData));
    }, [servicesData]);

     const contextValue: ProductsAndServicesContextType = {
        productsData,
        addProduct,
        updateProductData,
        removeProduct,
        servicesData,
        addNewService,
        updateServiceData,
        removeService,
        dischargesData,
        addDischarge,
        restockData,
        addRestock,
    };

    return (
        <ProductsAndServicesContext.Provider value={contextValue}>
            {children}
        </ProductsAndServicesContext.Provider>
    );
}

export function useProductsAndServices (): ProductsAndServicesContextType {
    const context = useContext(ProductsAndServicesContext);
    if (context === undefined) {
        throw new Error('useProductsAndServices debe ser usado dentro de un ProductsAndServicesProvider');
    }
    return context;
};

export { ProductsAndServicesContext, ProductsAndServicesProvider };
