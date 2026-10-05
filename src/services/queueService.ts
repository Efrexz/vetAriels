// ============================================================================
// Servicios para colas (clinic_queue + grooming_queue + items)
// ============================================================================
// El historial de grooming se deriva de la misma tabla: state = TERMINADO
// o ENTREGADO (ver comentario del schema). La "cola actual" son los
// estados PENDIENTE / EN_ATENCION (+ EN_ESPERA en la clinica).
//
// Mapeo de estados DB (CHECK mayusculas) <-> UI ('Pendiente'...):
//   clinica:  PENDIENTE<->Pendiente | EN_ATENCION<->En atención |
//             EN_ESPERA<->En espera | ATENDIDO<->Terminado | SUSPENDIDO<->Suspendido
//   grooming: PENDIENTE<->Pendiente | EN_ATENCION<->En atención |
//             TERMINADO<->Terminado | ENTREGADO<->Entregado
// ============================================================================
import { supabase } from './supabaseClient';
import type { Pet } from '../types/client.types';
import type { GroomingQueueItem, MedicalQueueItem, QueueState } from '../types/clinical.types';
import type { PurchasedItem } from '../types/inventory.types';
import { rowToPet, type PetRow } from './petsService';

// ----------------------------------------------------------------------------
// Rows
// ----------------------------------------------------------------------------

interface ClinicQueueRow {
    id: string;
    company_id: string;
    pet_id: string;
    assigned_doctor_id: string | null;
    notes: string | null;
    date_of_attention: string;
    state: 'PENDIENTE' | 'EN_ATENCION' | 'EN_ESPERA' | 'ATENDIDO' | 'SUSPENDIDO';
    created_at: string;
    pets?: PetRow | null;
    profiles?: { first_name: string; last_name: string } | { first_name: string; last_name: string }[] | null;
}

interface GroomingQueueRow {
    id: string;
    company_id: string;
    pet_id: string;
    turn: number;
    system_code: string | null;
    notes: string | null;
    health_observations: string[] | null;
    state: 'PENDIENTE' | 'EN_ATENCION' | 'TERMINADO' | 'ENTREGADO';
    created_at: string;
    pets?: PetRow | null;
    grooming_queue_items?: {
        id: string;
        item_type: 'PRODUCTO' | 'SERVICIO';
        product_id: string | null;
        service_id: string | null;
        description: string;
        quantity: number;
        unit_price: number;
    }[] | null;
}

// ----------------------------------------------------------------------------
// Mapeo de estados
// ----------------------------------------------------------------------------

const CLINIC_STATE_TO_UI: Record<string, QueueState> = {
    PENDIENTE: 'Pendiente',
    EN_ATENCION: 'En atención',
    EN_ESPERA: 'En espera',
    ATENDIDO: 'Terminado',
    SUSPENDIDO: 'Suspendido',
};

const GROOMING_STATE_TO_UI: Record<string, QueueState> = {
    PENDIENTE: 'Pendiente',
    EN_ATENCION: 'En atención',
    TERMINADO: 'Terminado',
    ENTREGADO: 'Entregado',
};

/** UI -> DB para CLINICA. Devuelve undefined si no aplica. */
function uiStateToClinic(state: QueueState):
    'PENDIENTE' | 'EN_ATENCION' | 'EN_ESPERA' | 'ATENDIDO' | 'SUSPENDIDO' | undefined {
    switch (state) {
        case 'Pendiente': return 'PENDIENTE';
        case 'En atención': return 'EN_ATENCION';
        case 'En espera': return 'EN_ESPERA';
        case 'Terminado': return 'ATENDIDO';
        case 'Suspendido': return 'SUSPENDIDO';
        default: return undefined; // 'Entregado' no aplica en clinica
    }
}

