-- ============================================================================
-- Paso 6 (colas) — ajustes de policies para el flujo de colas
-- ============================================================================
-- Para que recepcionistas/groomers puedan operar la cola (cancelar un
-- paciente, editar la orden de grooming, que ahora se hace borrando y
-- re-insertando los items), estas policies de DELETE se abren al rol
-- correspondiente DENTRO de la propia empresa. Se conserva el guard de
-- company_id (USING company = current_company_id()).
--
-- Cambios respecto a las policies anteriores (que dejaban DELETE solo
-- para admin):
--   clinic_queue        DELETE -> ADMIN / RECEPCIONISTA / VETERINARIO
--   grooming_queue      DELETE -> ADMIN / RECEPCIONISTA / GROOMER
--   grooming_queue_items DELETE -> ADMIN / RECEPCIONISTA / GROOMER
--   (La cancelacion "de negocio" en grooming equivale a quitar la fila;
--    el item ya no existe, no queda historico falso de entidades.)
-- ============================================================================

DROP POLICY IF EXISTS "Only admin can delete clinic queue" ON public.clinic_queue;
CREATE POLICY "Admin/recep/vet can delete clinic queue"
  ON public.clinic_queue FOR DELETE TO authenticated
  USING (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA', 'VETERINARIO')
  );

DROP POLICY IF EXISTS "Only admin can delete grooming queue" ON public.grooming_queue;
CREATE POLICY "Admin/recep/groomer can delete grooming queue"
  ON public.grooming_queue FOR DELETE TO authenticated
  USING (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA', 'GROOMER')
  );

DROP POLICY IF EXISTS "Only admin can delete grooming items" ON public.grooming_queue_items;
CREATE POLICY "Admin/recep/groomer can delete grooming items"
  ON public.grooming_queue_items FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.grooming_queue g
      WHERE g.id = queue_id
        AND g.company_id = public.current_company_id()
        AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA', 'GROOMER')
    )
  );

-- NOTA: db/supabase-rls-v2.sql sigue mostrando las policies antiguas de
-- DELETE individual para estas tablas; al re-ejecutarse la fuente de
-- verdad, estas policies finales prevalecen por ser posteriores y por el
-- DROP IF EXISTS en cada CREATE. Registrar el cambio en el changelog.