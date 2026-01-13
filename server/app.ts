import express from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { db } from "./db";
import { migrate } from "drizzle-orm/node-postgres/migrator";

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

// Setup function to initialize routes and middleware
// We return the app so it can be used by both the local server and Vercel
export async function setupApp() {
    const server = await registerRoutes(app);

    app.use((err: any, _req: any, res: any, _next: any) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        res.status(status).json({ message });
        throw err;
    });

    // Migrations
    if (db) {
        // PERFOMANCE FIX: In Vercel (Serverless), we DO NOT want to block startup with migrations.
        // It causes timeouts on cold starts. We use `npm run db:push` for updates.
        console.log("[DEBUG] Database connected. Skipping runtime migration to prevent hanging.");
        // try {
        //     await migrate(db, { migrationsFolder: "migrations" });
        //     console.log("Migrations applied successfully");
        // } catch (e) {
        //     console.error("Migration failed:", e);
        // }
    } else {
        console.log("Running in-memory mode (no database). Migrations skipped.");
    }

    if (process.env.NODE_ENV !== "production") {
        await setupVite(app, server);
    } else {
        // PRODUCTION: serve static files
        serveStatic(app);
    }

    return { app, server };
}