/** UI -> DB para GROOMING. */
function uiStateToGrooming(state: QueueState):
    'PENDIENTE' | 'EN_ATENCION' | 'TERMINADO' | 'ENTREGADO' | undefined {
    switch (state) {
        case 'Pendiente': return 'PENDIENTE';
        case 'En atención': return 'EN_ATENCION';
        case 'Terminado': return 'TERMINADO';
        case 'Entregado': return 'ENTREGADO';
        default: return undefined; // 'En espera'/'Suspendido' no aplican
    }
}

// ----------------------------------------------------------------------------
// Pet embebido (facade): los consumidores leen item.petData.petName etc.
// ----------------------------------------------------------------------------

function petFromJoin(row: { pets?: PetRow | null }): Pet | null {
    const petRow = row.pets;
    if (!petRow) return null;
    // rowToPet espera la forma completa de fila; el join la trae entera.
    return rowToPet({ ...(petRow as PetRow), pet_records: [] });
}

// ----------------------------------------------------------------------------
// LECTURAS
// ----------------------------------------------------------------------------

const CLINIC_SELECT = `
    *,
    pets (
        *,
        clients ( first_name, last_name )
    ),
    profiles ( first_name, last_name )
`;

const GROOMING_SELECT = `
    *,
    pets (
        *,
        clients ( first_name, last_name )
    ),
    grooming_queue_items ( * )
`;

/** Cola de la clinica del DIA (date_of_attention = hoy). */
export async function getClinicQueue(): Promise<MedicalQueueItem[]> {
    const today = new Date();
    const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const { data, error } = await supabase
        .from('clinic_queue')
        .select(CLINIC_SELECT)
        .eq('date_of_attention', todayIso)
        .order('created_at', { ascending: true });

    if (error) {
        throw new Error(`Error al obtener la cola medica: ${error.message}`);
    }

    return ((data as ClinicQueueRow[]) ?? []).map((row) => {
        const pet = petFromJoin(row);
        const doctorJoin = row.profiles;
        const doctor = doctorJoin
            ? (Array.isArray(doctorJoin) ? doctorJoin[0] : doctorJoin)
            : null;

        const item: MedicalQueueItem = {
            id: row.id,
            petData: pet as Pet,
            ownerName: pet ? `${pet.ownerName}` : '',
            notes: row.notes ?? '',
            dateOfAttention: row.date_of_attention,
            timeOfAttention: row.created_at.slice(11, 19),
            state: CLINIC_STATE_TO_UI[row.state] ?? 'Pendiente',
            assignedDoctor: doctor ? `${doctor.first_name} ${doctor.last_name}`.trim() : '',
        };
        return item;
    });
}

/**
 * Grooming: devuelve la cola ACTIVA (PENDIENTE/EN_ATENCION).
 * El historial se maneja en getGroomingHistory.
 */
export async function getGroomingQueue(): Promise<GroomingQueueItem[]> {
    const { data, error } = await supabase
        .from('grooming_queue')
        .select(GROOMING_SELECT)
        .in('state', ['PENDIENTE', 'EN_ATENCION'])
        .order('turn', { ascending: true });

    if (error) {
        throw new Error(`Error al obtener la cola de grooming: ${error.message}`);
    }

    return ((data as GroomingQueueRow[]) ?? []).map(mapGroomingRow);
}

