import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ✅ ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: express.Express) {
  // Vite build output path
  const distPath = path.resolve(__dirname, "../dist/public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `❌ Could not find build directory: ${distPath}\nRun build first!`
    );
  }

  // serve static files
  app.use(express.static(distPath));

  // ✅ Express v5 compatible SPA fallback
  app.get("/:path(*)", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
