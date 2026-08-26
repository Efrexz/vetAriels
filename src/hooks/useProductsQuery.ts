import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getProducts,
    getProductBySystemCode,
    createProduct,
    updateProduct,
    softDeleteProduct,
    type CreateProductInput,
    type UpdateProductInput,
} from '../services/productsService';

const PRODUCTS_KEY = ['products'] as const;

export function useProductsQuery() {
    return useQuery({
        queryKey: PRODUCTS_KEY,
        queryFn: getProducts,
    });
}

export function useProductQuery(systemCode: string | undefined) {
    return useQuery({
        queryKey: ['products', systemCode],
        queryFn: () => getProductBySystemCode(systemCode as string),
        enabled: !!systemCode,
    });
}

export function useProductsMutations() {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: ({ systemCode, input }: { systemCode: string; input: CreateProductInput }) =>
            createProduct(systemCode, input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
        },
    });

    const update = useMutation({
        mutationFn: ({ systemCode, changes }: { systemCode: string; changes: UpdateProductInput }) =>
            updateProduct(systemCode, changes),
        onSuccess: (updated) => {
            void queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
            queryClient.setQueryData(['products', updated.systemCode], updated);
        },
    });

    const remove = useMutation({
        mutationFn: (systemCode: string) => softDeleteProduct(systemCode),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
        },
    });

    return { create, update, remove };
}