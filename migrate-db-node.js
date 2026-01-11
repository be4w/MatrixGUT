
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import fs from 'fs';
import { config } from 'dotenv';

config({ path: '.env' });

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
    try {
        console.log('🚀 Starting Phase 1 Migration...');
        const sql = fs.readFileSync('migrations/0001_add_impact_column.sql', 'utf8');

        // Check if impact column already exists
        console.log('Checking if impact column exists...');
        const checkObj = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='tasks' AND column_name='impact'
    `);

        if (checkObj.rowCount > 0) {
            console.log('⚠️  Impact column already exists. Skipping ADD COLUMN.');
            console.log('Applying remaining steps (Data Copy, Constraints, Gravity Nullable)...');

            // Run the rest of the steps safely
            await pool.query(`
        UPDATE tasks SET impact = gravity WHERE impact IS NULL;
        ALTER TABLE tasks ALTER COLUMN impact SET DEFAULT 3;
        -- Attempt to set NOT NULL, might fail if nulls remain, but UPDATE above should fix it
        ALTER TABLE tasks ALTER COLUMN impact SET NOT NULL;
        ALTER TABLE tasks ALTER COLUMN gravity DROP NOT NULL;
      `);
            console.log('✅ Remaining steps applied successfully!');
        } else {
            console.log('Applying full migration...');
            const sql = fs.readFileSync('migrations/0001_add_impact_column.sql', 'utf8');
            await pool.query(sql);
            console.log('✅ Full migration applied successfully!');
        }
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

migrate();
