-- ============================================================================
-- Schema de VetAriel (Micro-fase 1A - SQLite local)
-- ============================================================================
-- Este archivo define las tablas `clients` y `pets` con su relación 1:N.
-- Cada cliente puede tener muchas mascotas; cada mascota pertenece a un único
-- cliente a través de la columna `ownerId` (foreign key).
-- ============================================================================

-- Habilitar FK (SQLite no las aplica por defecto)
PRAGMA foreign_keys = ON;

-- ----------------------------------------------------------------------------
-- Tabla: clients
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clients (
  id                 TEXT PRIMARY KEY,
  firstName          TEXT NOT NULL,
  lastName           TEXT NOT NULL,
  email              TEXT,
  phone1             TEXT NOT NULL,
  phone2             TEXT,
  address            TEXT NOT NULL,
  registrationDate   TEXT NOT NULL  -- ISO 8601: 'YYYY-MM-DD'
);

-- ----------------------------------------------------------------------------
-- Tabla: pets (relacionada con clients por ownerId)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pets (
  id           TEXT PRIMARY KEY,
  ownerId      TEXT NOT NULL,
  petName      TEXT NOT NULL,
  species      TEXT NOT NULL,
  breed        TEXT NOT NULL,
  birthDate    TEXT NOT NULL,  -- ISO 8601: 'YYYY-MM-DD'
  microchip    TEXT,

  -- Relación 1:N: una mascota pertenece a un cliente.
  -- Si el cliente se elimina, sus mascotas también (ON DELETE CASCADE).
  FOREIGN KEY (ownerId) REFERENCES clients(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- Índices: aceleran búsquedas por columnas usadas frecuentemente en WHERE
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_pets_ownerId ON pets(ownerId);
