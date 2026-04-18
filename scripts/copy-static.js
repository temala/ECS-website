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

// Copy vanilla JS files (not the JSX source)
for (const jsFile of ["main.js", "chatbot.js"]) {
  const jsSrc = resolve(root, "js", jsFile);
  const jsDest = resolve(dist, "js", jsFile);
  if (existsSync(jsSrc)) {
    cpSync(jsSrc, jsDest, { recursive: true });
    console.log(`  copied: js/${jsFile}`);
  }
}

console.log("Static files copied to dist/");
