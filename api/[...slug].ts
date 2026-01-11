import express from "express";
import type { Request, Response } from "express";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import ws from "ws";

// Configure Neon
neonConfig.webSocketConstructor = ws;

// Define schema inline
const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  impact: integer("impact").notNull(),
  urgency: integer("urgency").notNull(),
  tendency: integer("tendency").notNull(),
  completed: boolean("completed").notNull().default(false),
  sensitive: boolean("sensitive").notNull().default(false),
  labels: text("labels").array(),
  notes: text("notes"),
});

// Initialize database connection
let db: ReturnType<typeof drizzle> | null = null;
if (process.env.DATABASE_URL) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool });
  console.log("[DB] Connected to Neon database");
} else {
  console.log("[DB] No DATABASE_URL found, will use in-memory storage");
}

// Storage implementation
class MemStorage {
  private tasks: Map<number, any> = new Map();
  private currentId: number = 1;

  async getTasks() {
    return Array.from(this.tasks.values());
  }

  async createTask(insertTask: any) {
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

  async updateTask(id: number, updates: any) {
    const task = this.tasks.get(id);
    if (!task) throw new Error(`Task with id ${id} not found`);
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number) {
    this.tasks.delete(id);
  }
}

class DbStorage {
  private db: ReturnType<typeof drizzle>;

  constructor(database: ReturnType<typeof drizzle>) {
    this.db = database;
  }

  async getTasks() {
    return await this.db.select().from(tasks);
  }

  async createTask(insertTask: any) {
    const [task] = await this.db.insert(tasks).values(insertTask).returning();
    return task;
  }

  async updateTask(id: number, updates: any) {
    const [task] = await this.db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
    if (!task) throw new Error(`Task with id ${id} not found`);
    return task;
  }

  async deleteTask(id: number) {
    await this.db.delete(tasks).where(eq(tasks.id, id));
  }
}

// Choose storage based on DATABASE_URL
const storage = db ? new DbStorage(db) : new MemStorage();

// Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let initPromise: Promise<void> | null = null;

async function init() {
  if (!initPromise) {
    initPromise = (async () => {
      console.log("[INIT] Registering routes...");
      console.log(`[INIT] Using ${db ? "DATABASE" : "IN-MEMORY"} storage`);

      // GET /api/tasks
      app.get("/api/tasks", async (_req, res) => {
        try {
          console.log("[GET /api/tasks] Called");
          const tasksList = await storage.getTasks();
          console.log(`[GET /api/tasks] Returning ${tasksList.length} tasks`);
          res.json(tasksList);
        } catch (error) {
          console.error("[GET /api/tasks] Error:", error);
          res.status(500).json({
            error: "Failed to get tasks",
            message: error instanceof Error ? error.message : String(error),
          });
        }
      });

      // POST /api/tasks
      app.post("/api/tasks", async (req, res) => {
        try {
          console.log("[POST /api/tasks] Raw body:", JSON.stringify(req.body));

          // Basic validation
          if (!req.body.name || !req.body.name.trim()) {
            return res.status(400).json({ error: "Task name is required" });
          }

          const taskData = {
            name: req.body.name,
            impact: req.body.impact || 3,
            urgency: req.body.urgency || 3,
            tendency: req.body.tendency || 3,
            sensitive: req.body.sensitive || false,
            labels: req.body.labels || null,
            notes: req.body.notes || null,
          };

          const newTask = await storage.createTask(taskData);
          console.log(
            "[POST /api/tasks] Created task:",
            JSON.stringify(newTask)
          );
          res.json(newTask);
        } catch (error) {
          console.error("[POST /api/tasks] Error:", error);
          res.status(500).json({
            error: "Failed to create task",
            message: error instanceof Error ? error.message : String(error),
          });
        }
      });

      // PATCH /api/tasks/:id
      app.patch("/api/tasks/:id", async (req, res) => {
        try {
          console.log("[PATCH /api/tasks/:id] Called");
          const id = parseInt(req.params.id);
          const updatedTask = await storage.updateTask(id, req.body);
          console.log("[PATCH /api/tasks/:id] Updated task");
          res.json(updatedTask);
        } catch (error) {
          console.error("[PATCH /api/tasks/:id] Error:", error);
          res.status(500).json({
            error: "Failed to update task",
            message: error instanceof Error ? error.message : String(error),
          });
        }
      });

      // DELETE /api/tasks/:id
      app.delete("/api/tasks/:id", async (req, res) => {
        try {
          console.log("[DELETE /api/tasks/:id] Called");
          const id = parseInt(req.params.id);
          await storage.deleteTask(id);
          console.log("[DELETE /api/tasks/:id] Deleted task", id);
          res.status(204).end();
        } catch (error) {
          console.error("[DELETE /api/tasks/:id] Error:", error);
          res.status(500).json({
            error: "Failed to delete task",
            message: error instanceof Error ? error.message : String(error),
          });
        }
      });

      console.log("[INIT] Routes registered successfully");

      // Error handler
      app.use((err: any, _req: Request, res: Response, _next: any) => {
        console.error("[ERROR HANDLER]", err);
        const status = err?.status || err?.statusCode || 500;
        const message = err?.message || "Internal Server Error";
        res.status(status).json({ message });
      });
    })();
  }
  return initPromise;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[HANDLER] ${req.method} ${req.url}`);

  try {
    await init();

    return new Promise<void>((resolve, reject) => {
      app(req as any, res as any, (err?: any) => {
        if (err) {
          console.error("[HANDLER] Error:", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    console.error("[HANDLER] Init error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
