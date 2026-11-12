-- ============================================================================
-- Fixtures de prueba RLS/seguridad — VetAriel (esquema v3)
-- ============================================================================
-- Uso: psql -U postgres -d postgres -f supabase/tests/fixtures.sql
-- Crea 2 empresas + 4 usuarios de Auth con perfiles + datos minimos para
-- probar aislamiento, roles, soft-delete, stock y correlativos.
-- Re-ejecutable: usa ids fijos y ON CONFLICT DO NOTHING.
--
-- Los perfiles se crean SOLOS via el trigger handle_new_user (probamos
-- tambien que el trigger funciona con app_metadata).
-- ============================================================================

-- Empresas A y B -------------------------------------------------------------
INSERT INTO public.companies (id, name, ruc) VALUES
  ('00000000-0000-0000-0000-00000000000a', 'Empresa A (test)', '11111111111'),
  ('00000000-0000-0000-0000-00000000000b', 'Empresa B (test)', '22222222222')
ON CONFLICT (id) DO NOTHING;

-- Usuarios de Auth (handle_new_user crea el profile via app_metadata) --------
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password,
                        email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
                        created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000000',
   '10000000-0000-0000-0000-00000000000a', 'authenticated', 'authenticated',
   'admin.a@test.local', crypt('test1234', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"],"company_id":"00000000-0000-0000-0000-00000000000a","role":"ADMIN","first_name":"Admin","last_name":"De A"}',
   '{"phone":"999000001"}', now(), now()),

  ('00000000-0000-0000-0000-000000000000',
   '20000000-0000-0000-0000-00000000000a', 'authenticated', 'authenticated',
   'recep.a@test.local', crypt('test1234', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"],"company_id":"00000000-0000-0000-0000-00000000000a","role":"RECEPCIONISTA","first_name":"Recep","last_name":"De A"}',
   '{"phone":"999000002"}', now(), now()),

  ('00000000-0000-0000-0000-000000000000',
   '30000000-0000-0000-0000-00000000000a', 'authenticated', 'authenticated',
   'inactivo.a@test.local', crypt('test1234', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"],"company_id":"00000000-0000-0000-0000-00000000000a","role":"RECEPCIONISTA","first_name":"Inactivo","last_name":"De A"}',
   '{"phone":"999000003"}', now(), now()),

  ('00000000-0000-0000-0000-000000000000',
   '40000000-0000-0000-0000-00000000000b', 'authenticated', 'authenticated',
   'admin.b@test.local', crypt('test1234', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"],"company_id":"00000000-0000-0000-0000-00000000000b","role":"ADMIN","first_name":"Admin","last_name":"De B"}',
   '{"phone":"999000004"}', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Desactivar al usuario 3 (simula "admin lo desactivo"). Como postgres
-- (equivale a service_role): el trigger de escalada hace bypass.
UPDATE public.profiles SET active = FALSE
WHERE id = '30000000-0000-0000-0000-00000000000a';

-- Datos de negocio en empresa A ----------------------------------------------
INSERT INTO public.clients (id, company_id, first_name, last_name, phone1, address)
VALUES ('a0000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-00000000000a', 'Cliente', 'De A', '999111222', 'Calle A 123')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.pets (id, company_id, owner_id, pet_name, species, breed, sex, birth_date)
VALUES ('a0000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-00000000000a',
        'a0000000-0000-0000-0000-000000000001', 'Max', 'CANINO', 'Labrador', 'MACHO', '2020-01-01')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, company_id, system_code, product_name, brand, line, category, cost, sale_price)
VALUES ('a0000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-00000000000a', 'P001', 'Producto A', 'Marca', 'PET SHOP', 'ACCESORIOS', 5.00, 10.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.services (id, company_id, service_name, line, category, cost, sale_price)
VALUES ('a0000000-0000-0000-0000-000000000004',
        '00000000-0000-0000-0000-00000000000a', 'Baño', 'PET SHOP', 'GROOMING', 5.00, 20.00)
ON CONFLICT (id) DO NOTHING;

-- Stock inicial: carga de 10 via movimiento (como lo haria la app).
INSERT INTO public.inventory_movements (id, company_id, type, reason, responsible)
VALUES ('a0000000-0000-0000-0000-000000000005',
        '00000000-0000-0000-0000-00000000000a', 'CARGA', 'Stock inicial (fixture)', 'Fixture')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.inventory_movement_items (movement_id, product_id, quantity, unit_cost)
SELECT 'a0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003', 10, 5.00
WHERE NOT EXISTS (
  SELECT 1 FROM public.inventory_movement_items
  WHERE movement_id = 'a0000000-0000-0000-0000-000000000005'
);

-- Cliente en empresa B (para pruebas cross-tenant)
INSERT INTO public.clients (id, company_id, first_name, last_name, phone1, address)
VALUES ('b0000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-00000000000b', 'Cliente', 'De B', '999333444', 'Calle B 123')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Resumen
-- ============================================================================
SELECT 'perfiles' AS fixture, count(*) AS filas FROM public.profiles
UNION ALL
SELECT 'clientes', count(*) FROM public.clients
UNION ALL
SELECT 'mascotas', count(*) FROM public.pets
UNION ALL
SELECT 'stock producto A', stock FROM public.products WHERE id = 'a0000000-0000-0000-0000-000000000003';
