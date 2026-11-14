import { useState } from 'react';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';

/**
 * Despacha el evento global que ToastContext convierte en notificacion
 * visible (fix C-17: un fallo de datos nunca debe verse como lista vacia).
 */
function notifyQueryError(message: string, key?: unknown) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('veta:query-error', {
      detail: { message, key: Array.isArray(key) ? key.join('.') : String(key ?? '') },
    })
  );
}

function extractErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return '';
}

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Provider de React Query.
 * Envuelve toda la app y maneja el cache global de datos del servidor.
 *
 * Defaults configurados:
 * - staleTime: 60s — los datos se consideran "frescos" por 1 minuto.
 *   Antes de ese tiempo, React Query NO refetch aunque el componente se
 *   re monte. Después de ese tiempo, refetch en background al usar el dato.
 * - refetchOnWindowFocus: true — al volver a la pestaña, revalida.
 * - retry: 1 — reintenta una vez si la query falla.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const [client] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          // Se dispara solo en el fallo FINAL (tras agotar los reintentos).
          // Las mutaciones NO van aqui: cada pagina ya muestra su error con
          // toast en su try/catch (evitaria toasts duplicados).
          onError: (error, query) => {
            const message = extractErrorMessage(error);
            if (message) notifyQueryError(message, query.queryKey);
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: true,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      {/* Devtools solo en desarrollo: en produccion exponen el cache
          (emails, clientes) a quien abra los devtools. */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
