import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema } from "@shared/schema";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve manifest.json with correct MIME type
  app.get("/manifest.json", (_req, res) => {
    res.setHeader("Content-Type", "application/manifest+json");
    res.sendFile(path.resolve(__dirname, "../client/public/manifest.json"));
  });

  // Serve service worker with correct MIME type
  app.get("/sw.js", (_req, res) => {
    res.setHeader("Content-Type", "application/javascript");
    res.sendFile(path.resolve(__dirname, "../dist/public/sw.js"));
  });

  app.get("/api/tasks", async (_req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    const result = insertTaskSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const task = await storage.createTask(result.data);
    res.json(task);
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const task = await storage.updateTask(id, req.body);
    res.json(task);
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteTask(id);
    res.status(204).end();
  });

  const httpServer = createServer(app);
  return httpServer;
}