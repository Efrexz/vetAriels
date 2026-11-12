-- ============================================================================
-- Endurecimiento v3 — integridad, columnas protegidas y reglas de seguridad
-- ============================================================================
-- Consolida y CORRIGE el hardening anterior (auditado en Fase 1):
--
--   C-01 (CRITICO): un usuario desactivado podia reactivarse a si mismo.
--     Fix: el trigger de escalada de privilegios ahora TAMBIEN bloquea
--     cambios de `active` para usuarios no-admin (service_role no se ve
--     afectado: bypass explicito al inicio de la funcion).
--
--   C-03 (CRITICO): la version anterior referenciaba NEW.created_by en
--     tablas que NO tienen esa columna (pets, products, services) y
--     NEW.company_id en inventory_movement_items (que no la tiene).
--     Fix: logica por tabla (TG_TABLE_NAME) y own_company resuelto
--     segun si la tabla tiene o no company_id propia.
--
--   C-07 (ALTO): la proteccion de products.stock usaba pg_trigger_depth()
--     de forma incorrecta (dentro de un trigger la profundidad minima es 1,
--     nunca 0) -> la proteccion nunca se activaba y el stock era editable
--     via API. Fix: se reemplaza por privilegios a nivel de columna
--     (REVOKE UPDATE (stock)), el mecanismo correcto de Postgres. Los
--     triggers SECURITY DEFINER y service_role no se ven afectados.
--
--   C-19 (parcial): created_by se asigna SIEMPRE en servidor (trigger), no
--     se confia en lo que envia el frontend.
--
-- Estructura:
--   1. Privilegios por columna (columnas de sistema + stock).
--   2. set_created_by_from_auth: auditoria forzada en servidor.
--   3. assert_same_company_parent: integridad cross-tenant (ampliada).
--   4. protect_immutable_cols: soft-delete no revivable + guardas extra.
--   5. prevent_privilege_escalation: nadie toca role/company_id/active.
--   6. prevent_last_admin_demotion: anti-lockout.
--   7. prevent_profile_deletion: DELETE -> soft-disable.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Privilegios por columna: la app NO puede tocar columnas de sistema
-- ----------------------------------------------------------------------------
-- Postgres permite conceder/revocar UPDATE por columna. Para que el revoke
-- por columna sea EFECTIVO hay que revocar el privilegio table-wide primero
-- (Supabase otorga UPDATE completo por defecto) y re-grantar SOLO las
-- columnas de negocio. Los triggers SECURITY DEFINER y service_role no se
-- ven afectados.
--
-- Verificado empiricamente: un simple REVOKE UPDATE (col) con el grant
-- table-wide vigente NO hace nada (el grant general lo tapa).
-- ----------------------------------------------------------------------------

-- clients: todo menos id, company_id, created_at, created_by
REVOKE UPDATE ON public.clients FROM anon, authenticated;
GRANT UPDATE (first_name, last_name, dni, email, phone1, phone2, address,
              district, reference, observations, deleted_at, updated_at)
  ON public.clients TO authenticated;

-- pets: todo menos id, company_id, created_at
REVOKE UPDATE ON public.pets FROM anon, authenticated;
GRANT UPDATE (owner_id, hc, pet_name, species, breed, sex, birth_date,
              microchip, esterilized, active, deleted_at, updated_at)
  ON public.pets TO authenticated;

-- products: todo menos id, company_id, created_at Y STOCK (solo movimientos)
REVOKE UPDATE ON public.products FROM anon, authenticated;
GRANT UPDATE (system_code, product_name, brand, barcode, line, category,
              subcategory, unit_of_measurement, presentation, content,
              provider, min_stock, cost, sale_price, active, deleted_at,
              updated_at)
  ON public.products TO authenticated;

-- services: todo menos id, company_id, created_at
REVOKE UPDATE ON public.services FROM anon, authenticated;
GRANT UPDATE (service_name, line, category, cost, sale_price,
              available_for_sale, active, deleted_at, updated_at)
  ON public.services TO authenticated;

