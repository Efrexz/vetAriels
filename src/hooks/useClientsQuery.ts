import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Client } from '../types/client.types';
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  softDeleteClient,
  type CreateClientInput,
  type UpdateClientInput,
} from '../services/clientsService';

const CLIENTS_KEY = ['clients'] as const;

/**
 * Hook para obtener la lista de clientes con cache automático.
 *
 * - queryKey: identificador único del cache. Si otro componente usa
 *   useClientsQuery(), NO hace un request nuevo: reutiliza el cache.
 * - queryFn: la función que obtiene los datos (de clientsService).
 */
export function useClientsQuery() {
  return useQuery({
    queryKey: CLIENTS_KEY,
    queryFn: getClients,
  });
}

/**
 * Hook para obtener UN cliente por ID, con cache separado por ID.
 * Si pides el mismo ID en varios componentes, solo hace 1 request.
 */
export function useClientQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => getClientById(id as string),
    enabled: !!id,
  });
}

/**
 * Mutaciones de clientes: create, update, softDelete.
 * Cada una invalida el cache de la lista (['clients']) para que la UI
 * se refresque sola. Tambien elimina el detalle cacheado si aplica.
 */
export function useClientsMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (input: CreateClientInput) => createClient(input),
    onSuccess: (created) => {
      // Optimista: aparece de inmediato en la lista; sin esto, al navegar a
      // su perfil el listado aun no lo tenia y parpadeaba "Cliente no
      // encontrado" (el modal fantasma que veia el usuario).
      queryClient.setQueryData<Client[]>(CLIENTS_KEY, (old) =>
        old ? [created, ...old] : [created]
      );
      void queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: UpdateClientInput }) =>
      updateClient(id, changes),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
      queryClient.setQueryData(['clients', updated.id], updated);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => softDeleteClient(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CLIENTS_KEY });
    },
  });

  return { create, update, remove };
}
