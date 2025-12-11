import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  console.log("[HEALTH] Request received");
  res.status(200).json({
    ok: true,
    time: Date.now(),
    url: req.url,
    method: req.method,
  });
}
