// Minimal zero-dependency local host for the official http://void address.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const host = process.env.VOID_WEBSITE_HOST || "127.0.0.1";
const port = Number(process.env.VOID_WEBSITE_PORT || 80);
const root = path.resolve(__dirname, "dist");
const contentTypes = { ".css": "text/css; charset=utf-8", ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".exe": "application/octet-stream" };

function resolveRequestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, "http://void").pathname);
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const candidate = path.resolve(root, relativePath);
  return candidate === root || candidate.startsWith(`${root}${path.sep}`) ? candidate : null;
}

http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") { response.writeHead(405, { Allow: "GET, HEAD" }); response.end(); return; }
  const filePath = resolveRequestPath(request.url);
  if (!filePath) { response.writeHead(403); response.end(); return; }
  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) { response.writeHead(404); response.end("Not found"); return; }
    const extension = path.extname(filePath).toLowerCase();
    const headers = { "Content-Type": contentTypes[extension] || "application/octet-stream", "X-Content-Type-Options": "nosniff", "Cache-Control": extension === ".exe" ? "no-store" : "no-cache" };
    if (extension === ".exe") headers["Content-Disposition"] = "attachment; filename=VOID-Setup.exe";
    response.writeHead(200, headers);
    if (request.method === "HEAD") { response.end(); return; }
    fs.createReadStream(filePath).pipe(response);
  });
}).listen(port, host, () => console.log(`VOID website is available at http://VOID/ (http://${host}:${port}/)`));

