// ============================================================================
// scripts/migrate-localstorage.mjs
// ============================================================================
// Migracion de datos de localStorage -> Supabase (cierre del Paso 4).
//
// QUE IMPORTA (en orden):
//   1. clients        (mismos UUID v4 -> las referencias ownerId siguen OK)
//   2. pets           (insert -> trigger asigna HC -> UPDATE con el HC original)
//   3. pet_records    (CONSULTA / NOTA, created_at original, created_by match
//                      por nombre contra profiles, fallback: admin actual)
//   4. services
//   5. products       (stock NUNCA se pasa directo: se reconstruye)
//   6. historico de movimientos (CARGA/DESCARGA, created_at original)
//   7. conciliacion: si products.stock reconstruido difiere del
//      availableStock de localStorage, genera movimientos correctivos
//      'Ajuste por migracion de datos' (uno de CARGA, otro de DESCARGA).
//
// AUTENTICACION: credenciales de una cuenta ADMIN (env). Todas las
// escrituras pasan por RLS igual que la app real: no se usa service_role.
//
// IDEMPOTENTE: clients/pets/products/services usan upsert por id (los
// repetidos no duplican). Records y movimientos se chequean por
// (pet_id/created_at) y (reason/created_at) antes de insertar.
//
// USO (docs/PASO_4.md tiene el paso a paso completo):
//   1. Consola del navegador (con la app abierta donde estan los datos):
//      copy(JSON.stringify({
//        clients: localStorage['clients'],
//        petsData: localStorage['petsData'],
//        productsData: localStorage['productsData'],
//        servicesData: localStorage['servicesData'],
//        restockData: localStorage['restockData'],
//        dischargesData: localStorage['dischargesData']
//      }, null, 2))
//   2. Guardar el resultado como localstorage-export.json en la raiz.
//   3. .env: ADMIN_EMAIL= admin password= (cuenta ADMIN)
//   4. npm run migrate:localstorage
// ============================================================================

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    '\x1b[31mFaltan variables en .env: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, ADMIN_EMAIL, ADMIN_PASSWORD\x1b[0m'
  );
  process.exit(1);
}

const EXPORT_PATH = 'localstorage-export.json';
if (!existsSync(EXPORT_PATH)) {
  console.error(`\x1b[31mNo existe ${EXPORT_PATH}. Exporta tu localStorage siguiendo docs/PASO_4.md.\x1b[0m`);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parseo de fechas legacy: ISO 'yyyy-mm-dd', 'dd/mm/yyyy' y toLocaleString
 * del navegador. Convierte '31/07/2024' + '07:43 AM' a timestamp ISO para
 * la columna created_at. Devuelve null si nada casa.
 */
function toIsoTimestamp(dateStr, timeStr) {
  if (!dateStr) return null;
  const s = String(dateStr).trim();

  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    return `${iso[1]}-${iso[2]}-${iso[3]}T${(timeStr || '').trim() || '00:00:00'}`;
  }

  const parts = s.match(/^(\d{1,4})[-/](\d{1,2})[-/](\d{4})/);
  if (parts) {
    // '9/29/2026' (toLocaleString en-US) -> mes/dia/anio
    if (parts[1].length === 4) {
      // yyyy-mm-dd con hora suelta: mismo comportamiento que arriba.
      return `${parts[1]}-${parts[2].padStart(2, '0')}-${parts[3].padStart(2, '0')}T${(timeStr || '').trim() || '00:00:00'}`;
    }
    // '29/07/2024' (dd/mm/yyyy)
    const d = parts[1].padStart(2, '0');
    const m = parts[2].padStart(2, '0');
    const y = parts[3];
    // Validar que el mes sea 1..12 (si no, asume formato mezclado).
    const monthNum = Number(m);
    if (monthNum < 1 || monthNum > 12) return null;
    return `${y}-${m}-${d}T${(timeStr || '').trim() || '00:00:00'}`;
  }

  return null;
}

