// ============================================================================
// Servicios para mascotas (pets) y su historial clinico (pet_records)
// ============================================================================
import { supabase } from './supabaseClient';
import type {
    Pet,
    PetRecord,
    ConsultationRecord,
    NoteRecord,
} from '../types/client.types';

// ----------------------------------------------------------------------------
// Tipos crudos de la DB (snake_case)
// ----------------------------------------------------------------------------

export interface PetRecordRow {
    id: string;
    company_id: string;
    pet_id: string;
    type: 'CONSULTA' | 'NOTA';
    reason: string | null;
    anamnesis: string | null;
    temperature: string | null;
    heart_rate: string | null;
    weight: string | null;
    oxygen_saturation: string | null;
    clinical_exam: string | null;
    content: string | null;
    created_by: string | null;
    created_at: string;
    profiles?: { first_name: string; last_name: string } | { first_name: string; last_name: string }[] | null;
}

export interface PetRow {
    id: string;
    company_id: string;
    owner_id: string;
    hc: string | null;
    pet_name: string;
    species: string;
    breed: string;
    sex: 'MACHO' | 'HEMBRA';
    birth_date: string;
    microchip: string | null;
    esterilized: 'SI' | 'NO';
    active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    clients?: { first_name: string; last_name: string } | { first_name: string; last_name: string }[] | null;
    pet_records?: PetRecordRow[] | null;
}

// ----------------------------------------------------------------------------
// Helpers de mapeo
// ----------------------------------------------------------------------------

function ownerNameFromJoin(
    join: PetRow['clients']
): { ownerId: string; ownerName: string } | null {
    if (!join) return null;
    const c = Array.isArray(join) ? join[0] : join;
    if (!c) return null;
    return { ownerId: '', ownerName: `${c.first_name} ${c.last_name}`.trim() };
}

function createdByFromJoin(
    join: PetRecordRow['profiles']
): string {
    if (!join) return '';
    const p = Array.isArray(join) ? join[0] : join;
    if (!p) return '';
    return `${p.first_name} ${p.last_name}`.trim();
}

/**
 * Convierte una fila cruda de pet_records al tipo UI PetRecord.
 * 'CONSULTA' -> ConsultationRecord, 'NOTA' -> NoteRecord.
 * Las constantes fisiologicas pasan de columnas planas a un objeto anidado.
 */
export function rowToRecord(row: PetRecordRow): PetRecord {
    const baseDateTime = row.created_at;
    const createdBy = createdByFromJoin(row.profiles);

    if (row.type === 'CONSULTA') {
        const consultation: ConsultationRecord = {
            id: row.id,
            type: 'consultation',
            dateTime: baseDateTime,
            reason: row.reason ?? '',
            anamnesis: row.anamnesis ?? '',
            physiologicalConstants: {
                temperature: row.temperature ?? '',
                heartRate: row.heart_rate ?? '',
                weight: row.weight ?? '',
                oxygenSaturation: row.oxygen_saturation ?? '',
            },
            clinicalExam: row.clinical_exam ?? '',
            createdBy,
        };
        return consultation;
    }

    const note: NoteRecord = {
        id: row.id,
        type: 'note',
        dateTime: baseDateTime,
        content: row.content ?? '',
        createdBy,
    };
    return note;
}

/**
 * Convierte una fila cruda de pets al tipo UI Pet.
 * Une con clients para resolver ownerName.
 * pet_records se mapean al formato UI anidado.
 */
export function rowToPet(row: PetRow): Pet {
    const owner = ownerNameFromJoin(row.clients);
    const records = (row.pet_records ?? [])
        .filter((r) => !r.id.startsWith('__')) // safety
        .map(rowToRecord)
        .sort((a, b) => (a.dateTime < b.dateTime ? 1 : -1));

    return {
        id: row.id,
        hc: row.hc ?? '',
        ownerId: row.owner_id,
        ownerName: owner?.ownerName ?? '',
        owner: owner?.ownerName ?? '',
        registrationDate: row.created_at.slice(0, 10),
        registrationTime: row.created_at.slice(11, 19),
        petName: row.pet_name,
        birthDate: row.birth_date,
        microchip: row.microchip ?? '',
        species: row.species as Pet['species'],
        breed: row.breed,
        sex: row.sex,
        esterilized: row.esterilized,
        active: row.active,
        records,
    };
}

