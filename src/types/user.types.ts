export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  rol: string;
  status: 'ACTIVO' | 'INACTIVO';
  registrationDate: string;
  registrationTime: string;
  active: boolean;
}

export interface Role {
  id: number;
  name: string;
  access: 'SI' | 'NO';
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