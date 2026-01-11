import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
neonConfig.webSocketConstructor = ws;
import { config } from 'dotenv';

config({ path: '.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function test() {
  try {
    // Teste 1: Conexão
    const version = await pool.query('SELECT version()');
    console.log('✅ Conexão OK!');

    // Teste 2: Contar tasks
    const count = await pool.query('SELECT COUNT(*) FROM tasks');
    console.log(`📊 Tasks no banco: ${count.rows[0].count}`);

    // Teste 3: Ver últimas tasks
    const tasks = await pool.query('SELECT id, name, impact, urgency, tendency FROM tasks ORDER BY id DESC LIMIT 3');
    console.log('📋 Últimas tasks:');
    tasks.rows.forEach(t => console.log(`  - [${t.id}] ${t.name} (G:${t.impact} U:${t.urgency} T:${t.tendency})`));

    await pool.end();
  } catch (err) {
    console.error('❌ Erro:', err.message);
    await pool.end();
  }
}

test();
