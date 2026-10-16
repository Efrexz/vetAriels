# Smoke test — Verificación del camino feliz (10 min)

> **Qué es.** Pasada rápida y manual por cada flujo del sistema para confirmar que
> "no sale humo" tras migrar TODA la data de negocio a Supabase (pasos 4→7). No es
> una prueba exhaustiva: verifica que lo que DEBE funcionar, funciona.
>
> **Diferencia con el Paso 8 (penetración).** El smoke test pregunta
> *"¿funciona lo que debe funcionar?"*. El Paso 8 pregunta *"¿falla lo que debe
> fallar?* (RLS bloqueando roles). Este doc va primero: si un trigger falla,
> se arregla antes de probar seguridad encima.

---

## Preconditions

1. `npm run dev` con `.env` correcto (`VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`).
2. Credenciales de login:
   - **Admin**: `zyzz_448@hotmail.com` / `123123`
   - Recepcionista (opcional, para doble PC): `recepcion@vetariel.com` / `123123`
3. Supabase Dashboard abierto en el SQL Editor para los checks opcionales (marcados con 🔍).

## Datos de prueba

Empezamos creando un cliente y una mascota nuevos y luego reutilizamos/eliminamos
lo que exista. Sugerencia: cliente **"Smoke Test"** (DNI `70000000`) con mascota
**"Firulais"** para que sea fácil filtrarlo/limpiarlo después.

---

## PASO 1 — Login (2 checks)

| # | Acción | Resultado esperado |
|---|---|---|
| 1.1 | Login con admin `zyzz_448@hotmail.com` | Entra al Dashboard. No hay error. |
| 1.2 | Logout → login con `recepcion@vetariel.com` | Entra igual. Si falla, anota el mensaje. |

## PASO 2 — Clientes

| # | Acción | Resultado esperado |
|---|---|---|
| 2.1 | Clientes → crear "Smoke Test" (DNI 70000000, un telefono y email ficticios) | Toast de éxito + navegación al perfil del cliente con **id real** (la URL contiene el UUID de la DB). |
| 2.2 | Editar el cliente (cambiarle el telefono) y guardar | El cambio se refleja tras refrescar/volver a la lista. |
| 2.3 | En la lista, buscar "Smoke Test" | Aparece 1 sola vez (idempotencia: si ya existia de una corrida anterior, no se duplico). |

## PASO 3 — Mascota + historia clínica

| # | Acción | Resultado esperado |
|---|---|---|
| 3.1 | Clientes → Smoke Test → agregar mascota "Firulais" (CANINO, raza CRUCE, MACHO, esterilizado NO) | El campo "N° de historia" muestra el preview del HC → toast `Mascota "Firulais" creada con HC 00000X.` |
| 3.2 | Crear una SEGUNDA mascota "Firulais 2" | El HC preview es **correlativo** (HC+1). No debe repetir el número (si falla → bug del contador PET_HC). |
| 3.3 | Ir a la ficha de Firulais → "Nuevo registro" → llena motivo, anamnesis y 1-2 constantes (ej. temperatura 39, peso 10) → "Guardar cambios" | Toast `Registro clinico guardado correctamente.` + la consulta aparece en la sección historial con su autor (tu nombre de perfil). |
| 3.4 | "Nota" → escribe algo → guardar | Toast `Nota clinica guardada correctamente.` y aparece como NOTA. |
| 3.5 | Edita la nota y vuelve a guardar | Refleja el cambio. |
| 3.6 | Elimina la nota (basurero → confirmar) | Toast `Registro eliminado correctamente.` |

🔍 *Check opcional en SQL Editor:*
```sql
-- Los HC de la empresa son únicos y correlativos:
select id, pet_name, hc from pets
where company_id = (select id from companies limit 1)
  and deleted_at is null
order by created_at desc limit 5;
```

## PASO 4 — Inventario

| # | Acción | Resultado esperado |
|---|---|---|
| 4.1 | Catálogo → crea producto "Kibble Smoke 1kg" (compra 10, venta 15, stock inicial 5 via pantalla de carga o el campo que el form ofrezca) | Toast de éxito. El producto aparece en `/products` con su stock. |
| 4.2 | Cargar stock (`/charges/create`): elige producto, cant. 3, tipo "Ajuste por diferencia de inventario", motivo "compra smoke test" → submit | Toast `Stock cargado correctamente.` → el stock en `/products` ahora es **inicial + 3** (lo calcula el trigger, no el frontend). |
| 4.3 | Descargar stock (`/discharges/create`): mismo producto, cant. 1, motivo → submit | Toast `Stock descargado correctamente.` → stock baja en 1. |
| 4.4 | La operación aparece en `/charges` y `/discharges` con fecha, responsable y motivo | Sí, y el detalle (icono de la fila) muestra los items. |
| 4.5 | Servicios → crea servicio "Baño Smoke" precio 30 | Toast de éxito, aparece en lista. |

## PASO 5 — Venta completa (el flujo más importante)

