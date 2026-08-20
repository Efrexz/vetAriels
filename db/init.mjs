// ============================================================================
// Script de inicialización de la base de datos SQLite
// Ejecuta: node --experimental-sqlite db/init.mjs
// ============================================================================
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'vetAriel.db');

console.log('📁 Creando DB en:', dbPath);

// Abre (o crea) el archivo .db
const db = new DatabaseSync(dbPath);

// Lee y ejecuta schema.sql
const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
db.exec(schema);
console.log('✅ Schema aplicado');

// Lee y ejecuta seed.sql
const seed = readFileSync(join(__dirname, 'seed.sql'), 'utf-8');
db.exec(seed);
console.log('✅ Datos de ejemplo insertados');

// Verificación rápida
const clientCount = db.prepare('SELECT COUNT(*) AS total FROM clients').get();
const petCount = db.prepare('SELECT COUNT(*) AS total FROM pets').get();
console.log(`\n📊 Total clientes: ${clientCount.total}`);
console.log(`📊 Total mascotas: ${petCount.total}`);

db.close();
console.log('\n✨ Base de datos lista.');
