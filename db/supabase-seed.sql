-- ============================================================================
-- Datos de ejemplo para Supabase (Postgres)
-- ============================================================================
-- IMPORTANTE: en Supabase los UUIDs se generan automáticamente con
-- gen_random_uuid(). Para datos de ejemplo los escribimos manualmente.
-- ============================================================================

INSERT INTO public.clients (id, first_name, last_name, email, phone1, phone2, address, registration_date) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Juan',   'Pérez García',  'juan.perez@gmail.com',    '+51987654321', NULL,         'Av. La Marina 123, Lima',       NOW() - INTERVAL '120 days'),
  ('22222222-2222-2222-2222-222222222222', 'María',  'López Díaz',    'maria.lopez@hotmail.com', '+51976543210', '+5112345678', 'Jr. Los Pinos 456, Miraflores', NOW() - INTERVAL '85 days'),
  ('33333333-3333-3333-3333-333333333333', 'Carlos', 'Ramírez Soto',  NULL,                       '+51965432109', NULL,         'Calle Las Flores 789, San Isidro', NOW() - INTERVAL '60 days'),
  ('44444444-4444-4444-4444-444444444444', 'Ana',    'Torres Vega',   'ana.torres@gmail.com',     '+51954321098', NULL,         'Av. Pardo y Aliaga 234, San Isidro', NOW() - INTERVAL '35 days');

INSERT INTO public.pets (id, owner_id, pet_name, species, breed, birth_date, microchip) VALUES
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Max',    'Perro', 'Labrador Retriever', '2020-05-10', '982000123456789'),
  ('aaaa2222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Luna',   'Gato',  'Siamés',             '2021-08-22', NULL),
  ('aaaa3333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Rocky',  'Perro', 'Bulldog Francés',    '2019-11-03', '982000987654321'),
  ('aaaa4444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'Mishi',  'Gato',  'Persa',              '2022-01-15', '982000456789123'),
  ('aaaa5555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'Toby',   'Perro', 'Golden Retriever',   '2018-07-30', NULL);