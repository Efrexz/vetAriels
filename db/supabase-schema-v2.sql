-- ============================================================================
-- Schema v2 — VetAriel (multi-tenant, facturacion peruana, 4 roles)
-- ============================================================================
-- IMPORTANTE: ejecutar este archivo UNA SOLA VEZ en un proyecto Supabase
-- vacio o donde las tablas de esta lista aun no existan. Si las tablas ya
-- existen, este script fallara (es la intencion: evita ejecuciones duplicadas).
--
-- Estructura:
--   Grupo 1 - Identidad y empresa:           companies, profiles, company_counters
--   Grupo 2 - Clientes y pacientes:          clients, pets, pet_records
--   Grupo 3 - Inventario:                    products, services,
--                                             inventory_movements, inventory_movement_items
--   Grupo 4 - Facturacion peruana:           invoices, invoice_items, payments
--   Grupo 5 - Colas de atencion:             clinic_queue,
--                                             grooming_queue, grooming_queue_items
--
-- Convenciones del schema:
--   * Multi-tenant:        company_id en TODAS las tablas de negocio.
--   * Soft delete:         deleted_at TIMESTAMPTZ NULL (NULL = activo).
--   * Auditoria:           created_at, updated_at, created_by en casi todo.
--   * IDs:                 UUID autogenerado (gen_random_uuid()).
--   * Roles:               ENUM en profiles (no string libre).
--   * Documentos:          TEXT en todos (migrar a TEXT CITEXT si se necesita).
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- GRUPO 1 - Identidad y empresa
-- ----------------------------------------------------------------------------

