import fs from "fs";
import path from "path";
import http from "http";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viteBin = path.join(__dirname, "node_modules", "vite", "bin", "vite.js");

// If Vite is installed (e.g. in AI Studio or after npm install), use Vite
if (fs.existsSync(viteBin)) {
  const child = spawn(process.execPath, [viteBin, "--port=3000", "--host=0.0.0.0"], {
    stdio: "inherit",
    cwd: __dirname
  });
  child.on("exit", (code) => process.exit(code ?? 0));
} else {
  // Zero-dependency fallback HTTP server so `npm run dev` works on Windows/Mac/Linux even without `npm install`!
  const PORT = process.env.PORT || 3000;
  const MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
  };

  const server = http.createServer((req, res) => {
    const rawUrl = (req.url || "/").split("?")[0];
    const relPath = decodeURIComponent(rawUrl === "/" ? "/index.html" : rawUrl);

    // Try direct path first, then fallback to /public/... (for /images/*.jpg)
    const candidates = [
      path.join(__dirname, relPath),
      path.join(__dirname, "public", relPath)
    ];

    const filePath = candidates.find((p) => fs.existsSync(p) && fs.statSync(p).isFile());
    if (!filePath) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found: " + relPath);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(res);
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`\n  ☀️  Dress Sense Server running at: http://localhost:${PORT}\n`);
  });
}
