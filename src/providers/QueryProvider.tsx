import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';

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
