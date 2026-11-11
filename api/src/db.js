// Connexion unique à PostgreSQL (un "pool" de connexions réutilisables).
// Toutes les requêtes passent par la fonction query() ci-dessous.
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Neon (et la plupart des Postgres hébergés) exigent le SSL.
  ssl: { rejectUnauthorized: false },
});

// Petit helper : query(text, params) -> renvoie le résultat de pg.
// Les paramètres ($1, $2, ...) évitent les injections SQL.
export const query = (text, params) => pool.query(text, params);
