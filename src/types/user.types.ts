export interface Account {
    name: string;
    email: string;
    password?: string;
}

export interface User extends Account {
    id: string;
    lastName: string;
    phone: string;
    registrationDate: string;
    registrationTime: string;
    rol: string;
    status: 'ACTIVO' | 'INACTIVO';
    userName?: string;
}

export interface Role {
    id: string;
    name: string;
    access: 'SI' | 'NO' | '';
}

export interface CompanyData {
    clinicName: string;
    email: string;
    department: string;
    province: string;
    district: string;
    address: string;
    phone: string;
    facebook: string;
}