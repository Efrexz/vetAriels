-- ============================================================================
-- Pruebas de seguridad — esquema v3 (Fase 0)
-- ============================================================================
-- Uso: docker exec -i supabase_db_vetAriel psql -U postgres -d postgres \
--        -v ON_ERROR_STOP=0 -f supabase/tests/test_phase0.sql
--
-- Convencion: los tests que ESPERAN error muestran "ERROR ..." — ver un
-- ERROR ahi es PASS (si no apareciera, seria una vulnerabilidad). Los
-- PRINT muestran el resultado esperado explicitamente.
-- ============================================================================

-- T1 - Aislamiento por empresa: recep de A solo ve clientes de A -------------
\echo '=== T1: recep A lee clientes (esperado: 1, de empresa A) ==='
BEGIN;
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims = '{"sub":"20000000-0000-0000-0000-00000000000a","role":"authenticated"}';
SELECT 'T1-RESULT: ve ' || count(*) || ' cliente(s) | nombres: ' || coalesce(string_agg(first_name || ' ' || last_name, ', '), '-') FROM public.clients;
ROLLBACK;

-- T2 - C-01: usuario DESACTIVADO no puede reactivarse a si mismo -------------
\echo '=== T2: usuario inactivo intenta reactivarse (ERROR ESPERADO = PASS) ==='
BEGIN;
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims = '{"sub":"30000000-0000-0000-0000-00000000000a","role":"authenticated"}';
UPDATE public.profiles SET active = TRUE WHERE id = '30000000-0000-0000-0000-00000000000a';
ROLLBACK;

-- T3 - C-01 servicio: service_role SI puede desactivar (Edge Function) -------
\echo '=== T3: service_role reactiva al inactivo (esperado: UPDATE 1) ==='
BEGIN;
SET LOCAL role service_role;
UPDATE public.profiles SET active = TRUE WHERE id = '30000000-0000-0000-0000-00000000000a';
UPDATE public.profiles SET active = FALSE WHERE id = '30000000-0000-0000-0000-00000000000a';
ROLLBACK;

-- T4 - C-07: la app NO puede tocar stock directamente ------------------------
\echo '=== T4: recep intenta UPDATE products.stock (ERROR ESPERADO = PASS) ==='
BEGIN;
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims = '{"sub":"20000000-0000-0000-0000-00000000000a","role":"authenticated"}';
SAVEPOINT t4;
UPDATE public.products SET stock = 99 WHERE id = 'a0000000-0000-0000-0000-000000000003';
ROLLBACK TO SAVEPOINT t4;
-- Control negativo: precio SI es editable (la columna no esta revocada)
SAVEPOINT t4b;
UPDATE public.products SET sale_price = 10.50 WHERE id = 'a0000000-0000-0000-0000-000000000003';
ROLLBACK TO SAVEPOINT t4b;
ROLLBACK;

-- T5 - C-03 smoke: UPDATE de mascota funciona (sin columnas fantasma) --------
\echo '=== T5: recep actualiza raza de mascota (esperado: UPDATE 1) ==='
BEGIN;
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims = '{"sub":"20000000-0000-0000-0000-00000000000a","role":"authenticated"}';
UPDATE public.pets SET breed = 'Labrador Retriever' WHERE id = 'a0000000-0000-0000-0000-000000000002';
ROLLBACK;

-- T6 - Cross-tenant: INSERT mascota con dueno de otra empresa (ERROR ESPERADO)
\echo '=== T6: recep A crea mascota con dueno de empresa B (ERROR ESPERADO = PASS) ==='
BEGIN;
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims = '{"sub":"20000000-0000-0000-0000-00000000000a","role":"authenticated"}';
INSERT INTO public.pets (owner_id, pet_name, species, breed, sex, birth_date)
VALUES ('b0000000-0000-0000-0000-000000000001', 'Hack', 'CANINO', 'Cruce', 'MACHO', '2020-01-01');
ROLLBACK;

