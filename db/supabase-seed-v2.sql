-- ============================================================================
-- Seed + inicializacion v2 — Empresa "VetAriel" y datos demo
-- ============================================================================
-- CUIDADO: este archivo inserta datos. NO es solo estructura.
-- Ejecutar DESPUES de schema-v2, triggers-v2 y rls-v2.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Empresa "VetAriel". Solo se inserta si no existe (idempotente).
-- Si ya existe otra empresa con el mismo nombre, no se duplica.
-- ----------------------------------------------------------------------------
INSERT INTO public.companies (id, name, ruc, address, phone, email)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'VetAriel',
  '20608438719',
  'Av. de la Constitucion 100, Lima',
  '+51917104426',
  'vetariel@gmail.com'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- NOTA SOBRE EL USUARIO DEMO
-- ============================================================================
-- El usuario demo (zyzz_448@hotmail.com) se debe crear MANUALMENTE en el
-- dashboard de Supabase (Authentication > Users > Add user) ANTES de ejecutar
-- el seed de usuarios aqui abajo. Esto es porque:
--   - auth.users es una tabla del sistema, no podemos hacer INSERT directo.
--   - El admin debe asignar el company_id y role via app_metadata al crear.
--
-- Pasos:
--   1. Authentication > Users > Add user
--      Email: zyzz_448@hotmail.com
--      Password: 123123
--      Auto Confirm User: SI
--   2. Despues de creado, abrirlo y en "App Metadata" poner:
--      {"company_id": "00000000-0000-0000-0000-000000000001", "role": "ADMIN",
--       "first_name": "efrain", "last_name": "quintero"}
--   3. El trigger handle_new_user creara el profile automaticamente.
--
-- Si ya creaste el usuario SIN metadata, ejecuta este UPDATE (reemplaza
-- YOUR_USER_UUID por el UUID real del usuario en auth.users):
--
-- UPDATE auth.users
-- SET raw_app_meta_data = jsonb_build_object(
--   'company_id', '00000000-0000-0000-0000-000000000001',
--   'role', 'ADMIN',
--   'first_name', 'efrain',
--   'last_name', 'quintero'
-- )
-- WHERE id = 'YOUR_USER_UUID';
--
-- Despues ejecuta el INSERT manual del profile:
--
-- INSERT INTO public.profiles (id, company_id, role, first_name, last_name)
-- SELECT id, '00000000-0000-0000-0000-000000000001', 'ADMIN', 'efrain', 'quintero'
-- FROM auth.users WHERE email = 'zyzz_448@hotmail.com'
-- ON CONFLICT (id) DO NOTHING;
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Datos demo: 4 clientes + 5 mascotas de VetAriel.
-- Replican los del schema v1 para que la app no rompa al migrar.
-- ----------------------------------------------------------------------------

INSERT INTO public.clients (id, company_id, first_name, last_name, email, phone1, address, district, reference) VALUES
  ('11111111-1111-1111-1111-111111111111',
   '00000000-0000-0000-0000-000000000001',
   'Juan',   'Perez Garcia',  'juan.perez@gmail.com',    '+51987654321', 'Av. La Marina 123, Lima',       'Lima',     'Cerca del parque'),
  ('22222222-2222-2222-2222-222222222222',
   '00000000-0000-0000-0000-000000000001',
   'Maria',  'Lopez Diaz',    'maria.lopez@hotmail.com', '+51976543210', 'Jr. Los Pinos 456, Miraflores', 'Miraflores', 'Frente al colegio'),
  ('33333333-3333-3333-3333-333333333333',
   '00000000-0000-0000-0000-000000000001',
   'Carlos', 'Ramirez Soto',  NULL,                      '+51965432109', 'Calle Las Flores 789, San Isidro','San Isidro', NULL),
  ('44444444-4444-4444-4444-444444444444',
   '00000000-0000-0000-0000-000000000001',
   'Ana',    'Torres Vega',   'ana.torres@gmail.com',    '+51954321098', 'Av. Pardo y Aliaga 234, San Isidro','San Isidro', NULL)
ON CONFLICT (id) DO NOTHING;

-- Las mascotas se insertan SIN hc (lo asigna el trigger automaticamente).
INSERT INTO public.pets (id, company_id, owner_id, pet_name, species, breed, sex, birth_date, microchip) VALUES
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '00000000-0000-0000-0000-000000000001',
   '11111111-1111-1111-1111-111111111111',
   'Max',   'CANINO', 'Labrador Retriever', 'MACHO', '2020-05-10', '982000123456789'),
  ('aaaa2222-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '00000000-0000-0000-0000-000000000001',
   '11111111-1111-1111-1111-111111111111',
   'Luna',  'FELINO', 'Siames',            'HEMBRA','2021-08-22', NULL),
  ('aaaa3333-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '00000000-0000-0000-0000-000000000001',
   '22222222-2222-2222-2222-222222222222',
   'Rocky', 'CANINO', 'Bulldog Frances',   'MACHO', '2019-11-03', '982000987654321'),
  ('aaaa4444-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '00000000-0000-0000-0000-000000000001',
   '33333333-3333-3333-3333-333333333333',
   'Mishi', 'FELINO', 'Persa',             'HEMBRA','2022-01-15', '982000456789123'),
  ('aaaa5555-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '00000000-0000-0000-0000-000000000001',
   '44444444-4444-4444-4444-444444444444',
   'Toby',  'CANINO', 'Golden Retriever',  'MACHO', '2018-07-30', NULL)
ON CONFLICT (id) DO NOTHING;

-- Verificacion: el trigger deberia haber asignado HC automaticamente.
SELECT pet_name, hc FROM public.pets ORDER BY hc;