// Replaces check_design_system. Exit 1 on any error. Writes ../gallery.html (the Design System tab).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, posix } from 'node:path';
import { ROOT } from './serve.mjs';
import { walk, firstLine, parseCard, CONFIG } from './walk.mjs';

const files = walk(ROOT, ROOT);
const errors = [], warns = [];
const abs = p => join(ROOT, p);

// 1. components: PascalCase .d.ts needs a sibling .jsx/.tsx, and its folder needs a @dsCard html
const comps = [];
for (const f of files.filter(f => /(^|\/)[A-Z][A-Za-z0-9]*\.d\.ts$/.test(f))) {
  const base = f.replace(/\.d\.ts$/, '');
  const src = ['.jsx', '.tsx'].map(e => base + e).find(p => existsSync(abs(p)));
  if (!src) errors.push(`orphan .d.ts (no sibling .jsx/.tsx): ${f}`); else comps.push(src);
  const dir = posix.dirname(f);
  if (!files.some(f2 => posix.dirname(f2) === dir && f2.endsWith('.html') && parseCard(firstLine(abs(f2)))))
    errors.push(`component folder has no @dsCard thumbnail html: ${dir}`);
}

// 2. @dsCard cards: first line only, required attrs, no raw .jsx script
const cards = [];
for (const f of files.filter(f => f.endsWith('.html') && !f.startsWith('templates/'))) {
  const body = readFileSync(abs(f), 'utf8');
  const card = parseCard(body.split(/\r?\n/, 1)[0]);
  if (!card) { if (/@dsCard/.test(body.slice(0, 2000))) errors.push(`@dsCard not on line 1: ${f}`); continue; }
  for (const k of ['group', 'name']) if (!card[k]) errors.push(`@dsCard missing ${k}: ${f}`);
  if (!card.viewport) errors.push(`@dsCard viewport must be WxH: ${f}`);
  if (/<script[^>]+src="[^"]+\.(jsx|tsx)"/.test(body)) errors.push(`card loads raw .jsx/.tsx (use _ds_bundle.js): ${f}`);
  cards.push({ path: f, ...card });
}

// 3. global stylesheet @import closure resolves
const entry = ['styles.css', 'index.css', 'globals.css', 'global.css', 'main.css', 'theme.css', 'tokens.css'].find(p => existsSync(abs(p)));
const seen = new Set();
if (entry) (function imports(rel) {
  if (seen.has(rel)) return; seen.add(rel);
  if (!existsSync(abs(rel))) { errors.push(`@import target missing: ${rel}`); return; }
  for (const m of readFileSync(abs(rel), 'utf8').matchAll(/@import\s+(?:url\()?["']([^"')]+)["']\)?/g)) {
    if (/^(https?:)?\/\//.test(m[1])) continue;
    imports(posix.normalize(posix.join(posix.dirname(rel), m[1])));
  }
})(entry);

// 4. every local src/href in every html resolves
let refs = 0;
for (const f of files.filter(f => f.endsWith('.html'))) {
  const body = readFileSync(abs(f), 'utf8');
  for (const m of body.matchAll(/\s(?:src|href)="([^"]+)"/g)) {
    const u = m[1];
    if (/^(https?:|data:|mailto:|tel:|javascript:|blob:|#|\/\/)/.test(u) || u.includes('{{') || u.includes('${')) continue;
    refs++;
    const clean = decodeURIComponent(u.split(/[?#]/)[0]);
    if (!clean) continue;
    const target = clean.startsWith('/') ? clean.slice(1) : posix.normalize(posix.join(posix.dirname(f), clean));
    if (!existsSync(abs(target))) errors.push(`missing ref in ${f}: ${u}`);
  }
}

// 5. templates carry @template and their runtime
for (const f of files.filter(f => /^templates\/[^/]+\/[^/]+\.dc\.html$/.test(f))) {
  if (!/@template\s+name="/.test(readFileSync(abs(f), 'utf8'))) errors.push(`template missing @template comment: ${f}`);
  if (!existsSync(abs(posix.dirname(f) + '/support.js'))) errors.push(`template missing support.js: ${f}`);
}

// 6. gallery.html — the Design System tab, grouped verbatim by `group`
const groups = {};
for (const c of cards) (groups[c.group || '(none)'] ||= []).push(c);
const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const title = esc(CONFIG.name || 'Design System');
const gallery = `<!doctype html><html><head><meta charset="utf-8"><meta name="color-scheme" content="light"><title>${title} — Design System</title>${entry ? `<link rel="stylesheet" href="${entry}">` : ''}<style>body{margin:0;padding:32px;background:#f3f2ef;color:#1d1d1d}h2{margin:40px 0 12px}.g{display:flex;flex-wrap:wrap;gap:24px}figure{margin:0;display:flex;flex-direction:column;gap:6px}iframe{border:1px solid #ccc;border-radius:4px;background:#fff}figcaption{font-size:13px}</style></head><body><h1>${title} — ${cards.length} cards</h1>${Object.entries(groups).map(([g, cs]) => `<h2>${esc(g)}</h2><div class="g">${cs.map(c => { const w = c.viewport?.width || 800, h = c.viewport?.height || 600, s = Math.min(1, 520 / w); return `<figure><div style="width:${Math.round(w * s)}px;height:${Math.round(h * s)}px;overflow:hidden"><iframe src="${esc(encodeURI(c.path))}" loading="lazy" style="width:${w}px;height:${h}px;transform:scale(${s});transform-origin:0 0"></iframe></div><figcaption><b>${esc(c.name)}</b> — ${esc(c.subtitle)} · <a href="${esc(encodeURI(c.path))}">${esc(c.path)}</a></figcaption></figure>`; }).join('')}</div>`).join('')}</body></html>`;
writeFileSync(abs('gallery.html'), gallery);

console.log(`components: ${comps.length} · cards: ${cards.length} · css files: ${seen.size} · local refs: ${refs}`);
for (const w of warns) console.log('warn  ' + w);
for (const e of errors) console.log('ERROR ' + e);
console.log(`${errors.length} errors, ${warns.length} warnings · gallery.html written`);
process.exit(errors.length ? 1 : 0);
