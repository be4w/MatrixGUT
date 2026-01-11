
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import fs from 'fs';
import { config } from 'dotenv';

config({ path: '.env' });

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function backup() {
    try {
        console.log('📦 Starting database backup...');
        const tables = ['tasks']; // Add other tables if needed
        const backupData = {};

        for (const table of tables) {
            console.log(`Reading table: ${table}`);
            const res = await pool.query(`SELECT * FROM ${table}`);
            backupData[table] = res.rows;
            console.log(`  - ${res.rowCount} rows`);
        }

        const filename = `backup_db_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
        fs.writeFileSync(filename, JSON.stringify(backupData, null, 2));
        console.log(`✅ Backup saved to ${filename}`);
    } catch (err) {
        console.error('❌ Backup failed:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

backup();
