-- ============================================================================
-- Triggers v2 — VetAriel (multi-tenant, atomicidad, auditoria)
-- ============================================================================
-- Cada trigger resuelve un problema concreto del producto:
--
--   1. handle_new_user:      crea el profile automaticamente al registrar
--                            un usuario en Supabase Auth. Asi el usuario
--                            siempre tiene perfil al iniciar sesion.
--   2. set_updated_at:       mantiene updated_at al dia en cada UPDATE.
--   3. update_product_stock: mantiene products.stock al insertar/eliminar
--                            items de movimientos (atomico, sin race condition).
--   4. assign_invoice_correlative: asigna el siguiente correlativo por
--                            empresa+serie desde company_counters.
--   5. assign_grooming_turn: asigna el turno diario de grooming.
--   6. assign_pet_hc:        asigna el HC (historia clinica) por empresa.
--
-- Patron atomico para contadores:
--   INSERT INTO company_counters (...) VALUES (...) ON CONFLICT DO NOTHING;
--   SELECT current_value FROM company_counters WHERE ...
--     FOR UPDATE;  -- toma lock
--   UPDATE company_counters SET current_value = current_value + 1 WHERE ...;
--   RETURNING current_value;
-- El FOR UPDATE bloquea la fila hasta que termine la transaccion, evitando
-- que dos queries simultaneas obtengan el mismo numero.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Helper: leer el company_id del usuario actual desde su profile.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_company_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER  -- ejecuta con permisos del dueño de la funcion, no del usuario
SET search_path = public
AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid()
$$;

COMMENT ON FUNCTION public.current_company_id() IS 'Devuelve la empresa del usuario autenticado. Usado en policies y triggers.';

-- ----------------------------------------------------------------------------
-- 1. handle_new_user: crea profile al registrarse en Supabase Auth (v3)
-- ----------------------------------------------------------------------------
-- NOTA IMPORTANTE: GoTrue (Supabase Auth) inserta al usuario en auth.users
-- con raw_app_meta_data casi vacio (solo provider/providers), y luego aplica
-- el app_metadata que le pasamos al admin.createUser() en un UPDATE
-- posterior. Por eso este trigger escucha TANTO INSERT como UPDATE de
-- raw_app_meta_data. Si la metadata llega en el UPDATE, crea el profile
-- ahi. Es IDEMPOTENTE (ON CONFLICT DO NOTHING): si dispara dos veces
-- (INSERT + UPDATE) no duplica nada.
--
-- Sin la app_metadata (company_id NULL), sale silenciosamente.
-- Eso permite el caso normal del dashboard donde no se pasa app_metadata.
-- La Edge Function admin-users SIEMPRE pasa company_id, asi que el
-- UPDATE con metadata SIEMPRE llegara despues y creara el profile.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company_id UUID;
  v_role       TEXT;
  v_first_name TEXT;
  v_last_name  TEXT;
BEGIN
  -- El admin asigna empresa/rol via app_metadata (que el usuario NO puede editar).
  v_company_id := (NEW.raw_app_meta_data ->> 'company_id')::UUID;
  v_role       := COALESCE(NEW.raw_app_meta_data ->> 'role', 'RECEPCIONISTA');
  v_first_name := COALESCE(NEW.raw_app_meta_data ->> 'first_name', '');
  v_last_name  := COALESCE(NEW.raw_app_meta_data ->> 'last_name',  '');

  -- Sin empresa asignada: salir silenciosamente. GoTrue hara un UPDATE
  -- con la metadata que re-dispara este trigger.
  IF v_company_id IS NULL THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.profiles (id, company_id, role, first_name, last_name)
  VALUES (NEW.id, v_company_id, v_role, v_first_name, v_last_name)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE OF raw_app_meta_data ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user() IS 'Crea profile al registrarse un usuario en Auth. Requiere company_id en app_metadata.';

-- ----------------------------------------------------------------------------
-- 2. set_updated_at: mantiene updated_at en cada UPDATE
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

