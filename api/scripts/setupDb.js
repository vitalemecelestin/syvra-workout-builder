// Crée les tables et insère les données de test dans la base Neon.
// Lancement : npm run db:setup  (lit ../db/schema.sql puis ../db/seed.sql)
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pool } from '../src/db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbDir = join(__dirname, '..', '..', 'db');

async function run() {
  const schema = readFileSync(join(dbDir, 'schema.sql'), 'utf8');
  const seed = readFileSync(join(dbDir, 'seed.sql'), 'utf8');
  console.log('→ Création des tables (schema.sql)...');
  await pool.query(schema);
  console.log('→ Insertion des données (seed.sql)...');
  await pool.query(seed);
  console.log('✅ Base prête (tables + données).');
  await pool.end();
}

run().catch((err) => {
  console.error('❌ Erreur :', err.message);
  process.exit(1);
});
