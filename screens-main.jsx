/* ==================================================================
   screens-main.jsx — Dashboard, Recipe list, Recipe detail.
   Faithful recreations built from the design-system CSS classes.
   ================================================================== */

const TODAY = '2026-07-08';
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function fmtAmount(n) {
  if (n == null || n === '') return '';
  const num = Number(n);
  if (Number.isNaN(num)) return String(n);
  return String(Math.round(num * 100) / 100);
}
function scaleAmount(amount, factor) {
  if (amount == null) return null;
  return Math.round(amount * factor * 100) / 100;
}
function norm(s) { return String(s || '').toLowerCase().trim(); }
function findPantryMatch(pantry, name) {
  const n = norm(name);
  if (!n) return null;
  return pantry.find((p) => {
    const pn = norm(p.name);
    return pn && (pn === n || n.includes(pn) || pn.includes(n));
  }) || null;
}
function daysUntil(iso) {
  return Math.round((new Date(iso) - new Date(TODAY)) / 86400000);
}
/* Date helpers for the planner (dates as ISO yyyy-mm-dd strings). */
function isoAdd(iso, n) { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }
function mondayOf(iso) { const d = new Date(iso + 'T12:00:00'); return isoAdd(iso, -((d.getDay() + 6) % 7)); }
function niceDate(iso, opts) { return new Date(iso + 'T12:00:00').toLocaleDateString('en-CA', opts || { weekday: 'short', month: 'short', day: 'numeric' }); }
function pantryAlerts(pantry) {
  const expired = [], expiring = [], low = [];
  for (const p of pantry) {
    if (p.expiry) {
      const d = daysUntil(p.expiry);
      if (d < 0) expired.push(p);
      else if (d <= 7) expiring.push(p);
    }
    if (p.minimum != null && p.quantity <= p.minimum) low.push(p);
  }
  return { expired, expiring, low };
}

/* The app's herb-leaf brand mark (verbatim SVG from index.html). */
function BrandMark({ size = 29 }) {
  return (
    <svg className="brand-mark" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ width: size, height: size }}>
      <path d="M12 21c-4.5 0-8-3-8-8 0-6 5-10 8-11 3 1 8 5 8 11 0 5-3.5 8-8 8Z" fill="var(--primary)" />
      <path d="M12 4v15" stroke="var(--cream)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12 9c1.6-.4 3-1.6 3.6-3.2M12 13c-1.8-.4-3.4-1.8-4-3.6" stroke="var(--cream)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* Shared recipe tile (mirrors recipes.js → recipeCardHTML). */
function RecipeCardEl({ recipe, onOpen, onDelete }) {
  const r = recipe;
  const letter = (r.title || '?').trim().charAt(0).toUpperCase();
  return (
    <a className="recipe-card" href="#" onClick={(e) => { e.preventDefault(); onOpen(r.recipeId); }}>
      <div className="recipe-card-img recipe-card-placeholder" aria-hidden="true">{r.image ? <img src={r.image} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} /> : letter}</div>
      <div className="recipe-card-body">
        <h3 className="recipe-card-title">{r.title}{r.favourite ? <span className="fav-star" aria-label="favourite"> ★</span> : null}</h3>
        {onDelete ? <button className="card-del" aria-label={'Delete ' + r.title} title="Delete recipe" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(r); }}>×</button> : null}
        {r.subtitle ? <p className="recipe-card-sub">{r.subtitle}</p> : null}
        <p className="recipe-card-meta">
          <span>{r.category}</span>
          {r.totalMinutes ? <span>· {r.totalMinutes} min</span> : null}
          <span>· {r.difficulty}</span>
        </p>
      </div>
    </a>
  );
}

