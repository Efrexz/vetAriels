-- ===============================================================
-- ARCHIVO LEGADO (NO EJECUTAR). Movido a db/legacy/ por la auditoria
-- del Paso 4.5: crea policies que abren clientes/mascotas a usuarios
-- anonimos (TO anon USING true). Se conserva solo como referencia
-- historica de la micro-fase 1C. Nunca correr en la DB.
-- ===============================================================

-- ============================================================================
-- Políticas RLS TEMPORALES para desarrollo (Micro-fase 1C)
-- ============================================================================
-- ⚠️ ESTAS POLÍTICAS SON DE PRUEBA. Permiten lectura/escritura a cualquier
-- usuario anónimo. NO usar en producción.
-- En la micro-fase 1E las reemplazaremos por policies reales con Supabase Auth.
-- ============================================================================

-- Eliminar policies previas si existen (para re-ejecución segura)
DROP POLICY IF EXISTS "Temp: allow all clients" ON public.clients;
DROP POLICY IF EXISTS "Temp: allow all pets" ON public.pets;

-- Policy abierta para clients
CREATE POLICY "Temp: allow all clients" ON public.clients
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Policy abierta para pets
CREATE POLICY "Temp: allow all pets" ON public.pets
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);