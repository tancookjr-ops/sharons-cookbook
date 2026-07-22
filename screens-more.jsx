/* ==================================================================
   screens-more.jsx — Planner, Pantry, Shopping, Garden, AI Import,
   Settings. Uses helpers exported to window by screens-main.jsx.
   ================================================================== */

const MEAL_ROWS = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

/* ------------------------------ Planner ---------------------------- */
const TRAY_CHIPS = [
  { id: '', label: 'All', test: () => true },
  { id: 'breakfast', label: 'Breakfast', test: (r) => r.mealType === 'Breakfast' || r.category === 'Breakfast' },
  { id: 'lunch', label: 'Lunch', test: (r) => r.mealType === 'Lunch' },
  { id: 'dinner', label: 'Dinner', test: (r) => r.mealType === 'Dinner' },
  { id: 'salads', label: 'Salads', test: (r) => r.category === 'Salads' },
  { id: 'snacks', label: 'Snacks', test: (r) => r.category === 'Snacks' },
  { id: 'desserts', label: 'Desserts', test: (r) => r.category === 'Desserts' },
];
const VIEWS = ['day', 'week', 'fortnight', 'month'];

function PlannerScreen({ recipes, plans, setPlans, pantry, onAteMeal, onAddGroceries, onOpenRecipe, onToast }) {
  const [view, setView] = React.useState('week');
  const [anchor, setAnchor] = React.useState(window.TODAY);
  const [trayChip, setTrayChip] = React.useState('');
  const [trayOpen, setTrayOpen] = React.useState(false);
  const [groceriesOpen, setGroceriesOpen] = React.useState(false);   /* groceries panel visible? */
  const [picked, setPicked] = React.useState(null);      /* recipeId armed for tap-to-place */
  const [dragOver, setDragOver] = React.useState(null);  /* 'date|meal' or date being dragged over */
  const recipeById = Object.fromEntries(recipes.map((r) => [r.recipeId, r]));

  const days = view === 'day' ? [anchor]
    : view === 'week' ? Array.from({ length: 7 }, (_, i) => isoAdd(mondayOf(anchor), i))
    : view === 'fortnight' ? Array.from({ length: 14 }, (_, i) => isoAdd(mondayOf(anchor), i))
    : null;

  function shift(dir) {
    if (view === 'day') setAnchor(isoAdd(anchor, dir));
    else if (view === 'week') setAnchor(isoAdd(anchor, dir * 7));
    else if (view === 'fortnight') setAnchor(isoAdd(anchor, dir * 14));
    else { const d = new Date(anchor + 'T12:00:00'); d.setDate(1); d.setMonth(d.getMonth() + dir); setAnchor(d.toISOString().slice(0, 10)); }
  }
  const rangeLabel = view === 'day' ? niceDate(anchor, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : view === 'month' ? niceDate(anchor, { month: 'long', year: 'numeric' })
    : niceDate(days[0], { month: 'short', day: 'numeric' }) + ' – ' + niceDate(days[days.length - 1], { month: 'short', day: 'numeric', year: 'numeric' });

  function addPlan(date, meal, recipeId) {
    const r = recipeById[recipeId];
    if (!r) return;
    setPlans((ps) => [...ps, { planId: 'pl' + Date.now() + Math.random().toString(36).slice(2, 5), date, mealType: meal, recipeId, servings: r.servings || 2 }]);
    setPicked(null);
    onToast(r.title + ' → ' + meal + ', ' + niceDate(date, { month: 'short', day: 'numeric' }));
  }
  function removePlan(planId) { setPlans((ps) => ps.filter((p) => p.planId !== planId)); }
  function movePlan(planId, date, meal) { setPlans((ps) => ps.map((p) => (p.planId === planId ? { ...p, date, mealType: meal || p.mealType } : p))); }
  function stepServings(planId, delta) { setPlans((ps) => ps.map((p) => (p.planId === planId ? { ...p, servings: Math.max(1, p.servings + delta) } : p))); }
  function dropPayload(e, date, meal) {
    const t = e.dataTransfer.getData('text/plain');
    if (!t) return;
    if (t.indexOf('move:') === 0) movePlan(t.slice(5), date, meal);
    else addPlan(date, meal || ((recipeById[t] || {}).mealType || 'Dinner'), t);
  }

  function Slot({ date, meal }) {
    const cell = plans.filter((p) => p.date === date && p.mealType === meal);
    const key = date + '|' + meal;
    return (
      <div
        className={'plan-slot' + (dragOver === key ? ' drop-target' : '')}
        onDragOver={(e) => { e.preventDefault(); if (dragOver !== key) setDragOver(key); }}
        onDragLeave={() => setDragOver((k) => (k === key ? null : k))}
        onDrop={(e) => { e.preventDefault(); setDragOver(null); dropPayload(e, date, meal); }}
      >
        {cell.map((p) => {
          const r = recipeById[p.recipeId];
          return (
            <div key={p.planId} className={'plan-entry' + (p.completed ? ' done' : '')} draggable
              onDragStart={(e) => { e.dataTransfer.setData('text/plain', 'move:' + p.planId); e.dataTransfer.effectAllowed = 'move'; }}>
              <span className="drag-handle" aria-hidden="true" title="Drag to move">⠰</span>
              <button className="plan-entry-open" onClick={() => onOpenRecipe(p.recipeId)}>
                <span className="plan-entry-title">{r ? r.title : '—'}</span>
                {p.batch || p.leftovers ? <small>{p.batch ? 'batch' : ''}{p.batch && p.leftovers ? ' · ' : ''}{p.leftovers ? 'leftovers' : ''}</small> : null}
              </button>
              <div className="serv-stepper" aria-label="Servings">
                <button aria-label="Fewer servings" onClick={() => stepServings(p.planId, -1)}>−</button>
                <span>{p.servings}<small> serv</small></span>
                <button aria-label="More servings" onClick={() => stepServings(p.planId, 1)}>＋</button>
                <button className={'ate-btn' + (p.completed ? ' eaten' : '')} disabled={p.completed} title={p.completed ? 'Eaten — pantry updated' : 'Mark eaten and deduct ingredients from the pantry'}
                  onClick={() => onAteMeal(p)}>{p.completed ? '✓ Eaten' : 'I ate this'}</button>
              </div>
              <button className="plan-entry-x" aria-label="Remove from plan" title="Remove" onClick={() => removePlan(p.planId)}>×</button>
            </div>
          );
        })}
        <button className={'plan-add' + (picked ? ' armed' : '')} aria-label={'Add ' + meal} onClick={() => (picked ? addPlan(date, meal, picked) : setTrayOpen(true))}>＋</button>
      </div>
    );
  }

  function DayNutrition({ date }) {
    const entries = plans.filter((p) => p.date === date);
    const tot = { calories: 0, protein: 0, fat: 0, carbs: 0, fibre: 0 };
    let servTotal = 0, counted = 0;
    for (const p of entries) {
      const n = (recipeById[p.recipeId] || {}).nutrition;
      if (!n) continue;
      counted++; servTotal += p.servings;
      for (const k in tot) tot[k] += (n[k] || 0) * p.servings;
    }
    return (
      <section className="day-nutrition">
        <h2>Day nutrition</h2>
        {counted ? (
          <React.Fragment>
            <div className="nutri-cells">
              {[['Calories', Math.round(tot.calories), 'kcal'], ['Protein', Math.round(tot.protein), 'g'], ['Fat', Math.round(tot.fat), 'g'], ['Carbs', Math.round(tot.carbs), 'g'], ['Fibre', Math.round(tot.fibre), 'g']].map(([k, v, u]) => (
                <div key={k} className="nutri-cell"><strong>{v}</strong><small>{u}</small><span>{k}</span></div>
              ))}
            </div>
            <p className="hint">Totals for all {servTotal} planned serving{servTotal === 1 ? '' : 's'} across {counted} meal{counted === 1 ? '' : 's'} — adjust with ＋/− on each meal.</p>
          </React.Fragment>
        ) : <p className="dash-empty">Nothing planned yet — add meals to see the day's nutrition.</p>}
      </section>
    );
  }

  const trayTest = TRAY_CHIPS.find((c) => c.id === trayChip).test;
  const trayRecipes = recipes.filter(trayTest);

  /* Groceries: every ingredient in the visible range, scaled to the
     planned servings, aggregated by name+unit. Pantry stock never
     removes an item — it only flags it. Computed live from the current
     view, so switching day/week/fortnight/month updates the open list. */
  function buildGroceries() {
    let dates = days;
    if (view === 'month') {
      const ym = anchor.slice(0, 7);
      const n = new Date(Number(ym.slice(0, 4)), Number(ym.slice(5)), 0).getDate();
      dates = Array.from({ length: n }, (_, i) => ym + '-' + String(i + 1).padStart(2, '0'));
    }
    const inRange = plans.filter((p) => dates.includes(p.date));
    const agg = {};
    for (const p of inRange) {
      const r = recipeById[p.recipeId];
      if (!r) continue;
      const factor = p.servings / (r.servings || 1);
      for (const ing of (r.ingredients || [])) {
        const key = norm(ing.name) + '|' + (ing.unit || '');
        if (!agg[key]) agg[key] = { name: ing.name, unit: ing.unit || '', amount: 0, known: true, uses: 0 };
        const a = agg[key];
        a.uses++;
        if (ing.amount == null) a.known = false;
        else a.amount += ing.amount * factor;
      }
    }
    return Object.values(agg).map((it) => {
      const m = findPantryMatch(pantry, it.name);
      return { ...it, amount: it.known ? Math.round(it.amount * 100) / 100 : null, pantry: !!m, pantryNote: m ? fmtAmount(m.quantity) + ' ' + (m.unit || '') + ' in ' + m.location : '' };
    }).sort((a, b) => (a.pantry === b.pantry ? a.name.localeCompare(b.name) : a.pantry ? 1 : -1));
  }
  const groceries = groceriesOpen ? buildGroceries() : null;

  return (
    <div>
      <header className="page-head">
        <h1>Meal planner</h1>
        <div className="page-actions">
          <button className={'btn ' + (groceriesOpen ? 'btn-primary' : 'btn-ghost')} onClick={() => setGroceriesOpen((v) => !v)} aria-expanded={groceriesOpen}>Generate groceries</button>
          <button className={'btn ' + (trayOpen ? 'btn-primary' : 'btn-ghost')} onClick={() => setTrayOpen((v) => !v)} aria-expanded={trayOpen}>Recipe tray</button>
        </div>
      </header>

      <div className="planner-toolbar">
        <div className="seg">
          {VIEWS.map((v) => (
            <button key={v} className={'seg-btn' + (v === view ? ' active' : '')} onClick={() => setView(v)}>{v[0].toUpperCase() + v.slice(1)}</button>
          ))}
        </div>
        <div className="planner-nav">
          <button className="icon-btn" aria-label="Previous" onClick={() => shift(-1)}>‹</button>
          <button className="icon-btn" aria-label="Next" onClick={() => shift(1)}>›</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setAnchor(window.TODAY)}>Today</button>
          <span className="planner-range">{rangeLabel}</span>
        </div>
      </div>

      {groceries ? (
        <section className="grocery-panel">
          <div className="grocery-head">
            <h2>Groceries · {rangeLabel}</h2>
            <button className="icon-btn" aria-label="Close groceries" onClick={() => setGroceriesOpen(false)}>×</button>
          </div>
          <p className="hint">Scaled to your planned servings. <span className="chip chip-info chip-sm">PANTRY</span> = already some in stock — kept on the list so you can double-check.</p>
          <ul className="grocery-list">
            {groceries.length === 0 ? <li className="grocery-item"><span className="grocery-name">Nothing planned in this {view === 'day' ? 'day' : view} yet.</span></li> : null}
            {groceries.map((g) => (
              <li key={g.name + g.unit} className={'grocery-item' + (g.pantry ? ' in-pantry-item' : '')}>
                <span className="grocery-amt">{g.amount != null ? fmtAmount(g.amount) + (g.unit ? ' ' + g.unit : '') : 'to taste'}</span>
                <span className="grocery-name">{g.name}{g.uses > 1 ? <small> · {g.uses} meals</small> : null}</span>
                {g.pantry ? <span className="chip chip-info chip-sm" title={g.pantryNote}>PANTRY · {g.pantryNote}</span> : null}
              </li>
            ))}
          </ul>
          <div className="grocery-actions">
            {groceries.length ? <button className="btn btn-primary" onClick={() => { onAddGroceries(groceries); setGroceriesOpen(false); }}>Add {groceries.length} to Household shopping</button> : null}
            <button className="btn btn-ghost" onClick={() => setGroceriesOpen(false)}>Close</button>
          </div>
        </section>
      ) : null}

      <div className="planner-grid-wrap">
        {view === 'month' ? (
          <MonthGrid anchor={anchor} plans={plans} recipeById={recipeById} dragOver={dragOver} setDragOver={setDragOver} dropPayload={dropPayload}
            onPickDay={(d) => { setAnchor(d); setView('day'); }} />
        ) : view === 'day' ? (
          <div className="day-view">
            {MEAL_ROWS.map((meal) => (
              <section key={meal} className="day-meal">
                <h2>{meal}</h2>
                <Slot date={anchor} meal={meal} />
              </section>
            ))}
            <DayNutrition date={anchor} />
          </div>
        ) : (
          <table className={'planner-grid' + (view === 'fortnight' ? ' planner-grid-fortnight' : '')}>
            <thead>
              <tr>
                <th className="meal-col-head"></th>
                {days.map((d) => (
                  <th key={d} className={d === window.TODAY ? 'is-today' : ''}>
                    <button className="day-head-btn" onClick={() => { setAnchor(d); setView('day'); }}>{niceDate(d, { weekday: 'short' })} {Number(d.slice(8))}</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MEAL_ROWS.map((meal) => (
                <tr key={meal}>
                  <th className="meal-row-head">{meal}</th>
                  {days.map((d) => (
                    <td key={d} className={d === window.TODAY ? 'is-today' : ''}>
                      <Slot date={d} meal={meal} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={'tray-drawer' + (trayOpen ? ' open' : '')} aria-hidden={!trayOpen}>
        <div className="tray-drawer-head">
          <h2>Recipe tray</h2>
          <div className="tray-chips" role="group" aria-label="Filter tray">
            {TRAY_CHIPS.map((c) => (
              <button key={c.id} className={'filter-chip filter-chip-sm' + (trayChip === c.id ? ' active' : '')} onClick={() => setTrayChip(c.id)}>{c.label}</button>
            ))}
          </div>
          <button className="icon-btn tray-drawer-close" aria-label="Close tray" onClick={() => setTrayOpen(false)}>×</button>
        </div>
        <p className="hint">Drag a recipe onto the calendar — or tap it, then tap ＋ where it goes.</p>
        <ul className="tray-list">
          {trayRecipes.map((r) => (
            <li key={r.recipeId} className={'tray-item' + (picked === r.recipeId ? ' selected' : '')} draggable
              onDragStart={(e) => { e.dataTransfer.setData('text/plain', r.recipeId); e.dataTransfer.effectAllowed = 'copy'; }}
              onClick={() => setPicked(picked === r.recipeId ? null : r.recipeId)}>
              <span className="drag-handle" aria-hidden="true" title="Drag onto the calendar">⠰</span>
              <span className="tray-item-text">
                <span className="tray-title">{r.title}</span>
                <small>{r.category} · {r.totalMinutes} min</small>
              </span>
            </li>
          ))}
          {trayRecipes.length === 0 ? <li className="hint">No recipes in this group.</li> : null}
        </ul>
      </div>
    </div>
  );
}

function MonthGrid({ anchor, plans, recipeById, onPickDay, dragOver, setDragOver, dropPayload }) {
  const ym = anchor.slice(0, 7);
  const first = new Date(ym + '-01T12:00:00');
  const blanks = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const MEAL_ABBR = { Breakfast: 'B', Lunch: 'L', Dinner: 'D', Snack: 'S' };
  const cells = [];
  for (let i = 0; i < blanks; i++) cells.push(<div key={'b' + i} className="month-blank"></div>);
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = ym + '-' + String(d).padStart(2, '0');
    const dayPlans = plans.filter((p) => p.date === iso);
    dayPlans.sort((a, b) => MEAL_ROWS.indexOf(a.mealType) - MEAL_ROWS.indexOf(b.mealType));
    cells.push(
      <div key={d} role="button" tabIndex="0"
        className={'month-day' + (iso === window.TODAY ? ' is-today' : '') + (dragOver === iso ? ' drop-target' : '')}
        onClick={() => onPickDay(iso)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPickDay(iso); } }}
        onDragOver={(e) => { e.preventDefault(); if (dragOver !== iso) setDragOver(iso); }}
        onDragLeave={() => setDragOver((k) => (k === iso ? null : k))}
        onDrop={(e) => { e.preventDefault(); setDragOver(null); dropPayload(e, iso, null); }}>
        <span className="month-num">{d}</span>
        {dayPlans.slice(0, 3).map((p, k) => (
          <span key={k} className="month-dot"><b>{MEAL_ABBR[p.mealType] || ''}</b> {recipeById[p.recipeId] ? recipeById[p.recipeId].title : '—'}</span>
        ))}
        {dayPlans.length > 3 ? <span className="month-more">+{dayPlans.length - 3} more</span> : null}
        {dayPlans.length ? <span className="month-count">{dayPlans.length}</span> : null}
      </div>
    );
  }
  return (
    <div>
      <div className="month-grid">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <div key={d} className="month-head">{d}</div>)}
        {cells}
      </div>
      <p className="hint" style={{ marginTop: '.5rem' }}>Drop a recipe on a day to plan it (it lands on its usual meal) — tap a day to open it in Day view.</p>
    </div>
  );
}

/* ------------------------------ Pantry ----------------------------- */
const PANTRY_LOCATIONS = ['Pantry', 'Fridge', 'Freezer', 'Garden harvest', 'Bulk storage'];
function PantryScreen({ pantry, stores, onUpdateItem, onDeleteItem, onToast }) {
  const [loc, setLoc] = React.useState('All');
  const [openItem, setOpenItem] = React.useState(null);   /* name of the row being edited */
  const [confirmDel, setConfirmDel] = React.useState(false);
  const alerts = window.pantryAlerts(pantry);
  const items = loc === 'All' ? pantry : pantry.filter((p) => p.location === loc);
  const groups = {};
  for (const p of items) { (groups[p.category] = groups[p.category] || []).push(p); }
  const outCount = pantry.filter((p) => p.quantity <= 0).length;

  function stockStatus(p) {
    if (p.quantity <= 0) return 'out';
    if (p.minimum != null && p.quantity <= p.minimum) return 'low';
    return 'ok';
  }

  function renderEditor(p) {
    const set = (patch) => onUpdateItem(p.name, patch);
    return (
      <tr className="pantry-editor-row">
        <td colSpan="4">
          <div className="pantry-editor">
            <label>Name
              <input className="input" value={p.name} onChange={(e) => { const v = e.target.value; set({ name: v }); setOpenItem(v); }} />
            </label>
            <label>Category
              <input className="input" value={p.category} onChange={(e) => set({ category: e.target.value })} />
            </label>
            <label>Location
              <select className="input" value={p.location} onChange={(e) => set({ location: e.target.value })}>
                {PANTRY_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </label>
            <label>Unit
              <input className="input" value={p.unit || ''} placeholder="g, ml, cans…" onChange={(e) => set({ unit: e.target.value })} />
            </label>
            <label>Low-stock alert at
              <input className="input" type="number" min="0" value={p.minimum != null ? p.minimum : ''} placeholder="none"
                onChange={(e) => set({ minimum: e.target.value === '' ? null : Math.max(0, Number(e.target.value)) })} />
            </label>
            <label>Expiry
              <input className="input" type="date" value={p.expiry || ''} onChange={(e) => set({ expiry: e.target.value || null })} />
            </label>
            <label>Preferred store
              <select className="input" value={p.store || ''} onChange={(e) => set({ store: e.target.value || undefined })}>
                <option value="">No preference</option>
                {stores.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="pantry-editor-notes">Notes
              <input className="input" value={p.notes || ''} onChange={(e) => set({ notes: e.target.value })} />
            </label>
            <div className="pantry-editor-actions">
              <button className="btn btn-primary btn-sm" onClick={() => { setOpenItem(null); setConfirmDel(false); }}>Done</button>
              {confirmDel ? (
                <React.Fragment>
                  <button className="btn btn-danger-ghost btn-sm" onClick={() => { onDeleteItem(p.name); setOpenItem(null); setConfirmDel(false); }}>Yes, delete {p.name}</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDel(false)}>Keep it</button>
                </React.Fragment>
              ) : (
                <button className="btn btn-danger-ghost btn-sm" onClick={() => setConfirmDel(true)}>Delete item</button>
              )}
            </div>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <div>
      <header className="page-head">
        <h1>Pantry</h1>
        <div className="page-actions"><button className="btn btn-primary" onClick={() => onToast('Add item — coming soon')}>＋ Add item</button></div>
      </header>

      <div className="alert-strip" style={{ marginBottom: '1rem' }}>
        {outCount ? <span className="alert-pill alert-danger">{outCount} out of stock</span> : null}
        {alerts.expired.length ? <span className="alert-pill alert-danger">{alerts.expired.length} expired</span> : null}
        {alerts.expiring.length ? <span className="alert-pill alert-warn">{alerts.expiring.length} expiring soon</span> : null}
        {alerts.low.length ? <span className="alert-pill alert-warn">{alerts.low.length} low on stock</span> : null}
        {!outCount && !alerts.expired.length && !alerts.expiring.length && !alerts.low.length ? <span className="alert-pill alert-info">All stocked</span> : null}
      </div>

      <div className="pantry-toolbar">
        <div className="seg">
          {['All', ...PANTRY_LOCATIONS].map((l) => (
            <button key={l} className={'seg-btn' + (l === loc ? ' active' : '')} onClick={() => setLoc(l)}>{l}</button>
          ))}
        </div>
      </div>

      {Object.keys(groups).map((cat) => (
        <div key={cat} className="pantry-group">
          <div className="pantry-group-title">{cat}</div>
          <table className="pantry-table">
            <thead><tr><th>Item</th><th>Quantity</th><th className="col-hide-sm">Location</th><th className="col-hide-sm">Expiry</th></tr></thead>
            <tbody>
              {groups[cat].map((p) => {
                const status = stockStatus(p);
                const exp = p.expiry && window.daysUntil(p.expiry) <= 7;
                const step = p.quantity >= 100 ? 10 : 1;
                const isOpen = openItem === p.name;
                return (
                  <React.Fragment key={p.name}>
                  <tr className={(status === 'out' ? 'row-out' : status === 'low' ? 'row-low' : '') + (isOpen ? ' row-editing' : '')}>
                    <td>
                      <button className="pantry-item-btn" aria-expanded={isOpen} onClick={() => { setOpenItem(isOpen ? null : p.name); setConfirmDel(false); }}>
                        {p.name}<span className="pantry-item-caret">{isOpen ? '▾' : '▸'}</span>
                      </button>
                      {status === 'out' ? <span className="chip chip-danger chip-sm" style={{ marginLeft: '.4em' }}>out</span>
                        : status === 'low' ? <span className="chip chip-warn chip-sm" style={{ marginLeft: '.4em' }}>low</span> : null}
                    </td>
                    <td className="pantry-qty">
                      <span className="qty-edit">
                        <button aria-label={'Less ' + p.name} onClick={() => onUpdateItem(p.name, { quantity: Math.max(0, Math.round((p.quantity - step) * 100) / 100) })}>−</button>
                        <input type="number" min="0" step={step} value={p.quantity} aria-label={p.name + ' quantity'}
                          onChange={(e) => onUpdateItem(p.name, { quantity: e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)) })} />
                        <button aria-label={'More ' + p.name} onClick={() => onUpdateItem(p.name, { quantity: Math.round((p.quantity + step) * 100) / 100 })}>＋</button>
                        <span className="qty-unit">{p.unit}</span>
                      </span>
                    </td>
                    <td className="col-hide-sm">{p.location}</td>
                    <td className="col-hide-sm">{p.expiry ? <span className={exp ? 'chip chip-warn chip-sm' : ''}>{p.expiry}</span> : '—'}</td>
                  </tr>
                  {isOpen ? renderEditor(p) : null}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ Shopping --------------------------- */
function ShoppingScreen({ system, items, pantry, stores, onToggle, go }) {
  const isHouse = system === 'household';
  const [groupBy, setGroupBy] = React.useState('category');
  /* An item's store: its own setting, else the matching pantry item's
     preferred store, else unassigned. */
  function storeFor(it) {
    if (it.store) return it.store;
    const pm = window.findPantryMatch(pantry || [], it.name);
    return (pm && pm.store) || 'No store set';
  }
  const groups = {};
  if (groupBy === 'store') {
    for (const it of items) { const s = storeFor(it); (groups[s] = groups[s] || []).push(it); }
  } else {
    for (const it of items) { (groups[it.category] = groups[it.category] || []).push(it); }
  }
  const groupNames = Object.keys(groups).sort((a, b) => {
    if (groupBy !== 'store') return 0;
    if (a === 'No store set') return 1;
    if (b === 'No store set') return -1;
    return stores.indexOf(a) - stores.indexOf(b);
  });
  const openCount = items.filter((i) => !i.checked).length;

  return (
    <div>
      <header className="page-head">
        <div>
          <h1>{isHouse ? 'Household shopping' : 'Tancook Island Botanicals'}</h1>
          <p className="page-sub">{openCount} item{openCount === 1 ? '' : 's'} to buy{isHouse ? '' : ' · business supplies'}</p>
        </div>
        <div className="page-actions"><button className="btn btn-ghost">Clear checked</button></div>
      </header>

      <div className="seg" style={{ marginBottom: '1rem' }}>
        <button className={'seg-btn' + (isHouse ? ' active' : '')} onClick={() => go('shopping')}>Household</button>
        <button className={'seg-btn' + (!isHouse ? ' active' : '')} onClick={() => go('botanicals')}>Tancook Botanicals</button>
      </div>

      <div className="seg" style={{ marginBottom: '1rem', marginLeft: '.6rem' }} role="group" aria-label="Group items by">
        <button className={'seg-btn' + (groupBy === 'category' ? ' active' : '')} onClick={() => setGroupBy('category')}>By category</button>
        <button className={'seg-btn' + (groupBy === 'store' ? ' active' : '')} onClick={() => setGroupBy('store')}>By store</button>
      </div>

      <p className="hint" style={{ marginBottom: '1rem' }}>Two completely separate lists — they never mix.</p>

      {groupNames.map((cat) => (
        <div key={cat} className="shop-group">
          <div className="shop-group-title">{cat} <small>({groups[cat].length})</small></div>
          <ul className="shop-list">
            {groups[cat].map((it) => (
              <li key={it.name} className={'shop-item' + (it.checked ? ' checked' : '') + (it.priority === 'high' ? ' priority-high' : '')}>
                <label className="shop-check">
                  <input type="checkbox" checked={it.checked} onChange={() => onToggle(system, it.name)} />
                  <span className="shop-name">{it.name}</span>
                </label>
                {it.quantity ? <span className="shop-item-qty">{window.fmtAmount(it.quantity)} {it.unit}</span> : null}
                {it.notes ? <span className="shop-item-note">{it.notes}</span> : null}
                {groupBy === 'category' && storeFor(it) !== 'No store set' ? <span className="chip chip-sm chip-store">{storeFor(it)}</span> : null}
                {it.recurring ? <span className="chip chip-sm">recurring</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ Garden ----------------------------- */
const CAL_MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
function GardenScreen({ garden, onToast }) {
  return (
    <div>
      <header className="page-head">
        <div><h1>Garden</h1><p className="page-sub">Tancook Island · Zone 6a</p></div>
        <div className="page-actions"><button className="btn btn-primary">＋ Add plant</button></div>
      </header>

      <div className="garden-grid">
        {garden.map((g, i) => (
          <article key={i} className="garden-card">
            <div className="garden-card-head">
              <h2>{g.plantName}</h2>
              {g.variety ? <small>{g.variety}</small> : null}
            </div>
            <dl className="garden-facts">
              <div><dt>Location</dt><dd>{g.location}</dd></div>
              <div><dt>Planted</dt><dd>{g.plantDate}</dd></div>
              <div><dt>Harvest</dt><dd>{g.harvestDate}</dd></div>
              <div><dt>This season</dt><dd>{window.fmtAmount(g.quantity)} {g.unit}</dd></div>
            </dl>
            <div className="garden-chips">
              {g.preservation.map((p) => <span key={p} className="chip chip-info">{p}</span>)}
            </div>
            {g.notes ? <p className="garden-notes">{g.notes}</p> : null}
            <button className="btn btn-ghost btn-sm" onClick={() => onToast('Harvest logged for ' + g.plantName)}>Log harvest</button>
          </article>
        ))}
      </div>

      <h2 style={{ marginTop: '1.8rem' }}>Seasonal calendar</h2>
      <div className="planner-grid-wrap">
        <table className="cal-table">
          <thead><tr><th>Plant</th>{CAL_MONTHS.map((m, i) => <th key={i}>{m}</th>)}</tr></thead>
          <tbody>
            {[
              { name: 'Tomato', plant: [4], grow: [5, 6], harvest: [7] },
              { name: 'Sage', plant: [4], grow: [5, 6, 7, 8], harvest: [6, 8] },
              { name: 'Zucchini', plant: [4], grow: [5], harvest: [6, 7] },
              { name: 'Blueberry', plant: [], grow: [5, 6], harvest: [6, 7] },
            ].map((row) => (
              <tr key={row.name}>
                <th>{row.name}</th>
                {CAL_MONTHS.map((m, i) => {
                  let cls = '';
                  if (row.harvest.includes(i)) cls = 'cal-harvest';
                  else if (row.grow.includes(i) || row.plant.includes(i)) cls = 'cal-window';
                  return <td key={i} className={cls}>{row.harvest.includes(i) ? '✦' : ''}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------ Imports ---------------------------- */
const SAMPLE_IMPORT = `{
  "schemaVersion": 1,
  "exportedBy": "AI assistant",
  "operations": [
    { "op": "CREATE_RECIPE", "title": "Roasted Beet Hummus", "category": "Sauces & dressings" },
    { "op": "ADD_PANTRY_ITEM", "name": "Beets", "quantity": 6, "location": "Garden harvest" },
    { "op": "ADD_SHOPPING_ITEM", "name": "Cumin", "category": "Pantry" }
  ]
}`;

const IMPORT_METHODS = [
  { id: 'bulk', label: 'Bulk import' },
  { id: 'web', label: 'Web recipes' },
  { id: 'photo', label: 'Photo import' },
  { id: 'youtube', label: 'YouTube link' },
  { id: 'ai', label: 'AI import' },
];
const DIET_CRITERIA = [
  { id: 'vegan', label: 'Vegan' },
  { id: 'soy-free', label: 'Soy free' },
  { id: 'wheat-free', label: 'Wheat free' },
  { id: 'egg-free', label: 'Egg free' },
];
/* Demo scan results: each found recipe lists ingredients that clash with
   a criterion, and the substitute (null = no good alternative). */

function BulkImport({ onToast, onImportRecipes }) {
  const [source, setSource] = React.useState('');
  const [file, setFile] = React.useState(null);
  const fileRef = React.useRef(null);
  const [crit, setCrit] = React.useState({ vegan: false, 'soy-free': false, 'wheat-free': false, 'egg-free': false });
  const [amend, setAmend] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [drafts, setDrafts] = React.useState(null);   /* parsed recipe drafts, or null */
  const [warning, setWarning] = React.useState('');

  async function scan() {
    const src = file || source.trim();
    if (!src) { onToast('Add a file or URL first', 'error'); return; }
    setBusy(true); setDrafts(null); setWarning('');
    try {
      const { text, warning: w } = await window.parseCookbookSource(src);
      const found = window.extractRecipes(text);
      if (!found.length) {
        setWarning('Read ' + Math.round(text.length / 1000) + 'k characters but couldn’t find recipe-shaped content (a title followed by measured ingredients). If this is a scanned/image PDF there’s no text to read.');
      } else if (w) setWarning(w);
      setDrafts(found);
    } catch (e) {
      onToast(e.message || 'Could not read that source', 'error');
      setDrafts(null);
    }
    setBusy(false);
  }

  const results = (drafts || []).map((d) => ({ ...d, ...window.analyzeDraft(d, crit, amend) }));
  const importable = results.filter((r) => r.status !== 'skip');

  function doImport() {
    onImportRecipes(importable.map((r) => ({
      recipeId: 'imp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      title: r.title, subtitle: 'Imported from ' + (file ? file.name : source),
      category: 'Imported', cuisine: 'Other', mealType: 'Dinner', difficulty: 'Easy',
      prepMinutes: 0, cookMinutes: 0, totalMinutes: 0, servings: 4,
      tags: ['imported'].concat(r.status === 'amend' ? ['amended'] : []),
      ingredients: r.ingredients,
      instructions: r.steps.map((s) => ({ instruction: s })),
      nutrition: { calories: 0, protein: 0, fat: 0, carbs: 0, fibre: 0, sugar: 0 },
    })));
    setDrafts(null); setFile(null); setSource('');
  }

  return (
    <div>
      <div className="form-card">
        <label>Cookbook file or website URL
          <div className="import-source-row">
            <input className="input" placeholder="https://… or drop an EPUB / PDF" value={file ? file.name : source} onChange={(e) => { setSource(e.target.value); setFile(null); setDrafts(null); }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files && e.dataTransfer.files[0]; if (f) { setFile(f); setDrafts(null); } }} />
            <input ref={fileRef} type="file" accept=".epub,.pdf,.html,.htm,.txt,.md" style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) { setFile(f); setDrafts(null); } e.target.value = ''; }} />
            <button className="btn btn-ghost" onClick={() => fileRef.current && fileRef.current.click()}>Choose file…</button>
          </div>
        </label>
        <div className="import-criteria">
          <span className="import-criteria-label">Only keep recipes that are (or can be made):</span>
          <div className="tray-chips">
            {DIET_CRITERIA.map((c) => (
              <button key={c.id} className={'filter-chip filter-chip-sm' + (crit[c.id] ? ' active' : '')} onClick={() => { setCrit({ ...crit, [c.id]: !crit[c.id] }); }}>{c.label}</button>
            ))}
          </div>
          <label className="import-amend">
            <input type="checkbox" checked={amend} onChange={(e) => setAmend(e.target.checked)} />
            Amend recipes with alternative ingredients where possible
          </label>
          <p className="hint" style={{ margin: 0 }}>Recipes import word-for-word. Nothing is substituted unless you pick a diet above and tick “amend” — substituted ingredients keep a “was: …” note.</p>
        </div>
        <div className="import-btns">
          <button className="btn btn-primary" disabled={busy} onClick={scan}>{busy ? 'Reading…' : 'Scan source'}</button>
        </div>
        {warning ? <p className="hint" style={{ color: 'var(--warn, #b98424)' }}>{warning}</p> : null}
      </div>

      {drafts && drafts.length ? (
        <div className="import-preview">
          <h2>{results.length} recipes found · {importable.length} will import</h2>
          <ul className="import-plan">
            {results.map((r, idx) => (
              <li key={idx} className={'import-step ' + (r.status === 'ok' ? 'step-ok' : r.status === 'amend' ? 'step-conflict' : 'step-skip')}>
                <span className="chip chip-sm">{r.status === 'ok' ? 'OK' : r.status === 'amend' ? 'AMENDED' : 'SKIPPED'}</span>
                <span className="import-step-desc">{r.title} <small>· {r.ingredients.length} ingredients · {r.steps.length} steps</small></span>
                <span className="import-step-msg">
                  {r.status === 'ok' ? 'Meets the selected criteria.'
                    : r.status === 'amend' ? r.fixable.map((i) => i.ing + ' → ' + i.sub).join(' · ')
                    : r.blocked.length ? 'No good alternative for ' + r.blocked.map((i) => i.ing).join(', ') + '.'
                    : 'Needs amending — turn on “amend” to fix ' + r.fixable.map((i) => i.ing).join(', ') + '.'}
                </span>
              </li>
            ))}
          </ul>
          <div className="import-btns">
            <button className="btn btn-primary" disabled={!importable.length} onClick={doImport}>Import {importable.length} recipes</button>
            <button className="btn btn-ghost" onClick={() => setDrafts(null)}>Cancel</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* -------- Web recipes: multiple URLs, imported word-for-word ------- */
function WebImportScreen({ onToast, onImportRecipes }) {
  const [urls, setUrls] = React.useState('');
  const [adapt, setAdapt] = React.useState(false);
  const [crit, setCrit] = React.useState({ vegan: false, 'soy-free': false, 'wheat-free': false, 'egg-free': false });
  const [queue, setQueue] = React.useState([]);
  const [busy, setBusy] = React.useState(false);

  async function fetchAll() {
    const list = [...new Set(urls.split(/\s+/).map((s) => s.trim()).filter((s) => /^https?:\/\//i.test(s)))];
    if (!list.length) { onToast('Paste at least one recipe link (starting with https://)', 'error'); return; }
    setBusy(true);
    setQueue(list.map((u) => ({ url: u, status: 'fetching' })));
    await Promise.all(list.map(async (u, i) => {
      try {
        const html = await window.WebImport.fetchTextCors(u);
        const drafts = window.WebImport.extractWebRecipes(html, u);
        if (!drafts.length) throw new Error('No recipe found on that page');
        setQueue((q) => q.map((it, k) => (k === i ? { ...it, status: 'ready', draft: drafts[0] } : it)));
      } catch (e) {
        setQueue((q) => q.map((it, k) => (k === i ? { ...it, status: 'error', error: e.message || 'Could not read that page' } : it)));
      }
    }));
    setBusy(false);
  }
  const ready = queue.filter((q) => q.status === 'ready');
  function doImport() {
    onImportRecipes(ready.map((q) => window.WebImport.draftToRecipe(q.draft, { crit: adapt ? crit : null })));
    setQueue([]); setUrls('');
  }
  return (
    <div>
      <div className="form-card">
        <label>Recipe links — one per line
          <textarea className="input import-textarea" rows="4" placeholder={'https://…/best-focaccia\nhttps://…/lentil-dal'} value={urls} onChange={(e) => setUrls(e.target.value)}></textarea>
        </label>
        <p className="hint">Each link becomes its own recipe. Ingredients, amounts, times and method are kept exactly as published — only the page's editorial writing is replaced with a one-line factual summary, and the recipe photo is linked for personal reference.</p>
        <label className="import-amend">
          <input type="checkbox" checked={adapt} onChange={(e) => setAdapt(e.target.checked)} />
          Adapt ingredients to my dietary preferences (otherwise nothing is changed)
        </label>
        {adapt ? (
          <div className="tray-chips" style={{ marginTop: '.4rem' }}>
            {DIET_CRITERIA.map((c) => (
              <button key={c.id} className={'filter-chip filter-chip-sm' + (crit[c.id] ? ' active' : '')} onClick={() => setCrit({ ...crit, [c.id]: !crit[c.id] })}>{c.label}</button>
            ))}
          </div>
        ) : null}
        <div className="import-btns">
          <button className="btn btn-primary" disabled={busy} onClick={fetchAll}>{busy ? 'Fetching…' : 'Fetch recipes'}</button>
        </div>
      </div>

      {queue.length ? (
        <div className="import-preview">
          <h2>{ready.length} of {queue.length} link{queue.length === 1 ? '' : 's'} ready</h2>
          <ul className="import-plan">
            {queue.map((q, i) => (
              <li key={i} className={'import-step ' + (q.status === 'ready' ? 'step-ok' : q.status === 'error' ? 'step-skip' : 'step-conflict')}>
                <span className="chip chip-sm">{q.status === 'ready' ? 'READY' : q.status === 'error' ? 'FAILED' : 'FETCHING'}</span>
                <span className="import-step-desc">{q.draft ? q.draft.title : q.url}{q.draft ? <small> · {q.draft.host} · {q.draft.ingredients.length} ingredients · {q.draft.steps.length} steps{q.draft.exact ? '' : ' · read heuristically — review after import'}</small> : null}</span>
                <span className="import-step-msg">{q.status === 'error' ? q.error : ''}</span>
                <button className="icon-btn" aria-label="Remove from queue" title="Remove" onClick={() => setQueue(queue.filter((_, k) => k !== i))}>×</button>
              </li>
            ))}
          </ul>
          <div className="import-btns">
            <button className="btn btn-primary" disabled={!ready.length || busy} onClick={doImport}>Import {ready.length} recipe{ready.length === 1 ? '' : 's'}</button>
            <button className="btn btn-ghost" onClick={() => setQueue([])}>Clear queue</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const PHOTO_SLOTS = ['Title & ingredients', 'Method', 'Extra page (optional)'];
function PhotoImport({ onToast, onImportRecipes }) {
  const [photos, setPhotos] = React.useState([null, null, null]);
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [text, setText] = React.useState(null);   /* OCR text, user-editable */
  const [drafts, setDrafts] = React.useState(null);
  const count = photos.filter(Boolean).length;

  function setPhoto(i, file) {
    const next = photos.slice();
    next[i] = file ? { name: file.name, url: URL.createObjectURL(file), file } : null;
    setPhotos(next); setText(null); setDrafts(null);
  }
  async function readPhotos() {
    if (!count) { onToast('Add at least one photo', 'error'); return; }
    setBusy(true); setProgress(0); setText(null); setDrafts(null);
    try {
      const t = (await window.WebImport.ocrImages(photos.filter(Boolean).map((p) => p.file), setProgress)).trim();
      setText(t);
      const found = extractRecipes(t);
      if (found.length) setDrafts(found);
    } catch (e) { onToast(e.message || 'Could not read the photos', 'error'); }
    setBusy(false);
  }
  function parseNow(t) {
    const found = extractRecipes(t || '');
    if (!found.length) { onToast('No measured ingredient lines found — tidy the text so each ingredient is on its own line', 'error'); return; }
    setDrafts(found);
  }
  function doImport() {
    onImportRecipes(drafts.map((d) => window.WebImport.draftToRecipe(d, { subtitle: 'Imported from photo' })));
    setPhotos([null, null, null]); setText(null); setDrafts(null);
  }
  return (
    <div>
      <div className="form-card">
        <p className="hint" style={{ marginTop: 0 }}>Up to 3 photos of one recipe — a cookbook page, a recipe card, a printed note. Text is read on this device; nothing is uploaded.</p>
        <div className="photo-slots">
          {PHOTO_SLOTS.map((label, i) => (
            <label key={i} className={'photo-slot' + (photos[i] ? ' filled' : '')}>
              {photos[i] ? <img src={photos[i].url} alt={'Photo ' + (i + 1)} /> : <span className="photo-slot-plus">＋</span>}
              <span className="photo-slot-label">{photos[i] ? photos[i].name : label}</span>
              <input type="file" accept="image/*" onChange={(e) => setPhoto(i, e.target.files[0])} />
            </label>
          ))}
        </div>
        <div className="import-btns">
          <button className="btn btn-primary" disabled={busy} onClick={readPhotos}>{busy ? 'Reading… ' + Math.round(progress * 100) + '%' : 'Read text from ' + (count || '') + ' photo' + (count === 1 ? '' : 's')}</button>
          {count ? <button className="btn btn-ghost" disabled={busy} onClick={() => { setPhotos([null, null, null]); setText(null); setDrafts(null); }}>Clear photos</button> : null}
        </div>
        {busy ? <div style={{ height: 6, borderRadius: 3, background: 'var(--border)', marginTop: '.6rem' }}><div style={{ height: '100%', borderRadius: 3, background: 'var(--primary)', width: (progress * 100) + '%', transition: 'width .2s' }}></div></div> : null}
      </div>

      {text !== null ? (
        <div className="import-preview">
          <h2>Text read from the photo{count === 1 ? '' : 's'}</h2>
          <p className="hint" style={{ marginTop: 0 }}>Fix any misread words below — the recipe imports word-for-word from this text.</p>
          <textarea className="input import-textarea" rows="10" value={text} onChange={(e) => { setText(e.target.value); setDrafts(null); }} style={{ fontFamily: 'var(--font-mono)' }}></textarea>
          <div className="import-btns">
            <button className="btn btn-primary" onClick={() => parseNow(text)}>Find the recipe</button>
          </div>
          {drafts && drafts.length ? (
            <div>
              <ul className="import-plan">
                {drafts.map((d, i) => (
                  <li key={i} className="import-step step-ok"><span className="chip chip-sm">FOUND</span><span className="import-step-desc">{d.title}</span><span className="import-step-msg">{d.ingredients.length} ingredients · {d.steps.length} steps.</span></li>
                ))}
              </ul>
              <div className="import-btns">
                <button className="btn btn-primary" onClick={doImport}>Save {drafts.length === 1 ? '“' + drafts[0].title + '”' : drafts.length + ' recipes'} to Recipes</button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function YouTubeImport({ onToast, onImportRecipes }) {
  const [url, setUrl] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [meta, setMeta] = React.useState(null);
  const [desc, setDesc] = React.useState('');
  const [descAuto, setDescAuto] = React.useState(false);
  const [draft, setDraft] = React.useState(null);

  async function fetchVideo() {
    const vid = window.WebImport.ytVideoId(url);
    if (!vid) { onToast('That doesn’t look like a YouTube link', 'error'); return; }
    setBusy(true); setMeta(null); setDraft(null); setDesc(''); setDescAuto(false);
    let m = { title: 'YouTube video', author: '', thumb: 'https://i.ytimg.com/vi/' + vid + '/hqdefault.jpg' };
    try { m = { ...m, ...(await window.WebImport.ytMetadata(url)) }; } catch (e) {}
    setMeta({ ...m, vid });
    try {
      const d = await window.WebImport.ytDescription(vid);
      if (d) {
        setDesc(d); setDescAuto(true);
        const found = extractRecipes(d);
        if (found.length) setDraft(found[0]);
      }
    } catch (e) {}
    setBusy(false);
  }
  function parseNow() {
    const found = extractRecipes(desc || '');
    if (!found.length) { onToast('No measured ingredient lines found — paste the recipe part of the description', 'error'); return; }
    setDraft(found[0]);
  }
  function doImport() {
    onImportRecipes([window.WebImport.draftToRecipe({ ...draft, title: draft.title === 'Untitled recipe' ? meta.title : draft.title, sourceUrl: url, image: meta.thumb }, { subtitle: 'From YouTube' + (meta.author ? ' · ' + meta.author : '') })]);
    setUrl(''); setMeta(null); setDesc(''); setDraft(null);
  }
  return (
    <div>
      <div className="form-card">
        <label>Video link
          <div className="import-source-row">
            <input className="input" type="url" placeholder="https://youtube.com/watch?v=…" value={url} onChange={(e) => { setUrl(e.target.value); setMeta(null); setDraft(null); }} />
            <button className="btn btn-primary" disabled={busy} onClick={fetchVideo}>{busy ? 'Fetching…' : 'Fetch'}</button>
          </div>
        </label>
        <p className="hint">The recipe is read from the video's description box — that's where cooking channels publish the ingredient list. If the description can't be fetched, paste it below.</p>
      </div>

      {meta ? (
        <div className="import-preview">
          <div className="yt-card">
            <img src={meta.thumb} alt="" style={{ width: '5.5rem', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '6px' }} />
            <div>
              <strong>{meta.title}</strong>
              {meta.author ? <small>{meta.author}</small> : null}
            </div>
          </div>
          <p className="hint" style={{ margin: '.6rem 0 .2rem' }}>{descAuto ? 'Description fetched — edit if needed:' : 'Paste the video description (or the recipe from a pinned comment):'}</p>
          <textarea className="input import-textarea" rows="8" value={desc} onChange={(e) => { setDesc(e.target.value); setDraft(null); }} style={{ fontFamily: 'var(--font-mono)' }}></textarea>
          <div className="import-btns">
            <button className="btn btn-primary" onClick={parseNow}>Find the recipe</button>
          </div>
          {draft ? (
            <div>
              <ul className="import-plan">
                <li className="import-step step-ok"><span className="chip chip-sm">FOUND</span><span className="import-step-desc">{draft.title === 'Untitled recipe' ? meta.title : draft.title}</span><span className="import-step-msg">{draft.ingredients.length} ingredients · {draft.steps.length} steps, word-for-word.</span></li>
              </ul>
              <div className="import-btns">
                <button className="btn btn-primary" onClick={doImport}>Import recipe</button>
                <button className="btn btn-ghost" onClick={() => setDraft(null)}>Cancel</button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function AiImport({ onToast }) {
  const [text, setText] = React.useState(SAMPLE_IMPORT);
  const [previewed, setPreviewed] = React.useState(false);
  return (
    <div>
      <div className="form-card">
        <div className="import-input">
          <label>Import JSON
            <textarea className="input import-textarea" rows="9" value={text} onChange={(e) => setText(e.target.value)} style={{ fontFamily: 'var(--font-mono)' }}></textarea>
          </label>
          <div className="import-btns">
            <button className="btn btn-primary" onClick={() => setPreviewed(true)}>Preview changes</button>
            <button className="btn btn-ghost" onClick={() => { setText(''); setPreviewed(false); }}>Clear</button>
          </div>
        </div>
      </div>

      {previewed ? (
        <div className="import-preview">
          <h2>3 changes ready</h2>
          <ul className="import-plan">
            <li className="import-step step-ok"><span className="chip chip-sm">CREATE_RECIPE</span><span className="import-step-desc">Roasted Beet Hummus</span><span className="import-step-msg">New recipe in Sauces &amp; dressings.</span></li>
            <li className="import-step step-conflict"><span className="chip chip-sm">ADD_PANTRY_ITEM</span><span className="import-step-desc">Beets — 6, Garden harvest</span><span className="import-step-msg">Similar item exists; will merge quantities.</span></li>
            <li className="import-step step-ok"><span className="chip chip-sm">ADD_SHOPPING_ITEM</span><span className="import-step-desc">Cumin → Household · Pantry</span></li>
          </ul>
          <div className="import-btns">
            <button className="btn btn-primary" onClick={() => { setPreviewed(false); onToast('Import applied · 3 changes'); }}>Apply import</button>
            <button className="btn btn-ghost" onClick={() => setPreviewed(false)}>Cancel</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ImportScreen({ onToast, onImportRecipes }) {
  const [method, setMethod] = React.useState('bulk');
  const subtitles = {
    bulk: 'Read a whole digital cookbook or website, keep what fits your diet, amend the rest',
    web: 'Paste one or more recipe links — each becomes its own recipe, word-for-word',
    photo: 'Snap up to 3 pictures of a single recipe — read on-device',
    youtube: 'Turn a cooking video into a recipe',
    ai: 'Paste a structured update from your assistant',
  };
  return (
    <div>
      <header className="page-head">
        <div><h1>Imports</h1><p className="page-sub">{subtitles[method]}</p></div>
      </header>
      <div className="seg" style={{ marginBottom: '1rem' }}>
        {IMPORT_METHODS.map((m) => (
          <button key={m.id} className={'seg-btn' + (method === m.id ? ' active' : '')} onClick={() => setMethod(m.id)}>{m.label}</button>
        ))}
      </div>
      {method === 'bulk' ? <BulkImport onToast={onToast} onImportRecipes={onImportRecipes} /> : method === 'web' ? <WebImportScreen onToast={onToast} onImportRecipes={onImportRecipes} /> : method === 'photo' ? <PhotoImport onToast={onToast} onImportRecipes={onImportRecipes} /> : method === 'youtube' ? <YouTubeImport onToast={onToast} onImportRecipes={onImportRecipes} /> : <AiImport onToast={onToast} />}
    </div>
  );
}

/* ------------------------------ Settings --------------------------- */
function SettingsScreen({ user, onSignOut, theme, onTheme, measure, onMeasure, stores, onStores, keepAwake, onKeepAwake, densities, onDensities, onErase, onToast }) {
  const [confirmErase, setConfirmErase] = React.useState(false);
  const [scale, setScale] = React.useState(1);
  const [newStore, setNewStore] = React.useState('');
  const [sgQuery, setSgQuery] = React.useState('');
  const [newSg, setNewSg] = React.useState({ key: '', sg: '' });
  const sgShown = densities
    .map((d, idx) => ({ ...d, idx }))
    .filter((d) => d.key.indexOf(sgQuery.toLowerCase().trim()) !== -1)
    .sort((a, b) => a.key.localeCompare(b.key));
  function setSg(idx, patch) { onDensities(densities.map((d, i) => (i === idx ? { ...d, ...patch } : d))); }
  React.useEffect(() => { document.documentElement.style.setProperty('--font-scale', scale); return () => document.documentElement.style.setProperty('--font-scale', 1); }, [scale]);

  return (
    <div>
      <header className="page-head"><h1>Settings</h1></header>
      <div className="settings-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
        <fieldset className="form-card">
          <legend>Account</legend>
          <p style={{ margin: '0 0 .3rem' }}><strong>{user ? user.username : ''}</strong> <small style={{ color: 'var(--text-soft)' }}>· {user ? user.email : ''}</small></p>
          <p className="hint" style={{ marginTop: 0 }}>Each account keeps its own recipes, pantry, plans and settings on this device.</p>
          <button className="btn btn-ghost" onClick={onSignOut}>Sign out</button>
        </fieldset>

        <fieldset className="form-card">
          <legend>Appearance</legend>
          <div className="seg">
            {['light', 'dark', 'auto'].map((t) => (
              <button key={t} className={'seg-btn' + (t === theme ? ' active' : '')} onClick={() => onTheme(t)}>{t[0].toUpperCase() + t.slice(1)}</button>
            ))}
          </div>
          <label style={{ marginTop: '.6rem' }}>Font size
            <input type="range" min="0.9" max="1.3" step="0.05" value={scale} onChange={(e) => setScale(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
          </label>
        </fieldset>

        <fieldset className="form-card">
          <legend>Measurements</legend>
          <div className="seg">
            <button className={'seg-btn' + (measure.system === 'metric' ? ' active' : '')} onClick={() => onMeasure({ ...measure, system: 'metric' })}>Metric</button>
            <button className={'seg-btn' + (measure.system === 'imperial' ? ' active' : '')} onClick={() => onMeasure({ ...measure, system: 'imperial' })}>Imperial</button>
          </div>
          <div className="seg" style={{ marginTop: '.5rem' }}>
            <button className={'seg-btn' + (measure.form === 'volume' ? ' active' : '')} onClick={() => onMeasure({ ...measure, form: 'volume' })}>Volume</button>
            <button className={'seg-btn' + (measure.form === 'weight' ? ' active' : '')} onClick={() => onMeasure({ ...measure, form: 'weight' })}>Weight</button>
          </div>
          <p className="hint">Global default — each recipe has its own switch too. Volume ↔ weight uses each ingredient's specific gravity (flour ≠ honey), never a water standard; ingredients with unknown density stay in their native form. Amounts convert on display; stored data never changes.</p>
        </fieldset>

        <fieldset className="form-card">
          <legend>Screen</legend>
          <label className="import-amend">
            <input type="checkbox" checked={keepAwake} onChange={(e) => onKeepAwake(e.target.checked)} />
            Keep the screen awake
          </label>
          <p className="hint">Stops the phone from dimming, locking or sleeping while the app is open — handy mid-recipe with floury hands.</p>
        </fieldset>

        <fieldset className="form-card">
          <legend>Stores</legend>
          <p className="hint" style={{ marginTop: 0 }}>Used to group the shopping list by store. Set each item's preferred store in the pantry.</p>
          <ul className="store-list">
            {stores.map((s) => (
              <li key={s}><span>{s}</span>
                <button className="icon-btn" aria-label={'Remove ' + s} title="Remove store" onClick={() => onStores(stores.filter((x) => x !== s))}>×</button>
              </li>
            ))}
          </ul>
          <div className="import-source-row">
            <input className="input" placeholder="Add a store…" value={newStore} onChange={(e) => setNewStore(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && newStore.trim()) { onStores([...stores, newStore.trim()]); setNewStore(''); } }} />
            <button className="btn btn-ghost" onClick={() => { if (newStore.trim()) { onStores([...stores, newStore.trim()]); setNewStore(''); } }}>Add</button>
          </div>
        </fieldset>

        <fieldset className="form-card">
          <legend>Ingredient specific gravity</legend>
          <p className="hint" style={{ marginTop: 0 }}>The source of truth for volume ↔ weight conversion, in g/ml. “Packed” is for dry ingredients pressed into the measure (brown sugar, flour…) — leave it blank for everything else. New pantry ingredients are added automatically; blank loose value = unknown (that ingredient stays in its native form).</p>
          <input className="input" type="search" placeholder="Search ingredients…" value={sgQuery} onChange={(e) => setSgQuery(e.target.value)} />
          <ul className="sg-list">
            <li className="sg-head" aria-hidden="true"><span className="sg-key"></span><span className="sg-col">loose</span><span className="sg-col">packed</span><span className="sg-x-pad"></span></li>
            {sgShown.map((d) => (
              <li key={d.idx}>
                <span className="sg-key">{d.key}</span>
                <input type="number" min="0" step="0.01" value={d.sg == null ? '' : d.sg} placeholder="?" aria-label={d.key + ' loose specific gravity'}
                  onChange={(e) => setSg(d.idx, { sg: e.target.value === '' ? null : Math.max(0, Number(e.target.value)) })} />
                <input type="number" min="0" step="0.01" value={d.packed == null ? '' : d.packed} placeholder="–" aria-label={d.key + ' packed specific gravity'}
                  onChange={(e) => setSg(d.idx, { packed: e.target.value === '' ? null : Math.max(0, Number(e.target.value)) })} />
                <button className="icon-btn" aria-label={'Remove ' + d.key} title="Remove" onClick={() => onDensities(densities.filter((_, i) => i !== d.idx))}>×</button>
              </li>
            ))}
            {sgShown.length === 0 ? <li className="hint">No ingredients match “{sgQuery}”.</li> : null}
          </ul>
          <div className="import-source-row">
            <input className="input" placeholder="Ingredient…" value={newSg.key} onChange={(e) => setNewSg({ ...newSg, key: e.target.value })} />
            <input className="input sg-add-val" type="number" min="0" step="0.01" placeholder="g/ml" value={newSg.sg} onChange={(e) => setNewSg({ ...newSg, sg: e.target.value })} />
            <button className="btn btn-ghost" onClick={() => {
              const k = newSg.key.toLowerCase().trim();
              if (!k) return;
              if (densities.some((d) => d.key === k)) { onToast('“' + k + '” is already in the list', 'error'); return; }
              onDensities([...densities, { key: k, sg: newSg.sg === '' ? null : Math.max(0, Number(newSg.sg)), packed: null }]);
              setNewSg({ key: '', sg: '' });
            }}>Add</button>
          </div>
        </fieldset>

        <fieldset className="form-card">
          <legend>Backup</legend>
          <div className="btn-col" style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            <button className="btn btn-ghost" onClick={() => onToast('Backup exported')}>Export everything (JSON)</button>
            <button className="btn btn-ghost">Import backup…</button>
          </div>
          <ul className="snapshot-list" style={{ listStyle: 'none', margin: '.6rem 0 0', padding: 0 }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '.45em 0', borderBottom: '1px solid var(--border)', fontSize: '.92em' }}><span>Auto · today 06:00 <small style={{ display: 'block', color: 'var(--text-soft)' }}>{(window.CookbookData ? window.CookbookData.recipes.length : 0)} recipes, {(window.CookbookData ? window.CookbookData.pantry.length : 0)} pantry</small></span><button className="btn btn-ghost btn-sm">Restore</button></li>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '.45em 0', fontSize: '.92em' }}><span>Auto · yesterday 06:00</span><button className="btn btn-ghost btn-sm">Restore</button></li>
          </ul>
        </fieldset>

        <fieldset className="form-card danger-card" style={{ borderColor: 'color-mix(in srgb, var(--danger) 45%, var(--border))' }}>
          <legend style={{ color: 'var(--danger)' }}>Danger zone</legend>
          <p className="hint">Erases only {user ? user.username : 'this account'}’s data on this device — other accounts are untouched.</p>
          {confirmErase ? (
            <div className="pantry-editor-actions">
              <button className="btn btn-danger-ghost" onClick={() => onErase()}>Yes — erase everything and restart</button>
              <button className="btn btn-ghost" onClick={() => setConfirmErase(false)}>Keep my data</button>
            </div>
          ) : (
            <button className="btn btn-danger-ghost" onClick={() => setConfirmErase(true)}>Erase all data</button>
          )}
        </fieldset>
      </div>
    </div>
  );
}

/* ------------------------------ Login ------------------------------ */
function LoginScreen({ onLogin }) {
  const [mode, setMode] = React.useState('signin');
  const [id, setId] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [pw2, setPw2] = React.useState('');
  const [err, setErr] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  async function submit(e) {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      if (mode === 'signin') {
        const u = await window.CBAuth.verify(id, pw);
        if (!u) throw new Error('Wrong name/email or password');
        onLogin(u);
      } else {
        if (pw !== pw2) throw new Error('Passwords don’t match');
        onLogin(await window.CBAuth.create(id, email, pw));
      }
    } catch (ex) { setErr(ex.message || 'Something went wrong'); }
    setBusy(false);
  }
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '1.5rem' }}>
      <form className="form-card" style={{ width: 'min(92vw, 24rem)' }} onSubmit={submit}>
        <div style={{ textAlign: 'center', marginBottom: '.75rem' }}>
          {typeof BrandMark !== 'undefined' ? <BrandMark size={44} /> : null}
          <h1 style={{ margin: '.4rem 0 .1rem' }}>myCookbook</h1>
          <p className="hint" style={{ margin: 0 }}>Recipes, planning and pantry — all on this device.</p>
        </div>
        <div className="seg" style={{ marginBottom: '.9rem' }}>
          <button type="button" className={'seg-btn' + (mode === 'signin' ? ' active' : '')} onClick={() => { setMode('signin'); setErr(''); }}>Sign in</button>
          <button type="button" className={'seg-btn' + (mode === 'create' ? ' active' : '')} onClick={() => { setMode('create'); setErr(''); }}>Create account</button>
        </div>
        <label>{mode === 'signin' ? 'Name or email' : 'Your name'}
          <input className="input" value={id} autoFocus autoCapitalize="none" onChange={(e) => setId(e.target.value)} placeholder={mode === 'signin' ? 'Name or you@example.com' : 'Shown as “…’s Cookbook”'} />
        </label>
        {mode === 'create' ? (
          <label>Email
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
        ) : null}
        <label>Password
          <input className="input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
        </label>
        {mode === 'create' ? (
          <label>Password again
            <input className="input" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} />
          </label>
        ) : null}
        {err ? <p className="hint" style={{ color: 'var(--danger)' }}>{err}</p> : null}
        <button className="btn btn-primary" disabled={busy} style={{ width: '100%', marginTop: '.6rem' }}>{busy ? 'One moment…' : mode === 'signin' ? 'Open my cookbook' : 'Create my cookbook'}</button>
        {mode === 'create' ? <p className="hint">New cookbooks start with 25 staples — 5 each of breakfasts, lunches, dinners, desserts and snacks.</p> : null}
      </form>
    </div>
  );
}

Object.assign(window, { PlannerScreen, PantryScreen, ShoppingScreen, GardenScreen, ImportScreen, SettingsScreen, LoginScreen });