// ----------------------------------------------------------------------------
// Inputs de escritura (camelCase)
// ----------------------------------------------------------------------------

export interface CreatePetInput {
    ownerId: string;
    petName: string;
    birthDate: string;       // yyyy-mm-dd
    microchip?: string;
    species: 'CANINO' | 'FELINO';
    breed: string;
    sex: 'MACHO' | 'HEMBRA';
    esterilized: 'SI' | 'NO';
    active?: boolean;
}

export type UpdatePetInput = Partial<Omit<CreatePetInput, 'ownerId'>>;

export interface CreateRecordInput {
    petId: string;
    reason?: string;
    anamnesis?: string;
    temperature?: string;
    heartRate?: string;
    weight?: string;
    oxygenSaturation?: string;
    clinicalExam?: string;
    content?: string;
}

export interface CreateNoteInput {
    petId: string;
    content: string;
}

// ----------------------------------------------------------------------------
// Errores amigables
// ----------------------------------------------------------------------------

function translatePetError(message: string): string {
    const m = message.toLowerCase();
    if (m.includes('duplicate key') && m.includes('uq_pets_company_hc')) {
        return 'Ya existe una mascota con ese numero de historia clinica en tu empresa.';
    }
    if (m.includes('violates row-level security')) {
        return 'No tienes permisos para realizar esta accion. Verifica tu rol.';
    }
    if (m.includes('check constraint') && m.includes('species')) {
        return 'La especie seleccionada no es valida.';
    }
    if (m.includes('check constraint') && (m.includes('sex') || m.includes('esterilized'))) {
        return 'Los valores de sexo o esterilizado no son validos.';
    }
    if (m.includes('foreign key') && m.includes('owner_id')) {
        return 'El propietario seleccionado no existe.';
    }
    return message;
}

// ----------------------------------------------------------------------------
// LECTURAS
// ----------------------------------------------------------------------------

/**
 * Lista mascotas activas (soft-deleted excluidos) de la empresa.
 * Incluye join con clients para resolver el nombre del dueno y los
 * registros clinicos embebidos (para que ClinicalRecords siga leyendo
 * pet.records sin cambios).
 */
export async function getPets(): Promise<Pet[]> {
    const { data, error } = await supabase
        .from('pets')
        .select(`
            *,
            clients ( first_name, last_name ),
            pet_records (
                *,
                profiles ( first_name, last_name )
            )
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Error al obtener mascotas: ${translatePetError(error.message)}`);
    }

    return (data as PetRow[]).map(rowToPet);
}

/**
 * Obtiene una mascota por ID (incluyendo registros embebidos).
 */
export async function getPetById(id: string): Promise<Pet | null> {
    const { data, error } = await supabase
        .from('pets')
        .select(`
            *,
            clients ( first_name, last_name ),
            pet_records (
                *,
                profiles ( first_name, last_name )
            )
        `)
        .eq('id', id)
        .is('deleted_at', null)
        .maybeSingle();

    if (error) {
        throw new Error(`Error al obtener mascota: ${translatePetError(error.message)}`);
    }

    return data ? rowToPet(data as PetRow) : null;
}

// ----------------------------------------------------------------------------
// ESCRITURAS: mascotas
// ----------------------------------------------------------------------------

/**
 * Crea una mascota. La DB asigna:
 * - id (UUID),
 * - company_id (via RLS),
 * - hc (via trigger assign_pet_hc),
 * - created_at, updated_at, active = true (default).
 *
 * Devuelve la mascota persistida con el hc real asignado por el trigger.
 */
