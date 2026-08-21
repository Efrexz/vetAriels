-- ============================================================================
-- Triggers de seguridad v2 — Paso 2
-- ============================================================================
-- Cierra las superficies de ataque que las policies de RLS no cubren.
-- Las policies dicen QUIEN puede hacer QUÉ. Los triggers dicen QUE
-- cambios de datos son válidos (reglas de negocio).
--
-- Tres disparadores:
--   1. prevent_privilege_escalation: nadie puede cambiar su propio rol
--      o company_id (solo un admin puede modificar profiles de otros).
--   2. prevent_last_admin_demotion: impide dejar una empresa sin admins
--      (anti-lockout si el único admin se desactiva a sí mismo).
--   3. prevent_profile_deletion: convierte DELETE en soft-disable
--      (active = false) para preservar trazabilidad.
--
-- Los policies de la 1E/2E son la primera capa. Estos triggers son la
-- segunda capa ("defense in depth"). Si una policy tiene un bug,
-- el trigger aún protege.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Trigger 1: prevent_privilege_escalation
-- ----------------------------------------------------------------------------
-- Caso de ataque: un usuario con sesión válida (cualquier rol) intenta
--   UPDATE profiles SET role = 'ADMIN', company_id = '...' WHERE id = own_id.
-- La policy RLS dice "puedes actualizar tu propio profile" (campos no
-- sensibles). Sin este trigger, la policy dejaría pasar el cambio.
-- Este trigger lo bloquea.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_privilege_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Si el actor NO es admin, no puede cambiar role ni company_id
  -- en ninguna fila (ni la suya ni la de otros).
  IF NOT public.is_admin() THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Seguridad: solo un ADMIN puede cambiar roles. Actor: %',
        auth.uid()
        USING ERRCODE = '42501';  -- insufficient_privilege
    END IF;

    IF NEW.company_id IS DISTINCT FROM OLD.company_id THEN
      RAISE EXCEPTION 'Seguridad: solo un ADMIN puede cambiar empresas. Actor: %',
        auth.uid()
        USING ERRCODE = '42501';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_privilege_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_privilege_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_privilege_escalation();

COMMENT ON FUNCTION public.prevent_privilege_escalation()
  IS 'Bloquea cambios no autorizados de role o company_id en profiles.';

-- ----------------------------------------------------------------------------
-- Trigger 2: prevent_last_admin_demotion
-- ----------------------------------------------------------------------------
-- Caso de riesgo: el único ADMIN de una empresa se desactiva/des degrada
--   a RECEPCIONISTA. Nadie más puede gestionar la empresa. Lockout total.
-- Este trigger lo impide contando admins activos restantes.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_last_admin_demotion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_count INTEGER;
BEGIN
  -- Caso 1: estaba activo y como ADMIN, ahora se desactiva
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

  -- Caso 2: cambio de empresa de un ADMIN a una donde no quedaría ninguno
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
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_last_admin_demotion();

COMMENT ON FUNCTION public.prevent_last_admin_demotion()
  IS 'Impide que la empresa quede sin admins (lockout).';

-- ----------------------------------------------------------------------------
-- Trigger 3: prevent_profile_deletion (soft delete obligatorio)
-- ----------------------------------------------------------------------------
-- Las policies de RLS ya bloquean DELETE en profiles (no hay policy
-- de DELETE). Pero como defense in depth, este trigger convierte cualquier
-- intento de DELETE en un soft delete (active = false).
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_profile_deletion()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- En vez de borrar, desactivar.
  UPDATE public.profiles SET active = FALSE WHERE id = OLD.id;
  -- Devolver NULL impide el DELETE.
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_profile_deletion ON public.profiles;
CREATE TRIGGER trg_prevent_profile_deletion
  BEFORE DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_profile_deletion();

COMMENT ON FUNCTION public.prevent_profile_deletion()
  IS 'Convierte DELETE en soft-delete (active = false). Preserva trazabilidad.';

-- ============================================================================
-- Verificacion: listar triggers activos en profiles
-- ============================================================================
SELECT trigger_name, event_manipulation, action_timing
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table = 'profiles'
ORDER BY trigger_name;