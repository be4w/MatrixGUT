// Vercel Serverless Function for /api/tasks
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { pgTable, text, serial, integer, boolean } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import ws from 'ws';

// Configure Neon
neonConfig.webSocketConstructor = ws;

// Define schema inline
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

// Initialize database connection
let db = null;
if (process.env.DATABASE_URL) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool });
    console.log('[DB] Connected to Neon database');
} else {
    console.log('[DB] No DATABASE_URL found');
}

// In-memory storage fallback
class MemStorage {
    constructor() {
        this.tasks = new Map();
        this.currentId = 1;
    }

    async getTasks() {
        return Array.from(this.tasks.values());
    }

    async createTask(insertTask) {
        const id = this.currentId++;
        const task = {
            ...insertTask,
            id,
            completed: false,
            labels: insertTask.labels || null,
            notes: insertTask.notes || null,
        };
        this.tasks.set(id, task);
        return task;
    }

    async updateTask(id, updates) {
        const task = this.tasks.get(id);
        if (!task) throw new Error(`Task with id ${id} not found`);
        const updatedTask = { ...task, ...updates };
        this.tasks.set(id, updatedTask);
        return updatedTask;
    }

    async deleteTask(id) {
        this.tasks.delete(id);
    }
}

// Database storage
class DbStorage {
    constructor(database) {
        this.db = database;
    }

    async getTasks() {
        return await this.db.select().from(tasks);
    }

    async createTask(insertTask) {
        const [task] = await this.db.insert(tasks).values(insertTask).returning();
        return task;
    }

    async updateTask(id, updates) {
        const [task] = await this.db
            .update(tasks)
            .set(updates)
            .where(eq(tasks.id, id))
            .returning();
        if (!task) throw new Error(`Task with id ${id} not found`);
        return task;
    }

    async deleteTask(id) {
        await this.db.delete(tasks).where(eq(tasks.id, id));
    }
}

// Choose storage
const storage = db ? new DbStorage(db) : new MemStorage();

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
    console.log(`[API] ${req.method} ${req.url}`);

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).json({ ok: true });
    }

    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const path = url.pathname;

        // GET /api/tasks
        if (req.method === 'GET' && path === '/api/tasks') {
            const tasksList = await storage.getTasks();
            console.log(`[GET /api/tasks] Returning ${tasksList.length} tasks`);
            return res.status(200).json(tasksList);
        }

        // POST /api/tasks
        if (req.method === 'POST' && path === '/api/tasks') {
            console.log('[POST /api/tasks] Body:', req.body);

            if (!req.body.name || !req.body.name.trim()) {
                return res.status(400).json({ error: 'Task name is required' });
            }

            const taskData = {
                name: req.body.name,
                gravity: req.body.gravity || 3,
                urgency: req.body.urgency || 3,
                tendency: req.body.tendency || 3,
                sensitive: req.body.sensitive || false,
                labels: req.body.labels || null,
                notes: req.body.notes || null,
            };

            const newTask = await storage.createTask(taskData);
            console.log('[POST /api/tasks] Created task:', newTask.id);
            return res.status(200).json(newTask);
        }

        // PATCH /api/tasks/:id
        const patchMatch = path.match(/^\/api\/tasks\/(\d+)$/);
        if (req.method === 'PATCH' && patchMatch) {
            const id = parseInt(patchMatch[1]);
            console.log(`[PATCH /api/tasks/${id}]`, req.body);
            const updatedTask = await storage.updateTask(id, req.body);
            return res.status(200).json(updatedTask);
        }

        // DELETE /api/tasks/:id
        const deleteMatch = path.match(/^\/api\/tasks\/(\d+)$/);
        if (req.method === 'DELETE' && deleteMatch) {
            const id = parseInt(deleteMatch[1]);
            console.log(`[DELETE /api/tasks/${id}]`);
            await storage.deleteTask(id);
            return res.status(204).end();
        }

        // Route not found
        return res.status(404).json({ error: 'Route not found' });
    } catch (error) {
        console.error('[API ERROR]', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message,
        });
    }
}
