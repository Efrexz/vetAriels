-- ============================================================================
-- Policies RLS v2 — multi-tenant + roles
-- ============================================================================
-- PATRON:
--   1. Una policy de SELECT  permite ver filas de tu empresa (company_id).
--   2. Una policy de INSERT  permite crear filas de tu empresa.
--   3. Una policy de UPDATE  permite modificar filas de tu empresa.
--   4. Una policy de DELETE  permite eliminar filas de tu empresa.
--
-- ROLES (profiles.role):
--   ADMIN          → todo en su empresa.
--   VETERINARIO    → cola medica, mascotas, records, lectura de clientes.
--   RECEPCIONISTA  → clientes, mascotas, ventas, productos, lectura de todo.
--   GROOMER        → cola de grooming, lectura de mascotas/productos.
--
-- Todas las policies usan una funcion helper: public.current_role()
-- que lee profiles.role del usuario actual (SECURITY DEFINER para evitar
-- recursion con RLS de profiles).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Helper: rol del usuario actual
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

-- Helper: es admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'ADMIN')
$$;

-- ----------------------------------------------------------------------------
-- LIMPIEZA: eliminar policies previas (de la 1E y temporales)
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END
$$;

-- ============================================================================
-- PROFILES: cada usuario ve su propio profile. ADMIN ve todos los de su empresa.
-- Nadie puede ESCRIBIR su propio rol (eso lo hace solo el admin via Edge
-- Function en Paso 3). Solo puede actualizar first_name/last_name/phone.
-- ============================================================================

CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- NOTA (Paso 4.5 hardening): current_role(), is_admin() y
-- current_company_id() exigen profiles.active = TRUE: un usuario
-- desactivado pierde TODO acceso a datos aunque conserve JWT.
-- Las policies SELECT de clients/pets/products/services filtran
-- deleted_at IS NULL (la "papelera" ya no es legible por API).
-- Ver supabase/migrations/20260825100000_rls_hardening.sql.

CREATE POLICY "Admins can read all profiles in their company" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    public.is_admin() AND company_id = public.current_company_id()
  );

CREATE POLICY "Users can update own profile (non-sensitive fields)" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    -- El usuario NO puede cambiar su company_id ni su role.
    -- Eso se valida comparando OLD vs NEW en un trigger adicional (Paso 3).
  );

CREATE POLICY "Admins can insert profiles in their company" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin() AND company_id = public.current_company_id()
  );

CREATE POLICY "Admins can update profiles in their company" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.is_admin() AND company_id = public.current_company_id())
  WITH CHECK (public.is_admin() AND company_id = public.current_company_id());

-- ============================================================================
-- COMPANIES: lectura para usuarios autenticados de su propia empresa.
-- Solo lectura; la creacion/update la hace el admin del SaaS via service_role.
-- ============================================================================

CREATE POLICY "Users can read own company" ON public.companies
  FOR SELECT TO authenticated
  USING (id = public.current_company_id());

-- ============================================================================
-- COMPANY_COUNTERS: solo el sistema (triggers) los modifica.
-- Los usuarios autenticados pueden LEER los de su empresa (para UI).
-- ============================================================================

CREATE POLICY "Users can read counters in their company" ON public.company_counters
  FOR SELECT TO authenticated
  USING (company_id = public.current_company_id());

-- ============================================================================
-- CLIENTES: lectura para todos los autenticados de su empresa.
-- Escritura: admin, recepcionista, veterinario.
-- Borrado: solo admin (soft delete en realidad).
-- ============================================================================

CREATE POLICY "Authenticated users can read clients in their company"
  ON public.clients FOR SELECT TO authenticated
  USING (company_id = public.current_company_id());

CREATE POLICY "Admin/recep/vet can insert clients"
  ON public.clients FOR INSERT TO authenticated
  WITH CHECK (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA', 'VETERINARIO')
  );

CREATE POLICY "Admin/recep can update clients"
  ON public.clients FOR UPDATE TO authenticated
  USING (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA')
  )
  WITH CHECK (company_id = public.current_company_id());

CREATE POLICY "Only admin can delete clients"
  ON public.clients FOR DELETE TO authenticated
  USING (
    company_id = public.current_company_id() AND public.is_admin()
  );

-- ============================================================================
-- MASCOTAS: lectura para todos los autenticados.
-- Escritura: admin, recepcionista, veterinario.
-- ============================================================================

CREATE POLICY "Authenticated users can read pets in their company"
  ON public.pets FOR SELECT TO authenticated
  USING (company_id = public.current_company_id());

CREATE POLICY "Admin/recep/vet can insert pets"
  ON public.pets FOR INSERT TO authenticated
  WITH CHECK (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA', 'VETERINARIO')
  );

CREATE POLICY "Admin/recep/vet can update pets"
  ON public.pets FOR UPDATE TO authenticated
  USING (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA', 'VETERINARIO')
  )
  WITH CHECK (company_id = public.current_company_id());