function logOk(msg) { console.log('  \x1b[32mOK\x1b[0m', msg); }
function logSkip(msg) { console.log('  \x1b[33mSKIP\x1b[0m', msg); }
function logErr(context, err) { console.error('  \x1b[31mERR\x1b[0m', context, err?.message ?? err); }

// ---------------------------------------------------------------------------
// Autenticacion
// ---------------------------------------------------------------------------

console.log(`Autenticando como ${ADMIN_EMAIL} ...`);
const { error: authError } = await supabase.auth.signInWithPassword({
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
});
if (authError) {
  console.error('\x1b[31mLogin fallido:', authError.message, '\x1b[0m');
  process.exit(1);
}

const { data: sessionData } = await supabase.auth.getSession();
const authUserId = sessionData?.session?.user?.id;
if (!authUserId) {
  console.error('\x1b[31mNo hay sesion activa.\x1b[0m');
  process.exit(1);
}
logOk('sesion activa');

// ---------------------------------------------------------------------------
// Cargar export
// ---------------------------------------------------------------------------

const dump = JSON.parse(readFileSync(EXPORT_PATH, 'utf8'));
const clients = dump.clients ?? [];
const pets = dump.petsData ?? [];
const products = dump.productsData ?? [];
const services = dump.servicesData ?? [];
const restocks = dump.restockData ?? [];
const discharges = dump.dischargesData ?? [];

console.log('\nExport cargado:');
console.log(`  clients: ${clients.length}`);
console.log(`  pets: ${pets.length}`);
console.log(`  products: ${products.length}`);
console.log(`  services: ${services.length}`);
console.log(`  movimientos historicos: ${restocks.length + discharges.length}`);
console.log('');

// Empresa destino: la del admin logueado (multi-tenant).
const { data: myProfile } = await supabase
  .from('profiles')
  .select('company_id')
  .eq('id', authUserId)
  .single();

const companyId = myProfile?.company_id;
if (!companyId) {
  console.error('\x1b[31mTu usuario no tiene company_id en profiles.\x1b[0m');
  process.exit(1);
}
logOk(`empresa destino: ${companyId}`);

// ---------------------------------------------------------------------------
// 1. Clients
// ---------------------------------------------------------------------------

let clientsInserted = 0;
for (const c of clients) {
  if (!c.id || !c.firstName || !c.lastName) {
    logSkip(`cliente sin id/nombre (${c.firstName ?? ''})`);
    continue;
  }
  // created_at original preservado (los triggers no lo tocan en INSERT).
  const createdAt = toIsoTimestamp(c.date, c.hour) ?? new Date().toISOString();
  const { error } = await supabase.from('clients').upsert({
    id: c.id,
    company_id: companyId,
    first_name: c.firstName,
    last_name: c.lastName,
    dni: c.dni || null,
    email: c.email || null,
    // phone1 es NOT NULL en la DB: si el local no lo tenia, un placeholder
    // simple para cumplir el schema (editarlo en la app cuando toque).
    phone1: c.phone1 || '000000000',
    phone2: c.phone2 || null,
    address: c.address || 'Sin direccion registrada',
    district: c.district || null,
    reference: c.reference || null,
    observations: c.observations || null,
    created_by: authUserId,
    created_at: createdAt,
  }, { onConflict: 'id' });

  if (error) {
    logErr(`cliente ${c.firstName} ${c.lastName}`, error);
    continue;
  }
  clientsInserted++;
}
console.log(`\n[1/7] clientes upserted: ${clientsInserted}/${clients.length}`);

// ---------------------------------------------------------------------------
// 2. Pets (insert -> trigger asigna HC -> UPDATE al HC original)
// ---------------------------------------------------------------------------

const insertedPetIds = new Set();
let petsInserted = 0;
let hcsRestored = 0;