/* ------------------------------ Dashboard -------------------------- */
function DashboardScreen({ recipes, plans, pantry, garden, household, botanicals, activity, onOpenRecipe, go, onNewRecipe }) {
  const todayPlans = plans.filter((p) => p.date === TODAY);
  const byMeal = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  todayPlans.sort((a, b) => byMeal.indexOf(a.mealType) - byMeal.indexOf(b.mealType));
  const recipeById = Object.fromEntries(recipes.map((r) => [r.recipeId, r]));
  const favourites = recipes.filter((r) => r.favourite).slice(0, 4);
  const recent = recipes.slice(0, 4);
  const alerts = pantryAlerts(pantry);
  const harvests = garden.flatMap((g) => (g.harvests || []).map((h) => ({ plant: g.plantName, ...h }))).sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 4);
  const hhOpen = household.filter((i) => !i.checked).length;
  const botOpen = botanicals.filter((i) => !i.checked).length;

  return (
    <div>
      <header className="page-head dash-head">
        <div>
          <h1>Good morning, Sharon</h1>
          <p className="page-sub">Wednesday, 8 July 2026 · Summer 🌿</p>
        </div>
      </header>

      <div className="dash-grid">
        <section className="dash-card dash-today">
          <h2>Today's meals</h2>
          <ul className="dash-meal-list">
            {todayPlans.map((p, i) => (
              <li key={i} className={p.completed ? 'done' : ''}>
                <span className="dash-meal-type">{p.mealType}</span>
                <a href="#" onClick={(e) => { e.preventDefault(); onOpenRecipe(p.recipeId); }}>{recipeById[p.recipeId] ? recipeById[p.recipeId].title : '(removed)'}</a>
                <small>{p.servings} serv{p.completed ? ' · ✓ cooked' : ''}</small>
              </li>
            ))}
          </ul>
          <a className="dash-link" href="#" onClick={(e) => { e.preventDefault(); go('planner'); }}>Open the planner →</a>
        </section>

        <section className="dash-card">
          <h2>Quick actions</h2>
          <div className="dash-actions">
            <a className="btn btn-primary" href="#" onClick={(e) => { e.preventDefault(); onNewRecipe(); }}>＋ New recipe</a>
            <a className="btn btn-ghost" href="#" onClick={(e) => { e.preventDefault(); go('planner'); }}>Plan meals</a>
            <a className="btn btn-ghost" href="#" onClick={(e) => { e.preventDefault(); go('shopping'); }}>Household list</a>
            <a className="btn btn-ghost" href="#" onClick={(e) => { e.preventDefault(); go('import'); }}>Imports</a>
          </div>
        </section>

        <section className={'dash-card' + (alerts.expired.length ? ' dash-card-warn' : '')}>
          <h2>Pantry alerts</h2>
          <ul className="dash-alert-list">
            {alerts.expired.slice(0, 3).map((i, k) => <li key={'e' + k}><span className="chip chip-danger">expired</span> {i.name}</li>)}
            {alerts.expiring.slice(0, 3).map((i, k) => <li key={'x' + k}><span className="chip chip-warn">soon</span> {i.name} <small>{i.expiry}</small></li>)}
            {alerts.low.slice(0, 3).map((i, k) => <li key={'l' + k}><span className="chip chip-info">low</span> {i.name} <small>{fmtAmount(i.quantity)} {i.unit}</small></li>)}
          </ul>
          <a className="dash-link" href="#" onClick={(e) => { e.preventDefault(); go('pantry'); }}>Open the pantry →</a>
        </section>

        <section className="dash-card">
          <h2>Shopping</h2>
          <ul className="dash-shop-summary">
            <li><a href="#" onClick={(e) => { e.preventDefault(); go('shopping'); }}><strong>{hhOpen}</strong> household items to buy</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); go('botanicals'); }}><strong>{botOpen}</strong> Tancook Botanicals items to buy</a></li>
          </ul>
          <p className="hint">Two separate lists — they never mix.</p>
        </section>

        <section className="dash-card">
          <h2>Garden harvest</h2>
          <ul className="dash-harvest-list">
            {harvests.map((h, i) => <li key={i}>{h.plant} — {fmtAmount(h.quantity)} {h.unit} <small>{h.date}</small></li>)}
          </ul>
          <a className="dash-link" href="#" onClick={(e) => { e.preventDefault(); go('garden'); }}>Open the garden →</a>
        </section>

        <section className="dash-card dash-weather">
          <h2>Weather</h2>
          <p className="dash-empty">Weather for Tancook Island is coming in a future version — the cookbook never needs the internet, so this stays optional.</p>
        </section>

        <section className="dash-card dash-wide">
          <h2>Favourites</h2>
          <div className="recipe-grid recipe-grid-sm">
            {favourites.map((r) => <RecipeCardEl key={r.recipeId} recipe={r} onOpen={onOpenRecipe} />)}
          </div>
        </section>

        <section className="dash-card">
          <h2>Statistics</h2>
          <table className="stats-table"><tbody>
            <tr><th scope="row">Recipes</th><td>{recipes.length}</td></tr>
            <tr><th scope="row">Favourites</th><td>{recipes.filter((r) => r.favourite).length}</td></tr>
            <tr><th scope="row">Pantry items</th><td>{pantry.length}</td></tr>
            <tr><th scope="row">Garden plantings</th><td>{garden.length}</td></tr>
          </tbody></table>
        </section>

        <section className="dash-card">
          <h2>Recent activity</h2>
          <ul className="dash-activity">
            {activity.map((a, i) => <li key={i}>{a.summary} <small>{a.rel}</small></li>)}
          </ul>
        </section>
      </div>
    </div>
  );
}

