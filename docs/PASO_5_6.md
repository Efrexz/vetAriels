# Pasos 5 y 6 — Ventas/caja y colas en Supabase

Resumen técnico de los pasos 5 y 6 (implementados en un solo push junto con
el cierre del Paso 4 y el hardening de seguridad (Paso 4.5).

## Paso 5 — Ventas y caja

**Antes**: `CreateInvoice` mostraba "Comprobante generado" sin guardar nada;
el carrito vivia en `location.state` (se perdia con F5); `paymentsData` era
localStorage con seed 2024 ficticio; `BalanceReport` era todo fake.

**Modelo nuevo**:

- `invoices` + `invoice_items` + `payments` (movement_type `VENTA` ligado
  por `invoice_id` y `doc_ref` con el numero del comprobante).
- `invoicesService.createInvoice`:
  1. Insert del cabezal -> el trigger `assign_invoice_correlative` asigna el
     correlativo ATOMICO por empresa/tipo (usuario-safety: dos
     recepcionistas al mismo tiempo no pisan el numero).
  2. Insert batch de items.
  3. Insert de los pagos de caja (metodo VISA/YAPE/...).
  4. Descarga de stock de los productos vendidos via
     `createMovement('DESCARGA', reason: 'Venta <docRef>')`. Si el trigger
     rechaza por stock insuficiente, la venta aun se emite (igual a el
     producto/servicio vendible) y el admin corrige inventario con el
     ajuste manual. Los SERVICIOS no descargan stock.
- IGV: los precios de la UI YA llevan IGV 18%. Al guardar:
  `subtotal = total/1.18`, `igv = total - subtotal`.
- Serie: `B001` (boleta) / `F001` (factura). `RECIBO` se emite como `BOLETA`.

**Carrito**: `sessionStorage` por cliente (`vetArielCart:<clientId>`):
sobrevive a la navegacion entre Sales y CreateInvoice, al refetch de
React Query y al F5. Se limpa al emitir el comprobante.

**Caja** (`FinancialContext`):
- `paymentsData` ya viene de la DB (React Query).
- El extorno NO borra (fuero contable): crea el movimiento CONTRARIO con
  la misma descripcion, al modo de un journal. La policy DELETE de
  `payments` sigue siendo admin-only.

**Dashboard**: "ventas de hoy" y "clientes nuevos hoy" ahora real
(el parser de fechas era el bug: ISO se parseaba en UTC, no local).

## Paso 6 — Colas

**Antes**: `petsInQueueMedical`/`petsInQueueGrooming`/`...History` eran
arrays de localStorage: recepcion agrega paciente en PC 1, el veterinario
en PC 2 no lo ve. El turno de grooming se calcula localmente (dos PCs
duplican el turno). El historial era un registro principal distinto.

**Modelo nuevo**:

- `clinic_queue` (estados `PENDIENTE / EN_ATENCION / EN_ESPERA / ATENDIDO / SUSPENDIDO`) y `grooming_queue` (`PENDIENTE / EN_ATENCION / TERMINADO /
  ENTREGADO`).
- El turno diario de grooming lo asigna el trigger atomíco
  `assign_grooming_turn` (con `SELECT ... FOR UPDATE`).
- **El historial NO es un array separado**: son las mismas filas con
  state `TERMINADO`/`ENTREGADO`. "Terminar" = UPDATE state; "regresar a la cola" = UPDATE a `PENDIENTE`.
- `petData` en la cola NO es un snapshot: es un JOIN a `pets` (si alguien
  renombra la mascota, la cola la muestra correctamente al refrescar).
- Los items de servicios de grooming viven en `grooming_queue_items`
  (guardados junto a la orden), no en la cache del item.
- **Polling 30s** (React Query `refetchInterval`) en las colas: en
  recepcion y box ven los cambios entro 30 segundos sin nada cliente
  tecnico. Future (`Paso 10+`): puede migrarse a `supabase realtime`.

**Policies nuevas** (`20260825120000_queue_delete_policies.sql`):
DELETE abierta para (admin, recepcion, y groomer en grooming) dentro
de SU empresa — antes era solo admin, imposible cancelar un paciente
recibido. Guard de company via RLS, como siempre.

## Migraciones SQL a aplicar (en orden)

1. `supabase/migrations/20260825000000_fix_pet_hc_counter.sql` (ya aplicada).
2. `supabase/migrations/20260825000100_auto_fill_company_id.sql` (ya).
3. `supabase/migrations/20260825000200_counter_triggers_use_current_company_id.sql` (ya).
4. `supabase/migrations/20260825000300_counter_triggers_security_definer.sql` (ya).
5. **`supabase/migrations/20260825100000_rls_hardening.sql`** (nueva - paso 4.5).
6. **`supabase/migrations/20260825120000_queue_delete_policies.sql`** (nueva - paso 6).
