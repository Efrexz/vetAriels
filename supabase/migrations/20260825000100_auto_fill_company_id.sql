-- ============================================================================
-- Auto-fill company_id en INSERT para todas las tablas de negocio
-- ============================================================================
-- ANTES: el frontend tenia que pasar company_id explicitamente en cada INSERT.
-- Como company_id NO debe exponerse al cliente (es un dato interno de
-- multi-tenant) y ademas es facil olvidarselo, los INSERTs fallaban con
-- 'new row violates row-level security policy' (el RLS hace
-- WITH CHECK company_id = current_company_id() y la nueva fila tenia NULL).
--
-- DESPUES: un trigger BEFORE INSERT en cada tabla de negocio rellena
-- company_id con public.current_company_id() si llega NULL. Asi el
-- frontend envia solo los campos del negocio y la DB garantiza el
-- aislamiento multi-tenant. Si el INSERT ya trae company_id (caso del
-- script de migracion con service_role), se respeta el valor enviado.
--
-- Tablas afectadas (todas las que tienen company_id propio):
--   clients, pets, pet_records, products, services,
--   inventory_movements, invoices, payments,
--   clinic_queue, grooming_queue.
-- Las tablas de items (inventory_movement_items, invoice_items,
-- grooming_queue_items) NO tienen company_id propio: lo heredan via FK
-- del padre, asi que no necesitan este trigger.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.set_company_id_from_current()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.company_id IS NULL THEN
    NEW.company_id := public.current_company_id();
  END IF;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.set_company_id_from_current()
  IS 'Auto-rellena company_id con current_company_id() si llega NULL en INSERT. Mantiene multi-tenant sin que el frontend tenga que conocer su company_id.';

-- Aplica el trigger a cada tabla de negocio. DROP IF EXISTS + CREATE
-- garantiza idempotencia: se puede re-ejecutar sin error.
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'clients',
    'pets',
    'pet_records',
    'products',
    'services',
    'inventory_movements',
    'invoices',
    'payments',
    'clinic_queue',
    'grooming_queue'
  ]
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_set_company_id ON public.%1$I;
       CREATE TRIGGER trg_set_company_id
         BEFORE INSERT ON public.%1$I
         FOR EACH ROW EXECUTE FUNCTION public.set_company_id_from_current();',
      t
    );
  END LOOP;
END
$$;