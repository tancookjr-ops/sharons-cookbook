/* ==================================================================
   auth.js — myCookbook local user database. Everything stays on the
   device: users + per-user app data live in localStorage. No network.

   Keys:
     mycookbook-users            [{username, email, hash, created}]
     mycookbook-session          {username, email}
     mycookbook-data:<email>     that user's whole app state
   The pre-account save (sharons-cookbook-v1) migrates into Sharon's
   account the first time this file runs.
   ================================================================== */
(function () {
  const USERS_KEY = 'mycookbook-users';
  const SESSION_KEY = 'mycookbook-session';
  const LEGACY_KEY = 'sharons-cookbook-v1';
  const SHARON = { username: 'Sharon', email: 'sharon.andrew@gmail.com' };

  async function hash(email, password) {
    const msg = email.toLowerCase() + '::' + password;
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
    }
    /* insecure-context fallback (plain http) — djb2 */
    let h = 5381;
    for (let i = 0; i < msg.length; i++) h = ((h << 5) + h + msg.charCodeAt(i)) >>> 0;
    return 'djb2_' + h.toString(16);
  }

  function users() { try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch (e) { return []; } }
  function saveUsers(u) { try { localStorage.setItem(USERS_KEY, JSON.stringify(u)); } catch (e) {} }

  const CBAuth = {
    dataKey(email) { return 'mycookbook-data:' + String(email).toLowerCase(); },
    session() { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { return null; } },
    setSession(u) { try { localStorage.setItem(SESSION_KEY, JSON.stringify({ username: u.username, email: u.email })); } catch (e) {} },
    clearSession() { try { localStorage.removeItem(SESSION_KEY); } catch (e) {} },
    isSharon(email) { return String(email).toLowerCase() === SHARON.email; },

    /* Seed Sharon's account + migrate her pre-account data. */
    async init() {
      const u = users();
      if (!u.some((x) => x.email === SHARON.email)) {
        u.push({ username: SHARON.username, email: SHARON.email, hash: await hash(SHARON.email, 'Violet!2026'), created: new Date().toISOString() });
        saveUsers(u);
      }
      try {
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy && !localStorage.getItem(this.dataKey(SHARON.email))) {
          localStorage.setItem(this.dataKey(SHARON.email), legacy);
        }
      } catch (e) {}
    },

    async create(username, email, password) {
      username = String(username || '').trim();
      email = String(email || '').trim().toLowerCase();
      if (!username) throw new Error('Pick a name \u2014 it becomes \u201c\u2026\u2019s Cookbook\u201d');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('That email address doesn\u2019t look right');
      if (String(password || '').length < 6) throw new Error('Password needs at least 6 characters');
      const u = users();
      if (u.some((x) => x.email === email)) throw new Error('An account already exists for that email');
      const rec = { username, email, hash: await hash(email, password), created: new Date().toISOString() };
      u.push(rec); saveUsers(u);
      return { username, email };
    },

    /* id = email or username (case-insensitive) */
    async verify(id, password) {
      await this.init();
      id = String(id || '').trim().toLowerCase();
      const rec = users().find((x) => x.email === id || x.username.toLowerCase() === id);
      if (!rec) return null;
      return (await hash(rec.email, password)) === rec.hash ? { username: rec.username, email: rec.email } : null;
    },

    /* Standard starter collection for new accounts: 5 breakfasts, 5
       lunches, 5 dinners, 5 desserts, 5 snacks from the core library. */
    starterRecipes() {
      const all = (window.CookbookData && window.CookbookData.recipes) || [];
      const taken = new Set();
      const pick = (pred) => {
        const out = [];
        for (const r of all) {
          if (out.length >= 5) break;
          if (taken.has(r.recipeId) || !pred(r)) continue;
          taken.add(r.recipeId); out.push(r);
        }
        return out;
      };
      const sets = [
        pick((r) => r.mealType === 'Breakfast'),
        pick((r) => r.mealType === 'Lunch'),
        pick((r) => r.mealType === 'Dinner'),
        pick((r) => r.mealType === 'Dessert' || /dessert/i.test(r.category || '') || (r.tags || []).includes('dessert')),
        pick((r) => r.mealType === 'Snack'),
      ];
      return JSON.parse(JSON.stringify([].concat.apply([], sets))).map((r) => ({ ...r, favourite: false }));
    },
  };

  window.CBAuth = CBAuth;
  CBAuth.init();
})();
