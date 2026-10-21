// Zero-dependency local preview server: `node scripts/serve.mjs` then open http://localhost:8080
// Mirrors GitHub Pages behaviour: /path/ serves /path/index.html, unknown paths serve 404.html.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT) || 8080;
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json',
};

async function resolve(urlPath) {
  const safe = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[\/])+/, '');
  let file = join(root, safe);
  if (!file.startsWith(root)) return null;
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    await stat(file);
    return file;
  } catch { return null; }
}

createServer(async (req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  if (!path.endsWith('/') && !extname(path) && (await resolve(path + '/'))) {
    res.writeHead(301, { Location: path + '/' }); return res.end();
  }
  const file = await resolve(path);
  const target = file ?? join(root, '404.html');
  res.writeHead(file ? 200 : 404, { 'Content-Type': types[extname(target)] ?? 'application/octet-stream' });
  res.end(await readFile(target));
}).listen(port, () => console.log(`WHC website preview: http://localhost:${port}`));
