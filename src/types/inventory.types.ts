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
    id: string;
}

export interface Service {
    id: string;
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
    provisionalId: string;
    additionTime: string;
    additionDate: string;
    quantity: number;
    petSelected?: string;
}

// Operaciones de inventario restock discharges
export interface InventoryOperation {
    id: string;
    date: string;
    time: string;
    reason: string;
    responsible: string;
    registeredBy: string;
    operationType: string;
    store: string;
    products: PurchasedItem[];
}