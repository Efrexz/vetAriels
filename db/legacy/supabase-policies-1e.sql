-- ===============================================================
-- ARCHIVO LEGADO (NO EJECUTAR). Reemplazado por db/supabase-rls-v2.sql.
-- Leia el rol desde user_metadata (editable por el usuario: escalacion
-- de privilegios). Se conserva como referencia historica de la 1E.
-- ===============================================================

-- ============================================================================
-- Políticas RLS reales para VetAriel (Micro-fase 1E)
-- ============================================================================
-- ⚠️ EJECUTAR ESTE ARCHIVO REEMPLAZA las policies temporales de la 1C.
-- Las nuevas policies usan Supabase Auth (auth.uid(), auth.jwt()) para
-- controlar el acceso fila por fila.
--
-- Convenciones:
--   - SELECT/DELETE: políticas con USING (true) para usuarios autenticados.
--   - INSERT/UPDATE: políticas que verifican user_metadata.rol.
--   - Por defecto, denegamos (las policies solo permiten lo explícito).
-- ============================================================================

-- Eliminar policies temporales previas
DROP POLICY IF EXISTS "Temp: allow all clients" ON public.clients;
DROP POLICY IF EXISTS "Temp: allow all pets" ON public.pets;

-- ============================================================================
-- POLICIES PARA `clients`
-- ============================================================================

-- Cualquier usuario autenticado puede LEER clientes
CREATE POLICY "Authenticated users can read clients" ON public.clients
  FOR SELECT
  TO authenticated
  USING (true);

-- Solo Administradores pueden CREAR clientes
CREATE POLICY "Only admins can insert clients" ON public.clients
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'rol') = 'Administrador'
  );

-- Solo Administradores pueden ACTUALIZAR clientes
CREATE POLICY "Only admins can update clients" ON public.clients
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'rol') = 'Administrador'
  )
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'rol') = 'Administrador'
  );

-- Solo Administradores pueden BORRAR clientes
CREATE POLICY "Only admins can delete clients" ON public.clients
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'rol') = 'Administrador'
  );

-- ============================================================================
-- POLICIES PARA `pets`
-- ============================================================================
-- Misma lógica que clients: lectura abierta para autenticados,
-- escritura restringida a Administradores.
-- En fases siguientes afinaremos para que un Recepcionista también pueda
-- crear mascotas.
-- ============================================================================

CREATE POLICY "Authenticated users can read pets" ON public.pets
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert pets" ON public.pets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'rol') = 'Administrador'
  );

CREATE POLICY "Only admins can update pets" ON public.pets
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'rol') = 'Administrador'
  )
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'rol') = 'Administrador'
  );

CREATE POLICY "Only admins can delete pets" ON public.pets
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'rol') = 'Administrador'
  );

-- ============================================================================
-- Verificación final: listar policies activas
-- ============================================================================
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd, policyname;