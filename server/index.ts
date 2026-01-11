import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { db } from "./db";
import { migrate } from "drizzle-orm/node-postgres/migrator";

// Necessário para __dirname no ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: any, res: any, _next: any) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // Migrations
  if (db) {
    await migrate(db, { migrationsFolder: "migrations" });
    console.log("Migrations applied successfully");
  } else {
    console.log("Running in-memory mode (no database). Migrations skipped.");
  }

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // PRODUCTION: serve arquivos estáticos do Vite
    serveStatic(app);

    // CATCH-ALL ROUTE – ESSA É A LINHA MÁGICA QUE ELIMINA O 404 no Vercel
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../dist/public/index.html"));
    });
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  const host = "0.0.0.0";

  server.listen(port, host, () => {
    log(`serving on port ${port}`);
  });
})();
