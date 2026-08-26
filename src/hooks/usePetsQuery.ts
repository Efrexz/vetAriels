import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getPets,
    getPetById,
    createPet,
    updatePet,
    softDeletePet,
    createConsultationRecord,
    createNote,
    updateRecord,
    deleteRecord,
    getNextPetHc,
    type CreatePetInput,
    type UpdatePetInput,
    type CreateRecordInput,
} from '../services/petsService';

const PETS_KEY = ['pets'] as const;

export function usePetsQuery() {
    return useQuery({
        queryKey: PETS_KEY,
        queryFn: getPets,
    });
}

export function usePetQuery(id: string | undefined) {
    return useQuery({
        queryKey: ['pets', id],
        queryFn: () => getPetById(id as string),
        enabled: !!id,
    });
}

/**
 * Preview del proximo HC para el formulario de creacion de mascota.
 * La DB asigna el HC final via trigger; este valor es solo informativo.
 */
export function useNextPetHcQuery() {
    return useQuery({
        queryKey: ['pet-hc-next'],
        queryFn: getNextPetHc,
        staleTime: 30 * 1000,
    });
}

/**
 * Mutaciones de mascotas. Cada una invalida la lista ['pets'] para
 * refrescar la UI. createPet/updatePet devuelven la fila fresca con join;
 * remove no necesita devolver nada.
 */
export function usePetsMutations() {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: (input: CreatePetInput) => createPet(input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: PETS_KEY });
        },
    });

    const update = useMutation({
        mutationFn: ({ id, changes }: { id: string; changes: UpdatePetInput }) =>
            updatePet(id, changes),
        onSuccess: (updated) => {
            void queryClient.invalidateQueries({ queryKey: PETS_KEY });
            queryClient.setQueryData(['pets', updated.id], updated);
        },
    });

    const remove = useMutation({
        mutationFn: (id: string) => softDeletePet(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: PETS_KEY });
        },
    });

    return { create, update, remove };
}

/**
 * Mutaciones del historial clinico. Invalidan la lista de mascotas
 * porque los registros van embebidos en el query de pets.
 */
export function usePetRecordsMutations() {
    const queryClient = useQueryClient();

    const createConsultation = useMutation({
        mutationFn: ({ petId, input }: { petId: string; input: Omit<CreateRecordInput, 'petId' | 'content'> }) =>
            createConsultationRecord(petId, input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: PETS_KEY });
        },
    });

    const createNoteRecord = useMutation({
        mutationFn: ({ petId, content }: { petId: string; content: string }) =>
            createNote(petId, content),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: PETS_KEY });
        },
    });

    const update = useMutation({
        mutationFn: ({ recordId, input }: { recordId: string; input: Omit<CreateRecordInput, 'petId'> }) =>
            updateRecord(recordId, input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: PETS_KEY });
        },
    });

    const remove = useMutation({
        mutationFn: (recordId: string) => deleteRecord(recordId),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: PETS_KEY });
        },
    });

    return { createConsultation, createNoteRecord, update, remove };
}