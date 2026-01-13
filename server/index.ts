import "dotenv/config";
import { setupApp } from "./app";
import { log } from "./vite";

(async () => {
  const { server } = await setupApp();

  const port = parseInt(process.env.PORT || "5000", 10);
  const host = "0.0.0.0";

  server.listen(port, host, () => {
    log(`serving on port ${port}`);
  });
})();
