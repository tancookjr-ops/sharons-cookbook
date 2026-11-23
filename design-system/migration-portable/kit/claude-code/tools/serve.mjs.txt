// Static server for the design-system folder (the parent of tools/). No build step, no cache.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, normalize, extname, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MIME = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.jsx':'text/plain; charset=utf-8','.tsx':'text/plain; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.webp':'image/webp','.ico':'image/x-icon','.pdf':'application/pdf','.woff':'font/woff','.woff2':'font/woff2'};

export function serve(port = 4173, root = ROOT) {
  const srv = http.createServer(async (req, res) => {
    try {
      const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let f = normalize(join(root, p));
      if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
      let s = await stat(f).catch(() => null);
      if (s && s.isDirectory()) { f = join(f, 'index.html'); s = await stat(f).catch(() => null); }
      if (!s) { res.writeHead(404); return res.end('404 ' + p); }
      res.writeHead(200, { 'content-type': MIME[extname(f).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
      res.end(await readFile(f));
    } catch (e) { res.writeHead(500); res.end(String(e)); }
  });
  return new Promise(r => srv.listen(port, () => r(srv)));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || 4173;
  serve(port).then(() => console.log(`serving ${ROOT} at http://localhost:${port}/  (gallery: /gallery.html)`));
}