-- Aplicamos a todas las tablas que tienen updated_at (no las de solo INSERT).
DROP TRIGGER IF EXISTS trg_set_updated_at ON public.profiles;
CREATE TRIGGER trg_set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_set_updated_at ON public.clients;
CREATE TRIGGER trg_set_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_set_updated_at ON public.pets;
CREATE TRIGGER trg_set_updated_at BEFORE UPDATE ON public.pets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_set_updated_at ON public.products;
CREATE TRIGGER trg_set_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_set_updated_at ON public.services;
CREATE TRIGGER trg_set_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_set_updated_at ON public.invoices;
CREATE TRIGGER trg_set_updated_at BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_set_updated_at ON public.clinic_queue;
CREATE TRIGGER trg_set_updated_at BEFORE UPDATE ON public.clinic_queue
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_set_updated_at ON public.grooming_queue;
CREATE TRIGGER trg_set_updated_at BEFORE UPDATE ON public.grooming_queue
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 3. update_product_stock: stock atomico al insertar/eliminar items
-- ----------------------------------------------------------------------------
-- Antes (en localStorage) dos usuarios podian corromper el stock.
-- Ahora: trigger BEFORE INSERT valida que hay stock suficiente (descarga),
-- AFTER INSERT/DELETE actualiza el stock. Todo dentro de una transaccion.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_product_stock_on_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_movement_type TEXT;
BEGIN
  SELECT type INTO v_movement_type FROM public.inventory_movements WHERE id = NEW.movement_id;

  IF v_movement_type = 'CARGA' THEN
    UPDATE public.products SET stock = stock + NEW.quantity WHERE id = NEW.product_id;
  ELSIF v_movement_type = 'DESCARGA' THEN
    -- Validar stock suficiente ANTES de actualizar.
    IF (SELECT stock FROM public.products WHERE id = NEW.product_id) < NEW.quantity THEN
      RAISE EXCEPTION 'Stock insuficiente para producto % (necesita %, hay %)',
        NEW.product_id, NEW.quantity, (SELECT stock FROM public.products WHERE id = NEW.product_id);
    END IF;
    UPDATE public.products SET stock = stock - NEW.quantity WHERE id = NEW.product_id;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_product_stock_on_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_movement_type TEXT;
BEGIN
  SELECT type INTO v_movement_type FROM public.inventory_movements WHERE id = OLD.movement_id;

  IF v_movement_type = 'CARGA' THEN
    -- Si borramos una carga, restamos del stock.
    IF (SELECT stock FROM public.products WHERE id = OLD.product_id) < OLD.quantity THEN
      RAISE EXCEPTION 'No se puede eliminar la carga: stock (%) menor que cantidad a restar (%)',
        (SELECT stock FROM public.products WHERE id = OLD.product_id), OLD.quantity;
    END IF;
    UPDATE public.products SET stock = stock - OLD.quantity WHERE id = OLD.product_id;
  ELSIF v_movement_type = 'DESCARGA' THEN
    -- Si borramos una descarga, devolvemos al stock.
    UPDATE public.products SET stock = stock + OLD.quantity WHERE id = OLD.product_id;
  END IF;

  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_stock_after_insert ON public.inventory_movement_items;
CREATE TRIGGER trg_stock_after_insert
  AFTER INSERT ON public.inventory_movement_items
  FOR EACH ROW EXECUTE FUNCTION public.update_product_stock_on_insert();

DROP TRIGGER IF EXISTS trg_stock_after_delete ON public.inventory_movement_items;
CREATE TRIGGER trg_stock_after_delete
  AFTER DELETE ON public.inventory_movement_items
  FOR EACH ROW EXECUTE FUNCTION public.update_product_stock_on_delete();

COMMENT ON FUNCTION public.update_product_stock_on_insert() IS 'Mantiene products.stock al insertar items de movimientos (atomico).';
COMMENT ON FUNCTION public.update_product_stock_on_delete() IS 'Revierte el stock al eliminar items de movimientos.';

-- ----------------------------------------------------------------------------
-- 4. assign_invoice_correlative: correlativo unico por empresa+serie
-- ----------------------------------------------------------------------------
-- SECURITY DEFINER para poder escribir en company_counters (la tabla solo
-- tiene policy de SELECT). Mantiene public.current_company_id() directo
-- para no depender de NEW.company_id ni del orden de triggers.
CREATE OR REPLACE FUNCTION public.assign_invoice_correlative()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_counter_type TEXT;
  v_next_value  INTEGER;
  v_company_id  UUID := public.current_company_id();
BEGIN
  v_counter_type := CASE
    WHEN NEW.tipo_comprobante = 'BOLETA'  THEN 'INVOICE_BOLETA'
    WHEN NEW.tipo_comprobante = 'FACTURA' THEN 'INVOICE_FACTURA'
  END;

  -- Asegurar fila del contador para hoy.
  INSERT INTO public.company_counters (company_id, counter_type, counter_date, current_value)
  VALUES (v_company_id, v_counter_type, CURRENT_DATE, 0)
  ON CONFLICT (company_id, counter_type, counter_date) DO NOTHING;

  -- Lock + incrementar (atomico).
  SELECT current_value + 1 INTO v_next_value
  FROM public.company_counters
  WHERE company_id   = v_company_id
    AND counter_type = v_counter_type
    AND counter_date = CURRENT_DATE
  FOR UPDATE;

  UPDATE public.company_counters
  SET current_value = current_value + 1
  WHERE company_id   = v_company_id
    AND counter_type = v_counter_type
    AND counter_date = CURRENT_DATE;

  NEW.correlativo := v_next_value;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_invoice_correlative ON public.invoices;