CREATE POLICY "Only admin can delete pets"
  ON public.pets FOR DELETE TO authenticated
  USING (
    company_id = public.current_company_id() AND public.is_admin()
  );

-- ============================================================================
-- PET_RECORDS: lectura para todos los autenticados.
-- Escritura: admin y veterinario.
-- ============================================================================

CREATE POLICY "Authenticated users can read pet records"
  ON public.pet_records FOR SELECT TO authenticated
  USING (company_id = public.current_company_id());

CREATE POLICY "Admin/vet can insert pet records"
  ON public.pet_records FOR INSERT TO authenticated
  WITH CHECK (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'VETERINARIO')
  );

CREATE POLICY "Admin/vet can update pet records"
  ON public.pet_records FOR UPDATE TO authenticated
  USING (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'VETERINARIO')
  );

CREATE POLICY "Admin can delete pet records"
  ON public.pet_records FOR DELETE TO authenticated
  USING (
    company_id = public.current_company_id() AND public.is_admin()
  );

-- ============================================================================
-- PRODUCTOS: lectura para todos los autenticados.
-- Escritura: admin y recepcionista.
-- ============================================================================

CREATE POLICY "Authenticated users can read products"
  ON public.products FOR SELECT TO authenticated
  USING (company_id = public.current_company_id());

CREATE POLICY "Admin/recep can insert products"
  ON public.products FOR INSERT TO authenticated
  WITH CHECK (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA')
  );

CREATE POLICY "Admin/recep can update products"
  ON public.products FOR UPDATE TO authenticated
  USING (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA')
  );

CREATE POLICY "Only admin can delete products"
  ON public.products FOR DELETE TO authenticated
  USING (
    company_id = public.current_company_id() AND public.is_admin()
  );

-- ============================================================================
-- SERVICIOS: lectura para todos los autenticados.
-- Escritura: admin y recepcionista.
-- ============================================================================

CREATE POLICY "Authenticated users can read services"
  ON public.services FOR SELECT TO authenticated
  USING (company_id = public.current_company_id());

CREATE POLICY "Admin/recep can insert services"
  ON public.services FOR INSERT TO authenticated
  WITH CHECK (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA')
  );

CREATE POLICY "Admin/recep can update services"
  ON public.services FOR UPDATE TO authenticated
  USING (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA')
  );

CREATE POLICY "Only admin can delete services"
  ON public.services FOR DELETE TO authenticated
  USING (
    company_id = public.current_company_id() AND public.is_admin()
  );

-- ============================================================================
-- INVENTARIO (movimientos + items): lectura para todos los autenticados.
-- Escritura: admin y recepcionista.
-- ============================================================================

CREATE POLICY "Authenticated users can read inventory movements"
  ON public.inventory_movements FOR SELECT TO authenticated
  USING (company_id = public.current_company_id());

CREATE POLICY "Admin/recep can insert inventory movements"
  ON public.inventory_movements FOR INSERT TO authenticated
  WITH CHECK (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA')
  );

CREATE POLICY "Admin/recep can update inventory movements"
  ON public.inventory_movements FOR UPDATE TO authenticated
  USING (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA')
  );

CREATE POLICY "Only admin can delete inventory movements"
  ON public.inventory_movements FOR DELETE TO authenticated
  USING (
    company_id = public.current_company_id() AND public.is_admin()
  );

-- Items: heredan la policy via company_id en JOIN... pero RLS evalua fila
-- por fila sin joins. Solucion: replicar la logica leyendo movement.
-- En la practica, los items no se consultan solos: siempre via movement.
-- Para simplificar, hacemos una policy por rol que verifique company_id via subquery.
CREATE POLICY "Authenticated users can read inventory movement items"
  ON public.inventory_movement_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.inventory_movements m
      WHERE m.id = movement_id AND m.company_id = public.current_company_id()
    )
  );

CREATE POLICY "Admin/recep can insert inventory movement items"
  ON public.inventory_movement_items FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.inventory_movements m
      WHERE m.id = movement_id
        AND m.company_id = public.current_company_id()
        AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA')
    )
  );

CREATE POLICY "Admin/recep can update inventory movement items"
  ON public.inventory_movement_items FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.inventory_movements m
      WHERE m.id = movement_id
        AND m.company_id = public.current_company_id()
        AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA')
    )
  );

CREATE POLICY "Only admin can delete inventory movement items"
  ON public.inventory_movement_items FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.inventory_movements m
      WHERE m.id = movement_id
        AND m.company_id = public.current_company_id()
        AND public.is_admin()
    )
  );

-- ============================================================================
-- FACTURAS (comprobantes): lectura para todos los autenticados.
-- Escritura: admin y recepcionista. Veterinarios y groomers NO facturan.
-- ============================================================================

CREATE POLICY "Authenticated users can read invoices"
  ON public.invoices FOR SELECT TO authenticated
  USING (company_id = public.current_company_id());

CREATE POLICY "Admin/recep can insert invoices"
  ON public.invoices FOR INSERT TO authenticated
  WITH CHECK (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA')
  );

