-- ============================================================================
-- Counter triggers usan current_company_id() directamente
-- ============================================================================
-- ANTES: assign_pet_hc, assign_invoice_correlative y assign_grooming_turn
-- leian NEW.company_id para resolver el contador de la empresa.
--
-- Funcionaba cuando el INSERT pasaba company_id explicitamente (seed con
-- company_id hard-coded), pero rompia con el patron del frontend de NO
-- enviar company_id (dato interno de multi-tenant que no debe exponerse).
--
-- Postgres ejecuta multiples BEFORE INSERTs en orden alfabetico. Tras anadir
-- trg_set_company_id ('S'), el orden en pets pasa a ser:
--   trg_pet_hc      ('P') -> corre PRIMERO con company_id = NULL
--   trg_set_company_id ('S') -> corre DESPUES y rellena company_id
-- Resultado: assign_pet_hc intenta INSERT INTO company_counters con
-- company_id = NULL y falla antes de que el auto-fill trigger pueda actuar.
--
-- En clientes/pets existentes con company_id pasado manualmente (seed),
-- funcionaba. En inserciones desde el frontend fallaba.
--
-- Solucion: que los 3 counter triggers resuelvan company_id con
-- public.current_company_id() directamente. Asi son independientes del
-- orden de BEFORE triggers y del payload. La funcion corre SECURITY DEFINER
-- asi que la lectura de profiles no choca con la RLS de profiles.
--
-- Esta migracion solo actualiza las 3 funciones (CREATE OR REPLACE), no
-- toca los triggers (los nombres ya son correctos: trg_pet_hc,
-- trg_invoice_correlative, trg_grooming_turn).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.assign_pet_hc()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_next_value INTEGER;
  v_company_id UUID := public.current_company_id();
BEGIN
  INSERT INTO public.company_counters (company_id, counter_type, counter_date, current_value)
  VALUES (v_company_id, 'PET_HC', DATE '1970-01-01', 0)
  ON CONFLICT (company_id, counter_type, counter_date) DO NOTHING;

  SELECT current_value + 1 INTO v_next_value
  FROM public.company_counters
  WHERE company_id   = v_company_id
    AND counter_type = 'PET_HC'
    AND counter_date = DATE '1970-01-01'
  FOR UPDATE;

  UPDATE public.company_counters
  SET current_value = current_value + 1
  WHERE company_id   = v_company_id
    AND counter_type = 'PET_HC'
    AND counter_date = DATE '1970-01-01';

  NEW.hc := LPAD(v_next_value::TEXT, 6, '0');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.assign_invoice_correlative()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_counter_type TEXT;
  v_next_value  INTEGER;
  v_company_id  UUID := public.current_company_id();
BEGIN
  v_counter_type := CASE
    WHEN NEW.tipo_comprobante = 'BOLETA'  THEN 'INVOICE_BOLETA'
    WHEN NEW.tipo_comprobante = 'FACTURA' THEN 'INVOICE_FACTURA'
  END;

  INSERT INTO public.company_counters (company_id, counter_type, counter_date, current_value)
  VALUES (v_company_id, v_counter_type, CURRENT_DATE, 0)
  ON CONFLICT (company_id, counter_type, counter_date) DO NOTHING;

  SELECT current_value + 1 INTO v_next_value
  FROM public.company_counters
  WHERE company_id   = v_company_id
    AND counter_type = v_counter_type
    AND counter_date = CURRENT_DATE
  FOR UPDATE;

  UPDATE public.company_counters
  SET current_value = current_value + 1
  WHERE company_id   = v_company_id
    AND counter_type = v_counter_type
    AND counter_date = CURRENT_DATE;

  NEW.correlativo := v_next_value;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.assign_grooming_turn()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_next_value INTEGER;
  v_company_id UUID := public.current_company_id();
BEGIN
  INSERT INTO public.company_counters (company_id, counter_type, counter_date, current_value)
  VALUES (v_company_id, 'GROOMING_TURN_DAILY', CURRENT_DATE, 0)
  ON CONFLICT (company_id, counter_type, counter_date) DO NOTHING;

  SELECT current_value + 1 INTO v_next_value
  FROM public.company_counters
  WHERE company_id   = v_company_id
    AND counter_type = 'GROOMING_TURN_DAILY'
    AND counter_date = CURRENT_DATE
  FOR UPDATE;

  UPDATE public.company_counters
  SET current_value = current_value + 1
  WHERE company_id   = v_company_id
    AND counter_type = 'GROOMING_TURN_DAILY'
    AND counter_date = CURRENT_DATE;

  NEW.turn := v_next_value;
  RETURN NEW;
END;
$$;