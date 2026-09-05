// Prosty serwer podglądu dla Green Forest — zero zależności.
// Uruchom: node server.js   (albo kliknij start-preview.cmd)
// Serwuje folder ./public na http://localhost:8080 z obsługą "ładnych" adresów
// (np. /wycinka-drzew/ -> /wycinka-drzew/index.html).

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "public");
const PORT = process.env.PORT || 8080;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function resolveFile(urlPath) {
  // odetnij query/hash, zdekoduj, zablokuj wyjście poza ROOT
  let p = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  let full = path.normalize(path.join(ROOT, p));
  if (!full.startsWith(ROOT)) return null; // ochrona przed path traversal

  try {
    const st = fs.statSync(full);
    if (st.isDirectory()) full = path.join(full, "index.html");
  } catch (_) {
    // brak pliku/katalogu — spróbuj p + ".html", potem p + "/index.html"
    if (fs.existsSync(full + ".html")) full = full + ".html";
    else if (fs.existsSync(path.join(full, "index.html"))) full = path.join(full, "index.html");
  }
  return full;
}

const server = http.createServer((req, res) => {
  const file = resolveFile(req.url);
  if (!file || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    // 404 -> pokaż stronę główną z komunikatem, żeby podgląd nie "umierał"
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end('<h1>404 — nie znaleziono</h1><p><a href="/">Wróć na stronę główną</a></p>');
    console.log("404", req.url);
    return;
  }
  const ext = path.extname(file).toLowerCase();
  const type = TYPES[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-cache" });
  fs.createReadStream(file).pipe(res);
  console.log("200", req.url, "->", path.relative(ROOT, file));
});

server.listen(PORT, () => {
  console.log("\n  Green Forest — serwer podglądu");
  console.log("  ---------------------------------");
  console.log("  Otwórz w przeglądarce:  http://localhost:" + PORT);
  console.log("  Zatrzymaj:              Ctrl+C\n");
});