/* ------------------------------ Recipe list ------------------------ */
const QUICK_FILTERS = [
  { id: 'favourite', label: '★ Favourites' },
  { id: 'freezer', label: 'Freezer friendly' },
  { id: 'garden', label: 'From the garden' },
  { id: 'high-protein', label: 'High protein' },
  { id: 'raw', label: 'No-cook' },
];

function RecipesScreen({ recipes, onOpenRecipe, onNewRecipe, onDeleteRecipe }) {
  const confirmDel = (r) => { if (window.confirm('Delete “' + r.title + '”? This cannot be undone.')) onDeleteRecipe(r.recipeId); };
  const [q, setQ] = React.useState('');
  const [quick, setQuick] = React.useState('');
  const [cat, setCat] = React.useState('');
  const [cuisine, setCuisine] = React.useState('');
  const [meal, setMeal] = React.useState('');
  const [maxTime, setMaxTime] = React.useState('');
  const [sort, setSort] = React.useState('recent');
  const [showFilters, setShowFilters] = React.useState(false);

  const cats = [...new Set(recipes.map((r) => r.category).filter(Boolean))].sort();
  const cuisines = [...new Set(recipes.map((r) => r.cuisine).filter(Boolean))].sort();
  const meals = [...new Set(recipes.map((r) => r.mealType).filter(Boolean))].sort();

  let shown = recipes;
  if (q.trim()) {
    const terms = norm(q).split(/\s+/);
    shown = shown.filter((r) => {
      const hay = norm([r.title, r.subtitle, r.category, r.cuisine, (r.tags || []).join(' '), (r.ingredients || []).map((i) => i.name).join(' ')].join(' '));
      return terms.every((t) => hay.includes(t));
    });
  }
  if (quick === 'favourite') shown = shown.filter((r) => r.favourite);
  else if (quick === 'freezer') shown = shown.filter((r) => (r.tags || []).includes('freezer-friendly'));
  else if (quick === 'garden') shown = shown.filter((r) => (r.tags || []).includes('garden'));
  else if (quick === 'high-protein') shown = shown.filter((r) => (r.nutrition && r.nutrition.protein >= 20));
  else if (quick === 'raw') shown = shown.filter((r) => r.cookMinutes === 0);
  if (cat) shown = shown.filter((r) => r.category === cat);
  if (cuisine) shown = shown.filter((r) => r.cuisine === cuisine);
  if (meal) shown = shown.filter((r) => r.mealType === meal);
  if (maxTime !== '' && Number(maxTime) > 0) shown = shown.filter((r) => (r.totalMinutes || 0) <= Number(maxTime));

  shown = [...shown];
  if (sort === 'title') shown.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === 'time') shown.sort((a, b) => (a.totalMinutes || 0) - (b.totalMinutes || 0));

  const activeCount = [cat, cuisine, meal, maxTime].filter((v) => v !== '').length + (sort !== 'recent' ? 1 : 0);
  const anyActive = activeCount > 0 || quick || q.trim();
  function clearAll() { setQ(''); setQuick(''); setCat(''); setCuisine(''); setMeal(''); setMaxTime(''); setSort('recent'); }

  return (
    <div>
      <header className="page-head">
        <h1>Recipes</h1>
        <div className="page-actions">
          <a className="btn btn-primary" href="#" onClick={(e) => { e.preventDefault(); onNewRecipe(); }}>＋ New recipe</a>
        </div>
      </header>

      <div className="recipe-toolbar">
        <input type="search" className="input search-input" placeholder="Search recipes, ingredients, tags…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className={'btn ' + (showFilters || activeCount ? 'btn-primary' : 'btn-ghost')} onClick={() => setShowFilters((v) => !v)} aria-expanded={showFilters}>
          Filters{activeCount ? ' · ' + activeCount : ''}
        </button>
      </div>

      <div className="filter-chips" role="group" aria-label="Quick filters">
        <button className={'filter-chip' + (quick === '' ? ' active' : '')} onClick={() => setQuick('')}>All</button>
        {QUICK_FILTERS.map((f) => (
          <button key={f.id} className={'filter-chip' + (quick === f.id ? ' active' : '')} onClick={() => setQuick(quick === f.id ? '' : f.id)}>{f.label}</button>
        ))}
      </div>

      {showFilters ? (
        <div className="filter-panel">
          <label>Category <select className="input" value={cat} onChange={(e) => setCat(e.target.value)}><option value="">Any</option>{cats.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
          <label>Cuisine <select className="input" value={cuisine} onChange={(e) => setCuisine(e.target.value)}><option value="">Any</option>{cuisines.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>
          <label>Meal <select className="input" value={meal} onChange={(e) => setMeal(e.target.value)}><option value="">Any</option>{meals.map((m) => <option key={m} value={m}>{m}</option>)}</select></label>
          <label>Max total time (min) <input type="number" className="input" min="0" step="5" value={maxTime} onChange={(e) => setMaxTime(e.target.value)} placeholder="Any" /></label>
          <label>Sort by <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}><option value="recent">Recently updated</option><option value="title">Title A–Z</option><option value="time">Total time</option></select></label>
          <div className="filter-panel-foot"><button className="btn btn-ghost" onClick={clearAll} disabled={!anyActive}>Clear all</button></div>
        </div>
      ) : null}

      <p className="result-count">{shown.length} recipe{shown.length === 1 ? '' : 's'}{anyActive ? <> · <a href="#" onClick={(e) => { e.preventDefault(); clearAll(); }}>clear search &amp; filters</a></> : null}</p>
      {shown.length ? (
        <div className="recipe-grid">
          {shown.map((r) => <RecipeCardEl key={r.recipeId} recipe={r} onOpen={onOpenRecipe} onDelete={confirmDel} />)}
        </div>
      ) : (
        <div className="empty-state"><p>No recipes match “{q}”{quick || activeCount ? ' with those filters' : ''}.</p><button className="btn btn-ghost" onClick={clearAll}>Clear search &amp; filters</button></div>
      )}
    </div>
  );
}

