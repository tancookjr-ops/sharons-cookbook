/* ==================================================================
   app.jsx — the Sharon's Cookbook shell: topbar, sidebar nav, router
   outlet, theme + toast state. Ties the screens together into an
   interactive click-through.
   ================================================================== */

const NAV = [
  { id: 'dashboard', icon: '◐', label: 'Dashboard' },
  { id: 'recipes', icon: '✎', label: 'Recipes' },
  { id: 'planner', icon: '▦', label: 'Meal planner' },
  { id: 'pantry', icon: '▤', label: 'Pantry' },
  { id: 'shopping', icon: '☰', label: 'Household shopping' },
  { id: 'botanicals', icon: '✦', label: 'Tancook Botanicals' },
  { id: 'garden', icon: '❀', label: 'Garden' },
  { sep: true },
  { id: 'import', icon: '⇪', label: 'Imports' },
  { id: 'settings', icon: '⚙', label: 'Settings' },
];

const SEED_STORES = ['Costco', 'Costco online', 'Costco Instacart', 'PC Independent', 'Fresh Cuts', 'No Frills', "Sobey's", 'Walmart', 'Canadian Tire', "Gateway's", "Pete's Fruitique", 'NSLC'];

/* On-device persistence: each account's whole working state saves to its
   own localStorage key, so hosted app updates never touch anyone's data. */
function loadSaved(key) {
  try { return JSON.parse(localStorage.getItem(key)) || null; } catch (e) { return null; }
}

