-- ============================================================================
-- Soft delete como operacion de negocio (RPC) — esquema v3
-- ============================================================================
-- POR QUE EXISTE ESTE ARCHIVO (hallazgo de las pruebas de Fase 0):
--   En Postgres 17 (build de Supabase), un UPDATE cuya fila NUEVA deja de
--   satisfacer la policy de SELECT lanza "new row violates row-level
--   security policy". Como las policies SELECT de clients/pets/products/
--   services filtran deleted_at IS NULL (papelera invisible), el soft
--   delete por UPDATE es imposible: la fila borrada desapareceria del
--   SELECT y el UPDATE falla ANTES de aplicarse.
--   Verificado empiricamente: UPDATE clientes SET observations -> OK;
--   UPDATE SET deleted_at = now() -> ERROR (incluso con policy UPDATE
--   USING(true)/WITH CHECK(true) y triggers deshabilitados).
--
-- SOLUCION: el soft delete es una OPERACION DE NEGOCIO, no una edicion de
-- columna. Se implementa como RPC SECURITY DEFINER que hace bypass de RLS
-- y valida empresa/rol DENTRO de la funcion:
--
--   soft_delete(p_table, p_id)   -> deleted_at = now()
--   restore_deleted(p_table, p_id) -> deleted_at = NULL (solo ADMIN)
--
-- Whitelist de tablas: clients, pets, products, services (las 4 con
-- soft delete). Los roles permitidos replican las policies de UPDATE.
-- El frontend deja de enviar UPDATE deleted_at y llama a estas funciones.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.soft_delete(p_table TEXT, p_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company UUID;
  v_role    TEXT;
  v_count   INTEGER;
BEGIN
  -- Rol y empresa del llamador (desde profiles, como las policies).
  v_role    := public.current_role();
  v_company := public.current_company_id();

  IF v_role IS NULL OR v_company IS NULL THEN
    RAISE EXCEPTION 'No tienes permisos para eliminar registros (usuario inactivo o sin empresa).'
      USING ERRCODE = '42501';
  END IF;

  -- Whitelist + roles por tabla (espejo de las policies de UPDATE).
  IF p_table NOT IN ('clients', 'pets', 'products', 'services') THEN
    RAISE EXCEPTION 'Tabla no soportada para soft delete: %', p_table;
  END IF;

  IF NOT (
    (p_table IN ('clients', 'pets')
      AND v_role IN ('ADMIN', 'RECEPCIONISTA', 'VETERINARIO'))
    OR
    (p_table IN ('products', 'services')
      AND v_role IN ('ADMIN', 'RECEPCIONISTA'))
  ) THEN
    RAISE EXCEPTION 'Tu rol (%) no puede eliminar registros de %.', v_role, p_table
      USING ERRCODE = '42501';
  END IF;

  -- Soft delete dentro de la empresa del llamador. La comparacion de
  -- company_id garantiza que no se puedan borrar filas de otro tenant
  -- (el bypass de RLS lo exige: aqui ESTA la frontera).
  EXECUTE format(
    'UPDATE public.%I SET deleted_at = now()
     WHERE id = $1 AND company_id = $2 AND deleted_at IS NULL',
    p_table
  ) USING p_id, v_company;
  GET DIAGNOSTICS v_count = ROW_COUNT;

  RETURN v_count; -- 1 = borrado, 0 = no existe / ya borrado / otra empresa
END;
$$;

CREATE OR REPLACE FUNCTION public.restore_deleted(p_table TEXT, p_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Solo ADMIN revive registros (regla de negocio del soft delete).
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Solo un administrador puede restaurar registros eliminados.'
      USING ERRCODE = '42501';
  END IF;

  IF p_table NOT IN ('clients', 'pets', 'products', 'services') THEN
    RAISE EXCEPTION 'Tabla no soportada: %', p_table;
  END IF;

  EXECUTE format(
    'UPDATE public.%I SET deleted_at = NULL
     WHERE id = $1 AND company_id = $2 AND deleted_at IS NOT NULL',
    p_table
  ) USING p_id, public.current_company_id();
  GET DIAGNOSTICS v_count = ROW_COUNT;

  RETURN v_count;
END;
$$;

COMMENT ON FUNCTION public.soft_delete(TEXT, UUID) IS 'Soft delete multi-tenant (deleted_at = now()). Valida empresa y rol dentro de la funcion. Bypass de RLS por SECURITY DEFINER.';
COMMENT ON FUNCTION public.restore_deleted(TEXT, UUID) IS 'Restaura un soft delete (deleted_at = NULL). Solo ADMIN.';
