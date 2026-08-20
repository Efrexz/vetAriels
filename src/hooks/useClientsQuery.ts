import { useQuery } from '@tanstack/react-query';
import { getClients, getClientById } from '../services/clientsService';

/**
 * Hook para obtener la lista de clientes con cache automático.
 *
 * Reemplaza la lógica manual de:
 *   const [clients, setClients] = useState([]);
 *   const [isLoading, setIsLoading] = useState(true);
 *   const [error, setError] = useState(null);
 *   useEffect(() => { fetchClients().then(...) }, []);
 *
 * React Query maneja todo eso por ti.
 *
 * - queryKey: identificador único del cache. Si otro componente usa
 *   useClientsQuery(), NO hace un request nuevo: reutiliza el cache.
 * - queryFn: la función que obtiene los datos (de clientsService).
 * - Los datos se consideran "stale" después de 60s (config default).
 */
export function useClientsQuery() {
  return useQuery({
    queryKey: ['clients'],
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
    enabled: !!id, // no ejecuta la query si id es undefined
  });
}
