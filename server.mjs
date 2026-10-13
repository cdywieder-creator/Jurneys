import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleApi } from './server/api.mjs';

const root = resolve(fileURLToPath(new URL('./dist', import.meta.url)));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.json': 'application/json', '.woff2': 'font/woff2' };
createServer(async (req, res) => {
  try {
    if (await handleApi(req, res)) return;
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); res.end(); return; }
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = resolve(root, `.${path}`);
    if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403); res.end(); return; }
    if (path === '/') file = resolve(root, 'index.html');
    try { if (!(await stat(file)).isFile()) throw new Error('Not a file'); } catch { res.writeHead(404); res.end('Not found'); return; }
    const contents = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin' });
    res.end(req.method === 'HEAD' ? undefined : contents);
  } catch { if (!res.headersSent) res.writeHead(500); res.end('Request failed'); }
}).listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log('Journeys production server started'));
