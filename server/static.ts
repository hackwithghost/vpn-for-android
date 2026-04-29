import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: express.Express) {
  const distPath = path.resolve(__dirname, "../dist/public");

  if (!fs.existsSync(distPath)) {
    throw new Error(`❌ Build folder not found: ${distPath}`);
  }

  // static files
  app.use(express.static(distPath));

  // ✅ FINAL FIX (no path-to-regexp issue)
  app.use((req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