for (const p of pets) {
  if (!p.id || !p.petName || !p.ownerId) {
    logSkip(`mascota incompleta (${p.petName ?? ''})`);
    continue;
  }
  const createdAt = toIsoTimestamp(p.registrationDate, p.registrationTime) ?? new Date().toISOString();

  // El trigger assign_pet_hc SIEMPRE sobreescribe hc con el contador;
  // por eso hc NO viaja en el insert y se restaura en el UPDATE.
  const { data: insertedRow, error } = await supabase
    .from('pets')
    .insert({
      id: p.id,
      company_id: companyId,
      owner_id: p.ownerId,
      pet_name: p.petName,
      species: p.species,
      breed: p.breed,
      sex: p.sex,
      birth_date: p.birthDate,
      microchip: p.microchip || null,
      esterilized: p.esterilized || 'NO',
      active: p.active ?? true,
      created_at: createdAt,
    })
    .select('id')
    .single();

  if (error) {
    if (error.code === '23505' || error.message.toLowerCase().includes('duplicate')) {
      // Ya existe el id en la DB (idempotencia): saltarlo y NO hacer UPDATE.
      logSkip(`mascota ${p.petName} ya existia`);
      continue;
    }
    logErr(`mascota ${p.petName}`, error);
    continue;
  }

  petsInserted++;
  insertedPetIds.add(p.id);

  if (p.hc) {
    // El HC original de localStorage (ej. '105') esta en una secuencia
    // distinta; se preservar para que la historia clinica haga sentido.
    const { error: hcErr } = await supabase
      .from('pets')
      .update({ hc: String(p.hc).padStart(6, '0') })
      .eq('id', p.id);
    if (hcErr) {
      logErr(`hc en ${p.petName}`, hcErr);
    } else {
      hcsRestored++;
    }
  }
}
console.log(`[2/7] mascotas upserted: ${petsInserted}/${pets.length} | HC restaurados: ${hcsRestored}`);

// ---------------------------------------------------------------------------
// 3. Pet records (historial clinico)
// ---------------------------------------------------------------------------

let recordsInserted = 0;
let recordsSkipped = 0;

// Para created_by: matchea el nombre del autor contra profiles de la empresa.
const { data: profiles } = await supabase
  .from('profiles')
  .select('id, first_name, last_name');
const authorByName = new Map(
  (profiles ?? []).map((prof) => [`${prof.first_name} ${prof.last_name}`.trim().toLowerCase(), prof.id])
);

for (const pet of pets) {
  if (!insertedPetIds.has(pet.id) || !Array.isArray(pet.records)) continue;

  for (const rec of pet.records) {
    const createdAt = toIsoTimestamp(rec.dateTime, rec.dateTime?.split(',')?.[1] ?? null);
    if (!createdAt) {
      logSkip(`record sin fecha parseable (${rec.dateTime ?? '?'})`);
      recordsSkipped++;
      continue;
    }

    const isNote = rec.type === 'note';

    const payload = {
      company_id: companyId,
      pet_id: pet.id,
      type: isNote ? 'NOTA' : 'CONSULTA',
      created_at: createdAt,
      // El autor original si matchea; si no, el admin que ejecuta el
      // script (mejor 'null' nunca: created_by es util para auditoria).
      created_by: authorByName.get(String(rec.createdBy ?? '').trim().toLowerCase()) ?? authUserId,
    };

    if (isNote) {
      payload.content = rec.content || null;
    } else {
      payload.reason = rec.reason || null;
      payload.anamnesis = rec.anamnesis || null;
      payload.temperature = rec.physiologicalConstants?.temperature || null;
      payload.heart_rate = rec.physiologicalConstants?.heartRate || null;
      payload.weight = rec.physiologicalConstants?.weight || null;
      payload.oxygen_saturation = rec.physiologicalConstants?.oxygenSaturation || null;
      payload.clinical_exam = rec.clinicalExam || null;
    }

    // Idempotencia: existe ya ese record para esa mascota con esa fecha?
    const { data: existing } = await supabase
      .from('pet_records')
      .select('id')
      .eq('pet_id', pet.id)
      .eq('type', payload.type)
      .eq('created_at', createdAt)
      .limit(1);
    if (existing && existing.length > 0) {
      recordsSkipped++;
      continue;
    }

    const { error } = await supabase.from('pet_records').insert(payload);
    if (error) {
      logErr(`record de ${pet.petName}`, error);
      continue;
    }
    recordsInserted++;
  }
}
console.log(`[3/7] records insertados: ${recordsInserted} (skips/presentes: ${recordsSkipped})`);

