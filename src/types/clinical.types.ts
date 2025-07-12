import type { Pet } from './client.types';
import type { PurchasedItem } from './inventory.types';

// tipo base para los pacientes de la cola
interface QueueItem {
    id: number | string;
    petData: Pet;
    ownerName: string;
    notes: string;
    dateOfAttention: string;
    timeOfAttention: string;
    state: 'Pendiente' | 'Terminado' | 'En espera' | 'En Atención' | 'Suspendido';
}

export interface GroomingQueueItem extends QueueItem {
    turn: number;
    systemCode: string;
    productsAndServices: PurchasedItem[];
}

export interface MedicalQueueItem extends QueueItem {
    assignedDoctor: string;
}