CREATE TRIGGER trg_invoice_correlative
  BEFORE INSERT ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.assign_invoice_correlative();

COMMENT ON FUNCTION public.assign_invoice_correlative() IS 'Asigna correlativo unico por empresa+serie+fecha (atomico).';

-- ----------------------------------------------------------------------------
-- 5. assign_grooming_turn: turno diario por empresa
-- ----------------------------------------------------------------------------
-- SECURITY DEFINER para escribir en company_counters. Usa
-- public.current_company_id() directamente (ver seccion 4).
CREATE OR REPLACE FUNCTION public.assign_grooming_turn()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_next_value INTEGER;
  v_company_id UUID := public.current_company_id();
BEGIN
  INSERT INTO public.company_counters (company_id, counter_type, counter_date, current_value)
  VALUES (v_company_id, 'GROOMING_TURN_DAILY', CURRENT_DATE, 0)
  ON CONFLICT (company_id, counter_type, counter_date) DO NOTHING;

  SELECT current_value + 1 INTO v_next_value
  FROM public.company_counters
  WHERE company_id   = v_company_id
    AND counter_type = 'GROOMING_TURN_DAILY'
    AND counter_date = CURRENT_DATE
  FOR UPDATE;

  UPDATE public.company_counters
  SET current_value = current_value + 1
  WHERE company_id   = v_company_id
    AND counter_type = 'GROOMING_TURN_DAILY'
    AND counter_date = CURRENT_DATE;

  NEW.turn := v_next_value;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_grooming_turn ON public.grooming_queue;
CREATE TRIGGER trg_grooming_turn
  BEFORE INSERT ON public.grooming_queue
  FOR EACH ROW EXECUTE FUNCTION public.assign_grooming_turn();

-- ----------------------------------------------------------------------------
-- 6. assign_pet_hc: historia clinica unica por empresa (monotonico)
-- ----------------------------------------------------------------------------
-- SECURITY DEFINER para escribir en company_counters. Usa
-- public.current_company_id() directamente (ver seccion 4).
--
-- IMPORTANTE: este contador usa una fecha fija (1970-01-01) para mantener
-- una unica fila por empresa. Si usamos CURRENT_DATE, el trigger crea una
-- fila nueva del contador cada dia empezando en 0 -> choca con el indice
-- UNIQUE uq_pets_company_hc al dia siguiente.
--
-- PET_HC debe ser monotónico por empresa (la HC no se reinicia cada dia).
-- GROOMING_TURN_DAILY (funcion anterior) si se reinicia cada dia -- ese si
-- usa CURRENT_DATE. La PK compuesta (company_id, counter_type, counter_date)
-- exige que los dos counters se distingan por su counter_date.
CREATE OR REPLACE FUNCTION public.assign_pet_hc()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_next_value INTEGER;
  v_company_id UUID := public.current_company_id();
BEGIN
  INSERT INTO public.company_counters (company_id, counter_type, counter_date, current_value)
  VALUES (v_company_id, 'PET_HC', DATE '1970-01-01', 0)
  ON CONFLICT (company_id, counter_type, counter_date) DO NOTHING;

  SELECT current_value + 1 INTO v_next_value
  FROM public.company_counters
  WHERE company_id   = v_company_id
    AND counter_type = 'PET_HC'
    AND counter_date = DATE '1970-01-01'
  FOR UPDATE;

  UPDATE public.company_counters
  SET current_value = current_value + 1
  WHERE company_id   = v_company_id
    AND counter_type = 'PET_HC'
    AND counter_date = DATE '1970-01-01';

  NEW.hc := LPAD(v_next_value::TEXT, 6, '0');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_pet_hc ON public.pets;
CREATE TRIGGER trg_pet_hc
  BEFORE INSERT ON public.pets
  FOR EACH ROW EXECUTE FUNCTION public.assign_pet_hc();

-- ----------------------------------------------------------------------------
-- 7. set_company_id_from_current: auto-rellena company_id en INSERT
-- ----------------------------------------------------------------------------
-- El frontend no debe conocer su propio company_id (es dato interno de
-- multi-tenant), asi que los INSERTs llegan SIN company_id. El RLS policy
-- de cada tabla exige `company_id = current_company_id()`, asi que sin
-- company_id el INSERT falla con 'row-level security policy violated'.
--
-- Solucion: este trigger BEFORE INSERT en cada tabla de negocio rellena
-- company_id con current_company_id() si llega NULL. Si el INSERT ya trae
-- company_id (caso del script de migracion con service_role), se respeta.
-- ----------------------------------------------------------------------------
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