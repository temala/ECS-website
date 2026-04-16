import { cpSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const dist = resolve(root, "dist");

const items = [
  // HTML pages
  "index.html",
  "about.html",
  "services.html",
  "contact.html",
  "devis.html",
  // Directories
  "css",
  "assets",
  // Config
  "staticwebapp.config.json",
];

for (const item of items) {
  const src = resolve(root, item);
  if (!existsSync(src)) {
    console.warn(`  skip (not found): ${item}`);
    continue;
  }
  const dest = resolve(dist, item);
  cpSync(src, dest, { recursive: true });
  console.log(`  copied: ${item}`);
}

// Copy only js/main.js (not the JSX source)
const jsSrc = resolve(root, "js", "main.js");
const jsDest = resolve(dist, "js", "main.js");
if (existsSync(jsSrc)) {
  cpSync(jsSrc, jsDest, { recursive: true });
  console.log("  copied: js/main.js");
}

console.log("Static files copied to dist/");
