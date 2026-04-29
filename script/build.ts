import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile } from "fs/promises";

const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("🔨 building client...");
  await viteBuild();

  console.log("🔨 building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));

  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];

  const externals = allDeps;

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,

    // ✅ FIX: ESM output
    format: "esm",
    outfile: "dist/index.js",

    target: "node20",

    define: {
      "process.env.NODE_ENV": '"production"',
    },

    external: externals,
    logLevel: "info",
  });

  console.log("✅ Build complete: dist/index.js ready");
}

buildAll().catch((err) => {
  console.error("❌ Build failed:", err);
  process.exit(1);
});
