-- ============================================================================
-- Datos de ejemplo (seed) para VetAriel
-- ============================================================================

INSERT INTO clients (id, firstName, lastName, email, phone1, phone2, address, registrationDate) VALUES
  ('c-001', 'Juan',    'Pérez García',  'juan.perez@gmail.com',    '+51987654321', NULL,         'Av. La Marina 123, Lima',     '2024-01-15'),
  ('c-002', 'María',   'López Díaz',    'maria.lopez@hotmail.com', '+51976543210', '+5112345678', 'Jr. Los Pinos 456, Miraflores', '2024-02-20'),
  ('c-003', 'Carlos',  'Ramírez Soto',  NULL,                       '+51965432109', NULL,         'Calle Las Flores 789, San Isidro','2024-03-10'),
  ('c-004', 'Ana',     'Torres Vega',   'ana.torres@gmail.com',     '+51954321098', NULL,         'Av. Pardo y Aliaga 234, San Isidro','2024-04-05');

INSERT INTO pets (id, ownerId, petName, species, breed, birthDate, microchip) VALUES
  ('p-001', 'c-001', 'Max',     'Perro',  'Labrador Retriever', '2020-05-10', '982000123456789'),
  ('p-002', 'c-001', 'Luna',    'Gato',   'Siamés',             '2021-08-22', NULL),
  ('p-003', 'c-002', 'Rocky',   'Perro',  'Bulldog Francés',    '2019-11-03', '982000987654321'),
  ('p-004', 'c-003', 'Mishi',   'Gato',   'Persa',              '2022-01-15', '982000456789123'),
  ('p-005', 'c-004', 'Toby',    'Perro',  'Golden Retriever',   '2018-07-30', NULL);
