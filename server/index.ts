import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { db } from "./db";  // Import your db connection
import { migrate } from "drizzle-orm/node-postgres/migrator";  // For Neon/Postgres migrations

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

  // Run migrations to create tables (fix 'relation does not exist')
  await migrate(db, { migrationsFolder: "migrations" });
  console.log("Migrations applied successfully");

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Existing listen (port is correct)
  const port = parseInt(process.env.PORT || '5000', 10);
  const host = '0.0.0.0';

  server.listen(port, host, () => {
    log(`serving on port ${port}`);
  });
})();
