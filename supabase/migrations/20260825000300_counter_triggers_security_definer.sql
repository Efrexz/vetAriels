-- ============================================================================
-- Counter triggers ahora son SECURITY DEFINER
-- ============================================================================
-- ANTES: assign_pet_hc, assign_invoice_correlative y assign_grooming_turn
-- eran plpgsql sin SECURITY DEFINER. Cuando un usuario autenticado hace
-- INSERT en pets/invoices/grooming_queue, el trigger corre con los
-- privilegios del caller (role 'authenticated'). Dentro intenta escribir en
-- company_counters (otro trigger mas adelante o este mismo), pero
-- company_counters tiene RLS activado y SOLO tiene policy de SELECT.
-- Postgres deniega por defecto cualquier operacion sin policy, asi que
-- el INSERT falla con 'new row violates row-level security policy'.
--
-- Por que el seed funcionaba: se ejecuto desde SQL Editor con rol postgres
-- (superuser), que bypassa RLS.
--
-- Por que los clientes funcionaban desde la UI: clients no tiene trigger
-- de contador que escriba en company_counters.
--
-- Solucion: que los 3 counter triggers sean SECURITY DEFINER, igual que
-- handle_new_user y set_company_id_from_current. Asi corren con los
-- privilegios del dueno de la funcion (postgres, superuser) y pueden
-- escribir en company_counters sin chocar con la RLS.
--
-- Mantienen el uso de public.current_company_id() (introducido en la
-- migracion 20260825000200) para no depender de NEW.company_id.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.assign_pet_hc()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
SECURITY DEFINER
SET search_path = public
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
SECURITY DEFINER
SET search_path = public
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