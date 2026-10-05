// Minimal static server for local QA
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = "C:\\Users\\HP\\Desktop\\ChatZweb";
const PORT = 8321;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".ico": "image/x-icon",
};

http
  .createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p === "/" || p === "") p = "/index.html";
    let file = path.join(ROOT, p);
    if (!file.startsWith(ROOT)) {
      res.writeHead(403);
      return res.end();
    }
    // Clean URLs (matching Vercel's cleanUrls: true): /faq → faq.html
    if (!path.extname(file) && !fs.existsSync(file) && fs.existsSync(file + ".html")) {
      file += ".html";
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/html" });
        return res.end("<h1>404</h1><p><a href='/'>Home</a></p>");
      }
      res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
      res.end(data);
    });
  })
  .listen(PORT, () => console.log("Serving on http://localhost:" + PORT));