-- ----------------------------------------------------------------------------
-- 2. set_created_by_from_auth: created_by SIEMPRE correcto en servidor
-- ----------------------------------------------------------------------------
-- Si el INSERT viene de un usuario autenticado, created_by se fuerza a
-- auth.uid() (ignorando lo que mande el cliente). Si viene de service_role
-- (auth.uid() NULL, ej. scripts de seed), se respeta el valor enviado.
CREATE OR REPLACE FUNCTION public.set_created_by_from_auth()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    NEW.created_by := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  t TEXT;
BEGIN
  -- Solo tablas que REALMENTE tienen columna created_by.
  FOREACH t IN ARRAY ARRAY[
    'clients',
    'pet_records',
    'inventory_movements',
    'invoices',
    'payments',
    'clinic_queue',
    'grooming_queue'
  ]
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_set_created_by ON public.%1$I;
       CREATE TRIGGER trg_set_created_by
         BEFORE INSERT ON public.%1$I
         FOR EACH ROW EXECUTE FUNCTION public.set_created_by_from_auth();',
      t
    );
  END LOOP;
END
$$;

COMMENT ON FUNCTION public.set_created_by_from_auth() IS 'Fuerza created_by = auth.uid() en INSERTs de usuarios autenticados. Auditable y no falsificable desde el cliente.';

-- ----------------------------------------------------------------------------
-- 3. assert_same_company_parent: integridad cross-tenant (INSERT)
-- ----------------------------------------------------------------------------
-- Garantiza que el padre referenciado (cliente/mascota/factura/movimiento)
-- y los productos/servicios de items pertenezcan a la MISMA empresa que el
-- usuario que inserta. Cubre INSERT y tambien UPDATE (segundo trigger).
--
-- CORRECTIVO (C-03): esta version NO referencía NEW.company_id en tablas
-- que no la tienen. Para tablas con company_id propia usa
-- COALESCE(NEW.company_id, current_company_id()) porque el auto-fill
-- (trg_set_company_id) corre despues por orden alfabetico. Para tablas de
-- items (sin company_id) resuelve own con current_company_id().
--
-- Contexto service_role (auth.uid() NULL): sale sin validar. Lo controlan
-- las policies RLS; los scripts pueden sembrar datos de varias empresas.
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
  -- Contexto de servicio (scripts, seed, service_role): sin usuario, sin
  -- validacion por empresa (RLS cubre el resto de caminos).
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  -- Empresa propia: de la columna si la tabla la tiene, si no del profile.
  IF TG_TABLE_NAME IN (
    'pets', 'pet_records', 'invoices', 'clinic_queue',
    'grooming_queue', 'payments'
  ) THEN
    v_own_company := COALESCE(NEW.company_id, public.current_company_id());
  ELSE
    -- inventory_movement_items, invoice_items, grooming_queue_items:
    -- NO tienen company_id propia.
    v_own_company := public.current_company_id();
  END IF;

  IF v_own_company IS NULL THEN
    -- Usuario autenticado sin empresa activa: el RLS ya bloqueara el INSERT.
    RETURN NEW;
  END IF;

  -- Validar el PADRE principal de cada tabla.
  IF TG_TABLE_NAME = 'pets' THEN
    SELECT company_id INTO v_parent_company FROM public.clients WHERE id = NEW.owner_id;

  ELSIF TG_TABLE_NAME = 'pet_records' THEN
    SELECT company_id INTO v_parent_company FROM public.pets WHERE id = NEW.pet_id;

  ELSIF TG_TABLE_NAME = 'invoices' THEN
    SELECT company_id INTO v_parent_company FROM public.clients WHERE id = NEW.client_id;

  ELSIF TG_TABLE_NAME = 'clinic_queue' THEN
    SELECT company_id INTO v_parent_company FROM public.pets WHERE id = NEW.pet_id;

  ELSIF TG_TABLE_NAME = 'grooming_queue' THEN
    SELECT company_id INTO v_parent_company FROM public.pets WHERE id = NEW.pet_id;

  ELSIF TG_TABLE_NAME = 'payments' THEN
    IF NEW.invoice_id IS NOT NULL THEN
      SELECT company_id INTO v_parent_company FROM public.invoices WHERE id = NEW.invoice_id;
    ELSE
      v_parent_company := v_own_company; -- movimiento de caja suelto: OK
    END IF;

  ELSIF TG_TABLE_NAME = 'inventory_movement_items' THEN
    SELECT m.company_id INTO v_parent_company
    FROM public.inventory_movements m WHERE m.id = NEW.movement_id;
    IF v_parent_company IS DISTINCT FROM v_own_company THEN
      RAISE EXCEPTION 'El recurso referenciado pertenece a otra empresa.';
    END IF;
    SELECT p.company_id INTO v_parent_company FROM public.products p WHERE p.id = NEW.product_id;

  ELSIF TG_TABLE_NAME = 'invoice_items' THEN
    SELECT company_id INTO v_parent_company FROM public.invoices WHERE id = NEW.invoice_id;
    IF v_parent_company IS DISTINCT FROM v_own_company THEN
      RAISE EXCEPTION 'El recurso referenciado pertenece a otra empresa.';
    END IF;
    IF NEW.product_id IS NOT NULL THEN
      SELECT p.company_id INTO v_parent_company FROM public.products p WHERE p.id = NEW.product_id;
    ELSE
      SELECT s.company_id INTO v_parent_company FROM public.services s WHERE s.id = NEW.service_id;
    END IF;

  ELSIF TG_TABLE_NAME = 'grooming_queue_items' THEN
    SELECT company_id INTO v_parent_company FROM public.grooming_queue g WHERE g.id = NEW.queue_id;
    IF v_parent_company IS DISTINCT FROM v_own_company THEN
      RAISE EXCEPTION 'El recurso referenciado pertenece a otra empresa.';
    END IF;
    IF NEW.product_id IS NOT NULL THEN
      SELECT p.company_id INTO v_parent_company FROM public.products p WHERE p.id = NEW.product_id;
    ELSE
      SELECT s.company_id INTO v_parent_company FROM public.services s WHERE s.id = NEW.service_id;
    END IF;
  END IF;

  IF v_parent_company IS DISTINCT FROM v_own_company THEN
    RAISE EXCEPTION 'El recurso referenciado pertenece a otra empresa.';
  END IF;

  RETURN NEW;