/* ------------------------------ Recipe detail ---------------------- */
function RecipeDetailScreen({ recipe, pantry, measure, onToggleFav, onUpdateIngredients, onUpdateRecipe, onDeleteRecipe, onBack, onToast }) {
  const r = recipe;
  const [scale, setScale] = React.useState(r.servings || 1);
  /* Per-recipe measurement override, seeded from the global setting. */
  const [local, setLocal] = React.useState(null);
  /* "Make an adjustment": draft copy of the ingredients while editing;
     committing on toggle-back persists to the recipe permanently. */
  const [draft, setDraft] = React.useState(null);
  const adjusting = draft !== null;
  const [packing, setPacking] = React.useState('loose');   /* dry-ingredient measure: loose or packed */
  const m = local || measure || { system: 'metric', form: 'volume' };
  const factor = scale / (r.servings || 1);

  function startAdjusting() { setDraft(r.ingredients.map((i) => ({ ...i }))); }
  function commitAdjusting() {
    onUpdateIngredients(r.recipeId, draft.map((i) => ({ ...i, amount: i.amount === '' || i.amount == null ? null : Number(i.amount) })));
    setDraft(null);
  }
  function setDraftIng(k, patch) { setDraft((d) => d.map((i, idx) => (idx === k ? { ...i, ...patch } : i))); }

  /* Edit mode: recipe details form (title, times, tags…), persisted on save. */
  const [meta, setMeta] = React.useState(null);
  const editing = meta !== null;
  function startEditing() {
    setMeta({ title: r.title, subtitle: r.subtitle || '', description: r.description || '', category: r.category, cuisine: r.cuisine, mealType: r.mealType, difficulty: r.difficulty, prepMinutes: r.prepMinutes, cookMinutes: r.cookMinutes, servings: r.servings, yield: r.yield || '', servingSize: r.servingSize || '', notes: r.notes || '', tags: (r.tags || []).join(', ') });
  }
  function saveEditing() {
    const prep = Math.max(0, Number(meta.prepMinutes) || 0), cook = Math.max(0, Number(meta.cookMinutes) || 0);
    onUpdateRecipe(r.recipeId, {
      title: meta.title.trim() || r.title, subtitle: meta.subtitle.trim(), description: meta.description.trim(),
      category: meta.category.trim() || r.category, cuisine: meta.cuisine.trim() || r.cuisine, mealType: meta.mealType.trim() || r.mealType, difficulty: meta.difficulty,
      prepMinutes: prep, cookMinutes: cook, totalMinutes: prep + cook,
      servings: Math.max(1, Number(meta.servings) || r.servings), yield: meta.yield.trim(), servingSize: meta.servingSize.trim(), notes: meta.notes.trim(),
      tags: meta.tags.split(',').map((t) => t.trim()).filter(Boolean),
    });
    setMeta(null);
  }

  const nutriRows = [['Calories', r.nutrition.calories, ''], ['Protein', r.nutrition.protein, 'g'], ['Fat', r.nutrition.fat, 'g'], ['Carbs', r.nutrition.carbs, 'g'], ['Fibre', r.nutrition.fibre, 'g'], ['Sugar', r.nutrition.sugar, 'g']].filter(([, v]) => v != null);
  const healthNotes = [['EoE notes', r.eoeNotes], ['Blood sugar', r.bloodSugarNotes], ['Anti-inflammatory', r.antiInflammatoryNotes]].filter(([, v]) => v);
  const storageNotes = [['Storage', r.storage], ['Freezer', r.freezer], ['Reheating', r.reheating]].filter(([, v]) => v);

  return (
    <article className="recipe-detail">
      <nav className="crumbs"><a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>← Back</a></nav>

      <header className="recipe-hero">
        {r.image ? <img className="recipe-hero-img" src={r.image} alt={r.title} loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} /> : null}
        <div className="recipe-hero-text">
          <h1>{r.title}</h1>
          {r.subtitle ? <p className="recipe-subtitle">{r.subtitle}</p> : null}
          {r.description ? <p className="recipe-desc">{r.description}</p> : null}
          <p className="recipe-meta-chips">
            <span className="chip">{r.category}</span>
            <span className="chip">{r.cuisine}</span>
            <span className="chip">{r.mealType}</span>
            <span className="chip">{r.difficulty}</span>
            {(r.tags || []).map((t) => <span key={t} className="chip chip-tag">{t}</span>)}
          </p>
          <dl className="recipe-times">
            <div><dt>Prep</dt><dd>{r.prepMinutes} min</dd></div>
            <div><dt>Cook</dt><dd>{r.cookMinutes} min</dd></div>
            <div><dt>Total</dt><dd>{r.totalMinutes} min</dd></div>
            <div><dt>Serves</dt><dd>{r.servings}{r.yield ? ' · ' + r.yield : ''}</dd></div>
            {r.servingSize ? <div><dt>Serving size</dt><dd>{r.servingSize}</dd></div> : null}
            {r.rating ? <div><dt>Rating</dt><dd>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</dd></div> : null}
          </dl>
        </div>
      </header>

      {editing ? (
        <div className="form-card recipe-edit-form">
          <label className="span-2">Title <input className="input" value={meta.title} onChange={(e) => setMeta({ ...meta, title: e.target.value })} /></label>
          <label className="span-2">Subtitle <input className="input" value={meta.subtitle} onChange={(e) => setMeta({ ...meta, subtitle: e.target.value })} /></label>
          <label className="span-2">Description <textarea className="input" rows="2" value={meta.description} onChange={(e) => setMeta({ ...meta, description: e.target.value })}></textarea></label>
          <label>Category <input className="input" value={meta.category} onChange={(e) => setMeta({ ...meta, category: e.target.value })} /></label>
          <label>Cuisine <input className="input" value={meta.cuisine} onChange={(e) => setMeta({ ...meta, cuisine: e.target.value })} /></label>
          <label>Meal <select className="input" value={meta.mealType} onChange={(e) => setMeta({ ...meta, mealType: e.target.value })}>{['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'].map((x) => <option key={x}>{x}</option>)}</select></label>
          <label>Difficulty <select className="input" value={meta.difficulty} onChange={(e) => setMeta({ ...meta, difficulty: e.target.value })}>{['Easy', 'Medium', 'Involved'].map((x) => <option key={x}>{x}</option>)}</select></label>
          <label>Prep (min) <input className="input" type="number" min="0" value={meta.prepMinutes} onChange={(e) => setMeta({ ...meta, prepMinutes: e.target.value })} /></label>
          <label>Cook (min) <input className="input" type="number" min="0" value={meta.cookMinutes} onChange={(e) => setMeta({ ...meta, cookMinutes: e.target.value })} /></label>
          <label>Servings <input className="input" type="number" min="1" value={meta.servings} onChange={(e) => setMeta({ ...meta, servings: e.target.value })} /></label>
          <label>Yield <input className="input" value={meta.yield} placeholder="e.g. 24 oatcakes" onChange={(e) => setMeta({ ...meta, yield: e.target.value })} /></label>
          <label>Serving size <input className="input" value={meta.servingSize} placeholder="e.g. 125 g / 1 scoop" onChange={(e) => setMeta({ ...meta, servingSize: e.target.value })} /></label>
          <label className="span-2">Notes <textarea className="input" rows="3" value={meta.notes} placeholder="Storage, variations, tips…" onChange={(e) => setMeta({ ...meta, notes: e.target.value })}></textarea></label>
          <label className="span-2">Tags <input className="input" value={meta.tags} placeholder="comma, separated" onChange={(e) => setMeta({ ...meta, tags: e.target.value })} /></label>
          <div className="span-2 pantry-editor-actions">
            <button className="btn btn-primary" onClick={saveEditing}>Save changes</button>
            <button className="btn btn-ghost" onClick={() => setMeta(null)}>Cancel</button>
          </div>
        </div>
      ) : null}

      <div className="recipe-actions" role="toolbar">
        <button className={'btn ' + (r.favourite ? 'btn-primary' : 'btn-ghost')} onClick={() => onToggleFav(r.recipeId)}>{r.favourite ? '★ Favourite' : '☆ Favourite'}</button>
        <button className={'btn ' + (editing ? 'btn-primary' : 'btn-ghost')} onClick={() => (editing ? saveEditing() : startEditing())}>{editing ? '✓ Save' : 'Edit'}</button>
        <button className="btn btn-ghost" onClick={() => onToast('Recipe duplicated')}>Duplicate</button>
        <button className="btn btn-ghost" onClick={() => onToast('Added to meal plan')}>Add to plan</button>
        <button className="btn btn-ghost" onClick={() => onToast(r.ingredients.length + ' ingredients added to household shopping')}>＋ Shopping list</button>
        <button className="btn btn-ghost" onClick={() => window.print()}>Print / PDF</button>
        <button className="btn btn-danger-ghost" onClick={() => { if (window.confirm('Delete “' + r.title + '”? This cannot be undone.')) { onDeleteRecipe(r.recipeId); onBack(); } }}>Delete</button>
      </div>

      <div className="recipe-columns">
        <section className="recipe-ingredients">
          <div className="section-head">
            <h2>Ingredients</h2>
            <div className="scale-control">
              <button className="icon-btn" aria-label="Fewer servings" onClick={() => setScale((s) => Math.max(1, s - 1))}>−</button>
              <span>{scale} servings</span>
              <button className="icon-btn" aria-label="More servings" onClick={() => setScale((s) => s + 1)}>＋</button>
            </div>
          </div>
          <div className="measure-switches">
            <div className="seg seg-sm">
              <button className={'seg-btn' + (m.system === 'metric' ? ' active' : '')} onClick={() => setLocal({ ...m, system: 'metric' })}>Metric</button>
              <button className={'seg-btn' + (m.system === 'imperial' ? ' active' : '')} onClick={() => setLocal({ ...m, system: 'imperial' })}>Imperial</button>
            </div>
            <div className="seg seg-sm">
              <button className={'seg-btn' + (m.form === 'volume' ? ' active' : '')} onClick={() => setLocal({ ...m, form: 'volume' })}>Volume</button>
              <button className={'seg-btn' + (m.form === 'weight' ? ' active' : '')} onClick={() => setLocal({ ...m, form: 'weight' })}>Weight</button>
            </div>
            <div className="seg seg-sm" role="group" aria-label="Dry-ingredient packing">
              <button className={'seg-btn' + (packing === 'loose' ? ' active' : '')} title="Dry ingredients spooned in loosely" onClick={() => setPacking('loose')}>Loose</button>
              <button className={'seg-btn' + (packing === 'packed' ? ' active' : '')} title="Dry ingredients pressed into the measure" onClick={() => setPacking('packed')}>Packed</button>
            </div>
            {local ? <button className="btn btn-ghost btn-sm" onClick={() => setLocal(null)} title="Follow the global setting again">Use default</button> : null}
            <button className={'btn btn-sm ' + (adjusting ? 'btn-primary' : 'btn-ghost')} onClick={() => (adjusting ? commitAdjusting() : startAdjusting())}>
              {adjusting ? '✓ Save — back to cooking' : '✎ Make an adjustment'}
            </button>
            {adjusting ? <button className="btn btn-ghost btn-sm" onClick={() => setDraft(null)}>Discard</button> : null}
          </div>
          {adjusting ? <p className="hint adjust-hint">Amounts shown are the recipe's base figures (for {r.servings} servings), in each ingredient's native unit. Saving makes them permanent — scaling, nutrition, groceries and pantry deductions all calculate from the new figures.</p> : null}
          {adjusting ? (
            <ul className="ing-list ing-list-adjust">
              {draft.map((i, k) => (
                <li key={k} className="ing-row">
                  <span className="ing-amount ing-amount-edit">
                    <input type="number" min="0" step="any" value={i.amount == null ? '' : i.amount} placeholder="to taste" aria-label={i.name + ' amount'}
                      onChange={(e) => setDraftIng(k, { amount: e.target.value })} />
                    <input type="text" value={i.unit || ''} placeholder="unit" aria-label={i.name + ' unit'}
                      onChange={(e) => setDraftIng(k, { unit: e.target.value })} />
                  </span>
                  <span className="ing-name">{i.name}{i.notes ? <small className="ing-note">{i.notes}</small> : null}</span>
                </li>
              ))}
            </ul>
          ) : (
          <ul className="ing-list">
            {r.ingredients.map((i, k) => {
              const inPantry = findPantryMatch(pantry, i.name);
              const conv = window.convertIngredientDisplay(i, scaleAmount(i.amount, factor), m.system, m.form, packing);
              return (
                <li key={k} className={'ing-row' + (i.optional ? ' ing-optional' : '')}>
                  <span className="ing-amount" title={conv.approx ? 'Converted with this ingredient\u2019s specific gravity' + (conv.packable ? ' (' + packing + ')' : '') : undefined}>{conv.approx ? '≈ ' : ''}{conv.text}{conv.packable ? <small className="ing-pack-tag"> {packing}</small> : null}</span>
                  <span className="ing-name">{i.name}{i.optional ? <em> (optional)</em> : ''}
                    {i.notes ? <small className="ing-note">{i.notes}</small> : null}
                    {(i.substitutions || []).length ? <small className="ing-note">Substitute: {i.substitutions.join(', ')}</small> : null}
                  </span>
                  <span className={'ing-pantry' + (inPantry ? ' in-pantry' : '')} title={inPantry ? 'In ' + inPantry.location : 'Not in pantry'}>{inPantry ? '✓' : '·'}</span>
                </li>
              );
            })}
          </ul>
          )}
          <p className="pantry-legend"><span className="in-pantry">✓</span> = in your pantry</p>
        </section>

        <section className="recipe-instructions">
          <h2>Instructions</h2>
          <ol className="step-list">
            {r.instructions.map((s, k) => (
              <li key={k} className="step">
                {s.title ? <h3 className="step-title">{s.title}</h3> : null}
                <p>{s.instruction}</p>
                <p className="step-meta">
                  {s.timerMinutes ? <span className="chip">⏱ {s.timerMinutes} min</span> : null}
                  {s.temperature ? <span className="chip">🌡 {s.temperature}</span> : null}
                  {s.equipment ? <span className="chip">{s.equipment}</span> : null}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {nutriRows.length ? (
        <section className="recipe-panel">
          <h2>Nutrition <small>per serving</small></h2>
          <table className="nutri-table"><tbody>
            {nutriRows.map(([k, v, u]) => <tr key={k}><th scope="row">{k}</th><td>{v} {u}</td></tr>)}
          </tbody></table>
        </section>
      ) : null}

      {healthNotes.length ? (
        <section className="recipe-panel recipe-health">
          <h2>Health notes</h2>
          {healthNotes.map(([k, v]) => <div key={k}><h3>{k}</h3><p>{v}</p></div>)}
        </section>
      ) : null}

      {storageNotes.length ? (
        <section className="recipe-panel">
          <h2>Storage &amp; leftovers</h2>
          {storageNotes.map(([k, v]) => <div key={k}><h3>{k}</h3><p>{v}</p></div>)}
        </section>
      ) : null}

      {r.notes ? <section className="recipe-panel"><h2>Notes</h2>{String(r.notes).split('\n').filter(Boolean).map((n, k) => <p key={k}>{n}</p>)}</section> : null}

      <footer className="recipe-foot">
        {r.sourceUrl ? <p><a href={r.sourceUrl} target="_blank" rel="noopener noreferrer">View the original recipe ↗</a></p> : null}
        {r.source ? <p>Source: {r.source}</p> : null}
        <p>Added 8 July 2026 · Updated 8 July 2026 · v1</p>
      </footer>
    </article>
  );
}

/* ------------------------------ New recipe -------------------------- */
function NewRecipeScreen({ recipes, onCreate, onCancel, onToast }) {
  const [f, setF] = React.useState({ title: '', subtitle: '', category: '', cuisine: '', mealType: 'Dinner', servings: 4, prepMinutes: 0, cookMinutes: 0, ings: '', steps: '' });
  const cats = [...new Set(recipes.map((r) => r.category).filter(Boolean))].sort();
  const cuisines = [...new Set(recipes.map((r) => r.cuisine).filter(Boolean))].sort();
  function set(k) { return (e) => setF({ ...f, [k]: e.target.value }); }
  function save() {
    if (!f.title.trim()) { onToast('Give the recipe a title', 'error'); return; }
    const ings = f.ings.split('\n').map((s) => s.trim()).filter(Boolean).map((line) => classifyIngredient(line) || { amount: null, unit: '', name: line });
    const steps = f.steps.split('\n').map((s) => s.trim().replace(/^\d+[.)]\s*/, '')).filter(Boolean);
    if (!ings.length) { onToast('Add at least one ingredient', 'error'); return; }
    const prep = Math.max(0, Number(f.prepMinutes) || 0), cook = Math.max(0, Number(f.cookMinutes) || 0);
    onCreate({
      recipeId: 'rec_new_' + Date.now(), title: f.title.trim(), subtitle: f.subtitle.trim(),
      category: f.category.trim() || 'Uncategorised', cuisine: f.cuisine.trim() || 'Other', mealType: f.mealType, difficulty: 'Easy',
      prepMinutes: prep, cookMinutes: cook, totalMinutes: prep + cook, servings: Math.max(1, Number(f.servings) || 1),
      tags: [], ingredients: ings, instructions: steps.map((s) => ({ instruction: s })),
      nutrition: { calories: 0, protein: 0, fat: 0, carbs: 0, fibre: 0, sugar: 0 },
    });
  }
  return (
    <div>
      <header className="page-head"><h1>New recipe</h1></header>
      <div className="form-card recipe-edit-grid" style={{ display: 'grid', gap: '.7rem', gridTemplateColumns: '1fr 1fr' }}>
        <label className="span-2" style={{ gridColumn: '1 / -1' }}>Title <input className="input" value={f.title} autoFocus onChange={set('title')} placeholder="e.g. Rhubarb Crumble" /></label>
        <label className="span-2" style={{ gridColumn: '1 / -1' }}>Subtitle <input className="input" value={f.subtitle} onChange={set('subtitle')} /></label>
        <label>Category <input className="input" list="nr-cats" value={f.category} onChange={set('category')} /><datalist id="nr-cats">{cats.map((c) => <option key={c} value={c}></option>)}</datalist></label>
        <label>Cuisine <input className="input" list="nr-cuisines" value={f.cuisine} onChange={set('cuisine')} /><datalist id="nr-cuisines">{cuisines.map((c) => <option key={c} value={c}></option>)}</datalist></label>
        <label>Meal <select className="input" value={f.mealType} onChange={set('mealType')}>{['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'].map((m) => <option key={m}>{m}</option>)}</select></label>
        <label>Servings <input className="input" type="number" min="1" value={f.servings} onChange={set('servings')} /></label>
        <label>Prep (min) <input className="input" type="number" min="0" value={f.prepMinutes} onChange={set('prepMinutes')} /></label>
        <label>Cook (min) <input className="input" type="number" min="0" value={f.cookMinutes} onChange={set('cookMinutes')} /></label>
        <label style={{ gridColumn: '1 / -1' }}>Ingredients — one per line, amount first
          <textarea className="input" rows="7" value={f.ings} onChange={set('ings')} placeholder={'2 cups rolled oats\n1 tbsp maple syrup\n\u00bd tsp salt'} style={{ fontFamily: 'var(--font-mono)' }}></textarea>
        </label>
        <label style={{ gridColumn: '1 / -1' }}>Method — one step per line
          <textarea className="input" rows="7" value={f.steps} onChange={set('steps')} placeholder={'Preheat the oven to 180 \u00b0C.\nMix the dry ingredients\u2026'}></textarea>
        </label>
        <div className="import-btns" style={{ gridColumn: '1 / -1' }}>
          <button className="btn btn-primary" onClick={save}>Save recipe</button>
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { fmtAmount, scaleAmount, norm, findPantryMatch, pantryAlerts, daysUntil, isoAdd, mondayOf, niceDate, BrandMark, RecipeCardEl, DashboardScreen, RecipesScreen, RecipeDetailScreen, NewRecipeScreen, DAY_NAMES, TODAY });
