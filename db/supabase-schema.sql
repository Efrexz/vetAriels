-- ============================================================================
-- Schema de VetAriel para Supabase (PostgreSQL)
-- ============================================================================
-- Adaptación del schema SQLite para PostgreSQL. Las diferencias principales:
--   1. Tipos: usamos UUID en vez de TEXT para IDs (más seguro).
--   2. Fechas: usamos TIMESTAMPTZ (timestamp con zona horaria).
--   3. Email: agregamos UNIQUE para evitar duplicados.
--   4. Campos opcionales: usamos NULL (igual que SQLite).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Extensiones necesarias
-- ----------------------------------------------------------------------------
-- gen_random_uuid() viene de pgcrypto (Supabase lo tiene preinstalado).
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- Tabla: clients
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clients (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name         TEXT NOT NULL,
  last_name          TEXT NOT NULL,
  email              TEXT UNIQUE,                    -- UNIQUE: no se repite
  phone1             TEXT NOT NULL,
  phone2             TEXT,
  address            TEXT NOT NULL,
  registration_date  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.clients IS 'Dueños de mascotas registrados en la veterinaria';

-- ----------------------------------------------------------------------------
-- Tabla: pets
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id     UUID NOT NULL,
  pet_name     TEXT NOT NULL,
  species      TEXT NOT NULL,
  breed        TEXT NOT NULL,
  birth_date   DATE NOT NULL,                       -- DATE sin hora
  microchip    TEXT,

  CONSTRAINT fk_pets_owner
    FOREIGN KEY (owner_id)
    REFERENCES public.clients(id)
    ON DELETE CASCADE
);

COMMENT ON TABLE public.pets IS 'Mascotas registradas, pertenecen a un cliente';

-- ----------------------------------------------------------------------------
-- Índices (aceleran búsquedas por columnas usadas en WHERE)
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_last_name ON public.clients(last_name);
CREATE INDEX IF NOT EXISTS idx_pets_owner_id ON public.pets(owner_id);

-- ============================================================================
-- NOTA sobre Row Level Security (RLS)
-- ============================================================================
-- Por ahora las tablas están SIN políticas RLS — eso lo activamos en la 1E.
-- Sin RLS, solo el service_role puede leer/escribir (no la app desde React).
-- Ver micro-fase 1E para habilitar acceso desde la app autenticada.
-- ============================================================================