// Vercel Serverless Function for /api/tasks/[id]
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { pgTable, text, serial, integer, boolean } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import ws from 'ws';

// Configure Neon
neonConfig.webSocketConstructor = ws;

// Define schema
const tasks = pgTable('tasks', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    gravity: integer('gravity').notNull(),
    urgency: integer('urgency').notNull(),
    tendency: integer('tendency').notNull(),
    completed: boolean('completed').notNull().default(false),
    sensitive: boolean('sensitive').notNull().default(false),
    labels: text('labels').array(),
    notes: text('notes'),
});

// Initialize database
let db = null;
if (process.env.DATABASE_URL) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool });
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (!db) {
        return res.status(500).json({ error: 'Database not configured' });
    }

    try {
        const { id } = req.query;
        const taskId = parseInt(id);

        if (isNaN(taskId)) {
            return res.status(400).json({ error: 'Invalid task ID' });
        }

        // PATCH /api/tasks/[id]
        if (req.method === 'PATCH') {
            console.log(`[PATCH /api/tasks/${taskId}]`, req.body);
            const [task] = await db
                .update(tasks)
                .set(req.body)
                .where(eq(tasks.id, taskId))
                .returning();

            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }

            return res.status(200).json(task);
        }

        // DELETE /api/tasks/[id]
        if (req.method === 'DELETE') {
            console.log(`[DELETE /api/tasks/${taskId}]`);
            await db.delete(tasks).where(eq(tasks.id, taskId));
            return res.status(204).end();
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error(`[API ERROR]`, error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message,
        });
    }
}