END;
$$;

-- Un solo trigger para INSERT y UPDATE: asi no se puede "reapuntar" una
-- fila existente a un padre de otra empresa (hueco de la version anterior,
-- que solo cubria INSERT) ni duplicar la logica en dos funciones.
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'pets',
    'pet_records',
    'invoices',
    'clinic_queue',
    'grooming_queue',
    'payments',
    'inventory_movement_items',
    'invoice_items',
    'grooming_queue_items'
  ]
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_assert_company ON public.%1$I;
       CREATE TRIGGER trg_assert_company
         BEFORE INSERT OR UPDATE ON public.%1$I
         FOR EACH ROW EXECUTE FUNCTION public.assert_same_company_parent();',
      t
    );
  END LOOP;
END
$$;

-- ----------------------------------------------------------------------------
-- 4. protect_immutable_cols: soft-delete no revivable + guardas
-- ----------------------------------------------------------------------------
-- Aplica SOLO a las 4 tablas con soft delete que la app edita.
--
-- CORRECTIVO (C-03): la logica es por tabla (TG_TABLE_NAME). Las columnas
-- de sistema ni siquiera llegan aqui para la mayoria de casos porque la
-- seccion 1 las revoco por privilegio; este trigger queda como 2a capa
-- (defense in depth) y para la regla de negocio del soft delete.
--
-- CORRECTIVO (C-07): la proteccion de stock ya NO vive aqui (era
-- incorrecta); vive en los REVOKE por columna de la seccion 1.
CREATE OR REPLACE FUNCTION public.protect_immutable_cols()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 4a. Revivir filas soft-deleted: solo admin (regla de negocio).
  IF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'No puedes restaurar un registro eliminado. Pide a un administrador.';
    END IF;
  END IF;

  -- 4b. Guardas extra por tabla (2a capa de la seccion 1).
  IF TG_TABLE_NAME = 'clients' THEN
    IF NEW.created_by IS DISTINCT FROM OLD.created_by
       OR NEW.created_at IS DISTINCT FROM OLD.created_at
       OR NEW.company_id IS DISTINCT FROM OLD.company_id
       OR NEW.id <> OLD.id THEN
      RAISE EXCEPTION 'Las columnas del sistema (id, empresa, fecha de creacion, autor) no son editables.';
    END IF;
  ELSE
    -- pets, products, services: SIN created_by (la columna no existe).
    IF NEW.created_at IS DISTINCT FROM OLD.created_at
       OR NEW.company_id IS DISTINCT FROM OLD.company_id
       OR NEW.id <> OLD.id THEN
      RAISE EXCEPTION 'Las columnas del sistema (id, empresa, fecha de creacion) no son editables.';
    END IF;
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
-- 5. prevent_privilege_escalation: nadie toca role / company_id / active
-- ----------------------------------------------------------------------------
-- CORRECTIVO (C-01): ahora TAMBIEN bloquea cambios de `active`. Antes un
-- usuario desactivado podia enviarse active = TRUE a si mismo y recuperar
-- acceso (la policy RLS de "propio perfil" lo permitia).
--
-- Bypass explicito para service_role (auth.uid() NULL): la Edge Function
-- admin-users desactiva/activa usuarios via service_role y DEBE poder
-- cambiar active. El control de quien es admin vive en la Edge Function.
CREATE OR REPLACE FUNCTION public.prevent_privilege_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Contexto de servicio: trusted (Edge Function, scripts). Sale sin validar.
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  IF NOT public.is_admin() THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Seguridad: solo un ADMIN puede cambiar roles.'
        USING ERRCODE = '42501';  -- insufficient_privilege
    END IF;

    IF NEW.company_id IS DISTINCT FROM OLD.company_id THEN
      RAISE EXCEPTION 'Seguridad: solo un ADMIN puede cambiar empresas.'
        USING ERRCODE = '42501';
    END IF;

    -- FIX C-01: tampoco el propio estado de cuenta.
    IF NEW.active IS DISTINCT FROM OLD.active THEN
      RAISE EXCEPTION 'Seguridad: solo un ADMIN puede activar o desactivar usuarios.'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_privilege_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_privilege_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_privilege_escalation();

