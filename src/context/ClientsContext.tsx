import { createContext, useEffect, useState, ReactNode, useRef, useContext  } from 'react';
import { Client, Pet, PetRecord } from '@t/client.types';
import { MedicalQueueItem, GroomingQueueItem } from '@t/clinical.types';
import { PurchasedItem } from '@t/inventory.types';
import { generateUniqueId } from '@utils/idGenerator';
import { useClientsQuery, useClientsMutations } from '../hooks/useClientsQuery';
import {
    usePetsQuery,
    usePetsMutations,
    usePetRecordsMutations,
} from '../hooks/usePetsQuery';

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

    // Colas de Atención
    petsInQueueMedical: MedicalQueueItem[];
    addPetToQueueMedical: (newPetInQueue: MedicalQueueItem) => void;
    updatePetInQueueMedical: (id: string, newData: Partial<MedicalQueueItem>) => void;
    removePetFromQueueMedical: (id: string ) => void;

    petsInQueueGrooming: GroomingQueueItem[];
    addPetToQueueGrooming: (newPetInQueue: GroomingQueueItem) => void;
    updatePetInQueueGrooming: (id: string , newData: Partial<GroomingQueueItem>) => void;
    removePetFromQueueGrooming: (id: string ) => void;

    petsInQueueGroomingHistory: GroomingQueueItem[];
    addPetInQueueGroomingHistory: (petInHistory: GroomingQueueItem) => void;
    updatePetInQueueGroomingHistory: (id: string, newData: Partial<GroomingQueueItem>) => void;
    returnPetToQueueGrooming: (petToReturn: GroomingQueueItem) => void;
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

    //Mascotas en cola de espera
    const [petsInQueueMedical, setPetsInQueueMedical] = useState<MedicalQueueItem[]>(() => {
        const saved = localStorage.getItem('petsInQueueMedical');
        return saved ? (JSON.parse(saved) as MedicalQueueItem[]) : [];
    });

    //Mascotas en cola grooming actual
    const [petsInQueueGrooming, setPetsInQueueGrooming] = useState<GroomingQueueItem[]>(() => {
        const saved = localStorage.getItem('petsInQueueGrooming');
        return saved ? (JSON.parse(saved) as GroomingQueueItem[]) : [];
    });

    //Mascotas en cola de  grooming historial
    const [petsInQueueGroomingHistory, setPetsInQueueGroomingHistory] = useState<GroomingQueueItem[]>(() => {
        const saved = localStorage.getItem('petsInQueueGroomingHistory');
        return saved ? (JSON.parse(saved) as GroomingQueueItem[]) : [];
    });

    // Persistimos solo lo que sigue en localStorage (colas, Paso 6 los migra).
    useEffect(() => {
        localStorage.setItem('petsInQueueGrooming', JSON.stringify(petsInQueueGrooming));
    }, [petsInQueueGrooming]);

    useEffect(() => {
        localStorage.setItem('petsInQueueGroomingHistory', JSON.stringify(petsInQueueGroomingHistory));
    }, [petsInQueueGroomingHistory]);

    useEffect(() => {
        localStorage.setItem('petsInQueueMedical', JSON.stringify(petsInQueueMedical));
    }, [petsInQueueMedical]);

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

    // Pendiente Paso 5 (van con el flujo de ventas).
    function addProductToClient(_clientId: string, _product: PurchasedItem){
        console.warn('addProductToClient: pendiente de migrar a Supabase. Se implementa en el Paso 5.');
    }

    function removeProductFromClient(_clientId: string, _provisionalId: string) {
        console.warn('removeProductFromClient: pendiente de migrar a Supabase. Se implementa en el Paso 5.');
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
     * Contador de HC legado. Se conserva por compatibilidad con la firma
     * del contexto (CreatePetForm lo lee), pero su valor ya no se usa:
     * el HC lo asigna el trigger assign_pet_hc en la DB. El componente
     * CreatePetForm ahora prefiere useNextPetHcQuery() para el preview.
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

    //Mascotas en cola de espera clinica
    function addPetToQueueMedical(newPetInQueue: MedicalQueueItem) {
        setPetsInQueueMedical(prev => [...prev, newPetInQueue]);
    }

    function updatePetInQueueMedical(id: string, newData: Partial<MedicalQueueItem>){
        setPetsInQueueMedical(prev => prev.map(pet => pet.id === id ? { ...pet, ...newData } : pet));
    }

    function removePetFromQueueMedical(id: string ) {
        setPetsInQueueMedical(prev => prev.filter(pet => pet.id !== id));
    }

    //Mascotas en cola grooming
    function addPetToQueueGrooming(newPet: GroomingQueueItem) {
        setPetsInQueueGrooming(prev => [...prev, newPet]);
    }

    function updatePetInQueueGrooming(id: string, newData: Partial<GroomingQueueItem>) {
        setPetsInQueueGrooming(prev => prev.map(pet => pet.id === id ? { ...pet, ...newData } : pet));
    }

    function removePetFromQueueGrooming(id: string) {
        setPetsInQueueGrooming(prev => prev.filter(pet => pet.id !== id));
    }

    function addPetInQueueGroomingHistory(newPet: GroomingQueueItem) {
        setPetsInQueueGroomingHistory(prev => [...prev, newPet]);
    }

    function updatePetInQueueGroomingHistory(id: string, newData: Partial<GroomingQueueItem>) {
        setPetsInQueueGroomingHistory(prev => prev.map(pet => pet.id === id ? { ...pet, ...newData } : pet));
    }

    function returnPetToQueueGrooming(petToReturn: GroomingQueueItem) {
        // Eliminar la mascota del historial de grooming
        setPetsInQueueGroomingHistory(prev => prev.filter(pet => pet.id !== petToReturn.id));

        // Enviamos de vuelta a la mascota en la cola de grooming en el orden correcto
        const updatedQueue = [...petsInQueueGrooming, petToReturn];
        updatedQueue.sort((a, b) => a.turn - b.turn);

        setPetsInQueueGrooming(updatedQueue);
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