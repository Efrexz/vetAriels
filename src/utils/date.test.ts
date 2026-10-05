import { describe, it, expect } from 'vitest';
import {
    parseDateSafe,
    parseIsoDateLocal,
    isWithinRange,
    isSameDay,
    isSameMonth,
} from '@utils/date';

/**
 * El host de tests corre en una timezone de CI (UTC en GitHub Actions,
 * America/Lima o similar en local). La garantia central de este util es
 * que 'yyyy-mm-dd' se parsea como medianoche LOCAL (no UTC): la comparacion
 * getMonth/getDate nunca puede cambiar de dia ni en Lima/UTC-5.
 */
describe('parseIsoDateLocal', () => {
    it('parsea yyyy-mm-dd como medianoche local (mismo dia, no anterior)', () => {
        const d = parseIsoDateLocal('2026-10-05');
        expect(d).not.toBeNull();
        expect(d!.getFullYear()).toBe(2026);
        expect(d!.getMonth()).toBe(9);
        expect(d!.getDate()).toBe(5);
        expect(d!.getHours()).toBe(0);
    });

    it('devuelve null si no matchea', () => {
        expect(parseIsoDateLocal('31/07/2024')).toBeNull();
        expect(parseIsoDateLocal('')).toBeNull();
    });
});

describe('parseDateSafe', () => {
    it('soporta ISO de Supabase (YYYY-mm-dd)', () => {
        const d = parseDateSafe('2026-01-15');
        expect(d!.getDate()).toBe(15);
        expect(d!.getMonth()).toBe(0);
    });

    it('soporta dd/mm/yyyy (localStorage legado)', () => {
        const d = parseDateSafe('31/07/2024');
        expect(d!.getDate()).toBe(31);
        expect(d!.getMonth()).toBe(6);
    });

    it('soporta dd-mm-yyyy', () => {
        const d = parseDateSafe('31-07-2024');
        expect(d!.getDate()).toBe(31);
        expect(d!.getMonth()).toBe(6);
    });

    it('soporta yyyy primero con guiones (para suffix anormal)', () => {
        const d = parseDateSafe('2026/01/15');
        expect(d!.getDate()).toBe(15);
        expect(d!.getMonth()).toBe(0);
    });

    it('devuelve null para vacios/basura', () => {
        expect(parseDateSafe(null)).toBeNull();
        expect(parseDateSafe(undefined)).toBeNull();
        expect(parseDateSafe('no es fecha')).toBeNull();
    });
});

describe('isWithinRange (TZ-safe)', () => {
    it('INCLUYE el dia exacto del filtro "desde" en ISO (bug original de Lima UTC-5)', () => {
        // Antes: parseaba '2026-10-05' como UTC-> dia anterior -> el filtro
        // excluye los registros DE ese dia.
        expect(isWithinRange('2026-10-05', '2026-10-05', undefined)).toBe(true);
        expect(isWithinRange('2026-10-06', '2026-10-05', undefined)).toBe(true);
        expect(isWithinRange('2026-10-04', '2026-10-05', undefined)).toBe(false);
    });

    it('INCLUYE el dia exacto del filtro "hasta"', () => {
        expect(isWithinRange('2026-10-05', undefined, '2026-10-05')).toBe(true);
        expect(isWithinRange('2026-10-06', undefined, '2026-10-05')).toBe(false);
    });

    it('una fecha sin parsear no se filtra por defecto', () => {
        expect(isWithinRange('garbage', '2026-10-05', undefined)).toBe(true);
    });
});

describe('isSameDay / isSameMonth', () => {
    it('hoy local es mismo dia', () => {
        const now = new Date();
        const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        expect(isSameDay(iso)).toBe(true);
        expect(isSameMonth(iso)).toBe(true);
    });

    it('ayer NO es mismo dia', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const iso = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${
            String(yesterday.getDate()).padStart(2, '0')
        }`;
        expect(isSameDay(iso)).toBe(false);
    });

    it('basura no es hoy (evita NaN), y sin fecha da false', () => {
        expect(isSameDay(null)).toBe(false);
        expect(isSameDay('su birthday')).toBe(false);
    });
});