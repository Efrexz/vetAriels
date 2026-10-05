import { createContext, useRef, ReactNode, useContext } from 'react';
import { Client, Pet, PetRecord } from '@t/client.types';
import { MedicalQueueItem, GroomingQueueItem, QueueState } from '@t/clinical.types';
import { PurchasedItem } from '@t/inventory.types';
import { useClientsQuery, useClientsMutations } from '../hooks/useClientsQuery';
import {
    usePetsQuery,
    usePetsMutations,
    usePetRecordsMutations,
} from '../hooks/usePetsQuery';
import {
    useClinicQueueQuery,
    useGroomingQueueQuery,
    useGroomingHistoryQuery,
    useClinicQueueMutations,
    useGroomingQueueMutations,
} from '../hooks/useQueuesQuery';

/**
 * Los items de cola que envia la UI pueden pasar assignedDoctorId (el id
 * del profile del vet) ademas del nombre para mostrar. La DB guarda el id.
 */
type QueueItemPayload<T> = T & { assignedDoctorId?: string | null };

interface ClientsContextType {
    // Clientes
    clients: Client[];
    isLoadingClients: boolean;
    isLoadingPets: boolean;
    clientsError: Error | null;
    addClient: (newClient: Client) => Promise<Client>;
    updateClientData: (id: string, newData: Partial<Client>) => Promise<void>;
    removeClient: (id: string) => Promise<void>;
    addProductToClient: (clientId: string, product: PurchasedItem) => void;
    removeProductFromClient: (clientId: string, provisionalId: string) => void;
    refreshClients: () => Promise<void>;

    // Mascotas
    petsData: Pet[];
    addPet: (
        newPet: Omit<Pet, 'id' | 'hc' | 'ownerId' | 'ownerName' | 'owner'>,
        ownerId: string,
        ownerName: string
    ) => Promise<Pet>;
    updatePetData: (id: string, newData: Partial<Pet>) => Promise<void>;
    removePet: (id: string) => Promise<void>;
    historyCounter: React.MutableRefObject<number>;

    // Historial Clínico de Mascotas
    addRecord: (petId: string, newRecord: PetRecord) => Promise<PetRecord>;
    updateRecord: (petId: string, recordId: string, updatedRecord: PetRecord) => Promise<void>;
    removeRecord: (petId: string, recordId: string) => Promise<void>;

    // Colas de Atención (ya en Supabase; ver docs/PASO_4.md fase colas)
    petsInQueueMedical: MedicalQueueItem[];
    addPetToQueueMedical: (newPetInQueue: QueueItemPayload<MedicalQueueItem>) => Promise<void>;
    updatePetInQueueMedical: (id: string, newData: QueueItemPayload<Partial<MedicalQueueItem>>) => Promise<void>;
    removePetFromQueueMedical: (id: string) => Promise<void>;

    petsInQueueGrooming: GroomingQueueItem[];
    addPetToQueueGrooming: (newPetInQueue: GroomingQueueItem) => Promise<void>;
    updatePetInQueueGrooming: (id: string, newData: Partial<GroomingQueueItem>) => Promise<void>;
    removePetFromQueueGrooming: (id: string) => Promise<void>;

    petsInQueueGroomingHistory: GroomingQueueItem[];
    addPetInQueueGroomingHistory: (petInHistory: GroomingQueueItem) => Promise<void>;
    updatePetInQueueGroomingHistory: (id: string, newData: Partial<GroomingQueueItem>) => Promise<void>;
    returnPetToQueueGrooming: (petToReturn: GroomingQueueItem) => Promise<void>;
}
const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

interface ClientsProviderProps {
    children: ReactNode;
}