export async function createPet(input: CreatePetInput): Promise<Pet> {
    const insertPayload = {
        owner_id: input.ownerId,
        pet_name: input.petName,
        species: input.species,
        breed: input.breed,
        sex: input.sex,
        birth_date: input.birthDate,
        microchip: input.microchip ?? null,
        esterilized: input.esterilized,
        active: input.active ?? true,
    };

    const { data, error } = await supabase
        .from('pets')
        .insert(insertPayload)
        .select(`
            *,
            clients ( first_name, last_name ),
            pet_records (
                *,
                profiles ( first_name, last_name )
            )
        `)
        .single();

    if (error) {
        throw new Error(`Error al crear mascota: ${translatePetError(error.message)}`);
    }

    return rowToPet(data as PetRow);
}

export async function updatePet(id: string, changes: UpdatePetInput): Promise<Pet> {
    const updatePayload: Record<string, unknown> = {};
    if (changes.petName !== undefined) updatePayload.pet_name = changes.petName;
    if (changes.birthDate !== undefined) updatePayload.birth_date = changes.birthDate;
    if (changes.microchip !== undefined) updatePayload.microchip = changes.microchip ?? null;
    if (changes.species !== undefined) updatePayload.species = changes.species;
    if (changes.breed !== undefined) updatePayload.breed = changes.breed;
    if (changes.sex !== undefined) updatePayload.sex = changes.sex;
    if (changes.esterilized !== undefined) updatePayload.esterilized = changes.esterilized;
    if (changes.active !== undefined) updatePayload.active = changes.active;

    const { data, error } = await supabase
        .from('pets')
        .update(updatePayload)
        .eq('id', id)
        .is('deleted_at', null)
        .select(`
            *,
            clients ( first_name, last_name ),
            pet_records (
                *,
                profiles ( first_name, last_name )
            )
        `)
        .single();

    if (error) {
        throw new Error(`Error al actualizar mascota: ${translatePetError(error.message)}`);
    }

    return rowToPet(data as PetRow);
}

/**
 * Soft delete: marca deleted_at. La policy de UPDATE de pets permite a
 * admin/recep/vet, asi que veterinarios tambien pueden 'eliminar' mascotas
 * desde la UI sin chocar con la policy de DELETE (solo admin).
 */
export async function softDeletePet(id: string): Promise<void> {
    const { error } = await supabase
        .from('pets')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .is('deleted_at', null);

    if (error) {
        throw new Error(`Error al eliminar mascota: ${translatePetError(error.message)}`);
    }
}

// ----------------------------------------------------------------------------
// ESCRITURAS: historial clinico
// ----------------------------------------------------------------------------

/**
 * Inserta un registro de tipo CONSULTA. created_by = auth.uid() (auditoria).
 */
export async function createConsultationRecord(
    petId: string,
    input: Omit<CreateRecordInput, 'petId' | 'content'>
): Promise<PetRecord> {
    const { data: userData } = await supabase.auth.getUser();
    const createdBy = userData.user?.id ?? null;

    const { data, error } = await supabase
        .from('pet_records')
        .insert({
            pet_id: petId,
            type: 'CONSULTA',
            reason: input.reason ?? null,
            anamnesis: input.anamnesis ?? null,
            temperature: input.temperature ?? null,
            heart_rate: input.heartRate ?? null,
            weight: input.weight ?? null,
            oxygen_saturation: input.oxygenSaturation ?? null,
            clinical_exam: input.clinicalExam ?? null,
            created_by: createdBy,
        })
        .select(`
            *,
            profiles ( first_name, last_name )
        `)
        .single();

    if (error) {
        throw new Error(`Error al crear registro clinico: ${translatePetError(error.message)}`);
    }

    return rowToRecord(data as PetRecordRow);
}

/**
 * Inserta una nota clinica. created_by = auth.uid() (auditoria).
 */
