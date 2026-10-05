-- ============================================================================
-- PASO 4.5 — Hardening de seguridad RLS + triggers de integridad
-- ============================================================================
-- Hallazgos de la auditoria de seguridad que esta migracion corrige:
--
-- 1. CRITICO: usuarios desactivados (profiles.active = false) conservaban
--    TODO su acceso: current_role()/current_company_id() no consultaban
--    active, y el login no bloqueaba. Fix: esas funciones devuelven NULL
--    si el profile esta inactivo -> todas las policies (que comparan con
--    su resultado) fallan -> acceso a datos cortado. El bloqueo de login
--    se hace en el frontend + re revocan sesiones en la Edge Function.
--
-- 2. ALTO: soft-delete revivable. Las policies de UPDATE no restringian
--    columnas: un RECEPCIONISTA podia enviar deleted_at = NULL y revivir
--    filas eliminadas, o tocar stock/created_at/created_by. Fix: trigger
--    protect_immutable_columns que bloquea (solo admin puede):
--      - revivir filas (deleted_at NOT NULL -> NULL)
--      - product: cambiar stock (solo via movimientos)
--      - tocar id/company_id/created_at/created_by
--
-- 3. MEDIO: RLS SELECT no filtraba deleted_at -> datos eliminados legibles
--    desde la API quitando el filtro del frontend. Fix: USING agrega
--    deleted_at IS NULL.
--
-- 4. MEDIO: FKs cross-tenant: un VETERINARIO de la empresa B podia crear
--    records/movimientos apuntando a mascotas/productos de la empresa A.
--    Fix: triggers de validacion que exigen misma company.
--
-- 5. MEDIO: columns-level: prevent triggering SELF-deactivation of the
--    last admin (prevent_last_admin_demotion ya cubre democion; aqui
--    tambien bloqueamos que un no-admin se marque active = false a si
--    mismo para forzarse una baja).
--
-- Todo idempotente. Ejecutar en SQL Editor (Dashboard > SQL).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. current_role() / is_admin() exigen profile activo
-- ----------------------------------------------------------------------------
-- Devuelven NULL / false si el profile esta inactivo (active = false) o
-- no existe. Como TODAS las policies comparan contra estas funciones,
-- un usuario desactivado queda sin acceso a cualquier dato, aun con
-- JWT valido.
CREATE OR REPLACE FUNCTION public.current_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles
  WHERE id = auth.uid() AND active = TRUE
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'ADMIN' AND active = TRUE
  )
$$;

-- current_company_id() tambien debe devolver NULL para inactivos: asi el
-- auto-fill de company_id ($ trg_set_company_id) no llena filas con la
-- empresa de un usuario desactivado, y las policies via company_id fallan.
CREATE OR REPLACE FUNCTION public.current_company_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT company_id FROM public.profiles
  WHERE id = auth.uid() AND active = TRUE
$$;

-- ----------------------------------------------------------------------------
-- 2. RLS SELECT filtran soft-deleted (clients/pets/products/services)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can read clients in their company"
  ON public.clients;
CREATE POLICY "Authenticated users can read clients in their company"
  ON public.clients FOR SELECT TO authenticated
  USING (
    deleted_at IS NULL
    AND company_id = public.current_company_id()
  );

DROP POLICY IF EXISTS "Authenticated users can read pets in their company"
  ON public.pets;
CREATE POLICY "Authenticated users can read pets in their company"
  ON public.pets FOR SELECT TO authenticated
  USING (
    deleted_at IS NULL
    AND company_id = public.current_company_id()
  );

DROP POLICY IF EXISTS "Authenticated users can read products"
  ON public.products;
CREATE POLICY "Authenticated users can read products"
  ON public.products FOR SELECT TO authenticated
  USING (
    deleted_at IS NULL
    AND company_id = public.current_company_id()
  );

DROP POLICY IF EXISTS "Authenticated users can read services"
  ON public.services;
CREATE POLICY "Authenticated users can read services"
  ON public.services FOR SELECT TO authenticated
  USING (
    deleted_at IS NULL
    AND company_id = public.current_company_id()
  );

-- ----------------------------------------------------------------------------
-- 3. protect_immutable_columns: bloquea revivir filas y tocar columnas
--    de sistema en UPDATEs desde la app.
-- ----------------------------------------------------------------------------
-- Reglas:
--   * deleted_at: solo puede pasar de NULL a NOT NULL (soft delete).
--     Revivir (NOT NULL -> NULL) requiere admin.
--   * id / company_id / created_at / created_by: NADIE los cambia (ni
--     admin: ni siquiera tiene sentido desde la app).
--   * products.stock: nadie desde la app (solo trigger de movimientos).
--     (El trigger corre como definer con stock ya aplicado; este check
--     corre en el mismo BEFORE y permite max 1 escritura... ver nota.)
--
-- NOTA sobre products.stock: el soft-delete de products SI pasa por esta
-- policy de UPDATE, y el stock no cambia en ese flujo, asi que el bloqueo
-- de stock no interfiere. Los movimientos de inventario tocan stock via
-- su PROPIO trigger SECURITY DEFINER (fuera de esta funcion).
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_immutable_cols()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 3a. Revivir filas soft-deleted: solo admin.
  IF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'No puedes restaurar un registro eliminado. Pide a un administrador.';
    END IF;
  END IF;

  -- 3b. Columnas de sistema: nadie las cambia.
  IF NEW.id <> OLD.id
     OR NEW.company_id IS DISTINCT FROM OLD.company_id
     OR NEW.created_at IS DISTINCT FROM OLD.created_at
     OR NEW.created_by IS DISTINCT FROM OLD.created_by
  THEN
    RAISE EXCEPTION 'Las columnas del sistema (id, company, fecha de creacion, autor) no son editables.';
  END IF;

  -- 3c. products.stock: inmutable desde la app; solo movimientos.
  -- pg_trigger_depth() = 0 significa "el UPDATE viene de la aplicacion",
  -- no de otro trigger (el trigger de movimientos de stock hace un UPDATE
  -- anidado a products a la profundidad 1 — ese es legitimo y se permite).
  IF TG_TABLE_NAME = 'products'
     AND NEW.stock IS DISTINCT FROM OLD.stock
     AND pg_trigger_depth() = 0
  THEN
    RAISE EXCEPTION 'El stock se modifica unicamente via movimientos de inventario.';
  END IF;

  RETURN NEW;
