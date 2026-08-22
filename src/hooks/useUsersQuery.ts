import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listUsers,
  createUser,
  deactivateUser,
  changeUserRole,
  type AdminUser,
  type CreateUserInput,
  type UserRole,
} from '../services/adminUsersService';

const USERS_KEY = ['admin-users'] as const;

/**
 * Lista usuarios de la empresa actual via Edge Function.
 * Cache compartido entre componentes (un solo request para todos los
 * consumidores).
 */
export function useUsersQuery() {
  return useQuery({
    queryKey: USERS_KEY,
    queryFn: listUsers,
  });
}

/**
 * Hook con todas las mutaciones de usuarios. Cada mutation invalida
 * el cache de listUsers para que la UI se refresque sola.
 */
export function useUsersMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (input: CreateUserInput) => createUser(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });

  const deactivate = useMutation({
    mutationFn: (userId: string) => deactivateUser(userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });

  const changeRole = useMutation({
    mutationFn: ({ userId, newRole }: { userId: string; newRole: UserRole }) =>
      changeUserRole(userId, newRole),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });

  return { create, deactivate, changeRole };
}

export type { AdminUser };