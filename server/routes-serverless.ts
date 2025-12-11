import type { Express } from "express";
import { insertTaskSchema } from "@shared/schema";

export async function registerRoutesServerless(app: Express): Promise<void> {
  // API Routes
  app.get("/api/tasks", async (_req, res) => {
    try {
      console.log("[GET /api/tasks] Called");

      // Temporariamente retornar dados mockados para testar
      // Depois vamos conectar com o storage
      const mockTasks = [
        {
          id: 1,
          title: "Test Task",
          urgency: 5,
          importance: 5,
          completed: false,
        },
      ];

      console.log("[GET /api/tasks] Returning mock data");
      res.json(mockTasks);
    } catch (error) {
      console.error("[GET /api/tasks] Error:", error);
      res.status(500).json({
        error: "Failed to get tasks",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      console.log("[POST /api/tasks] Called with body:", req.body);
      const result = insertTaskSchema.safeParse(req.body);
      if (!result.success) {
        console.log("[POST /api/tasks] Validation failed:", result.error);
        return res.status(400).json({ error: result.error });
      }

      // Mock response
      const mockTask = { id: Date.now(), ...result.data, completed: false };
      console.log("[POST /api/tasks] Returning mock task");
      res.json(mockTask);
    } catch (error) {
      console.error("[POST /api/tasks] Error:", error);
      res.status(500).json({
        error: "Failed to create task",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      console.log("[PATCH /api/tasks/:id] Called");
      const id = parseInt(req.params.id);
      const mockTask = { id, ...req.body };
      console.log("[PATCH /api/tasks/:id] Returning mock task");
      res.json(mockTask);
    } catch (error) {
      console.error("[PATCH /api/tasks/:id] Error:", error);
      res.status(500).json({
        error: "Failed to update task",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      console.log("[DELETE /api/tasks/:id] Called");
      const id = parseInt(req.params.id);
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
}
