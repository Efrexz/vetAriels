import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getServices,
    getServiceById,
    createService,
    updateService,
    softDeleteService,
    type CreateServiceInput,
    type UpdateServiceInput,
} from '../services/servicesService';

const SERVICES_KEY = ['services'] as const;

export function useServicesQuery() {
    return useQuery({
        queryKey: SERVICES_KEY,
        queryFn: getServices,
    });
}

export function useServiceQuery(id: string | undefined) {
    return useQuery({
        queryKey: ['services', id],
        queryFn: () => getServiceById(id as string),
        enabled: !!id,
    });
}

export function useServicesMutations() {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (input: CreateServiceInput) => createService(input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: SERVICES_KEY });
        },
    });

    const update = useMutation({
        mutationFn: ({ id, changes }: { id: string; changes: UpdateServiceInput }) =>
            updateService(id, changes),
        onSuccess: (updated) => {
            void queryClient.invalidateQueries({ queryKey: SERVICES_KEY });
            queryClient.setQueryData(['services', updated.id], updated);
        },
    });

    const remove = useMutation({
        mutationFn: (id: string) => softDeleteService(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: SERVICES_KEY });
        },
    });

    return { create: createMutation, update, remove };
}