CREATE POLICY "Admin/recep can update invoices"
  ON public.invoices FOR UPDATE TO authenticated
  USING (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA')
  );

CREATE POLICY "Only admin can delete invoices"
  ON public.invoices FOR DELETE TO authenticated
  USING (
    company_id = public.current_company_id() AND public.is_admin()
  );

CREATE POLICY "Authenticated users can read invoice items"
  ON public.invoice_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices i
      WHERE i.id = invoice_id AND i.company_id = public.current_company_id()
    )
  );

CREATE POLICY "Admin/recep can insert invoice items"
  ON public.invoice_items FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invoices i
      WHERE i.id = invoice_id
        AND i.company_id = public.current_company_id()
        AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA')
    )
  );

CREATE POLICY "Admin/recep can update invoice items"
  ON public.invoice_items FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices i
      WHERE i.id = invoice_id
        AND i.company_id = public.current_company_id()
        AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA')
    )
  );

CREATE POLICY "Only admin can delete invoice items"
  ON public.invoice_items FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices i
      WHERE i.id = invoice_id
        AND i.company_id = public.current_company_id()
        AND public.is_admin()
    )
  );

-- ============================================================================
-- PAGOS: lectura para todos los autenticados.
-- Escritura: admin y recepcionista.
-- ============================================================================

CREATE POLICY "Authenticated users can read payments"
  ON public.payments FOR SELECT TO authenticated
  USING (company_id = public.current_company_id());

CREATE POLICY "Admin/recep can insert payments"
  ON public.payments FOR INSERT TO authenticated
  WITH CHECK (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA')
  );

CREATE POLICY "Admin/recep can update payments"
  ON public.payments FOR UPDATE TO authenticated
  USING (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA')
  );

CREATE POLICY "Only admin can delete payments"
  ON public.payments FOR DELETE TO authenticated
  USING (
    company_id = public.current_company_id() AND public.is_admin()
  );

-- ============================================================================
-- COLA CLINICA: lectura para todos los autenticados.
-- Escritura: admin, recepcionista y veterinario.
-- ============================================================================

CREATE POLICY "Authenticated users can read clinic queue"
  ON public.clinic_queue FOR SELECT TO authenticated
  USING (company_id = public.current_company_id());

CREATE POLICY "Admin/recep/vet can insert clinic queue"
  ON public.clinic_queue FOR INSERT TO authenticated
  WITH CHECK (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA', 'VETERINARIO')
  );

CREATE POLICY "Admin/recep/vet can update clinic queue"
  ON public.clinic_queue FOR UPDATE TO authenticated
  USING (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA', 'VETERINARIO')
  );

CREATE POLICY "Only admin can delete clinic queue"
  ON public.clinic_queue FOR DELETE TO authenticated
  USING (
    company_id = public.current_company_id() AND public.is_admin()
  );

-- ============================================================================
-- COLA GROOMING: lectura para todos los autenticados.
-- Escritura: admin, recepcionista y groomer.
-- ============================================================================

CREATE POLICY "Authenticated users can read grooming queue"
  ON public.grooming_queue FOR SELECT TO authenticated
  USING (company_id = public.current_company_id());

CREATE POLICY "Admin/recep/groomer can insert grooming queue"
  ON public.grooming_queue FOR INSERT TO authenticated
  WITH CHECK (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA', 'GROOMER')
  );

CREATE POLICY "Admin/recep/groomer can update grooming queue"
  ON public.grooming_queue FOR UPDATE TO authenticated
  USING (
    company_id = public.current_company_id()
    AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA', 'GROOMER')
  );

CREATE POLICY "Only admin can delete grooming queue"
  ON public.grooming_queue FOR DELETE TO authenticated
  USING (
    company_id = public.current_company_id() AND public.is_admin()
  );

CREATE POLICY "Authenticated users can read grooming items"
  ON public.grooming_queue_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.grooming_queue g
      WHERE g.id = queue_id AND g.company_id = public.current_company_id()
    )
  );

CREATE POLICY "Admin/recep/groomer can insert grooming items"
  ON public.grooming_queue_items FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.grooming_queue g
      WHERE g.id = queue_id
        AND g.company_id = public.current_company_id()
        AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA', 'GROOMER')
    )
  );

CREATE POLICY "Admin/recep/groomer can update grooming items"
  ON public.grooming_queue_items FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.grooming_queue g
      WHERE g.id = queue_id
        AND g.company_id = public.current_company_id()
        AND public.current_role() IN ('ADMIN', 'RECEPCIONISTA', 'GROOMER')
    )
  );

CREATE POLICY "Only admin can delete grooming items"
  ON public.grooming_queue_items FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.grooming_queue g
      WHERE g.id = queue_id
        AND g.company_id = public.current_company_id()
        AND public.is_admin()
    )
  );

-- ============================================================================
-- Verificacion final: listar policies creadas
-- ============================================================================
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd, policyname;