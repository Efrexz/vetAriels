import type { ClinicalRecord } from './clinical.types';
import type { Product } from './inventory.types';

export interface Pet {
  id: string;
  ownerId: number;
  ownerName: string;
  petName: string;
  birthDate: string;
  hc: string;
  microchip: string;
  species: 'CANINO' | 'FELINO' | 'OTRO';
  breed: string;
  sex: 'MACHO' | 'HEMBRA';
  active: boolean;
  records?: ClinicalRecord[];
}

export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  date: string;
  hour: string;
  phone1: string;
  phone2: string;
  address: string;
  distrit: string;
  reference: string;
  observations: string;
  pets: any[];
  products: Product[];
}

export interface PetInQueue {
  id: string;
  assignedDoctor: string;
  petData: Pet;
  notes: string;
  dateOfAttention: string;
  timeOfAttention: string;
  state: 'En espera' | 'En atención' | 'Atendido';
}