function ClientsProvider({ children }: ClientsProviderProps) {

    //clients Data — cacheado y revalidado automáticamente por React Query
    const { data: clients = [], isLoading: isLoadingClients, error: clientsError, refetch } = useClientsQuery();
    const { create: createClientMutation, update: updateClientMutation, remove: removeClientMutation } = useClientsMutations();

    // petsData — cacheado por React Query contra Supabase. Los records
    // clinicos vienen embebidos via join (SELECT pet_records(*)) para que
    // ClinicalRecords y demas paginas sigan leyendo pet.records sin cambios.
    const { data: petsData = [], refetch: refetchPets, isLoading: isLoadingPets } = usePetsQuery();
    const {
        create: createPetMutation,
        update: updatePetMutation,
        remove: removePetMutation,
    } = usePetsMutations();
    const {
        createConsultation: createConsultationMutation,
        createNoteRecord: createNoteMutation,
        update: updateRecordMutation,
        remove: removeRecordMutation,
    } = usePetRecordsMutations();

    async function refreshClients() {
        await Promise.all([refetch(), refetchPets()]);
    }

    // Clientes — escritura real contra Supabase.
    async function addClient(newClient: Client): Promise<Client> {
        return createClientMutation.mutateAsync({
            firstName: newClient.firstName,
            lastName: newClient.lastName,
            dni: newClient.dni,
            email: newClient.email,
            phone1: newClient.phone1,
            phone2: newClient.phone2,
            address: newClient.address,
            district: newClient.district,
            reference: newClient.reference,
            observations: newClient.observations,
        });
    }

    async function updateClientData(id: string, newData: Partial<Client>) {
        const changes: {
            dni?: string;
            email?: string;
            phone2?: string;
            district?: string;
            reference?: string;
            observations?: string;
        } = {};
        if (newData.dni !== undefined) changes.dni = newData.dni;
        if (newData.email !== undefined) changes.email = newData.email;
        if (newData.phone2 !== undefined) changes.phone2 = newData.phone2;
        if (newData.district !== undefined) changes.district = newData.district;
        if (newData.reference !== undefined) changes.reference = newData.reference;
        if (newData.observations !== undefined) changes.observations = newData.observations;
        await updateClientMutation.mutateAsync({ id, changes });
    }

    async function removeClient(id: string) {
        await removeClientMutation.mutateAsync(id);
    }

    // El carrito de ventas ahora vive en sessionStorage (ver Sales.tsx):
    // estos hooks quedan como no-ops para no romper los call sites que
    // quedan (ProductSearchInput tiene el bloque comentado).
    function addProductToClient(_clientId: string, _product: PurchasedItem) {
        // No-op: el carrito es session-local; no se persiste en el cliente.
    }

    function removeProductFromClient(_clientId: string, _provisionalId: string) {
        // No-op (idem arriba).
    }

    // Mascotas — escritura real contra Supabase. El id, hc y created_at
    // los asigna la DB (id por gen_random_uuid, hc por el trigger
    // assign_pet_hc, created_at por default). Devolvemos la mascota
    // persistida con su id real para que el caller navegue correctamente.
    async function addPet(
        newPet: Omit<Pet, 'id' | 'hc' | 'ownerId' | 'ownerName' | 'owner'>,
        ownerId: string,
        _ownerName: string
    ): Promise<Pet> {
        return createPetMutation.mutateAsync({
            ownerId,
            petName: newPet.petName,
            birthDate: newPet.birthDate,
            microchip: newPet.microchip,
            species: newPet.species,
            breed: newPet.breed,
            sex: newPet.sex,
            esterilized: newPet.esterilized,
            active: newPet.active ?? true,
        });
    }

    async function updatePetData(id: string, newData: Partial<Pet>) {
        const changes: {
            petName?: string;
            birthDate?: string;
            microchip?: string;
            species?: Pet['species'];
            breed?: string;
            sex?: Pet['sex'];
            esterilized?: Pet['esterilized'];
            active?: boolean;
        } = {};
        if (newData.petName !== undefined) changes.petName = newData.petName;
        if (newData.birthDate !== undefined) changes.birthDate = newData.birthDate;
        if (newData.microchip !== undefined) changes.microchip = newData.microchip;
        if (newData.species !== undefined) changes.species = newData.species;
        if (newData.breed !== undefined) changes.breed = newData.breed;
        if (newData.sex !== undefined) changes.sex = newData.sex;
        if (newData.esterilized !== undefined) changes.esterilized = newData.esterilized;
        if (newData.active !== undefined) changes.active = newData.active;
        await updatePetMutation.mutateAsync({ id, changes });
    }

    async function removePet(id: string) {
        await removePetMutation.mutateAsync(id);
    }

    /**
     * Contador de HC legado. Ya no se usa (el HC lo asigna el trigger
     * assign_pet_hc); expuesto por compatibilidad de firma.
     */
    const historyCounter = useRef<number>(100);

    // Historial clinico
    async function addRecord(petId: string, newRecord: PetRecord): Promise<PetRecord> {
        if (newRecord.type === 'note') {
            return createNoteMutation.mutateAsync({ petId, content: newRecord.content });
        }
        return createConsultationMutation.mutateAsync({
            petId,
            input: {
                reason: newRecord.reason,
                anamnesis: newRecord.anamnesis,
                temperature: newRecord.physiologicalConstants.temperature,
                heartRate: newRecord.physiologicalConstants.heartRate,
                weight: newRecord.physiologicalConstants.weight,
                oxygenSaturation: newRecord.physiologicalConstants.oxygenSaturation,
                clinicalExam: newRecord.clinicalExam,
            },
        });
    }

    async function updateRecord(petId: string, recordId: string, updatedRecord: PetRecord) {
        if (updatedRecord.type === 'note') {
            await updateRecordMutation.mutateAsync({
                recordId,
                input: { content: updatedRecord.content },
            });
        } else {
            await updateRecordMutation.mutateAsync({
                recordId,
                input: {
                    reason: updatedRecord.reason,
                    anamnesis: updatedRecord.anamnesis,
                    temperature: updatedRecord.physiologicalConstants.temperature,
                    heartRate: updatedRecord.physiologicalConstants.heartRate,
                    weight: updatedRecord.physiologicalConstants.weight,
                    oxygenSaturation: updatedRecord.physiologicalConstants.oxygenSaturation,
                    clinicalExam: updatedRecord.clinicalExam,
                },
            });
        }
        void petId; // no usado en la DB (la fila ya tiene pet_id)
    }

    async function removeRecord(_petId: string, recordId: string) {
        await removeRecordMutation.mutateAsync(recordId);
    }

    // ---------------------------------------------------------------------------
    // COLAS — tablas reales (clinic_queue / grooming_queue) con React Query y
    // polling (30s). Las mismas firmas; ahora devuelven Promise. El trigger
    // assign_grooming_turn asigna el turno diario atomico.
    // ---------------------------------------------------------------------------
    const { data: petsInQueueMedical = [] } = useClinicQueueQuery();
    const { data: petsInQueueGrooming = [] } = useGroomingQueueQuery();
    const { data: petsInQueueGroomingHistory = [] } = useGroomingHistoryQuery();
    const { add: addToClinic, update: updateClinic, remove: removeFromClinic } = useClinicQueueMutations();
    const { add: addToGrooming, update: updateGrooming, remove: removeFromGrooming } = useGroomingQueueMutations();

    async function addPetToQueueMedical(newPetInQueue: QueueItemPayload<MedicalQueueItem>) {
        await addToClinic.mutateAsync({
            petId: newPetInQueue.petData.id,
            assignedDoctorId: newPetInQueue.assignedDoctorId ?? null,
            notes: newPetInQueue.notes,
        });
    }

    async function updatePetInQueueMedical(id: string, newData: QueueItemPayload<Partial<MedicalQueueItem>>) {
        const doctorId = newData.assignedDoctorId;
        await updateClinic.mutateAsync({
            id,
            input: {
                state: newData.state as QueueState | undefined,
                assignedDoctorId: doctorId,
                notes: newData.notes,
            },
        });
    }

    async function removePetFromQueueMedical(id: string) {
        await removeFromClinic.mutateAsync(id);
    }

    async function addPetToQueueGrooming(newItem: GroomingQueueItem) {
        await addToGrooming.mutateAsync({
            petId: newItem.petData.id,
            systemCode: newItem.systemCode,
            notes: newItem.notes,
            healthObservations: newItem.healthObservations ?? [],
            items: (newItem.productsAndServices ?? []).map((item) => ({
                productId: item.productName !== undefined ? item.id : undefined,
                serviceId: item.productName !== undefined ? undefined : item.id,
                description: item.productName ?? item.serviceName ?? '',
                quantity: item.quantity ?? 1,
                unitPrice: item.salePrice ?? 0,
            })),
        });
    }

    async function updatePetInQueueGrooming(id: string, newData: Partial<GroomingQueueItem>) {
        await updateGrooming.mutateAsync({
            id,
            input: {
                state: newData.state as QueueState | undefined,
                notes: newData.notes,
                healthObservations: newData.healthObservations,
                items: newData.productsAndServices
                    ? newData.productsAndServices.map((item) => ({
                        productId: item.productName !== undefined ? item.id : undefined,
                        serviceId: item.productName !== undefined ? undefined : item.id,
                        description: item.productName ?? item.serviceName ?? '',
                        quantity: item.quantity ?? 1,
                        unitPrice: item.salePrice ?? 0,
                    }))
                    : undefined,
            },
        });
    }

    async function removePetFromQueueGrooming(id: string) {
        await removeFromGrooming.mutateAsync(id);
    }

    /**
     * El historial ya NO es un array separado: es la misma tabla con state
     * TERMINADO/ENTREGADO. Mover al historial = cambiar el estado; volver
     * a la cola = PENDIENTE.
     */
    async function addPetInQueueGroomingHistory(item: GroomingQueueItem) {
        await updateGrooming.mutateAsync({ id: item.id, input: { state: 'Terminado' } });
    }

    async function updatePetInQueueGroomingHistory(id: string, newData: Partial<GroomingQueueItem>) {
        await updateGrooming.mutateAsync({
            id,
            input: {
                state: newData.state as QueueState | undefined,
                notes: newData.notes,
            },
        });
    }

    async function returnPetToQueueGrooming(item: GroomingQueueItem) {
        await updateGrooming.mutateAsync({ id: item.id, input: { state: 'Pendiente' } });
    }

    const contextValue: ClientsContextType = {
        clients, isLoadingClients, isLoadingPets, clientsError, refreshClients,
        addClient, updateClientData, removeClient, addProductToClient, removeProductFromClient,
        petsData, addPet, updatePetData, removePet, historyCounter,
        addRecord, updateRecord, removeRecord,
        petsInQueueMedical, addPetToQueueMedical, updatePetInQueueMedical, removePetFromQueueMedical,
        petsInQueueGrooming, addPetToQueueGrooming, updatePetInQueueGrooming, removePetFromQueueGrooming,
        petsInQueueGroomingHistory, addPetInQueueGroomingHistory, updatePetInQueueGroomingHistory, returnPetToQueueGrooming
    };

    return (
        <ClientsContext.Provider value={contextValue}>
            {children}
        </ClientsContext.Provider>
    );
}

    export function useClients(): ClientsContextType {
        const context = useContext(ClientsContext);
        if (context === undefined) {
            throw new Error('useClients debe ser usado dentro de un ClientsProvider');
        }
        return context;
    }

export { ClientsContext, ClientsProvider };