COMMENT ON FUNCTION public.prevent_privilege_escalation() IS 'Bloquea cambios no autorizados de role, company_id o active en profiles (usuarios autenticados). service_role bypass.';

-- ----------------------------------------------------------------------------
-- 6. prevent_last_admin_demotion: anti-lockout
-- ----------------------------------------------------------------------------
-- Igual que la version anterior. Nota: este trigger corre DESPUES del de
-- escalada (orden alfabetico: demotion < escalation) y solo aplica a
-- usuarios autenticados-admin o service_role (escalada bloquea al resto).
CREATE OR REPLACE FUNCTION public.prevent_last_admin_demotion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_count INTEGER;
BEGIN
  -- Caso 1: estaba activo como ADMIN y se degrada o desactiva.
  IF OLD.role = 'ADMIN' AND OLD.active = TRUE
     AND (NEW.role != 'ADMIN' OR NEW.active = FALSE) THEN

    SELECT COUNT(*) INTO v_admin_count
    FROM public.profiles
    WHERE company_id = OLD.company_id
      AND role = 'ADMIN'
      AND active = TRUE
      AND id != OLD.id;

    IF v_admin_count = 0 THEN
      RAISE EXCEPTION 'No puedes degradar/desactivar al ultimo ADMIN de la empresa. Crea otro ADMIN primero.'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  -- Caso 2: traslado de un ADMIN a una empresa sin admins.
  IF OLD.role = 'ADMIN' AND NEW.company_id IS DISTINCT FROM OLD.company_id THEN
    SELECT COUNT(*) INTO v_admin_count
    FROM public.profiles
    WHERE company_id = NEW.company_id
      AND role = 'ADMIN'
      AND active = TRUE;

    IF v_admin_count = 0 THEN
      RAISE EXCEPTION 'La empresa destino no tiene ningun ADMIN activo. Crea uno antes de mover este usuario.'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_last_admin_demotion ON public.profiles;
CREATE TRIGGER trg_prevent_last_admin_demotion
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_last_admin_demotion();

COMMENT ON FUNCTION public.prevent_last_admin_demotion() IS 'Impide que la empresa quede sin admins (lockout).';

-- ----------------------------------------------------------------------------
-- 7. prevent_profile_deletion: DELETE -> soft-disable (trazabilidad)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_profile_deletion()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles SET active = FALSE WHERE id = OLD.id;
  RETURN NULL; -- NULL impide el DELETE
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_profile_deletion ON public.profiles;
CREATE TRIGGER trg_prevent_profile_deletion
  BEFORE DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_deletion();

COMMENT ON FUNCTION public.prevent_profile_deletion() IS 'Convierte DELETE en soft-delete (active = false). Preserva trazabilidad.';

-- ----------------------------------------------------------------------------
-- Verificacion final
-- ----------------------------------------------------------------------------
SELECT tablename, policyname, cmd FROM pg_policies
WHERE schemaname = 'public' ORDER BY tablename, cmd, policyname;

SELECT table_name, column_name, privilege_type
FROM information_schema.column_privileges
WHERE grantee IN ('anon', 'authenticated') AND column_name IN ('stock', 'created_by', 'company_id', 'id', 'created_at')
ORDER BY table_name, column_name;