function App({ user, onSignOut }) {
  const D = window.CookbookData;
  const SAVE_KEY = window.CBAuth.dataKey(user.email);
  const isOwner = window.CBAuth.isSharon(user.email);   /* Sharon keeps the original full collection */
  const saved = React.useMemo(() => loadSaved(SAVE_KEY), [SAVE_KEY]);
  const [route, setRoute] = React.useState({ name: 'dashboard' });
  const [stack, setStack] = React.useState([]);   /* back history of routes */
  const [theme, setTheme] = React.useState(saved && saved.theme ? saved.theme : 'light');
  const [navOpen, setNavOpen] = React.useState(false);
  const [sideCollapsed, setSideCollapsed] = React.useState(true);
  const [recipes, setRecipes] = React.useState(saved && saved.recipes ? saved.recipes : (isOwner ? D.recipes : window.CBAuth.starterRecipes()));
  const [household, setHousehold] = React.useState(saved && saved.household ? saved.household : (isOwner ? D.household : []));
  const [botanicals, setBotanicals] = React.useState(saved && saved.botanicals ? saved.botanicals : (isOwner ? D.botanicals : []));
  const [plans, setPlans] = React.useState(() => (saved && saved.plans ? saved.plans : (isOwner ? D.plans.map((p, i) => ({ ...p, planId: 'pl' + i, date: isoAdd('2026-07-06', p.day) })) : [])));
  const [pantry, setPantry] = React.useState(saved && saved.pantry ? saved.pantry : (isOwner ? D.pantry : []));
  const [measure, setMeasure] = React.useState(saved && saved.measure ? saved.measure : { system: 'metric', form: 'volume' });  /* global default */
  const [stores, setStores] = React.useState(saved && saved.stores ? saved.stores : SEED_STORES);
  const [keepAwake, setKeepAwake] = React.useState(saved ? !!saved.keepAwake : false);
  /* Editable specific-gravity table — the source of truth for all
     volume ↔ weight conversion. Seeded from units.js. */
  const [densities, setDensities] = React.useState(() => (saved && saved.densities ? saved.densities : window.ING_DENSITY.map(([key, sg, packed]) => ({ key, sg, packed: packed != null ? packed : null }))));
  window.DENSITY_TABLE = densities;   /* published synchronously so this render's conversions use it */

  /* Debounced save of everything above. */
  React.useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem(SAVE_KEY, JSON.stringify({ theme, recipes, household, botanicals, plans, pantry, measure, stores, keepAwake, densities })); } catch (e) {}
    }, 400);
    return () => clearTimeout(t);
  }, [theme, recipes, household, botanicals, plans, pantry, measure, stores, keepAwake, densities]);
  function eraseAll() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
    window.location.reload();
  }

  /* Every pantry ingredient gets a density entry automatically; unknown
     values stay blank until filled in under Settings. */
  React.useEffect(() => {
    const missing = pantry.filter((p) => {
      const n = norm(p.name);
      return !densities.some((d) => n.indexOf(d.key) !== -1);
    }).map((p) => ({ key: norm(p.name), sg: null }));
    if (missing.length) setDensities((ds) => [...ds, ...missing]);
  }, [pantry]);
  const [toast, setToast] = React.useState(null);
  const toastTimer = React.useRef(null);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  React.useEffect(() => { document.title = user.username + '’s Cookbook · myCookbook'; }, [user]);

  /* Screen wake lock: while enabled, ask the browser to keep the screen
     on; re-acquire whenever the app returns to the foreground. */
  React.useEffect(() => {
    if (!keepAwake) return;
    if (!('wakeLock' in navigator)) { showToast('Keep-awake isn\u2019t supported by this browser', 'error'); return; }
    let lock = null, released = false;
    const acquire = () => navigator.wakeLock.request('screen').then((l) => { if (released) l.release(); else lock = l; }).catch(() => {});
    acquire();
    const onVis = () => { if (document.visibilityState === 'visible') acquire(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { released = true; document.removeEventListener('visibilitychange', onVis); if (lock) lock.release().catch(() => {}); };
  }, [keepAwake]);

  /* Navigation with history: every move pushes the previous route, and
     goBack() also answers the browser / Android back gesture. */
  const routeRef = React.useRef(route);
  routeRef.current = route;
  function navigate(next) {
    setStack((s) => [...s.slice(-49), routeRef.current]);
    setRoute(next); setNavOpen(false); window.scrollTo({ top: 0 });
    try { window.history.pushState({ cb: true }, ''); } catch (e) {}
  }
  const goBack = React.useCallback(() => {
    setStack((s) => {
      if (!s.length) return s;
      setRoute(s[s.length - 1]);
      window.scrollTo({ top: 0 });
      return s.slice(0, -1);
    });
    setNavOpen(false);
  }, []);
  React.useEffect(() => {
    const onPop = () => goBack();
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [goBack]);

  function go(name) { navigate({ name }); }
  function openRecipe(id) { navigate({ name: 'recipe', id }); }
  function showToast(msg, tone = 'success') {
    setToast({ msg, tone });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }
  function toggleFav(id) {
    setRecipes((rs) => rs.map((r) => (r.recipeId === id ? { ...r, favourite: !r.favourite } : r)));
    const r = recipes.find((x) => x.recipeId === id);
    showToast(r && r.favourite ? 'Removed from favourites' : 'Added to favourites');
  }
  function updateRecipeIngredients(id, ingredients) {
    setRecipes((rs) => rs.map((r) => (r.recipeId === id ? { ...r, ingredients } : r)));
    showToast('Adjustment saved — all amounts now calculate from the new figures');
  }
  function updateRecipe(id, patch) {
    setRecipes((rs) => rs.map((r) => (r.recipeId === id ? { ...r, ...patch } : r)));
    showToast('Recipe saved');
  }
  function toggleShop(system, name) {
    const setter = system === 'household' ? setHousehold : setBotanicals;
    setter((list) => list.map((it) => (it.name === name ? { ...it, checked: !it.checked } : it)));
  }
  function addGroceries(items) {
    let added = 0;
    setHousehold((list) => {
      const have = new Set(list.map((i) => norm(i.name)));
      const fresh = items.filter((i) => !have.has(norm(i.name)));
      added = fresh.length;
      return [...list, ...fresh.map((i) => {
        const pm = findPantryMatch(pantry, i.name);
        return {
          name: i.name, category: 'From meal plan', quantity: i.amount, unit: i.unit,
          checked: false, store: pm && pm.store ? pm.store : undefined,
          notes: i.pantry ? '[PANTRY] ' + i.pantryNote : (i.notes || ''),
        };
      })];
    });
    showToast(added + ' item' + (added === 1 ? '' : 's') + ' added to Household shopping' + (items.length - added ? ' (' + (items.length - added) + ' already on the list)' : ''));
  }

  const activeNav = route.name === 'recipe' ? 'recipes' : route.name;

  function updatePantryItem(name, patch) {
    setPantry((list) => list.map((it) => (it.name === name ? { ...it, ...patch, quantity: patch.quantity != null ? Math.max(0, patch.quantity) : it.quantity } : it)));
  }
  function deletePantryItem(name) {
    setPantry((list) => list.filter((it) => it.name !== name));
    showToast(name + ' removed from pantry');
  }
  /* "I ate this": deduct the meal's scaled ingredients from pantry stock.
     Units are converted where trivial (kg↔g, l↔ml); unmatched units or
     missing items are reported, never guessed. Quantities clamp at 0. */
  function consumeMeal(plan) {
    const r = recipes.find((x) => x.recipeId === plan.recipeId);
    if (!r) return;
    const factor = plan.servings / (r.servings || 1);
    let deducted = 0, skipped = 0;
    /* Compute the next pantry (and the counts) synchronously so the toast
       reports real numbers — a setState updater runs after showToast would. */
    const next = pantry.map((it) => ({ ...it }));
    for (const ing of (r.ingredients || [])) {
      if (ing.amount == null) { skipped++; continue; }
      const m = findPantryMatch(next, ing.name);
      if (!m) { skipped++; continue; }
      let amt = ing.amount * factor;
      const iu = norm(ing.unit), pu = norm(m.unit);
      if (iu !== pu) {
        if (iu === 'g' && pu === 'kg') amt /= 1000;
        else if (iu === 'kg' && pu === 'g') amt *= 1000;
        else if (iu === 'ml' && pu === 'l') amt /= 1000;
        else if (iu === 'l' && pu === 'ml') amt *= 1000;
        else { skipped++; continue; }
      }
      m.quantity = Math.max(0, Math.round((m.quantity - amt) * 100) / 100);
      deducted++;
    }
    setPantry(next);
    setPlans((ps) => ps.map((p) => (p.planId === plan.planId ? { ...p, completed: true } : p)));
    showToast(deducted + ' ingredient' + (deducted === 1 ? '' : 's') + ' deducted from pantry' + (skipped ? ' · ' + skipped + ' not tracked' : ''));
  }

  function importRecipes(list) {
    if (!list.length) return;
    setRecipes((rs) => [...list, ...rs]);
    showToast(list.length + ' recipe' + (list.length === 1 ? '' : 's') + ' imported — find them under Recipes');
  }

  let screen = null;
  if (route.name === 'dashboard') {
    screen = <DashboardScreen recipes={recipes} plans={plans} pantry={pantry} garden={D.garden} household={household} botanicals={botanicals} activity={D.activity} onOpenRecipe={openRecipe} go={go} onNewRecipe={() => go('recipe-new')} />;
  } else if (route.name === 'recipes') {
    screen = <RecipesScreen recipes={recipes} onOpenRecipe={openRecipe} onNewRecipe={() => go('recipe-new')} />;
  } else if (route.name === 'recipe-new') {
    screen = <NewRecipeScreen recipes={recipes} onToast={showToast} onCancel={goBack} onCreate={(rec) => { setRecipes((rs) => [rec, ...rs]); showToast('“' + rec.title + '” added to Recipes'); navigate({ name: 'recipe', id: rec.recipeId }); }} />;
  } else if (route.name === 'recipe') {
    const r = recipes.find((x) => x.recipeId === route.id);
    screen = <RecipeDetailScreen recipe={r} pantry={pantry} measure={measure} onToggleFav={toggleFav} onUpdateIngredients={updateRecipeIngredients} onUpdateRecipe={updateRecipe} onBack={goBack} onToast={showToast} />;
  } else if (route.name === 'planner') {
    screen = <PlannerScreen recipes={recipes} plans={plans} setPlans={setPlans} pantry={pantry} onAteMeal={consumeMeal} onAddGroceries={addGroceries} onOpenRecipe={openRecipe} onToast={showToast} />;
  } else if (route.name === 'pantry') {
    screen = <PantryScreen pantry={pantry} stores={stores} onUpdateItem={updatePantryItem} onDeleteItem={deletePantryItem} onToast={showToast} />;
  } else if (route.name === 'shopping') {
    screen = <ShoppingScreen system="household" items={household} pantry={pantry} stores={stores} onToggle={toggleShop} go={go} />;
  } else if (route.name === 'botanicals') {
    screen = <ShoppingScreen system="botanicals" items={botanicals} pantry={pantry} stores={stores} onToggle={toggleShop} go={go} />;
  } else if (route.name === 'garden') {
    screen = <GardenScreen garden={D.garden} onToast={showToast} />;
  } else if (route.name === 'import') {
    screen = <ImportScreen onToast={showToast} onImportRecipes={importRecipes} />;
  } else if (route.name === 'settings') {
    screen = <SettingsScreen user={user} onSignOut={onSignOut} theme={theme} onTheme={setTheme} measure={measure} onMeasure={setMeasure} stores={stores} onStores={setStores} keepAwake={keepAwake} onKeepAwake={setKeepAwake} densities={densities} onDensities={setDensities} onErase={eraseAll} onToast={showToast} />;
  }

  return (
    <div className={'app-shell' + (navOpen ? ' nav-open' : '') + (sideCollapsed ? ' side-collapsed' : '')}>
      <header className="topbar">
        <button className="icon-btn menu-btn" aria-label="Toggle navigation menu" title="Toggle menu" onClick={() => { if (window.innerWidth >= 900) setSideCollapsed((v) => !v); else setNavOpen((v) => !v); }}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <button className="icon-btn back-btn" aria-label="Go back" title="Back" disabled={!stack.length} onClick={goBack}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
        </button>
        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); go('dashboard'); }}>
          <BrandMark size={29} />
          <span className="brand-name">{user.username}’s Cookbook</span>
        </a>
        <div className="topbar-spacer"></div>
        <span className="net-status">Offline-ready</span>
        <button className="icon-btn" aria-label="Toggle colour theme" title="Toggle theme" onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}>
          {theme === 'dark' ? '☾' : '☀'}
        </button>
      </header>

      <nav className="sidebar" aria-label="Main navigation">
        <ul className="nav-list">
          {NAV.map((n, i) => n.sep ? <li key={i} className="nav-sep" role="separator"></li> : (
            <li key={n.id}>
              <a href="#" className={activeNav === n.id ? 'active' : ''} onClick={(e) => { e.preventDefault(); go(n.id); }}>
                <span className="nav-ico">{n.icon}</span> {n.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="sidebar-foot">myCookbook · v1.2.0 · offline PWA</p>
      </nav>
      {navOpen ? <div className="sidebar-scrim" onClick={() => setNavOpen(false)}></div> : null}

      <nav className="tabbar" aria-label="Primary">
        {NAV.filter((n) => ['dashboard', 'recipes', 'planner', 'pantry'].includes(n.id)).map((n) => (
          <button key={n.id} className={!navOpen && activeNav === n.id ? 'active' : ''} onClick={() => go(n.id)}>
            <span className="tab-ico">{n.icon}</span> {n.label === 'Meal planner' ? 'Planner' : n.label}
          </button>
        ))}
        <button className={navOpen || !['dashboard', 'recipes', 'recipe', 'planner', 'pantry'].includes(activeNav) ? 'active' : ''} aria-label="More sections" onClick={() => setNavOpen((v) => !v)}>
          <span className="tab-ico">⋯</span> More
        </button>
      </nav>

      <main className="main" id="main" tabIndex="-1">
        {screen}
      </main>

      {toast ? (
        <div className="toast-region">
          <div className={'toast show toast-' + toast.tone}>{toast.msg}</div>
        </div>
      ) : null}
    </div>
  );
}

/* Login gate: no session → sign in / create an account; each account
   opens its own cookbook. */
function Root() {
  const [user, setUser] = React.useState(() => window.CBAuth.session());
  return user
    ? <App key={user.email} user={user} onSignOut={() => { window.CBAuth.clearSession(); setUser(null); }} />
    : <LoginScreen onLogin={(u) => { window.CBAuth.setSession(u); setUser(u); }} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
