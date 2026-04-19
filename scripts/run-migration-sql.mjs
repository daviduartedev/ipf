/**
 * Executa o ficheiro SQL da migração contra o Postgres do Supabase.
 * Requer no .env: DATABASE_URL (URI completa com palavra-passe — Settings → Database no dashboard).
 *
 * Uso: npm run db:migrate-sql
 */

import 'dotenv/config';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client } = pg;

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const sqlPath = join(root, 'supabase', 'migrations', '20260419120000_posts_and_storage.sql');

const url = process.env.DATABASE_URL;
if (!url || !url.startsWith('postgres')) {
  console.error(
    'Defina DATABASE_URL no .env com a connection string do Supabase (inclui a palavra-passe da base).',
  );
  console.error('Dashboard → Project Settings → Database → Connection string (URI).');
  process.exit(1);
}

const sql = readFileSync(sqlPath, 'utf8');

const client = new Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);
  console.log('Migração aplicada com sucesso:', sqlPath);
} catch (e) {
  console.error('Erro ao executar SQL:', e.message);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
