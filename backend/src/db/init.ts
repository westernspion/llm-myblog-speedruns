import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Read and execute migration file
    const migrationPath = path.join(__dirname, 'migrations', '0000_create_initial_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    
    const client = await pool.connect();
    try {
      await client.query(sql);
      console.log('✅ Database schema initialized');
    } finally {
      client.release();
    }
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      console.log('✅ Database schema already exists');
    } else {
      console.error('❌ Failed to initialize database:', error.message);
      throw error;
    }
  } finally {
    await pool.end();
  }
}
