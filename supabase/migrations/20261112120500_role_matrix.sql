-- ============================================================================
-- Matriz de roles Fase 1 — restringir lecturas sensibles
-- ============================================================================
-- ANTES: cualquier usuario autenticado de la empresa leia TODO el tenant
-- (historial clinico, comprobantes, caja, inventario, cola clinica).
-- DESPUES: la lectura se acota al rol que la necesita:
--
--   pet_records (historial clinico): ADMIN / VETERINARIO
--   invoices + items (comprobantes): ADMIN / RECEPCIONISTA
--   payments (caja):                 ADMIN / RECEPCIONISTA
--   inventory_movements + items:     ADMIN / RECEPCIONISTA
--   clinic_queue (cola clinica):     ADMIN / RECEPCIONISTA / VETERINARIO
--
-- Se mantiene leyendo para todos: pets, clients (nombres en colas), products,
-- services, grooming_queue (el groomer opera su cola), companies, profiles
-- propios. Limitacion conocida (aceptada por ahora): el groomer sigue viendo
-- clientes/mascotas de la empresa (la UI de grooming muestra el dueno).
--
-- NOTA UI: el dashboard de VETERINARIO/GROOMER vera vacios los KPIs de
-- caja/ventas (su rol no puede leerlos). Ajuste de UI en Fase 3.
-- ============================================================================

-- Historial clinico: solo admin/vet ------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can read pet records"
  ON public.pet_records;
CREATE POLICY "Admin/vet can read pet records"
  ON public.pet_records FOR SELECT TO authenticated
  USING (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'VETERINARIO')
  );

-- Comprobantes: solo admin/recep ----------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can read invoices" ON public.invoices;
CREATE POLICY "Admin/recep can read invoices"
  ON public.invoices FOR SELECT TO authenticated
  USING (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA')
  );

DROP POLICY IF EXISTS "Authenticated users can read invoice items"
  ON public.invoice_items;
CREATE POLICY "Admin/recep can read invoice items"
  ON public.invoice_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices i
      WHERE i.id = invoice_id
        AND i.company_id = public.current_company_id()
        AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA')
    )
  );

-- Caja: solo admin/recep ------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can read payments" ON public.payments;
CREATE POLICY "Admin/recep can read payments"
  ON public.payments FOR SELECT TO authenticated
  USING (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA')
  );

-- Inventario: solo admin/recep ------------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can read inventory movements"
  ON public.inventory_movements;
CREATE POLICY "Admin/recep can read inventory movements"
  ON public.inventory_movements FOR SELECT TO authenticated
  USING (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA')
  );

DROP POLICY IF EXISTS "Authenticated users can read inventory movement items"
  ON public.inventory_movement_items;
CREATE POLICY "Admin/recep can read inventory movement items"
  ON public.inventory_movement_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.inventory_movements m
      WHERE m.id = movement_id
        AND m.company_id = public.current_company_id()
        AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA')
    )
  );

-- Cola clinica: admin/recep/vet (el groomer no la opera) ----------------------
DROP POLICY IF EXISTS "Authenticated users can read clinic queue"
  ON public.clinic_queue;
CREATE POLICY "Admin/recep/vet can read clinic queue"
  ON public.clinic_queue FOR SELECT TO authenticated
  USING (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA', 'VETERINARIO')
  );

-- Verificacion
SELECT tablename, policyname, cmd FROM pg_policies
WHERE schemaname='public' AND policyname ILIKE '%read%' AND tablename IN
  ('pet_records','invoices','invoice_items','payments','inventory_movements','inventory_movement_items','clinic_queue')
ORDER BY tablename;
