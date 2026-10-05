// ============================================================================
// Utilidades de fecha compartidas
// ============================================================================
// Problema original: habia 3 parsers duplicados (useTableControls,
// dashboard.utils, PetsData/Clients) y NINGUNO aceptaba el formato ISO
// 'yyyy-mm-dd' que ahora entrega Supabase. Ademas `new Date('yyyy-mm-dd')`
// se parsea como UTC medianoche; en Lima (UTC-5) eso se convierte en el
// dia ANTERIOR a las 19:00 locales, por lo que los filtros "desde X"
// excluyen el dia X y los stats "nuevos este mes" cuentan mal.
//
// Regla de esta utilidad: las fechas de texto sin hora se parsean
// SIEMPRE en hora LOCAL. Nunca new Date(string) para 'yyyy-mm-dd'.
// ============================================================================

/**
 * Parsea '2026-01-15' como fecha LOCAL (evita el shift UTC de new Date()).
 */
export function parseIsoDateLocal(iso: string): Date | null {
    const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Parser universal de las fechas del proyecto:
 *  - '2026-01-15' | '2026-01-15T10:30:00' (ISO de Supabase)
 *  - '15/01/2026' | '15-01-2026'          (dd/mm/yyyy de localStorage)
 *  - '1/15/2026, 10:05:23 AM'             (toLocaleString del navegador)
 * Devuelve Date en hora LOCAL o null si no puede parsear.
 */
export function parseDateSafe(value: string | undefined | null): Date | null {
    if (!value) return null;

    // 1. ISO (yyyy-mm-dd...): hora local, no UTC.
    const iso = parseIsoDateLocal(value);
    if (iso) return iso;

    // 2. Con separadores '/' o '-': puede ser dd/mm/yyyy (localStorage
    //    legado) o toLocaleString del navegador ('9/29/2026, 10:05:23 AM').
    const parts = value.match(/^(\d{1,4})[-/](\d{1,2})[-/](\d{4})/);
    if (parts) {
        if (parts[1].length === 4) {
            // yyyy-mm-dd con suffix raro (no capturado por el parser ISO
            // de arriba). Se parsea por calendario local.
            const year = Number(parts[1]);
            const month = Number(parts[2]);
            const day = Number(parts[3]);
            const date = new Date(year, month - 1, day);
            return Number.isNaN(date.getTime()) ? null : date;
        }
        // dd/mm/yyyy
        const day = Number(parts[1]);
        const month = Number(parts[2]);
        const year = Number(parts[3]);
        const date = new Date(year, month - 1, day);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    // 3. Fallback: el motor nativo (para fechas con zona horaria completa).
    const native = new Date(value);
    return Number.isNaN(native.getTime()) ? null : native;
}

/**
 * Nos dice si la fecha esta dentro del rango [from, to] inclusive
 * (comparacion por calendario, sin horas).
 */
export function isWithinRange(
    value: string | undefined | null,
    from: string | undefined,
    to: string | undefined
): boolean {
    const date = parseDateSafe(value);
    if (!date) return true; // sin fecha parseable: no filtramos por defecto

    if (from) {
        const fromDate = parseDateSafe(from);
        if (fromDate && date.getTime() < fromDate.getTime()) return false;
    }
    if (to) {
        const toDate = parseDateSafe(to);
        if (toDate && date.getTime() > toDate.getTime()) return false;
    }
    return true;
}

/**
 * Es la fecha (d-m-a calendario) igual a hoy?
 */
export function isSameDay(value: string | undefined | null): boolean {
    const date = parseDateSafe(value);
    if (!date) return false;
    const now = new Date();
    return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
    );
}

/**
 * Es el mes y anio actual? (para los stats "nuevos este mes")
 */
export function isSameMonth(value: string | undefined | null): boolean {
    const date = parseDateSafe(value);
    if (!date) return false;
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

/**
 * Es la fecha de ayer? (para deltas "vs ayer")
 */
export function isSameDayYesterday(value: string | undefined | null): boolean {
    const date = parseDateSafe(value);
    if (!date) return false;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
        date.getFullYear() === yesterday.getFullYear() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getDate() === yesterday.getDate()
    );
}