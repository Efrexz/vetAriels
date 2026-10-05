import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getClinicQueue,
    getGroomingQueue,
    getGroomingHistory,
    getVetProfiles,
    addClinicQueueItem,
    updateClinicQueueItem,
    removeClinicQueueItem,
    addGroomingQueueItem,
    updateGroomingQueueItem,
    removeGroomingQueueItem,
    type AddClinicItemInput,
    type UpdateClinicItemInput,
    type AddGroomingItemInput,
    type UpdateGroomingItemInput,
} from '../services/queueService';

const CLINIC_QUEUE_KEY = ['clinic-queue'] as const;
const GROOMING_QUEUE_KEY = ['grooming-queue'] as const;
const GROOMING_HISTORY_KEY = ['grooming-history'] as const;
const VET_PROFILES_KEY = ['vet-profiles'] as const;

// Invalidar las dos colas esta barato: la agenda del dashboard y el navbar
// leen ambas.
function invalidateQueues(queryClient: ReturnType<typeof useQueryClient>) {
    void queryClient.invalidateQueries({ queryKey: CLINIC_QUEUE_KEY });
    void queryClient.invalidateQueries({ queryKey: GROOMING_QUEUE_KEY });
    void queryClient.invalidateQueries({ queryKey: GROOMING_HISTORY_KEY });
}

export function useClinicQueueQuery() {
    return useQuery({
        queryKey: CLINIC_QUEUE_KEY,
        queryFn: getClinicQueue,
        // La cola cambia en tiempo real entre usuarios (recepcion agrega,
        // vet atiende): refresco agresivo.
        refetchInterval: 30 * 1000,
    });
}

export function useGroomingQueueQuery() {
    return useQuery({
        queryKey: GROOMING_QUEUE_KEY,
        queryFn: getGroomingQueue,
        refetchInterval: 30 * 1000,
    });
}

export function useGroomingHistoryQuery() {
    return useQuery({
        // Se revalida junto con la cola (mismos datos, distinto filtro).
        queryKey: GROOMING_HISTORY_KEY,
        queryFn: getGroomingHistory,
        refetchInterval: 60 * 1000,
    });
}

export function useVetProfilesQuery(enabled = true) {
    return useQuery({
        queryKey: VET_PROFILES_KEY,
        queryFn: getVetProfiles,
        enabled,
        staleTime: 10 * 60 * 1000,
    });
}

export function useClinicQueueMutations() {
    const queryClient = useQueryClient();

    const add = useMutation({
        mutationFn: (input: AddClinicItemInput) => addClinicQueueItem(input),
        onSuccess: () => invalidateQueues(queryClient),
    });

    const update = useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateClinicItemInput }) =>
            updateClinicQueueItem(id, input),
        onSuccess: () => invalidateQueues(queryClient),
    });

    const remove = useMutation({
        mutationFn: (id: string) => removeClinicQueueItem(id),
        onSuccess: () => invalidateQueues(queryClient),
    });

    return { add, update, remove };
}

export function useGroomingQueueMutations() {
    const queryClient = useQueryClient();

    const add = useMutation({
        mutationFn: (input: AddGroomingItemInput) => addGroomingQueueItem(input),
        onSuccess: () => invalidateQueues(queryClient),
    });

    const update = useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateGroomingItemInput }) =>
            updateGroomingQueueItem(id, input),
        onSuccess: () => invalidateQueues(queryClient),
    });

    const remove = useMutation({
        mutationFn: (id: string) => removeGroomingQueueItem(id),
        onSuccess: () => invalidateQueues(queryClient),
    });

    return { add, update, remove };
}