/** Historial de grooming: states TERMINADO + ENTREGADO. */
export async function getGroomingHistory(): Promise<GroomingQueueItem[]> {
    const { data, error } = await supabase
        .from('grooming_queue')
        .select(GROOMING_SELECT)
        .in('state', ['TERMINADO', 'ENTREGADO'])
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Error al obtener el historial de grooming: ${error.message}`);
    }

    return ((data as GroomingQueueRow[]) ?? []).map(mapGroomingRow);
}

function mapGroomingRow(row: GroomingQueueRow): GroomingQueueItem {
    const pet = petFromJoin(row);

    const items: PurchasedItem[] = (row.grooming_queue_items ?? []).map((it) => ({
        id: (it.product_id ?? it.service_id) as string,
        provisionalId: it.id,
        additionDate: row.created_at.slice(0, 10),
        additionTime: row.created_at.slice(11, 19),
        quantity: it.quantity,
        productName: undefined,
        serviceName: it.description,
        salePrice: it.unit_price,
        status: true,
    }));

    return {
        id: row.id,
        petData: pet as Pet,
        ownerName: pet ? `${pet.ownerName}` : '',
        notes: row.notes ?? '',
        // La DB no guarda fecha/hora de atencion separadas para grooming:
        // derivadas de created_at.
        dateOfAttention: row.created_at.slice(0, 10),
        timeOfAttention: row.created_at.slice(11, 19),
        state: GROOMING_STATE_TO_UI[row.state] ?? 'Pendiente',
        turn: row.turn,
        systemCode: row.system_code ?? (pet ? pet.hc : ''),
        healthObservations: row.health_observations ?? [],
        productsAndServices: items,
    };
}

// ----------------------------------------------------------------------------
// ESCRITURAS
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// Errores
// ----------------------------------------------------------------------------

function translateQueueError(message: string): string {
    const m = message.toLowerCase();
    if (m.includes('violates row-level security')) {
        return 'No tienes permisos para operar la cola (solo admin/recepcionista pueden eliminar).';
    }
    if (m.includes('foreign key') && m.includes('pet_id')) {
        return 'La mascota seleccionada ya no existe.';
    }
    return message;
}

// consulta medica -------------------------------------------------------------

export interface AddClinicItemInput {
    petId: string;
    assignedDoctorId?: string | null;
    notes?: string;
}

export interface UpdateClinicItemInput {
    state?: QueueState;
    assignedDoctorId?: string | null;
    notes?: string;
}

export async function addClinicQueueItem(input: AddClinicItemInput): Promise<void> {
    const dbState = uiStateToClinic('Pendiente'); // siempre entra como Pendiente
    const { error } = await supabase
        .from('clinic_queue')
        .insert({
            pet_id: input.petId,
            assigned_doctor_id: input.assignedDoctorId ?? null,
            notes: input.notes ?? '',
            state: dbState,
        });

    if (error) {
        throw new Error(`No se pudo agregar a la cola medica: ${translateQueueError(error.message)}`);
    }
}

export async function updateClinicQueueItem(id: string, input: UpdateClinicItemInput): Promise<void> {
    const payload: Record<string, unknown> = {};
    if (input.state) {
        const dbState = uiStateToClinic(input.state);
        if (!dbState) throw new Error(`El estado "${input.state}" no aplica a la cola medica.`);
        payload.state = dbState;
    }
    if (input.assignedDoctorId !== undefined) payload.assigned_doctor_id = input.assignedDoctorId;
    if (input.notes !== undefined) payload.notes = input.notes;

    const { error } = await supabase
        .from('clinic_queue')
        .update(payload)
        .eq('id', id);

    if (error) {
        throw new Error(`No se pudo actualizar la cola medica: ${translateQueueError(error.message)}`);
    }
}

export async function removeClinicQueueItem(id: string): Promise<void> {
    const { error } = await supabase
        .from('clinic_queue')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(`No se pudo quitar de la cola medica: ${translateQueueError(error.message)}`);
    }
}

// grooming --------------------------------------------------------------------

export interface AddGroomingItemInput {
    petId: string;
    systemCode?: string;
    notes?: string;
    state?: QueueState;
    healthObservations?: string[];
    items: Array<{ productId?: string; serviceId?: string; description: string; quantity: number; unitPrice: number }>;
}

export interface UpdateGroomingItemInput {
    state?: QueueState;
    notes?: string;
    healthObservations?: string[];
    /** Si llega, se reemplazan TODOS los items (borrar + insertar). */
    items?: AddGroomingItemInput['items'];
}

export async function addGroomingQueueItem(input: AddGroomingItemInput): Promise<void> {
    const { data: head, error: headErr } = await supabase
        .from('grooming_queue')
        .insert({
            pet_id: input.petId,
            system_code: input.systemCode ?? '',
            notes: input.notes ?? '',
            health_observations: input.healthObservations ?? [],
            state: uiStateToGrooming(input.state ?? 'Pendiente'),
            // turn lo asigna el trigger assign_grooming_turn (atomico diario)
        })
        .select('id')
        .single();

    if (headErr) {
        throw new Error(`No se pudo agregar a la cola de grooming: ${translateQueueError(headErr.message)}`);
    }

    if (input.items.length > 0) {
        const { error: itemsErr } = await supabase
            .from('grooming_queue_items')
            .insert(input.items.map((it) => ({
                queue_id: (head as { id: string }).id,
                item_type: it.productId ? 'PRODUCTO' : 'SERVICIO',
                product_id: it.productId ?? null,
                service_id: it.serviceId ?? null,
                description: it.description,
                quantity: it.quantity,
                unit_price: it.unitPrice,
            })));
        if (itemsErr) {
            // rollback best-effort
            await supabase.from('grooming_queue').delete().eq('id', (head as { id: string }).id);
            throw new Error(`No se pudo guardar los items de la orden: ${translateQueueError(itemsErr.message)}`);
        }
    }
}

export async function updateGroomingQueueItem(id: string, input: UpdateGroomingItemInput): Promise<void> {
    const payload: Record<string, unknown> = {};
    if (input.state) {
        const dbState = uiStateToGrooming(input.state);
        if (!dbState) throw new Error(`El estado "${input.state}" no aplica a la cola de grooming.`);
        payload.state = dbState;
    }
    if (input.notes !== undefined) payload.notes = input.notes;
    if (input.healthObservations !== undefined) payload.health_observations = input.healthObservations;

    if (Object.keys(payload).length > 0) {
        const { error } = await supabase
            .from('grooming_queue')
            .update(payload)
            .eq('id', id);
        if (error) {
            throw new Error(`No se pudo actualizar la orden de grooming: ${translateQueueError(error.message)}`);
        }
    }

    if (input.items) {
        // Reemplazo completo: borrar los actuales e insertar los nuevos.
        const { error: delErr } = await supabase
            .from('grooming_queue_items')
            .delete()
            .eq('queue_id', id);
        if (delErr) {
            throw new Error(`No se pudo actualizar los items: ${translateQueueError(delErr.message)}`);
        }
        if (input.items.length > 0) {
            const { error: insErr } = await supabase
                .from('grooming_queue_items')
                .insert(input.items.map((it) => ({
                    queue_id: id,
                    item_type: it.productId ? 'PRODUCTO' : 'SERVICIO',
                    product_id: it.productId ?? null,
                    service_id: it.serviceId ?? null,
                    description: it.description,
                    quantity: it.quantity,
                    unit_price: it.unitPrice,
                })));
            if (insErr) {
                throw new Error(`No se pudo guardar los items: ${translateQueueError(insErr.message)}`);
            }
        }
    }
}

/** Borrado real (cancelacion de la orden). La policy nueva lo permite para recep/groomer. */
export async function removeGroomingQueueItem(id: string): Promise<void> {
    // Los items cascada con la fila (FK ON DELETE CASCADE).
    const { error } = await supabase
        .from('grooming_queue')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(`No se pudo quitar de la cola de grooming: ${translateQueueError(error.message)}`);
    }
}

// ----------------------------------------------------------------------------
// Veterinarios para el select de doctor
// ----------------------------------------------------------------------------

export async function getVetProfiles(): Promise<Array<{ id: string; label: string }>> {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role')
        .in('role', ['VETERINARIO', 'ADMIN'])
        .order('first_name', { ascending: true });

    if (error) {
        throw new Error(`Error al obtener los medicos: ${error.message}`);
    }

    return ((data as { id: string; first_name: string; last_name: string }[]) ?? []).map((p) => ({
        id: p.id,
        label: `${p.first_name} ${p.last_name}`.trim(),
    }));
}