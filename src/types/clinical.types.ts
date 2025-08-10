import type { Pet } from './client.types';
import type { PurchasedItem } from './inventory.types';

export type QueueState = 'Pendiente' | 'Terminado' | 'En espera' | 'En Atención' | 'Suspendido' | 'Entregado';

// tipo base para los pacientes de la cola
interface QueueItem {
    id: string;
    petData: Pet;
    ownerName: string;
    notes: string;
    dateOfAttention: string;
    timeOfAttention: string;
    state: QueueState;
}

export interface GroomingQueueItem extends QueueItem {
    turn: number;
    systemCode: string;
    productsAndServices: PurchasedItem[];
}

export interface MedicalQueueItem extends QueueItem {
    assignedDoctor: string;
}