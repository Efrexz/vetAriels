import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getOwnProfile,
    getOwnCompany,
    updateProfileData,
} from '../services/profilesService';

const MY_PROFILE_KEY = ['my-profile'] as const;
const MY_COMPANY_KEY = ['my-company'] as const;

export function useMyProfileQuery(enabled: boolean = true) {
    return useQuery({
        queryKey: MY_PROFILE_KEY,
        queryFn: getOwnProfile,
        enabled,
    });
}

export function useMyCompanyQuery(enabled: boolean = true) {
    return useQuery({
        queryKey: MY_COMPANY_KEY,
        queryFn: getOwnCompany,
        enabled,
    });
}

export function useProfileMutations() {
    const queryClient = useQueryClient();

    const update = useMutation({
        mutationFn: ({ userId, changes }: {
            userId: string;
            changes: { firstName?: string; lastName?: string; phone?: string };
        }) => updateProfileData(userId, changes),
        onSuccess: () => {
            // El badge de la NavBar lee el perfil del usuario logueado; si
            // el admin edito a otro, ese se recarga por focus refetch.
            void queryClient.invalidateQueries({ queryKey: MY_PROFILE_KEY });
            void queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        },
    });

    return { update };
}