-- T7 - Soft delete: borra, desaparece, no revive sin admin -------------------
\echo '=== T7a: recep soft-deletea cliente via RPC (esperado: soft_delete = 1) ==='
BEGIN;
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims = '{"sub":"20000000-0000-0000-0000-00000000000a","role":"authenticated"}';
SELECT 'T7a-RESULT: soft_delete=' || public.soft_delete('clients', 'a0000000-0000-0000-0000-000000000001');
\echo '=== T7b: cliente borrado es INVISIBLE por API (esperado: 0 filas) ==='
SELECT 'T7b-RESULT: visibles ' || count(*) FROM public.clients;
\echo '=== T7c: recep intenta restaurar via RPC (ERROR ESPERADO = PASS) ==='
SAVEPOINT t7;
SELECT public.restore_deleted('clients', 'a0000000-0000-0000-0000-000000000001');
ROLLBACK TO SAVEPOINT t7;
ROLLBACK;

\echo '=== T7d: admin A soft-deletea y restaura via RPC (esperado: 1 y 1) ==='
BEGIN;
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims = '{"sub":"10000000-0000-0000-0000-00000000000a","role":"authenticated"}';
SELECT 'T7d-RESULT: soft_delete(admin)=' || public.soft_delete('clients', 'a0000000-0000-0000-0000-000000000001')
       || ' restore=' || public.restore_deleted('clients', 'a0000000-0000-0000-0000-000000000001');
ROLLBACK;

-- T8 - C-05: correlativo monotono por empresa+serie (sin reinicio diario) ----
\echo '=== T8: recep A emite 2 boletas (correlativos 1 y 2, counter en fecha fija) ==='
BEGIN;
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims = '{"sub":"20000000-0000-0000-0000-00000000000a","role":"authenticated"}';
INSERT INTO public.invoices (client_id, tipo_comprobante, serie, cliente_doc_tipo, cliente_doc_numero, subtotal, igv, total, estado)
VALUES ('a0000000-0000-0000-0000-000000000001', 'BOLETA', 'B001', 'DNI', '11111111', 8.47, 1.53, 10.00, 'EMITIDA');
INSERT INTO public.invoices (client_id, tipo_comprobante, serie, cliente_doc_tipo, cliente_doc_numero, subtotal, igv, total, estado)
VALUES ('a0000000-0000-0000-0000-000000000001', 'BOLETA', 'B001', 'DNI', '11111111', 16.95, 3.05, 20.00, 'EMITIDA');
SELECT 'T8a-RESULT: boletas: ' || string_agg(serie || '-' || lpad(correlativo::text, 7, '0'), ', ')
FROM (SELECT serie, correlativo FROM public.invoices ORDER BY correlativo) s;
SELECT 'T8b-RESULT: contador ' || counter_type || ' fecha=' || counter_date || ' valor=' || current_value
FROM public.company_counters WHERE counter_type LIKE 'INVOICE%';
ROLLBACK;

-- T9 - RLS escritura: recep NO crea registros clinicos (ERROR ESPERADO) ------
\echo '=== T9: recep A inserta pet_record (ERROR ESPERADO = PASS) ==='
BEGIN;
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims = '{"sub":"20000000-0000-0000-0000-00000000000a","role":"authenticated"}';
INSERT INTO public.pet_records (pet_id, type, content) VALUES ('a0000000-0000-0000-0000-000000000002', 'NOTA', 'test');
ROLLBACK;

-- T10 - C-19 audit: created_by forzado al uid del emisor ---------------------
\echo '=== T10: created_by de la boleta es el uid de recep (no editable por cliente) ==='
BEGIN;
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims = '{"sub":"20000000-0000-0000-0000-00000000000a","role":"authenticated"}';
INSERT INTO public.invoices (client_id, tipo_comprobante, serie, cliente_doc_tipo, cliente_doc_numero, subtotal, igv, total, estado)
VALUES ('a0000000-0000-0000-0000-000000000001', 'BOLETA', 'B001', 'DNI', '11111111', 8.47, 1.53, 10.00, 'EMITIDA');
SELECT 'T10-RESULT: created_by correcto=' || (created_by = '20000000-0000-0000-0000-00000000000a'::uuid) FROM public.invoices ORDER BY created_at DESC LIMIT 1;
ROLLBACK;

-- T11 - Usuario inactivo: SIN acceso a datos ---------------------------------
\echo '=== T11: usuario desactivado consulta clientes (esperado: 0) ==='
BEGIN;
SET LOCAL role authenticated;
SET LOCAL request.jwt.claims = '{"sub":"30000000-0000-0000-0000-00000000000a","role":"authenticated"}';
SELECT 'T11-RESULT: ve ' || count(*) || ' cliente(s)' FROM public.clients;
ROLLBACK;
