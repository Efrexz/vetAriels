import type { PurchasedItem } from './inventory.types'; 

type PhysiologicalConstants = {
    temperature: string;
    heartRate: string;
    weight: string;
    oxygenSaturation: string;
};

export interface ConsultationRecord {
    id: string;
    dateTime: string;
    reason: string;
    anamnesis: string;
    physiologicalConstants: PhysiologicalConstants;
    clinicalExam: string;
    createdBy: string;
}

interface NoteRecord {
    id: string;
    type: 'note';
    dateTime: string;
    content: string;
    createdBy: string;
}

export type PetRecord = ConsultationRecord | NoteRecord;

export interface Pet {
    id: string;
    hc: string;
    owner: string;
    ownerId: string;
    ownerName: string;
    registrationDate: string;
    registrationTime: string;
    petName: string;
    birthDate: string;
    microchip: string;
    species: 'CANINO' | 'FELINO';
    breed: string;
    sex: 'MACHO' | 'HEMBRA';
    esterilized: "SI" | "NO";
    active: boolean;
    records?: PetRecord[];
}

export interface Client {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dni: string;
    date: string;
    hour: string;
    phone1: string;
    phone2?: string;
    address: string;
    district: string;
    reference: string;
    observations?: string;
    pets: Pet[];
    products: PurchasedItem[];
}