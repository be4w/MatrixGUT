import express from "express";
import type { Request, Response } from "express";
import { registerRoutes } from "../server/routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize routes once and reuse the same app for all invocations
let initPromise: Promise<void> | null = null;
async function init() {
  if (!initPromise) {
    initPromise = (async () => {
      // registerRoutes configures the Express `app` with all routes
      await registerRoutes(app as any);

      // simple error handler copied from server/index.ts
      app.use((err: any, _req: Request, res: Response, _next: any) => {
        const status = err?.status || err?.statusCode || 500;
        const message = err?.message || "Internal Server Error";
        res.status(status).json({ message });
        throw err;
      });
    })();
  }
  return initPromise;
}

export default async function handler(req: Request, res: Response) {
  await init();
  return app(req, res as any);
}
