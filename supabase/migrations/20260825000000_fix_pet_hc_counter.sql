-- ============================================================================
-- Fix: assign_pet_hc usaba counter_date = CURRENT_DATE
-- ============================================================================
-- El trigger original creaba una fila nueva del contador cada dia empezando
-- en 0. Al dia siguiente generaba HCs repetidos (000001, 000002, ...) que
-- chocaban con el indice UNIQUE:
--
--   CREATE UNIQUE INDEX uq_pets_company_hc
--     ON public.pets (company_id, hc) WHERE hc IS NOT NULL AND deleted_at IS NULL;
--
-- Resultado: el INSERT de cualquier mascota al dia siguiente de la primera
-- fallaba con "duplicate key value violates unique constraint".
--
-- PET_HC debe ser monotónico por empresa (la historia clinica no se reinicia
-- cada dia). GROOMING_TURN_DAILY sí debe seguir siendo diario (su nombre lo
-- dice) — esa parte no se toca.
--
-- Para evitar tocar la PK de company_counters (company_id, counter_type,
-- counter_date), usamos una fecha fija '1970-01-01' para PET_HC. Asi hay
-- una sola fila por empresa para ese contador.
--
-- Esta migración tambien consolida filas PET_HC existentes (de seed o de
-- datos de prueba) en la fila de fecha fija, tomando el max current_value.
-- ============================================================================

-- 1. Consolidar filas PET_HC existentes hacia la fila de fecha fija.
--    (Si no hay filas previas, no hace nada.)
DO $$
DECLARE
  v_max INTEGER;
  v_company_id UUID;
BEGIN
  -- Para cada empresa que tenga filas PET_HC de cualquier fecha distinta a
  -- la fija, calculamos el max current_value y lo movemos a la fila fija.
  FOR v_company_id IN (
    SELECT DISTINCT company_id
    FROM public.company_counters
    WHERE counter_type = 'PET_HC'
      AND counter_date <> DATE '1970-01-01'
  ) LOOP
    SELECT COALESCE(MAX(current_value), 0) INTO v_max
    FROM public.company_counters
    WHERE company_id = v_company_id
      AND counter_type = 'PET_HC'
      AND counter_date <> DATE '1970-01-01';

    INSERT INTO public.company_counters (company_id, counter_type, counter_date, current_value)
    VALUES (v_company_id, 'PET_HC', DATE '1970-01-01', v_max)
    ON CONFLICT (company_id, counter_type, counter_date)
    DO UPDATE SET current_value = GREATEST(company_counters.current_value, EXCLUDED.current_value);
  END LOOP;

  -- Borrar las filas diarias de PET_HC (ya consolidadas en la fila fija).
  DELETE FROM public.company_counters
  WHERE counter_type = 'PET_HC'
    AND counter_date <> DATE '1970-01-01';
END
$$;

-- 2. Reemplazar la función assign_pet_hc con la versión correcta.
CREATE OR REPLACE FUNCTION public.assign_pet_hc()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_next_value INTEGER;
BEGIN
  -- Asegurar que existe la fila del contador en la fila (company, PET_HC, 1970-01-01).
  INSERT INTO public.company_counters (company_id, counter_type, counter_date, current_value)
  VALUES (NEW.company_id, 'PET_HC', DATE '1970-01-01', 0)
  ON CONFLICT (company_id, counter_type, counter_date) DO NOTHING;

  -- Tomar lock sobre la fila del contador y leer el siguiente valor.
  SELECT current_value + 1 INTO v_next_value
  FROM public.company_counters
  WHERE company_id   = NEW.company_id
    AND counter_type = 'PET_HC'
    AND counter_date = DATE '1970-01-01'
  FOR UPDATE;

  UPDATE public.company_counters
  SET current_value = current_value + 1
  WHERE company_id   = NEW.company_id
    AND counter_type = 'PET_HC'
    AND counter_date = DATE '1970-01-01';

  NEW.hc := LPAD(v_next_value::TEXT, 6, '0');
  RETURN NEW;
END;
$$;

-- (El trigger trg_pet_hc en public.pets se conserva: apunta a la función
-- actualizada y su semantica sigue siendo BEFORE INSERT FOR EACH ROW.)