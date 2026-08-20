// ============================================================================
// Práctica de SQL — VetAriel
// Ejecuta: node --experimental-sqlite db/practice.mjs
// ============================================================================
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(join(__dirname, 'vetAriel.db'));
db.exec('PRAGMA foreign_keys = ON');

function separator(title) {
  console.log('\n' + '━'.repeat(70));
  console.log(`▶ ${title}`);
  console.log('━'.repeat(70));
}

function run(title, sql) {
  separator(title);
  console.log('SQL:', sql);
  const rows = db.prepare(sql).all();
  console.log('Resultados (' + rows.length + ' filas):');
  console.table(rows);
}

// ========================================================================
// 1. SELECT básico: traer todas las columnas de una tabla
// ========================================================================
run(
  '1. SELECT * — todos los clientes',
  'SELECT * FROM clients',
);

// ========================================================================
// 2. SELECT con columnas específicas y alias
// ========================================================================
run(
  '2. SELECT firstName, lastName con alias "nombreCompleto"',
  `SELECT firstName || ' ' || lastName AS nombreCompleto, email FROM clients`,
);

// ========================================================================
// 3. WHERE: filtrar filas
// ========================================================================
run(
  '3. WHERE — clientes registrados después del 2024-02-01',
  `SELECT firstName, registrationDate FROM clients WHERE registrationDate > '2024-02-01'`,
);

// ========================================================================
// 4. ORDER BY: ordenar resultados
// ========================================================================
run(
  '4. ORDER BY — clientes ordenados por apellido ascendente',
  `SELECT firstName, lastName FROM clients ORDER BY lastName ASC`,
);

// ========================================================================
// 5. JOIN: unir clientes con sus mascotas
// ========================================================================
run(
  '5. INNER JOIN — cada mascota con los datos de su dueño',
  `SELECT pets.petName, pets.species, pets.breed,
          clients.firstName, clients.lastName, clients.phone1
   FROM pets
   INNER JOIN clients ON pets.ownerId = clients.id`,
);

// ========================================================================
// 6. GROUP BY + COUNT: contar mascotas por cliente
// ========================================================================
run(
  '6. GROUP BY + COUNT — cuántos clientes tienen email registrado',
  `SELECT
     CASE WHEN email IS NULL THEN 'Sin email' ELSE 'Con email' END AS categoria,
     COUNT(*) AS total
   FROM clients
   GROUP BY categoria`,
);

// ========================================================================
// 7. INSERT: agregar un nuevo cliente
// ========================================================================
separator('7. INSERT — agregar un cliente nuevo');
db.prepare(
  `INSERT INTO clients (id, firstName, lastName, email, phone1, phone2, address, registrationDate)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
).run('c-005', 'Lucía', 'Mendoza Ríos', 'lucia.mendoza@gmail.com', '+51987651111', null, 'Av. Javier Prado 100', '2024-05-22');
console.log('✅ Insertado c-005: Lucía Mendoza Ríos');
run('Verificación: SELECT clientes después del insert', 'SELECT * FROM clients');

// ========================================================================
// 8. UPDATE: modificar un registro existente
// ========================================================================
separator('8. UPDATE — cambiar el teléfono de c-001');
const result = db.prepare(`UPDATE clients SET phone1 = ? WHERE id = ?`).run('+51999000111', 'c-001');
console.log(`✅ Filas afectadas: ${result.changes}`);
run('Verificación: SELECT cliente c-001 después del update', `SELECT id, firstName, phone1 FROM clients WHERE id = 'c-001'`);

// ========================================================================
// 9. DELETE: borrar un registro (con CASCADE eliminamos sus mascotas)
// ========================================================================
separator('9. DELETE — borrar cliente c-003 (sus mascotas se eliminan por CASCADE)');
const del = db.prepare(`DELETE FROM clients WHERE id = ?`).run('c-003');
console.log(`✅ Filas eliminadas en clients: ${del.changes}`);
run('Verificación: clientes restantes', `SELECT id, firstName FROM clients`);
run('Verificación: mascotas restantes (la mascota de c-003 debería haber desaparecido)', `SELECT id, petName, ownerId FROM pets`);

// ========================================================================
// 10. Subquery: clientes que tienen más de una mascota
// ========================================================================
separator('10. Subquery — clientes con MÁS de una mascota');
console.log('SQL:', `
   SELECT firstName, lastName, (SELECT COUNT(*) FROM pets WHERE pets.ownerId = clients.id) AS totalMascotas
   FROM clients
   WHERE (SELECT COUNT(*) FROM pets WHERE pets.ownerId = clients.id) > 1
 `);
const subRows = db
  .prepare(
    `SELECT firstName, lastName,
            (SELECT COUNT(*) FROM pets WHERE pets.ownerId = clients.id) AS totalMascotas
     FROM clients
     WHERE (SELECT COUNT(*) FROM pets WHERE pets.ownerId = clients.id) > 1`,
  )
  .all();
console.log('Resultados:');
console.table(subRows);

// ========================================================================
// 11. INSERT fallido por integridad referencial
// ========================================================================
separator('11. INSERT fallido — intentar agregar una mascota con ownerId inexistente');
console.log('SQL:', `INSERT INTO pets (id, ownerId, petName, species, breed, birthDate) VALUES ('p-fake', 'no-existe', 'Firulais', 'Perro', 'Mestizo', '2023-01-01')`);
try {
  db.prepare(
    `INSERT INTO pets (id, ownerId, petName, species, breed, birthDate) VALUES (?, ?, ?, ?, ?, ?)`,
  ).run('p-fake', 'no-existe', 'Firulais', 'Perro', 'Mestizo', '2023-01-01');
  console.log('⚠️  Esto NO debería imprimirse');
} catch (err) {
  console.log('✅ ERROR ESPERADO (FOREIGN KEY constraint):');
  console.log('   ', err.message);
}

db.close();
console.log('\n✨ Práctica completada.');