| # | Acción | Resultado esperado |
|---|---|---|
| 5.1 | `/clients` → Smoke Test → ir a Ventas (`/sales/client/:id`) | POS del cliente. |
| 5.2 | Buscador "Buscar y agregar productos y servicios…" → agrega "Kibble Smoke 1kg" (cantidad 2) y "Baño Smoke" | Ambos items en la tabla con sus precios. |
| 5.3 | Prueba el F5 | El carrito **sobrevive** (sessionStorage `vetArielCart:<clientId>`). |
| 5.4 | "Ir a caja y generar comprobante" | CreateInvoice. "Número de comprobante" dice **"Se asigna al emitir"** y la serie es `B001`. |
| 5.5 | Tipo BOLETA, DNI 70000000. Pagos: forma EFECTIVO, monto = total, motivo "cobro smoke" → "+ AGREGAR" | El pago aparece en la tabla de pagos. "Saldo por pagar" = 0. |
| 5.6 | "Generar comprobante" | Toast: `Comprobante B001-00000xx emitido por S/ xx.x` → navega a `/sales/invoices`. |
| 5.7 | En `/sales/invoices`, abre el comprobante nuevo | Items correctos (2 kibble + 1 baño), datos del cliente, IGV calculado (total/1.18). |
| 5.8 | `/products` → revisa stock de Kibble | Bajó **exactamente 2** por la venta. |
| 5.9 | Caja (`/sales/payments`, menú "Entradas / Salidas") | Hay una fila nueva tipo VENTA, medio EFECTIVO, Doc. Ref. `B001-00000xx`. Las stats de ingresos incluyeron el monto. |

🔍 *Check opcional: emite una 2a venta y confirma que el correlativo fue +1 (atómico, sin duplicados).*

```sql
select serie, correlativo, total from invoices
where company_id = (select id from companies limit 1)
order by created_at desc limit 5;
```

## PASO 6 — Caja: extorno

| # | Acción | Resultado esperado |
|---|---|---|
| 6.1 | Caja → menú ⋮ del pago de la venta → "Eliminar" → confirma extorno con un motivo | NO borra la fila original: aparece una **fila inversa** en el listado y el balance baja. El Doc. Ref. de ambas comparten el número del comprobante. |

## PASO 7 — Cola clínica

| # | Acción | Resultado esperado |
|---|---|---|
| 7.1 | En Ventas del cliente, botón "Enviar a la cola médica" | Modal "Generar Consulta": médico asignado (select con al menos tu usuario), propietario y mascota autocompletados. Añade notas y "Enviar a la cola". |
| 7.2 | Ve a `/clinic-queue` | Firulais aparece con estado **Pendiente**, fecha de hoy, chip "Alerta" por las notas. |
| 7.3 | Click en la pastilla de estado → "En atención" → guardar | Toast `Paciente de la cola actualizado.` y la pastilla cambia. |
| 7.4 | Cámbiala a "Atendido" | El contador de stats "Atendidos" sube. La fila puede seguir listada (mismo día). |
| 7.5 | Refresca la página (F5) | La fila persiste (está en DB, no en localStorage). |
| 7.6 | (Si tienes 2 PCs/sesiones) agrega desde la otra sesión | En ~30 s aparece en la primera (polling). |
| 7.7 | Menú ⋮ → "Eliminar" → confirmar | La fila desaparece de la lista de hoy. |

## PASO 8 — Cola de grooming

| # | Acción | Resultado esperado |
|---|---|---|
| 8.1 | En Ventas, "Enviar a cola de grooming" → formulario de orden → agrega "Baño Smoke" → "Crear orden de servicio" | Toast `Orden de grooming creada correctamente.` → navega a `/grooming` y la orden aparece con **Turno** asignado (1, 2, … por día). |
| 8.2 | Refresca (F5) | La orden persiste. El turno NO se duplica. |
| 8.3 | Pastilla de estado → "En atención" → guardar | Pastilla cambia + toast. |
| 8.4 | Menú ⋮ → "Terminar" → confirmar | La orden **desaparece de Órdenes Activas** y aparece en `/grooming/history` con estado Terminado. Es la MISMA fila en DB (no una copia). |
| 8.5 | En el historial, stats "Terminados" | Hizo +1. |
| 8.6 | Menú ⋮ → "Devolver a cola" → confirmar | La orden vuelve a Órdenes Activas como Pendiente. |
| 8.7 | ⋮ → "Eliminar" → confirmar | Limpia la fila de hoy. |

## PASO 9 — Dashboard y cierre

| # | Acción | Resultado esperado |
|---|---|---|
| 9.1 | Dashboard | "Ventas de hoy" incluye la venta del PASO 5; "Clientes nuevos hoy" incluye a "Smoke Test". (Parsing de fechas: hoy = hora local de Lima). |
| 9.2 | Logout | Vuelve a `/login` sin errores. |

---

## Qué anotar si algo falla

Para que el fix sea rápido, documenta:

1. **Paso y sub-paso exacto** (ej. "5.6").
2. **Mensaje del toast rojo** (los servicios traducen los errores de Supabase al español).
3. **Qué dice la consola del navegador** (F12 → Console y Network): status HTTP y el response body del request a Supabase.
4. Si el error viene de la DB: el mensaje en el SQL Editor ejecutando la consulta equivalente.

## Limpieza de datos de prueba (opcional)

```sql
-- Limpia clientes y mascotas de smoke test (soft delete):
-- (Ajusta los ids después de revisar con un SELECT previo)
update clients set deleted_at = now() where first_name = 'Smoke';
update pets    set deleted_at = now() where pet_name in ('Firulais', 'Firulais 2');
```

Los productos/servicios/movimientos/ventas del smoke test NO se borran: son
transacciones reales del historial (stock y correlativos ya avanzaron). Déjalos;
si molestan, renómbralos con prefijo `[SMOKE]`.

---

**Después de este test:** sigue `docs/PASO_8_PENETRATION.md` para verificar que
lo que DEBE fallar, falla.
