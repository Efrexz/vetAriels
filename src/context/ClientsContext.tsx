import { createContext, useEffect, useState, ReactNode, useRef  } from 'react';
import { Client, Pet, PetRecord } from '@t/client.types';
import { MedicalQueueItem, GroomingQueueItem } from '@t/clinical.types';
import { PurchasedItem } from '@t/inventory.types';

interface ClientsContextType {
  // Clientes
  clients: Client[];
  addClient: (newClient: Client) => void;
  updateClientData: (id: number, newData: Partial<Client>) => void;
  removeClient: (id: number) => void;
  addProductToClient: (clientId: number, product: PurchasedItem) => void;
  removeProductFromClient: (clientId: number, provisionalId: number) => void;

  // Mascotas
  petsData: Pet[];
  addPet: (newPet: Omit<Pet, 'id' | 'hc' | 'ownerId' | 'ownerName' | 'owner'>, ownerId: number, ownerName: string) => void;
  updatePetData: (id: string, newData: Partial<Pet>) => void;
  removePet: (id: string) => void;
  
  // Historial Clínico de Mascotas
  addRecord: (petId: string, newRecord: PetRecord) => void;
  updateRecord: (petId: string, recordId: number, updatedRecord: PetRecord) => void;
  removeRecord: (petId: string, recordId: number) => void;

  // Colas de Atención
  petsInQueueMedical: MedicalQueueItem[];
  addPetToQueueMedical: (newPetInQueue: MedicalQueueItem) => void;
  updatePetInQueueMedical: (id: string | number, newData: Partial<MedicalQueueItem>) => void;
  removePetFromQueueMedical: (id: string | number) => void;

  petsInQueueGrooming: GroomingQueueItem[];
  addPetToQueueGrooming: (newPetInQueue: GroomingQueueItem) => void;
  updatePetInQueueGrooming: (id: string | number, newData: Partial<GroomingQueueItem>) => void;
  removePetFromQueueGrooming: (id: string | number) => void;

  petsInQueueGroomingHistory: GroomingQueueItem[];
  addPetInQueueGroomingHistory: (petInHistory: GroomingQueueItem) => void;
  updatePetInQueueGroomingHistory: (id: string | number, newData: Partial<GroomingQueueItem>) => void;
  returnPetToQueueGrooming: (petToReturn: GroomingQueueItem) => void;
}
const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

interface ClientsProviderProps {
  children: ReactNode;
}

function ClientsProvider({ children }: ClientsProviderProps) {

    //clients Data
    const [clients, setClients] = useState<Client[]>(() => {
        const saved = localStorage.getItem('clients');
        return saved ? (JSON.parse(saved) as Client[]) : [];
    });


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
    function updateRecord(petId: string, recordId: number, updatedRecord: PetRecord) {
    setPetsData(prev => prev.map(pet =>
      pet.id === petId ? { ...pet, records: pet.records?.map(record => record.id === recordId ? updatedRecord : record) } : pet
    ));
  }

    //Eliminar record de consulta por mascota
    function removeRecord(petId: string, recordId: number){
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
    useEffect(() => {
        localStorage.setItem('clients', JSON.stringify(clients));
    }, [clients]);

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

    //clients
    function addClient(newClient: Client) {
        setClients(prev => [newClient, ...prev]);
    }


    function updateClientData(id: number, newData: Partial<Client>) {
        setClients(prev => prev.map(client => client.id === id ? { ...client, ...newData } : client));
    }

    function removeClient(id: number) {
        setClients(prev => prev.filter(client => client.id !== id));
    }

    function addProductToClient(clientId: number, product: PurchasedItem){
        setClients(prev => prev.map(client =>
        client.id === clientId ? { ...client, products: [...(client.products || []), product] } : client
        ));
    }
  

    function removeProductFromClient(clientId: number, provisionalId: number) {
    setClients(prev => prev.map(client =>
      client.id === clientId ? { ...client, products: (client.products || []).filter(p => p.provisionalId !== provisionalId) } : client
    ));
  }

    //pets data
    const historyCounter = useRef<number>(
        parseInt(localStorage.getItem('historyCounter') || '100', 10)
    );

     function addPet(newPet: Omit<Pet, 'id' | 'hc' | 'ownerId' | 'ownerName' | 'owner'>, ownerId: number, ownerName: string): void {
        const hcString = historyCounter.current.toString();
        const newPetData: Pet = {
        ...newPet,
        ownerId,
        ownerName,
        owner: ownerName,
        hc: hcString,
        id: hcString,
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

    function updatePetInQueueMedical(id: string | number, newData: Partial<MedicalQueueItem>){
        setPetsInQueueMedical(prev => prev.map(pet => pet.id === id ? { ...pet, ...newData } : pet));
    }

    function removePetFromQueueMedical(id: string | number) {
        setPetsInQueueMedical(prev => prev.filter(pet => pet.id !== id));
    }

    //Mascotas en cola grooming
    function addPetToQueueGrooming(newPet: GroomingQueueItem) {
        setPetsInQueueGrooming(prev => [...prev, newPet]);
    }

    function updatePetInQueueGrooming(id: string | number, newData: Partial<GroomingQueueItem>) {
        setPetsInQueueGrooming(prev => prev.map(pet => pet.id === id ? { ...pet, ...newData } : pet));
    }

    function removePetFromQueueGrooming(id: string | number) {
        setPetsInQueueGrooming(prev => prev.filter(pet => pet.id !== id));
    }

    function addPetInQueueGroomingHistory(newPet: GroomingQueueItem) {
        setPetsInQueueGroomingHistory(prev => [...prev, newPet]);
    }

    function updatePetInQueueGroomingHistory(id: string | number, newData: Partial<GroomingQueueItem>) {
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
    clients, addClient, updateClientData, removeClient, addProductToClient, removeProductFromClient,
    petsData, addPet, updatePetData, removePet,
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

export { ClientsContext, ClientsProvider };