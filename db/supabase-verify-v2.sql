-- ============================================================================
-- Verificaciones v2 — ejecutar despues de seed-v2 para validar todo
-- ============================================================================
-- Estas queries confirman que schema, triggers y policies funcionan.

-- ----------------------------------------------------------------------------
-- 1. Empresa creada
-- ----------------------------------------------------------------------------
SELECT id, name, ruc FROM public.companies;

-- ----------------------------------------------------------------------------
-- 2. HC asignados por trigger (deberian ser 000001 a 000005)
-- ----------------------------------------------------------------------------
SELECT pet_name, hc FROM public.pets ORDER BY hc;

-- ----------------------------------------------------------------------------
-- 3. updated_at funciona (UPDATE un cliente y ver que cambia)
-- ----------------------------------------------------------------------------
-- ANTES:
SELECT first_name, updated_at FROM public.clients
  WHERE id = '11111111-1111-1111-1111-111111111111';

-- Ejecutar manualmente un UPDATE para ver el cambio:
-- UPDATE public.clients SET address = 'Av. La Marina 456, Lima'
--   WHERE id = '11111111-1111-1111-1111-111111111111';
-- Volver a consultar updated_at y ver que cambio.

-- ----------------------------------------------------------------------------
-- 4. Test del trigger de stock: insertar una carga y ver el stock cambiar
-- ----------------------------------------------------------------------------
-- ANTES: stock del producto = 0
-- 4a. Crear un producto
INSERT INTO public.products (company_id, system_code, brand, line, category, cost, sale_price)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'TEST-001', 'MarcaTest', 'Alimentos', 'Perros',
  10.00, 25.00
)
RETURNING id, system_code, stock;

-- 4b. Crear una carga de +5 unidades
INSERT INTO public.inventory_movements (company_id, type, reason, responsible)
VALUES (
  '00000000-0000-0000-0000-000000000001', 'CARGA',
  'Compra inicial de prueba', 'admin'
)
RETURNING id;

-- (Copia el id del movimiento de arriba y pegalo abajo donde dice <movement_id>)
-- 4c. Insertar item de la carga
-- INSERT INTO public.inventory_movement_items (movement_id, product_id, quantity, unit_cost)
-- VALUES ('<movement_id>', '<product_id>', 5, 10.00);

-- 4d. Verificar que el stock cambio (debe ser 5)
-- SELECT system_code, stock FROM public.products WHERE system_code = 'TEST-001';

-- 4e. Intentar una descarga mayor al stock (debe fallar)
-- INSERT INTO public.inventory_movements (company_id, type, reason, responsible)
-- VALUES (
--   '00000000-0000-0000-0000-000000000001', 'DESCARGA',
--   'Test de validacion', 'admin'
-- ) RETURNING id;
-- INSERT INTO public.inventory_movement_items (movement_id, product_id, quantity)
-- VALUES ('<id>', '<product_id>', 100);  -- ERROR: stock insuficiente

-- ----------------------------------------------------------------------------
-- 5. Test del trigger de correlativo de factura
-- ----------------------------------------------------------------------------
-- Solo se ejecuta con un usuario autenticado. Insertar 2 boletas y ver
-- que el correlativo es 1, luego 2.
--
-- INSERT INTO public.invoices (company_id, client_id, tipo_comprobante, serie,
--   cliente_doc_tipo, cliente_doc_numero, subtotal, igv, total)
-- VALUES
--   ('00000000-0000-0000-0000-000000000001',
--    '11111111-1111-1111-1111-111111111111',
--    'BOLETA', 'B001', 'DNI', '12345678', 100.00, 18.00, 118.00);
-- SELECT tipo_comprobante, serie, correlativo FROM public.invoices ORDER BY correlativo;

-- ----------------------------------------------------------------------------
-- 6. Ver policies activas
-- ----------------------------------------------------------------------------
SELECT tablename, COUNT(*) AS total_policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- ============================================================================
-- FIN de verificaciones. Si todo lo anterior funciona, el Paso 1 esta OK.
-- ============================================================================