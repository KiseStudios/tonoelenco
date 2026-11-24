import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";

const root = resolve(process.env.ELENCO_EXPORT_DIR ?? "out");
const port = Number(process.env.ELENCO_QA_PORT ?? "4173");
const contentTypes = {
  ".css": "text/css",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

async function isFile(path) {
  return (await stat(path).catch(() => null))?.isFile() ?? false;
}

createServer(async (request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch {
    response.writeHead(400).end();
    return;
  }

  const candidate = resolve(root, "." + pathname);
  if (candidate !== root && !candidate.startsWith(root + sep)) {
    response.writeHead(404).end();
    return;
  }

  // Match the clean route URLs served by Cloudflare Pages, including HEAD from Next prefetch.
  let path = pathname === "/" ? resolve(root, "index.html") : candidate;
  if (!(await isFile(path)) && !extname(path)) path += ".html";
  const found = await isFile(path);
  if (!found) path = resolve(root, "404.html");
  if (!(await isFile(path))) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(found ? 200 : 404, {
    "Content-Type": contentTypes[extname(path)] ?? "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
  });
  if (request.method === "HEAD") response.end();
  else createReadStream(path).pipe(response);
}).listen(port, "127.0.0.1");
