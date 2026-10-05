import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Payment } from '@t/financial.types';
import {
    getPayments,
    createPayment,
    extornPayment,
    type CreatePaymentInput,
} from '../services/paymentsService';

const PAYMENTS_KEY = ['payments'] as const;

export function usePaymentsQuery() {
    return useQuery({
        queryKey: PAYMENTS_KEY,
        queryFn: getPayments,
    });
}

export function usePaymentsMutations() {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: (input: CreatePaymentInput) => createPayment(input),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: PAYMENTS_KEY });
        },
    });

    const extorn = useMutation({
        mutationFn: (payment: Payment) => extornPayment(payment),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: PAYMENTS_KEY });
        },
    });

    return { create, extorn };
}