import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMovements, createMovement } from '../services/inventoryService';

const INVENTORY_MOVEMENTS_KEY = ['inventory-movements'] as const;
// Ademas invalidamos la lista de productos porque el stock cambia tras cada movimiento
const PRODUCTS_KEY = ['products'] as const;

export function useInventoryMovementsQuery() {
    return useQuery({
        queryKey: INVENTORY_MOVEMENTS_KEY,
        queryFn: getMovements,
    });
}

export function useInventoryMovementsMutations() {
    const queryClient = useQueryClient();

    const createMovementMutation = useMutation({
        mutationFn: createMovement,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: INVENTORY_MOVEMENTS_KEY });
            // El stock de products cambio: revalidamos para refrescar la UI
            void queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
        },
    });

    return { createMovement: createMovementMutation };
}