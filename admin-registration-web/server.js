const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.ADMIN_PORTAL_PORT || 3100);
const indexPath = path.join(__dirname, "index.html");

http
  .createServer((req, res) => {
    if (req.url === "/" || req.url === "/index.html") {
      const html = fs.readFileSync(indexPath, "utf8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  })
  .listen(port, () => {
    console.log(`Admin registration portal running on http://localhost:${port}`);
  });
