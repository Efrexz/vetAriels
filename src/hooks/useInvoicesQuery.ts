import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getInvoices,
    createInvoice,
    type CreateInvoiceInput,
} from '../services/invoicesService';

const INVOICES_KEY = ['invoices'] as const;

export function useInvoicesQuery() {
    return useQuery({
        queryKey: INVOICES_KEY,
        queryFn: getInvoices,
    });
}

export function useInvoicesMutations() {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: (input: CreateInvoiceInput) => createInvoice(input),
        onSuccess: () => {
            // El comprobante y sus cobros tocan invoices y payments.
            void queryClient.invalidateQueries({ queryKey: INVOICES_KEY });
            void queryClient.invalidateQueries({ queryKey: ['payments'] });
            // El stock cambio (DESCARGA por venta de productos).
            void queryClient.invalidateQueries({ queryKey: ['products'] });
            void queryClient.invalidateQueries({ queryKey: ['inventory-movements'] });
        },
    });

    return { create };
}