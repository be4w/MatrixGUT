import { createRoot } from "react-dom/client";
import { Workbox } from "workbox-window";
import App from "./App";
import "./index.css";

// Register service worker for PWA support
if ("serviceWorker" in navigator) {
  const wb = new Workbox("/sw.js");
  wb.register().catch((error) => {
    console.error("Service worker registration failed:", error);
  });
}

createRoot(document.getElementById("root")!).render(<App />);