// ---------------------------------------------------------------------------
// 4. Services
// ---------------------------------------------------------------------------

let servicesInserted = 0;
for (const s of services) {
  if (!s.id || !s.line || !s.category) {
    logSkip(`servicio incompleto (${s.serviceName ?? ''})`);
    continue;
  }
  const createdAt = toIsoTimestamp(s.registrationDate, s.registrationTime) ?? new Date().toISOString();
  const { error } = await supabase.from('services').upsert({
    id: s.id,
    company_id: companyId,
    service_name: s.serviceName || null,
    line: s.line,
    category: s.category,
    cost: s.cost ?? 0,
    sale_price: s.salePrice ?? 0,
    available_for_sale: s.availableForSale ?? true,
    active: s.status ?? true,
    created_at: createdAt,
  }, { onConflict: 'id' });

  if (error) {
    logErr(`servicio ${s.serviceName}`, error);
    continue;
  }
  servicesInserted++;
}
console.log(`[4/7] servicios upserted: ${servicesInserted}/${services.length}`);

// ---------------------------------------------------------------------------
// 5. Products (SIN stock: se reconstruye en 6 y 7)
// ---------------------------------------------------------------------------

let productsInserted = 0;
for (const p of products) {
  if (!p.id || !p.systemCode) {
    logSkip(`producto incompleto (${p.productName ?? ''})`);
    continue;
  }
  const createdAt = toIsoTimestamp(p.registrationDate, p.registrationTime) ?? new Date().toISOString();
  const { error } = await supabase.from('products').upsert({
    id: p.id,
    company_id: companyId,
    system_code: p.systemCode,
    product_name: p.productName || null,
    brand: p.brand || 'N.D.',
    barcode: p.barcode || null,
    line: p.line || 'GENERAL',
    category: p.category || 'PRODUCTO',
    subcategory: p.subcategory || null,
    unit_of_measurement: p.unitOfMeasurement || null,
    presentation: p.presentation || null,
    content: p.content || null,
    provider: p.provider || null,
    min_stock: p.minStock ?? 0,
    cost: p.cost ?? 0,
    sale_price: p.salePrice ?? 0,
    // stock NO va: lo mantienen los triggers via movimientos (pasos 6 y 7)
    active: p.status ?? true,
    created_at: createdAt,
  }, { onConflict: 'id' });

  if (error) {
    logErr(`producto ${p.systemCode}`, error);
    continue;
  }
  productsInserted++;
}
console.log(`[5/7] productos upserted: ${productsInserted}/${products.length}`);

// ---------------------------------------------------------------------------
// 6. Historico de movimientos
// ---------------------------------------------------------------------------

const localProductsById = new Map(products.map((p) => [p.id, p]));

let movementsInserted = 0;
let movementsSkipped = 0;

async function importOperation(op, type) {
  if (!op || !op.reason || !op.responsible) {
    movementsSkipped++;
    return;
  }
  const createdAt = toIsoTimestamp(op.date, op.time);
  if (!createdAt) {
    movementsSkipped++;
    return;
  }

  // Idempotencia: mismo motivo + tipo + fecha EXACTA en la empresa.
  const { data: existing } = await supabase
    .from('inventory_movements')
    .select('id')
    .eq('company_id', companyId)
    .eq('reason', op.reason)
    .eq('type', type)
    .eq('created_at', createdAt)
    .limit(1);
  if (existing && existing.length > 0) {
    movementsSkipped++;
    return;
  }

  // Filtrar items cuyo product_id NO matchee con el export local
  // (protege contra referencias rots de localStorage viejo).
  const validItems = (op.products || []).filter((item) => {
    if (!item || !item.id) return false;
    return localProductsById.has(item.id);
  });
  if (validItems.length === 0) {
    movementsSkipped++;
    return;
  }

  const { data: head, error } = await supabase
    .from('inventory_movements')
    .insert({
      company_id: companyId,
      type,
      reason: op.reason,
      responsible: op.responsible,
      store: op.store || null,
      created_by: authUserId,
      created_at: createdAt,
    })
    .select('id')
    .single();

  if (error) {
    logErr(`movimiento ${type} ${op.reason}`, error);
    movementsSkipped++;
    return;
  }

  const { error: itemsErr } = await supabase
    .from('inventory_movement_items')
    .insert(
      validItems.map((item) => ({
        movement_id: head.id,
        product_id: item.id,
        quantity: item.quantity > 0 ? item.quantity : 1,
        unit_cost: item.cost ?? 0,
      }))
    );

  if (itemsErr) {
    logErr(`items de ${op.reason}`, itemsErr);
    movementsSkipped++;
    return;
  }
  movementsInserted++;
}