END;
$$;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['clients', 'pets', 'products', 'services']
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_protect_immutable ON public.%1$I;
       CREATE TRIGGER trg_protect_immutable
         BEFORE UPDATE ON public.%1$I
         FOR EACH ROW EXECUTE FUNCTION public.protect_immutable_cols();',
      t
    );
  END LOOP;
END
$$;

-- ----------------------------------------------------------------------------
-- 4. Validacion cross-tenant en FKs criticos
-- ----------------------------------------------------------------------------
-- Garantiza que el padre (pet/producto/cliente) pertenezca a la MISMA
-- empresa que la fila nueva. Sin esto, un usuario podia referenciar recursos
-- de otra empresa (los FKs son globales y no consultan RLS en todos los
-- flujos).
CREATE OR REPLACE FUNCTION public.assert_same_company_parent()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_parent_company UUID;
  v_own_company    UUID;
BEGIN
  -- El auto-fill de company_id (trg_set_company_id) corre en orden
  -- alfabetico DESPUES de este trigger ('a' < 's'), asi que NEW.company_id
  -- puede seguir siendo NULL aqui. COALESCE lo resuelve leyendo el profile
  -- del usuario; cuando la fila si trae company_id (seed, script de
  -- migracion), se respeta ese valor.
  v_own_company := COALESCE(NEW.company_id, public.current_company_id());

  IF TG_TABLE_NAME = 'pet_records' THEN
    SELECT company_id INTO v_parent_company FROM public.pets WHERE id = NEW.pet_id;

  ELSIF TG_TABLE_NAME = 'invoices' THEN
    SELECT company_id INTO v_parent_company FROM public.clients WHERE id = NEW.client_id;

  ELSIF TG_TABLE_NAME = 'clinic_queue' THEN
    SELECT company_id INTO v_parent_company FROM public.pets WHERE id = NEW.pet_id;

  ELSIF TG_TABLE_NAME = 'grooming_queue' THEN
    SELECT company_id INTO v_parent_company FROM public.pets WHERE id = NEW.pet_id;

  ELSIF TG_TABLE_NAME = 'inventory_movement_items' THEN
    -- Esta tabla NO tiene company_id propia: el padre valido es el movimiento.
    SELECT m.company_id INTO v_parent_company
    FROM public.inventory_movements m WHERE m.id = NEW.movement_id;

    -- Y el producto debe pertenecer a la misma empresa que el movimiento.
    IF v_own_company IS DISTINCT FROM v_parent_company THEN
      RAISE EXCEPTION 'El recurso referenciado pertenece a otra empresa.';
    END IF;
    SELECT p.company_id INTO v_parent_company FROM public.products p WHERE p.id = NEW.product_id;
  END IF;

  IF v_parent_company IS DISTINCT FROM v_own_company THEN
    RAISE EXCEPTION 'El recurso referenciado pertenece a otra empresa.';
  END IF;

  RETURN NEW;
END;
$$;

-- El orden de BEFORE triggers en each tabla es alfabetico: trg_assert_company
-- ('a') corre ANTES de trg_set_company_id ('s'), por eso la funcion usa
-- COALESCE(NEW.company_id, current_company_id()) y no depende del auto-fill.
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'pet_records',
    'invoices',
    'clinic_queue',
    'grooming_queue',
    'inventory_movement_items'
  ]
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_assert_company ON public.%1$I;
       CREATE TRIGGER trg_assert_company
         BEFORE INSERT ON public.%1$I
         FOR EACH ROW EXECUTE FUNCTION public.assert_same_company_parent();',
      t
    );
  END LOOP;
END
$$;

-- ----------------------------------------------------------------------------
-- 5. Nadie se desactiva a si mismo (evita auto-bloqueo accidental)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_self_deactivation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.id = auth.uid() AND NEW.active = FALSE AND OLD.active = TRUE THEN
    RAISE EXCEPTION 'No puedes desactivar tu propio usuario.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_self_deactivation ON public.profiles;
CREATE TRIGGER trg_prevent_self_deactivation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_self_deactivation();

-- ----------------------------------------------------------------------------
-- Verificacion final
-- ----------------------------------------------------------------------------
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public' AND policyname ILIKE '%read%'
ORDER BY tablename;