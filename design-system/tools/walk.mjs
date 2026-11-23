// Shared tree walk + @dsCard parsing. SKIP = folders that hold history/payloads, never DS sources.
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

export const SKIP = new Set(['node_modules', '.git', 'tools', 'export', 'exports', 'github-staging', 'scraps', 'scratch', 'screenshots', 'uploads', 'locker', 'MIGRATE', 'migration', 'migration-portable']);

export function walk(dir, root, out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    const s = statSync(p);
    if (s.isDirectory()) { if (!SKIP.has(n)) walk(p, root, out); }
    else out.push(relative(root, p).split(sep).join('/'));
  }
  return out;
}

export function firstLine(abs) { return readFileSync(abs, 'utf8').split(/\r?\n/, 1)[0]; }

export function parseCard(line) {
  if (!/^\s*<!--\s*@dsCard\b/.test(line)) return null;
  const a = {};
  for (const m of line.matchAll(/(\w+)="([^"]*)"/g)) a[m[1]] = m[2];
  const vp = /^(\d+)x(\d+)$/.exec(a.viewport || '');
  return { group: a.group, name: a.name, subtitle: a.subtitle || '', viewport: vp ? { width: +vp[1], height: +vp[2] } : null, raw: a };
}

export const CONFIG = (() => { try { return JSON.parse(readFileSync(new URL('./ds.config.json', import.meta.url), 'utf8')); } catch { return {}; } })();
