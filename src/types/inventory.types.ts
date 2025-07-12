export interface Product {
    systemCode?: string;
    productName?: string;
    brand: string;
    unitOfMeasurement?: string;
    presentation?: string;
    content?: string;
    provider?: string;
    barcode?: string;
    line: string;
    category: string;
    subcategory?: string;
    minStock?: number;
    availableStock?: number;
    cost: number;
    salePrice: number;
    registrationDate: string;
    registrationTime: string;
    status: boolean;
    id?: number | string;
}

export interface Service {
    id: number | string;
    serviceName?: string;
    line: string;
    category: string;
    cost: number;
    salePrice: number;
    registrationDate: string;
    registrationTime: string;
    status: boolean;
    availableForSale: boolean;
}

export interface PurchasedItem extends Partial<Product>, Partial<Service> {
    provisionalId: number;
    additionTime: string;
    additionDate: string;
    quantity: number;
    petSelected?: string;
}

// Operaciones de inventario restock discharges
export interface InventoryOperation {
    id: number | string;
    date: string;
    time: string;
    reason: string;
    responsible: string;
    registeredBy: string;
    operationType: string;
    store: string;
    products: PurchasedItem[];
}