-- Empresa/tenant. Hoy solo "Vet Ariel", pero el campo esta pensado para
-- multiples negocios (cada uno con sus propios clientes, productos, facturas).
CREATE TABLE public.companies (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  ruc         TEXT,
  address     TEXT,
  phone       TEXT,
  email       TEXT,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.companies             IS 'Tenants del producto. Una fila por negocio que usa el sistema.';
COMMENT ON COLUMN public.companies.name        IS 'Nombre comercial del negocio.';
COMMENT ON COLUMN public.companies.ruc         IS 'RUC del negocio (Peru).';

-- Perfil de usuario, 1:1 con auth.users (de Supabase Auth).
-- Esta es la fuente SEGURA del rol: el usuario no puede editar su propio rol
-- porque la policy WITH CHECK se lo niega. El user_metadata NO se usa para
-- permisos (corrige la vulnerabilidad de la 1E).
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id  UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
  role        TEXT NOT NULL CHECK (role IN ('ADMIN', 'VETERINARIO', 'RECEPCIONISTA', 'GROOMER')),
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL,
  phone       TEXT,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.profiles            IS 'Extension de auth.users con empresa y rol. Fuente unica de permisos.';
COMMENT ON COLUMN public.profiles.role       IS 'Rol del usuario: ADMIN, VETERINARIO, RECEPCIONISTA, GROOMER.';

CREATE INDEX idx_profiles_company ON public.profiles(company_id);

-- Contadores atomicos por empresa. Usados para generar correlativos sin
-- colisiones: HC de mascota, turno de grooming diario, correlativo de
-- comprobante por serie. Se actualizan via SELECT ... FOR UPDATE dentro de
-- una transaccion (definido en supabase-triggers-v2.sql).
CREATE TABLE public.company_counters (
  company_id     UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  counter_type   TEXT NOT NULL CHECK (counter_type IN ('PET_HC', 'GROOMING_TURN_DAILY', 'INVOICE_BOLETA', 'INVOICE_FACTURA')),
  counter_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  current_value  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (company_id, counter_type, counter_date)
);

COMMENT ON TABLE public.company_counters IS 'Contadores atomicos por empresa (HC, turno, correlativo factura).';

-- ----------------------------------------------------------------------------
-- GRUPO 2 - Clientes y pacientes
-- ----------------------------------------------------------------------------

CREATE TABLE public.clients (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id    UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  dni           TEXT,
  email         TEXT,
  phone1        TEXT NOT NULL,
  phone2        TEXT,
  address       TEXT NOT NULL,
  district      TEXT,
  reference     TEXT,
  observations  TEXT,
  created_by    UUID REFERENCES public.profiles(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);

COMMENT ON TABLE  public.clients          IS 'Clientes (duenos de mascotas) por empresa.';
COMMENT ON COLUMN public.clients.deleted_at IS 'Soft delete: NULL = activo; timestamp = eliminado logicamente.';

CREATE INDEX idx_clients_company       ON public.clients(company_id);
CREATE INDEX idx_clients_company_dni   ON public.clients(company_id, dni);
CREATE INDEX idx_clients_company_name  ON public.clients(company_id, last_name, first_name);
-- Solo clientes activos por defecto (queries con WHERE deleted_at IS NULL).

CREATE TABLE public.pets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
  owner_id     UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  hc           TEXT,  -- Asignado por trigger desde company_counters
  pet_name     TEXT NOT NULL,
  species      TEXT NOT NULL CHECK (species IN ('CANINO', 'FELINO')),
  breed        TEXT NOT NULL,
  sex          TEXT NOT NULL CHECK (sex IN ('MACHO', 'HEMBRA')),
  birth_date   DATE NOT NULL,
  microchip    TEXT,
  esterilized  TEXT NOT NULL DEFAULT 'NO' CHECK (esterilized IN ('SI', 'NO')),
  active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at   TIMESTAMPTZ
);

COMMENT ON TABLE  public.pets             IS 'Mascotas, pertenecen a un cliente de la misma empresa.';
COMMENT ON COLUMN public.pets.hc          IS 'Historia clinica: numero correlativo por empresa (asignado por trigger).';

CREATE INDEX idx_pets_company       ON public.pets(company_id);
CREATE INDEX idx_pets_company_owner ON public.pets(company_id, owner_id);
CREATE INDEX idx_pets_company_hc    ON public.pets(company_id, hc);
CREATE UNIQUE INDEX uq_pets_company_hc ON public.pets(company_id, hc) WHERE hc IS NOT NULL AND deleted_at IS NULL;

-- Historial clinico (consultas y notas). Antes vivia embebido en pets.records
-- (JSON). Ahora es tabla propia para poder buscar "todas las consultas del
-- Dr X esta semana" o "peso de Max en sus ultimas 5 visitas".
CREATE TABLE public.pet_records (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
  pet_id              UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  type                TEXT NOT NULL CHECK (type IN ('CONSULTA', 'NOTA')),
  reason              TEXT,
  anamnesis           TEXT,
  temperature         TEXT,
  heart_rate          TEXT,
  weight              TEXT,
  oxygen_saturation   TEXT,
  clinical_exam       TEXT,
  content             TEXT,
  created_by          UUID REFERENCES public.profiles(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.pet_records IS 'Historial clinico: consultas y notas por mascota.';

CREATE INDEX idx_pet_records_company_pet ON public.pet_records(company_id, pet_id, created_at DESC);

-- ----------------------------------------------------------------------------
-- GRUPO 3 - Inventario
-- ----------------------------------------------------------------------------

CREATE TABLE public.products (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
  system_code         TEXT NOT NULL,
  product_name        TEXT,
  brand               TEXT NOT NULL,
  barcode             TEXT,
  line                TEXT NOT NULL,
  category            TEXT NOT NULL,
  subcategory         TEXT,
  unit_of_measurement TEXT,
  presentation        TEXT,
  content             TEXT,
  provider            TEXT,
  min_stock           INTEGER NOT NULL DEFAULT 0,
  cost                NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (cost >= 0),
  sale_price          NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (sale_price >= 0),
  stock               INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),  -- Mantenido por trigger
  active              BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ
);

COMMENT ON COLUMN public.products.stock IS 'Stock actual. Se actualiza atomicamente via trigger al insertar movimientos.';

CREATE INDEX idx_products_company_code     ON public.products(company_id, system_code);
CREATE INDEX idx_products_company_category ON public.products(company_id, category);
CREATE INDEX idx_products_company_line     ON public.products(company_id, line);
CREATE UNIQUE INDEX uq_products_company_code ON public.products(company_id, system_code) WHERE deleted_at IS NULL;

CREATE TABLE public.services (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id        UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
  service_name      TEXT,
  line              TEXT NOT NULL,
  category          TEXT NOT NULL,
  cost              NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (cost >= 0),
  sale_price        NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (sale_price >= 0),
  available_for_sale BOOLEAN NOT NULL DEFAULT TRUE,
  active            BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE INDEX idx_services_company_category ON public.services(company_id, category);

-- Una sola tabla para CARGA y DESCARGA (eran dos tablas separadas en localStorage).
-- El signo de la operacion la define el campo 'type'. Asi el stock se calcula
-- con una sola regla: CARGA suma, DESCARGA resta.
CREATE TABLE public.inventory_movements (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id   UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
  type         TEXT NOT NULL CHECK (type IN ('CARGA', 'DESCARGA')),
  reason       TEXT NOT NULL,
  responsible  TEXT NOT NULL,
  store        TEXT,
  created_by   UUID REFERENCES public.profiles(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.inventory_movements IS 'Cabezal de operaciones de stock (cargas y descargas).';

CREATE INDEX idx_inv_mov_company_date ON public.inventory_movements(company_id, created_at DESC);

CREATE TABLE public.inventory_movement_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  movement_id  UUID NOT NULL REFERENCES public.inventory_movements(id) ON DELETE CASCADE,
  product_id   UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity     INTEGER NOT NULL CHECK (quantity > 0),
  unit_cost    NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (unit_cost >= 0)
);

COMMENT ON TABLE public.inventory_movement_items IS 'Items de cada operacion de stock. El trigger actualiza products.stock.';

CREATE INDEX idx_inv_items_movement ON public.inventory_movement_items(movement_id);
CREATE INDEX idx_inv_items_product  ON public.inventory_movement_items(product_id);

-- ----------------------------------------------------------------------------
-- GRUPO 4 - Facturacion peruana
-- ----------------------------------------------------------------------------

CREATE TABLE public.invoices (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
  client_id           UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  tipo_comprobante    TEXT NOT NULL CHECK (tipo_comprobante IN ('BOLETA', 'FACTURA')),
  serie               TEXT NOT NULL,
  correlativo         INTEGER NOT NULL CHECK (correlativo > 0),
  cliente_doc_tipo    TEXT NOT NULL CHECK (cliente_doc_tipo IN ('DNI', 'RUC')),
  cliente_doc_numero  TEXT NOT NULL,
  subtotal            NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  igv                 NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (igv >= 0),
  total               NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  estado              TEXT NOT NULL DEFAULT 'EMITIDA' CHECK (estado IN ('EMITIDA', 'ANULADA')),
  created_by           UUID REFERENCES public.profiles(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ
);

COMMENT ON TABLE  public.invoices                IS 'Comprobantes de pago (boletas/facturas) emitidos por empresa.';
COMMENT ON COLUMN public.invoices.serie          IS 'Serie del comprobante (ej. B001 boletas, F001 facturas).';
COMMENT ON COLUMN public.invoices.correlativo     IS 'Numero correlativo unico por (empresa, serie). Asignado por trigger.';
COMMENT ON COLUMN public.invoices.igv            IS 'IGV 18% (Peru).';

CREATE INDEX idx_invoices_company_date ON public.invoices(company_id, created_at DESC);
CREATE INDEX idx_invoices_company_client ON public.invoices(company_id, client_id);
-- Un mismo numero de comprobante no se puede repetir por empresa/serie.
CREATE UNIQUE INDEX uq_invoices_company_serie_corr
  ON public.invoices(company_id, serie, correlativo)
  WHERE deleted_at IS NULL;

CREATE TABLE public.invoice_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id    UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  item_type     TEXT NOT NULL CHECK (item_type IN ('PRODUCTO', 'SERVICIO')),
  product_id    UUID REFERENCES public.products(id) ON DELETE RESTRICT,
  service_id    UUID REFERENCES public.services(id) ON DELETE RESTRICT,
  description   TEXT NOT NULL,
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  unit_price    NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  subtotal      NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  CHECK (
    (item_type = 'PRODUCTO' AND product_id IS NOT NULL AND service_id IS NULL) OR
    (item_type = 'SERVICIO'  AND service_id IS NOT NULL AND product_id IS NULL)
  )
);

COMMENT ON TABLE public.invoice_items IS 'Items de cada comprobante. Debe ser producto o servicio, no ambos.';

CREATE INDEX idx_invoice_items_invoice ON public.invoice_items(invoice_id);

CREATE TABLE public.payments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id     UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
  invoice_id     UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  movement_type  TEXT NOT NULL CHECK (movement_type IN ('VENTA', 'INGRESO', 'EGRESO')),
  description    TEXT NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('EFECTIVO', 'VISA', 'YAPE', 'PLIN', 'TRANSFERENCIA', 'OTRO')),
  amount         NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  doc_ref        TEXT,
  created_by     UUID REFERENCES public.profiles(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.payments IS 'Cobros y pagos. Si esta ligado a una factura, doc_ref puede ser el numero del comprobante.';

CREATE INDEX idx_payments_company_date ON public.payments(company_id, created_at DESC);
CREATE INDEX idx_payments_company_invoice ON public.payments(company_id, invoice_id);

-- ----------------------------------------------------------------------------
-- GRUPO 5 - Colas de atencion
-- ----------------------------------------------------------------------------

CREATE TABLE public.clinic_queue (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id          UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
  pet_id              UUID NOT NULL REFERENCES public.pets(id) ON DELETE RESTRICT,
  assigned_doctor_id  UUID REFERENCES public.profiles(id),
  notes               TEXT NOT NULL DEFAULT '',
  date_of_attention   DATE NOT NULL DEFAULT CURRENT_DATE,
  state               TEXT NOT NULL DEFAULT 'PENDIENTE'
    CHECK (state IN ('PENDIENTE', 'EN_ATENCION', 'EN_ESPERA', 'ATENDIDO', 'SUSPENDIDO')),
  created_by          UUID REFERENCES public.profiles(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.clinic_queue IS 'Cola de atencion medica (clinica).';

CREATE INDEX idx_clinic_queue_company_state ON public.clinic_queue(company_id, state, created_at DESC);

CREATE TABLE public.grooming_queue (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id            UUID NOT NULL REFERENCES public.companies(id) ON DELETE RESTRICT,
  pet_id                UUID NOT NULL REFERENCES public.pets(id) ON DELETE RESTRICT,
  turn                  INTEGER NOT NULL CHECK (turn > 0),  -- Asignado por trigger, diario
  system_code           TEXT NOT NULL,
  notes                 TEXT NOT NULL DEFAULT '',
  health_observations   TEXT[] NOT NULL DEFAULT '{}',
  state                 TEXT NOT NULL DEFAULT 'PENDIENTE'
    CHECK (state IN ('PENDIENTE', 'EN_ATENCION', 'TERMINADO', 'ENTREGADO')),
  created_by            UUID REFERENCES public.profiles(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  public.grooming_queue         IS 'Cola de grooming. El historial se obtiene filtrando state = ENTREGADO.';
COMMENT ON COLUMN public.grooming_queue.turn    IS 'Turno diario por empresa (reinicia cada dia). Asignado por trigger.';

CREATE INDEX idx_grooming_queue_company_state ON public.grooming_queue(company_id, state, created_at DESC);
-- Turno unico por empresa por dia.
-- La unicidad del turno se garantiza en el trigger assign_grooming_turn
-- via FOR UPDATE sobre company_counters (lock pesimista atomico).
-- No usamos unique index porque DATE(timestamptz) es STABLE, no IMMUTABLE,
-- y Postgres rechaza expresiones no-inmutables en indices.

CREATE TABLE public.grooming_queue_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id      UUID NOT NULL REFERENCES public.grooming_queue(id) ON DELETE CASCADE,
  item_type     TEXT NOT NULL CHECK (item_type IN ('PRODUCTO', 'SERVICIO')),
  product_id    UUID REFERENCES public.products(id) ON DELETE RESTRICT,
  service_id    UUID REFERENCES public.services(id) ON DELETE RESTRICT,
  description   TEXT NOT NULL,
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  unit_price    NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  CHECK (
    (item_type = 'PRODUCTO' AND product_id IS NOT NULL AND service_id IS NULL) OR
    (item_type = 'SERVICIO'  AND service_id IS NOT NULL AND product_id IS NULL)
  )
);

CREATE INDEX idx_grooming_items_queue ON public.grooming_queue_items(queue_id);

-- ============================================================================
-- Activar RLS en TODAS las tablas (las policies estan en supabase-rls-v2.sql)
-- ============================================================================
ALTER TABLE public.companies                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_counters             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients                      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets                         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_records                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movement_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinic_queue                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grooming_queue               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grooming_queue_items         ENABLE ROW LEVEL SECURITY;