export async function createNote(petId: string, content: string): Promise<PetRecord> {
    const { data: userData } = await supabase.auth.getUser();
    const createdBy = userData.user?.id ?? null;

    const { data, error } = await supabase
        .from('pet_records')
        .insert({
            pet_id: petId,
            type: 'NOTA',
            content,
            created_by: createdBy,
        })
        .select(`
            *,
            profiles ( first_name, last_name )
        `)
        .single();

    if (error) {
        throw new Error(`Error al crear nota clinica: ${translatePetError(error.message)}`);
    }

    return rowToRecord(data as PetRecordRow);
}

/**
 * Actualiza un registro existente. La DB no permite cambiar pet_id
 * (es parte de la identidad). Se envia type segun lo que se actualiza:
 * si input.content esta presente, es NOTA; si no, CONSULTA.
 */
export async function updateRecord(
    recordId: string,
    input: Omit<CreateRecordInput, 'petId'>
): Promise<PetRecord> {
    const isNote = input.content !== undefined;
    const updatePayload: Record<string, unknown> = {
        type: isNote ? 'NOTA' : 'CONSULTA',
    };
    if (isNote) {
        updatePayload.content = input.content ?? null;
        // Limpia campos de consulta para mantener la invariante del CHECK
        updatePayload.reason = null;
        updatePayload.anamnesis = null;
        updatePayload.temperature = null;
        updatePayload.heart_rate = null;
        updatePayload.weight = null;
        updatePayload.oxygen_saturation = null;
        updatePayload.clinical_exam = null;
    } else {
        updatePayload.reason = input.reason ?? null;
        updatePayload.anamnesis = input.anamnesis ?? null;
        updatePayload.temperature = input.temperature ?? null;
        updatePayload.heart_rate = input.heartRate ?? null;
        updatePayload.weight = input.weight ?? null;
        updatePayload.oxygen_saturation = input.oxygenSaturation ?? null;
        updatePayload.clinical_exam = input.clinicalExam ?? null;
        updatePayload.content = null;
    }

    const { data, error } = await supabase
        .from('pet_records')
        .update(updatePayload)
        .eq('id', recordId)
        .select(`
            *,
            profiles ( first_name, last_name )
        `)
        .single();

    if (error) {
        throw new Error(`Error al actualizar registro: ${translatePetError(error.message)}`);
    }

    return rowToRecord(data as PetRecordRow);
}

/**
 * Elimina un registro de historial clinico. Solo admin (RLS DELETE).
 * Los veterinarios NO pueden borrar; recibiran un error si lo intentan.
 */
export async function deleteRecord(recordId: string): Promise<void> {
    const { error } = await supabase
        .from('pet_records')
        .delete()
        .eq('id', recordId);

    if (error) {
        throw new Error(`Error al eliminar registro: ${translatePetError(error.message)}`);
    }
}

// ----------------------------------------------------------------------------
// Contador PET_HC (preview en el formulario)
// ----------------------------------------------------------------------------

/**
 * Devuelve el siguiente HC que asignara el trigger assign_pet_hc. Util
 * para que el formulario muestre un preview mientras el usuario lo llena.
 * La fila del contador vive en (company_id, 'PET_HC', DATE '1970-01-01')
 * despues del fix del Paso 4.
 */
export async function getNextPetHc(): Promise<string> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
        return '';
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', userData.user.id)
        .maybeSingle();

    const companyId = (profile as { company_id?: string } | null)?.company_id;
    if (!companyId) {
        return '';
    }

    const { data, error } = await supabase
        .from('company_counters')
        .select('current_value')
        .eq('company_id', companyId)
        .eq('counter_type', 'PET_HC')
        .eq('counter_date', '1970-01-01')
        .maybeSingle();

    if (error || !data) {
        return '';
    }

    const next = ((data as { current_value?: number }).current_value ?? 0) + 1;
    return next.toString().padStart(6, '0');
}