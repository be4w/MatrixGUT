import { setupApp } from "../server/app";

// Vercel Serverless Function Adapter
// This file initializes the Express app and exposes it as a handler
export default async function handler(req: any, res: any) {
    const { app } = await setupApp();

    // Vercel handles the request/response using the Express app
    app(req, res);
}
