import { createContext, useEffect, useState, ReactNode, useRef, useContext  } from 'react';
import { Client, Pet, PetRecord } from '@t/client.types';
import { MedicalQueueItem, GroomingQueueItem } from '@t/clinical.types';
import { PurchasedItem } from '@t/inventory.types';
import { generateUniqueId } from '@utils/idGenerator';
import { useClientsQuery, useClientsMutations } from '../hooks/useClientsQuery';

interface ClientsContextType {
    // Clientes
    clients: Client[];
    isLoadingClients: boolean;
    clientsError: Error | null;
    addClient: (newClient: Client) => Promise<Client>;
    updateClientData: (id: string, newData: Partial<Client>) => Promise<void>;
    removeClient: (id: string) => Promise<void>;
    addProductToClient: (clientId: string, product: PurchasedItem) => void;
    removeProductFromClient: (clientId: string, provisionalId: string) => void;
    refreshClients: () => Promise<void>;

    // Mascotas
    petsData: Pet[];
    addPet: (newPet: Omit<Pet, 'id' | 'hc' | 'ownerId' | 'ownerName' | 'owner'>, ownerId: string, ownerName: string) => void;
    updatePetData: (id: string, newData: Partial<Pet>) => void;
    removePet: (id: string) => void;
    historyCounter: React.MutableRefObject<number>;

    // Historial Clínico de Mascotas
    addRecord: (petId: string, newRecord: PetRecord) => void;
    updateRecord: (petId: string, recordId: string, updatedRecord: PetRecord) => void;
    removeRecord: (petId: string, recordId: string) => void;

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

    async function refreshClients() {
        await refetch();
    }

    //Pets Data
    const [petsData, setPetsData] = useState<Pet[]>(() => {
        const saved = localStorage.getItem('petsData');
        return saved ? (JSON.parse(saved) as Pet[]) : [];
    });

    //agregar nuevo record de consulta por mascota
    function addRecord(petId: string, newRecord: PetRecord) {
        setPetsData(prev => prev.map(pet =>
            pet.id === petId ? { ...pet, records: [newRecord, ...(pet.records || [])] } : pet
        ));
    }

    //editar record de consulta por mascota
    function updateRecord(petId: string, recordId: string, updatedRecord: PetRecord) {
        setPetsData(prev => prev.map(pet =>
            pet.id === petId ? { ...pet, records: pet.records?.map(record => record.id === recordId ? updatedRecord : record) } : pet
        ));
    }

    //Eliminar record de consulta por mascota
    function removeRecord(petId: string, recordId: string){
        setPetsData(prev => prev.map(pet =>
            pet.id === petId ? { ...pet, records: pet.records?.filter(record => record.id !== recordId) } : pet
        ));
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

    // Guardar en localStorage cada vez que cambien los estados
    // (Nota: clients ya NO se persiste aquí — lo maneja React Query + Supabase)
    useEffect(() => {
        localStorage.setItem('petsData', JSON.stringify(petsData));
    }, [petsData]);

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
    // Mapeamos el Client "UI" (camelCase + date/hour + pets/products) al input
    // que espera el servicio, y resolvemos con la fila real devuelta por la DB
    // (asi el id es el UUID generado por Postgres, no uno local).
    async function addClient(newClient: Client): Promise<Client> {
        const created = await createClientMutation.mutateAsync({
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
        return created;
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

    //pets data
    const historyCounter = useRef<number>(
        parseInt(localStorage.getItem('historyCounter') || '100', 10)
    );

    function addPet(newPet: Omit<Pet, 'id' | 'hc' | 'ownerId' | 'ownerName' | 'owner'>, ownerId: string, ownerName: string){
        const hcString = historyCounter.current.toString();
        const newPetData: Pet = {
        ...newPet,
        ownerId,
        ownerName,
        owner: ownerName,
        hc: hcString,
        id: generateUniqueId(),
        };
        setPetsData(prev => [newPetData, ...prev]);
        historyCounter.current++;
        localStorage.setItem('historyCounter', historyCounter.current.toString());
    }

    function updatePetData(id: string, newData: Partial<Pet>){
        setPetsData(prev => prev.map(pet => pet.id === id ? { ...pet, ...newData } : pet));
    }

    function removePet(id: string){
        setPetsData(prev => prev.filter(pet => pet.id !== id));
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
        clients, isLoadingClients, clientsError, refreshClients,
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