/**
 * dashboard.js — the home screen.
 *
 * Route: #/dashboard (default)
 *
 * Cards: today's meals, favourites, recently added, pantry alerts,
 * shopping summary (both systems, clearly separated), garden harvests,
 * season + weather placeholder, quick actions, statistics, recent activity.
 */

import { dbGetAll } from './database.js';
import { esc, todayISO, fmtDate, fmtAmount, relTime, seasonOf, sortBy } from './utilities.js';
import { recipeCardHTML } from './recipes.js';
import { pantryAlerts } from './pantry.js';
import { recentHarvests } from './garden.js';
import { plansInRange } from './planner.js';

export async function renderDashboard(main) {
  const today = todayISO();
  const [recipes, pantry, household, botanicals, garden, activity, todayPlans] = await Promise.all([
    dbGetAll('recipes'), dbGetAll('pantry'),
    dbGetAll('shoppingHousehold'), dbGetAll('shoppingBotanicals'),
    dbGetAll('garden'), dbGetAll('activity'),
    plansInRange(today, today),
  ]);

  const favourites = sortBy(recipes.filter(r => r.favourite), r => r.modified, true).slice(0, 4);
  const recent = sortBy(recipes, r => r.created, true).slice(0, 4);
  const alerts = pantryAlerts(pantry);
  const harvests = recentHarvests(garden, 4);
  const hhOpen = household.filter(i => !i.checked).length;
  const botOpen = botanicals.filter(i => !i.checked).length;
  const season = seasonOf();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  main.innerHTML = `
    <header class="page-head dash-head">
      <div>
        <h1>${greeting}, Sharon</h1>
        <p class="page-sub">${fmtDate(today, true)} · ${season} ${{ Spring: '🌱', Summer: '🌿', Autumn: '🍂', Winter: '❄' }[season]}</p>
      </div>
    </header>

    <div class="dash-grid">

      <section class="dash-card dash-today">
        <h2>Today's meals</h2>
        ${todayPlans.length ? `
          <ul class="dash-meal-list">
            ${sortBy(todayPlans, p => ['Breakfast', 'Lunch', 'Dinner', 'Snack'].indexOf(p.mealType)).map(p => `
              <li class="${p.completed ? 'done' : ''}">
                <span class="dash-meal-type">${esc(p.mealType)}</span>
                ${p.recipe ? `<a href="#/recipe/${esc(p.recipe.recipeId)}">${esc(p.recipe.title)}</a>` : '<em>(recipe removed)</em>'}
                <small>${p.servings} serv${p.completed ? ' · ✓ cooked' : ''}</small>
              </li>`).join('')}
          </ul>`
        : `<p class="dash-empty">Nothing planned for today.</p>`}
        <a class="dash-link" href="#/planner">Open the planner →</a>
      </section>

      <section class="dash-card">
        <h2>Quick actions</h2>
        <div class="dash-actions">
          <a class="btn btn-primary" href="#/recipe-edit/new">＋ New recipe</a>
          <a class="btn btn-ghost" href="#/planner">Plan meals</a>
          <a class="btn btn-ghost" href="#/shopping">Household list</a>
          <a class="btn btn-ghost" href="#/import">AI import</a>
        </div>
      </section>

      <section class="dash-card ${alerts.expired.length ? 'dash-card-warn' : ''}">
        <h2>Pantry alerts</h2>
        ${(alerts.expired.length + alerts.expiring.length + alerts.low.length) ? `
          <ul class="dash-alert-list">
            ${alerts.expired.slice(0, 3).map(i => `<li><span class="chip chip-danger">expired</span> ${esc(i.name)}</li>`).join('')}
            ${alerts.expiring.slice(0, 3).map(i => `<li><span class="chip chip-warn">soon</span> ${esc(i.name)} <small>${fmtDate(i.expiry)}</small></li>`).join('')}
            ${alerts.low.slice(0, 3).map(i => `<li><span class="chip chip-info">low</span> ${esc(i.name)} <small>${fmtAmount(i.quantity)} ${esc(i.unit)}</small></li>`).join('')}
          </ul>`
        : `<p class="dash-empty">All good — nothing expiring, nothing low.</p>`}
        <a class="dash-link" href="#/pantry">Open the pantry →</a>
      </section>

      <section class="dash-card">
        <h2>Shopping</h2>
        <ul class="dash-shop-summary">
          <li><a href="#/shopping"><strong>${hhOpen}</strong> household item${hhOpen === 1 ? '' : 's'} to buy</a></li>
          <li><a href="#/botanicals"><strong>${botOpen}</strong> Tancook Botanicals item${botOpen === 1 ? '' : 's'} to buy</a></li>
        </ul>
        <p class="hint">Two separate lists — they never mix.</p>
      </section>

      <section class="dash-card">
        <h2>Garden harvest</h2>
        ${harvests.length ? `
          <ul class="dash-harvest-list">
            ${harvests.map(h => `<li>${esc(h.plant)} — ${fmtAmount(h.quantity)} ${esc(h.unit || '')} <small>${fmtDate(h.date)}</small></li>`).join('')}
          </ul>`
        : `<p class="dash-empty">No harvests logged yet.</p>`}
        <a class="dash-link" href="#/garden">Open the garden →</a>
      </section>

      <section class="dash-card dash-weather">
        <h2>Weather</h2>
        <p class="dash-empty">Weather for Tancook Island is coming in a future version — the cookbook never needs the internet, so this stays optional.</p>
      </section>

      ${favourites.length ? `
      <section class="dash-card dash-wide">
        <h2>Favourites</h2>
        <div class="recipe-grid recipe-grid-sm">${favourites.map(recipeCardHTML).join('')}</div>
      </section>` : ''}

      ${recent.length ? `
      <section class="dash-card dash-wide">
        <h2>Recently added</h2>
        <div class="recipe-grid recipe-grid-sm">${recent.map(recipeCardHTML).join('')}</div>
      </section>` : ''}

      <section class="dash-card">
        <h2>Statistics</h2>
        <table class="stats-table"><tbody>
          <tr><th scope="row">Recipes</th><td>${recipes.length}</td></tr>
          <tr><th scope="row">Favourites</th><td>${recipes.filter(r => r.favourite).length}</td></tr>
          <tr><th scope="row">Pantry items</th><td>${pantry.length}</td></tr>
          <tr><th scope="row">Garden plantings</th><td>${garden.length}</td></tr>
        </tbody></table>
      </section>

      <section class="dash-card">
        <h2>Recent activity</h2>
        ${activity.length ? `
          <ul class="dash-activity">
            ${sortBy(activity, a => a.time, true).slice(0, 6).map(a =>
              `<li>${esc(a.summary)} <small>${relTime(a.time)}</small></li>`).join('')}
          </ul>`
        : `<p class="dash-empty">Activity will appear here as you cook, plan and shop.</p>`}
      </section>
    </div>
  `;
}
