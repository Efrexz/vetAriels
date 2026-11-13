-- ============================================================================
-- Venta transaccional (RPC) — Fase 2
-- ============================================================================
-- Reemplaza el flujo de 4 peticiones separadas del frontend (auditoria C-06):
--   cabecera -> items -> pagos -> descarga de stock
-- por UNA llamada a esta funcion. PostgREST ejecuta cada RPC en su propia
-- transaccion: si algo falla, TODO se revierte (no quedan comprobantes
-- huerfanos, ni cobros sin comprobante, ni stock sin descontar).
--
-- Decisiones de diseno (auditadas):
--   * El TOTAL se calcula en el SERVIDOR desde quantity x unit_price de cada
--     item. El cliente NO puede alterar subtotal/igv/total enviando numeros.
--   * Stock insuficiente = venta RECHAZADA completa (antes: venta exitosa
--     con stock sin descontar y error solo en consola). Las ventas de solo
--     servicios no tocan stock y pasan.
--   * created_by, company_id y correlativo los asignan triggers/funciones
--     ya existentes (auditoria C-19).
--   * Pendiente (anotado): idempotencia por clave de request (proteccion
--     contra reintentos de red que dupliquen la venta).
--
-- Seguridad: SECURITY DEFINER para atomicidad; valida internamente que el
-- llamador sea ADMIN/RECEPCIONISTA de la empresa del cliente. Un groomer o
-- veterinario recibira 42501 con mensaje en espanol.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.create_invoice(
  p_client_id       UUID,
  p_tipo_comprobante TEXT,
  p_doc_tipo        TEXT,
  p_doc_numero      TEXT,
  p_items           JSONB,
  p_payments        JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company    UUID;
  v_role       TEXT;
  v_client_ok  UUID;
  v_item       JSONB;
  v_total      NUMERIC(10,2) := 0;
  v_subtotal   NUMERIC(10,2);
  v_igv        NUMERIC(10,2);
  v_invoice_id UUID;
  v_serie      TEXT;
  v_corr       INTEGER;
  v_doc_ref    TEXT;
  v_product_id UUID;
  v_stock_mov  UUID;
BEGIN
  -- 1. Rol y empresa del llamador (igual que las policies).
  v_role    := public.current_role();
  v_company := public.current_company_id();

  IF v_role IS NULL OR v_company IS NULL THEN
    RAISE EXCEPTION 'Sesion no valida para emitir comprobantes.'
      USING ERRCODE = '42501';
  END IF;
  IF v_role NOT IN ('ADMIN', 'RECEPCIONISTA') THEN
    RAISE EXCEPTION 'Tu rol (%) no puede emitir comprobantes.', v_role
      USING ERRCODE = '42501';
  END IF;

  -- 2. Validar el cliente: debe existir y ser de la empresa del llamador.
  SELECT company_id INTO v_client_ok
  FROM public.clients
  WHERE id = p_client_id AND deleted_at IS NULL;

  IF v_client_ok IS NULL THEN
    RAISE EXCEPTION 'El cliente no existe o esta eliminado.';
  END IF;
  IF v_client_ok <> v_company THEN
    RAISE EXCEPTION 'El cliente pertenece a otra empresa.'
      USING ERRCODE = '42501';
  END IF;
  IF p_tipo_comprobante NOT IN ('BOLETA', 'FACTURA') THEN
    RAISE EXCEPTION 'Tipo de comprobante invalido: %', p_tipo_comprobante;
  END IF;
  IF p_doc_tipo NOT IN ('DNI', 'RUC') THEN
    RAISE EXCEPTION 'Tipo de documento invalido: %', p_doc_tipo;
  END IF;

  -- 3. Validar items y calcular el TOTAL en el servidor.
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'El comprobante necesita al menos un item.';
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    IF COALESCE((v_item->>'quantity')::numeric, 0) <= 0
       OR COALESCE((v_item->>'unit_price')::numeric, 0) <= 0 THEN
      RAISE EXCEPTION 'Cada item necesita cantidad y precio mayores a 0.';
    END IF;
    v_total := v_total + (v_item->>'quantity')::numeric
                        * (v_item->>'unit_price')::numeric;
  END LOOP;

  v_subtotal := round(v_total / 1.18, 2);
  v_igv      := v_total - v_subtotal;
  v_serie    := CASE WHEN p_tipo_comprobante = 'FACTURA' THEN 'F001' ELSE 'B001' END;

  -- 4. Cabecera (el trigger asigna el correlativo atomico).
  INSERT INTO public.invoices (
    company_id, client_id, tipo_comprobante, serie,
    cliente_doc_tipo, cliente_doc_numero,
    subtotal, igv, total, estado
  ) VALUES (
    v_company, p_client_id, p_tipo_comprobante, v_serie,
    p_doc_tipo, COALESCE(NULLIF(p_doc_numero, ''), '00000000'),
    v_subtotal, v_igv, v_total, 'EMITIDA'
  )
  RETURNING id, correlativo INTO v_invoice_id, v_corr;

  v_doc_ref := v_serie || '-' || lpad(v_corr::text, 7, '0');

  -- 5. Items (subtotal por item calculado en servidor).
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    INSERT INTO public.invoice_items (
      invoice_id, item_type, product_id, service_id,
      description, quantity, unit_price, subtotal
    ) VALUES (
      v_invoice_id,
      v_item->>'item_type',
      (v_item->>'product_id')::uuid,
      (v_item->>'service_id')::uuid,
      v_item->>'description',
      (v_item->>'quantity')::integer,
      (v_item->>'unit_price')::numeric,
      round((v_item->>'quantity')::numeric * (v_item->>'unit_price')::numeric, 2)
    );

    -- Recolectar el product_id para la descarga de stock (paso 7).
    IF v_item->>'item_type' = 'PRODUCTO' THEN
      v_product_id := COALESCE(v_product_id, (v_item->>'product_id')::uuid);
    END IF;
  END LOOP;

  -- 6. Pagos: cada metodo es un movement VENTA de caja.
  IF p_payments IS NOT NULL THEN
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_payments) LOOP
      IF COALESCE((v_item->>'amount')::numeric, 0) <= 0 THEN
        CONTINUE; -- pago vacio del formulario: se ignora
      END IF;
      INSERT INTO public.payments (
        company_id, invoice_id, movement_type, description,
        payment_method, amount, doc_ref
      ) VALUES (
        v_company, v_invoice_id, 'VENTA',
        COALESCE(NULLIF(v_item->>'description', ''), 'Cobro ' || v_doc_ref),
        v_item->>'payment_method',
        (v_item->>'amount')::numeric,
        v_doc_ref
      );
    END LOOP;
  END IF;

  -- 7. Descarga de stock: UN movimiento DESCARGA con los productos vendidos.
  --    Si el stock es insuficiente, el trigger de inventario lanza error y
  --    TODA la venta se revierte (cabecera, items y pagos incluidos).
  IF EXISTS (
    SELECT 1 FROM jsonb_array_elements(p_items) it
    WHERE it->>'item_type' = 'PRODUCTO'
      AND COALESCE((it->>'quantity')::numeric, 0) > 0
  ) THEN
    INSERT INTO public.inventory_movements (company_id, type, reason, responsible)
    VALUES (v_company, 'DESCARGA', 'Venta ' || v_doc_ref, 'Sistema')
    RETURNING id INTO v_stock_mov;

    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
      IF v_item->>'item_type' = 'PRODUCTO' THEN
        INSERT INTO public.inventory_movement_items (
          movement_id, product_id, quantity, unit_cost
        ) VALUES (
          v_stock_mov,
          (v_item->>'product_id')::uuid,
          (v_item->>'quantity')::integer,
          0
        );
      END IF;
    END LOOP;
  END IF;

  RETURN jsonb_build_object(
    'id', v_invoice_id,
    'serie', v_serie,
    'correlativo', v_corr,
    'comprobante', v_doc_ref,
    'total', v_total
  );
END;
$$;

COMMENT ON FUNCTION public.create_invoice(UUID, TEXT, TEXT, TEXT, JSONB, JSONB)
  IS 'Venta atomica: comprobante+items+pagos+stock en una transaccion. Total calculado en servidor. Stock insuficiente rechaza toda la venta.';
