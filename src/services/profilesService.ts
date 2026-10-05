// ============================================================================
// Servicios para profiles (datos del usuario actual y de usuarios de su
// empresa) — el rol y la sesion los controla Supabase Auth.
// ============================================================================
import { supabase } from './supabaseClient';
import type { User } from '../types/user.types';
import type { AdminUser } from './adminUsersService';

// ----------------------------------------------------------------------------
// Tipos
// ----------------------------------------------------------------------------

export interface OwnProfile {
    id: string;
    companyId: string;
    role: string; // 'ADMIN' | 'VETERINARIO' | 'RECEPCIONISTA' | 'GROOMER'
    active: boolean;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    createdAt: string;
}

// ----------------------------------------------------------------------------
// Errores
// ----------------------------------------------------------------------------

function translateProfileError(message: string): string {
    const m = message.toLowerCase();
    if (m.includes('violates row-level security')) {
        return 'No tienes permisos para modificar este usuario.';
    }
    if (m.includes('prevent_privilege_escalation')) {
        return 'No puedes cambiar tu rol ni tu empresa.';
    }
    return message;
}

// ----------------------------------------------------------------------------
// API
// ----------------------------------------------------------------------------

/**
 * Lee el profile del usuario autenticado (RLS: cada usuario ve su fila).
 * Es la fuente REAL de rol y datos personales (no user_metadata, que
 * el propio usuario podria editar).
 */
export async function getOwnProfile(): Promise<OwnProfile | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('id, company_id, role, active, first_name, last_name, phone, created_at')
        .eq('id', userData.user.id)
        .maybeSingle();

    if (error) {
        throw new Error(`Error al leer tu perfil: ${translateProfileError(error.message)}`);
    }
    if (!data) return null;

    const row = data as {
        id: string;
        company_id: string;
        role: string;
        active: boolean;
        first_name: string;
        last_name: string;
        phone: string | null;
        created_at: string;
    };

    return {
        id: row.id,
        companyId: row.company_id,
        role: row.role,
        active: row.active,
        firstName: row.first_name,
        lastName: row.last_name,
        phone: row.phone ?? '',
        email: userData.user.email ?? '',
        createdAt: row.created_at,
    };
}

/**
 * Lee la empresa del usuario actual (companies). RLS permite SELECT de la
 * empresa propia. Es la fuente real de los datos de la clinica (antes
 * estaban en localStorage y se mezclaban entre tenants).
 */
export async function getOwnCompany(): Promise<{
    id: string;
    name: string;
    ruc: string;
    address: string;
    phone: string;
    email: string;
} | null> {
    const profile = await getOwnProfile();
    if (!profile) return null;

    const { data, error } = await supabase
        .from('companies')
        .select('id, name, ruc, address, phone, email')
        .eq('id', profile.companyId)
        .maybeSingle();

    if (error) {
        throw new Error(`Error al leer los datos de tu clinica: ${translateProfileError(error.message)}`);
    }

    if (!data) return null;

    const row = data as {
        id: string;
        name: string;
        ruc: string | null;
        address: string | null;
        phone: string | null;
        email: string | null;
    };

    return {
        id: row.id,
        name: row.name,
        ruc: row.ruc ?? '',
        address: row.address ?? '',
        phone: row.phone ?? '',
        email: row.email ?? '',
    };
}

/**
 * Actualiza campos no-sensibles de un profile.
 * - Propio usuario: RLS lo permite siempre.
 * - Otros usuarios: requiere ADMIN (policy "Admins can update profiles").
 * El rol y el estado activo NO pasan por aqui: van por la Edge Function
 * admin-users (service_role + triggers de seguridad).
 */
export async function updateProfileData(
    userId: string,
    changes: { firstName?: string; lastName?: string; phone?: string }
): Promise<void> {
    const updatePayload: Record<string, unknown> = {};
    if (changes.firstName !== undefined) updatePayload.first_name = changes.firstName;
    if (changes.lastName !== undefined) updatePayload.last_name = changes.lastName;
    if (changes.phone !== undefined) updatePayload.phone = changes.phone ?? null;

    const { error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', userId);

    if (error) {
        throw new Error(`Error al actualizar el perfil: ${translateProfileError(error.message)}`);
    }
}

// ----------------------------------------------------------------------------
// Adaptador: AdminUser (Edge Function) -> User (UI legacy)
// ----------------------------------------------------------------------------

export const ROLES_ES: Record<string, string> = {
    ADMIN: 'Administrador',
    VETERINARIO: 'Veterinario',
    RECEPCIONISTA: 'Recepcionista',
    GROOMER: 'Groomer',
};

/** Mapa inverso: etiqueta en espanol -> enum de la DB. */
export const ROLES_FROM_ES: Record<string, string> = Object.fromEntries(
    Object.entries(ROLES_ES).map(([enumVal, esLabel]) => [esLabel, enumVal])
);

export function adminUserToUser(admin: AdminUser): User {
    return {
        id: admin.id,
        name: admin.first_name,
        lastName: admin.last_name,
        email: admin.email ?? '',
        phone: admin.phone ?? '',
        rol: ROLES_ES[admin.role] ?? admin.role,
        status: admin.active ? 'ACTIVO' : 'INACTIVO',
        registrationDate: admin.created_at.slice(0, 10),
        registrationTime: admin.created_at.slice(11, 19),
    };
}

// ----------------------------------------------------------------------------
// Hook-friendly funcion para el mapeo del propio perfil a User legacy
// ----------------------------------------------------------------------------

export function ownProfileToUser(profile: OwnProfile): User {
    return {
        id: profile.id,
        name: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        rol: ROLES_ES[profile.role] ?? profile.role,
        status: profile.active ? 'ACTIVO' : 'INACTIVO',
        registrationDate: profile.createdAt.slice(0, 10),
        registrationTime: profile.createdAt.slice(11, 19),
    };
}