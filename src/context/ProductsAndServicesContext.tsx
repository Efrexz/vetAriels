import { createContext, useContext, ReactNode } from 'react';
import { Product, Service, InventoryOperation, PurchasedItem } from '@t/inventory.types';
import { useProductsQuery, useProductsMutations } from '../hooks/useProductsQuery';
import { useServicesQuery, useServicesMutations } from '../hooks/useServicesQuery';
import {
    useInventoryMovementsQuery,
    useInventoryMovementsMutations,
} from '../hooks/useInventoryMovementsQuery';
import { buildMovementFromForm } from '../services/inventoryService';

interface ProductsAndServicesContextType {
    // Productos
    productsData: Product[];
    addProduct: (systemCode: string, product: Omit<Product, 'id' | 'systemCode'>) => Promise<Product>;
    updateProductData: (systemCode: string, newData: Partial<Product>) => Promise<void>;
    removeProduct: (systemCode: string) => Promise<void>;

    // Servicios
    servicesData: Service[];
    addNewService: (service: Omit<Service, 'id'>) => Promise<Service>;
    updateServiceData: (id: string, newData: Partial<Service>) => Promise<void>;
    removeService: (id: string) => Promise<void>;

    // Operaciones de Inventario
    dischargesData: InventoryOperation[];
    addDischarge: (discharge: Omit<InventoryOperation, 'id'>) => Promise<InventoryOperation>;
    restockData: InventoryOperation[];
    addRestock: (restock: Omit<InventoryOperation, 'id'>) => Promise<InventoryOperation>;
}

const ProductsAndServicesContext = createContext<ProductsAndServicesContextType | undefined>(undefined);

interface ProductsAndServicesProviderProps {
    children: ReactNode;
}

function ProductsAndServicesProvider({ children }: ProductsAndServicesProviderProps) {
    // Productos
    const { data: productsData = [] } = useProductsQuery();
    const { create: createProductMutation, update: updateProductMutation, remove: removeProductMutation } = useProductsMutations();

    // Servicios
    const { data: servicesData = [] } = useServicesQuery();
    const { create: createServiceMutation, update: updateServiceMutation, remove: removeServiceMutation } = useServicesMutations();

    // Movimientos de inventario
    const { data: movements = [] } = useInventoryMovementsQuery();
    const { createMovement: createMovementMutation } = useInventoryMovementsMutations();
    const dischargesData = movements.filter((m) => m.operationType === 'DESCARGA');
    const restockData = movements.filter((m) => m.operationType === 'CARGA');

    // Productos
    async function addProduct(
        systemCode: string,
        product: Omit<Product, 'id' | 'systemCode'>
    ): Promise<Product> {
        return createProductMutation.mutateAsync({
            systemCode,
            input: {
                productName: product.productName,
                brand: product.brand,
                barcode: product.barcode,
                line: product.line,
                category: product.category,
                subcategory: product.subcategory,
                unitOfMeasurement: product.unitOfMeasurement,
                presentation: product.presentation,
                content: product.content,
                provider: product.provider,
                minStock: product.minStock,
                cost: product.cost,
                salePrice: product.salePrice,
                active: product.status,
            },
        });
    }

    async function updateProductData(systemCode: string, newData: Partial<Product>) {
        const changes: {
            productName?: string;
            brand?: string;
            barcode?: string;
            line?: string;
            category?: string;
            subcategory?: string;
            unitOfMeasurement?: string;
            presentation?: string;
            content?: string;
            provider?: string;
            minStock?: number;
            cost?: number;
            salePrice?: number;
            active?: boolean;
        } = {};
        if (newData.productName !== undefined) changes.productName = newData.productName;
        if (newData.brand !== undefined) changes.brand = newData.brand;
        if (newData.barcode !== undefined) changes.barcode = newData.barcode;
        if (newData.line !== undefined) changes.line = newData.line;
        if (newData.category !== undefined) changes.category = newData.category;
        if (newData.subcategory !== undefined) changes.subcategory = newData.subcategory;
        if (newData.unitOfMeasurement !== undefined) changes.unitOfMeasurement = newData.unitOfMeasurement;
        if (newData.presentation !== undefined) changes.presentation = newData.presentation;
        if (newData.content !== undefined) changes.content = newData.content;
        if (newData.provider !== undefined) changes.provider = newData.provider;
        if (newData.minStock !== undefined) changes.minStock = newData.minStock;
        if (newData.cost !== undefined) changes.cost = newData.cost;
        if (newData.salePrice !== undefined) changes.salePrice = newData.salePrice;
        if (newData.status !== undefined) changes.active = newData.status;
        await updateProductMutation.mutateAsync({ systemCode, changes });
    }

    async function removeProduct(systemCode: string) {
        await removeProductMutation.mutateAsync(systemCode);
    }

    // Servicios
    async function addNewService(service: Omit<Service, 'id'>): Promise<Service> {
        return createServiceMutation.mutateAsync({
            serviceName: service.serviceName,
            line: service.line,
            category: service.category,
            cost: service.cost,
            salePrice: service.salePrice,
            availableForSale: service.availableForSale,
            active: service.status,
        });
    }

    async function updateServiceData(id: string, newData: Partial<Service>) {
        const changes: {
            serviceName?: string;
            line?: string;
            category?: string;
            cost?: number;
            salePrice?: number;
            availableForSale?: boolean;
            active?: boolean;
        } = {};
        if (newData.serviceName !== undefined) changes.serviceName = newData.serviceName;
        if (newData.line !== undefined) changes.line = newData.line;
        if (newData.category !== undefined) changes.category = newData.category;
        if (newData.cost !== undefined) changes.cost = newData.cost;
        if (newData.salePrice !== undefined) changes.salePrice = newData.salePrice;
        if (newData.availableForSale !== undefined) changes.availableForSale = newData.availableForSale;
        if (newData.status !== undefined) changes.active = newData.status;
        await updateServiceMutation.mutateAsync({ id, changes });
    }

    async function removeService(id: string) {
        await removeServiceMutation.mutateAsync(id);
    }

    // Movimientos de inventario. Las paginas pasan el InventoryOperation
    // UI completo (con todos los campos del formulario) y aqui lo
    // convertimos al CreateMovementInput del servicio.
    async function addRestock(restock: Omit<InventoryOperation, 'id'>): Promise<InventoryOperation> {
        const input = buildMovementFromForm({
            formReason: restock.reason,
            operationTypeLabel: restock.operationType,
            responsible: restock.responsible,
            store: restock.store,
            type: 'CARGA',
            items: restock.products.map((p: PurchasedItem) => ({
                id: p.id,
                quantity: p.quantity,
                cost: p.cost,
            })),
        });
        return createMovementMutation.mutateAsync(input);
    }

    async function addDischarge(discharge: Omit<InventoryOperation, 'id'>): Promise<InventoryOperation> {
        const input = buildMovementFromForm({
            formReason: discharge.reason,
            operationTypeLabel: discharge.operationType,
            responsible: discharge.responsible,
            store: discharge.store,
            type: 'DESCARGA',
            items: discharge.products.map((p: PurchasedItem) => ({
                id: p.id,
                quantity: p.quantity,
                cost: p.cost,
            })),
        });
        return createMovementMutation.mutateAsync(input);
    }

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

export function useProductsAndServices(): ProductsAndServicesContextType {
    const context = useContext(ProductsAndServicesContext);
    if (context === undefined) {
        throw new Error('useProductsAndServices debe ser usado dentro de un ProductsAndServicesProvider');
    }
    return context;
}

export { ProductsAndServicesContext, ProductsAndServicesProvider };