for (const r of restocks) await importOperation(r, 'CARGA');
for (const d of discharges) await importOperation(d, 'DESCARGA');
console.log(`[6/7] movimientos historicos insertados: ${movementsInserted} (skips: ${movementsSkipped})`);

// ---------------------------------------------------------------------------
// 7. Conciliacion de stock
// ---------------------------------------------------------------------------

const { data: dbProducts } = await supabase
  .from('products')
  .select('id, system_code, stock')
  .eq('company_id', companyId);

const stockInDb = new Map((dbProducts ?? []).map((p) => [p.id, p.stock]));

const driftsUp = [];   // DB quedo por debajo de localStorage -> CARGA
const driftsDown = []; // DB quedo por encima              -> DESCARGA

for (const local of products) {
  const expected = Number(local.availableStock ?? 0);
  const current = stockInDb.get(local.id) ?? 0;
  const delta = expected - current;
  if (delta === 0) continue;
  if (delta > 0) {
    driftsUp.push({ id: local.id, systemCode: local.systemCode, quantity: delta });
  } else {
    driftsDown.push({ id: local.id, systemCode: local.systemCode, quantity: Math.abs(delta) });
  }
}

if (driftsUp.length === 0 && driftsDown.length === 0) {
  logOk('stock reconstruido igual al de localStorage: sin ajustes');
} else {
  console.log(`\n[7/7] conciliando stock: ${driftsUp.length} cargas + ${driftsDown.length} descargas correctivas`);

  async function correctiveMovement(type, items, label) {
    if (items.length === 0) return;
    const { data: head, error: headErr } = await supabase
      .from('inventory_movements')
      .insert({
        company_id: companyId,
        type,
        reason: label,
        responsible: 'Sistema (migracion)',
        store: null,
        created_by: authUserId,
      })
      .select('id')
      .single();

    if (headErr) {
      logErr(`ajuste ${type}`, headErr);
      return;
    }
    const { error: itemsErr } = await supabase
      .from('inventory_movement_items')
      .insert(items.map((it) => ({
        movement_id: head.id,
        product_id: it.id,
        quantity: it.quantity,
        unit_cost: 0,
      })));
    if (itemsErr) {
      logErr(`items de ajuste ${type}`, itemsErr);
      return;
    }
    logOk(`movimiento correctivo ${type} con ${items.length} productos`);
  }

  await correctiveMovement('CARGA', driftsUp, 'Ajuste por migracion de datos');
  await correctiveMovement('DESCARGA', driftsDown, 'Ajuste por migracion de datos');
}

// ---------------------------------------------------------------------------
// Resumen
// ---------------------------------------------------------------------------

console.log('\n\x1b[32m=== MIGRACION COMPLETADA ===\x1b[0m');
console.log(`  clientes:     ${clientsInserted}/${clients.length}`);
console.log(`  mascotas:     ${petsInserted}/${pets.length} (HC restaurados: ${hcsRestored})`);
console.log(`  records:      ${recordsInserted}`);
console.log(`  servicios:    ${servicesInserted}/${services.length}`);
console.log(`  productos:    ${productsInserted}/${products.length}`);
console.log(`  movimientos:  ${movementsInserted} + ajustes`);
console.log('\nRecarga la app (Ctrl+Shift+R) para ver tus datos desde Supabase.');
