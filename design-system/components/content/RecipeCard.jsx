/**
 * RecipeCard — the cookbook's signature tile.
 *
 * Reproduces the app's shared recipe card (recipes.js → recipeCardHTML):
 * a 16:10 photo (or a gradient placeholder showing the title's first
 * letter in the display serif), then title with an optional favourite
 * star, subtitle, and a category · time · difficulty meta line. Lifts on
 * hover. Pass a `recipe` object.
 */
export function RecipeCard({ recipe, href = '#', className = '', ...rest }) {
  const r = recipe || {};
  const cls = ['recipe-card', className].filter(Boolean).join(' ');
  const firstLetter = (r.title || '?').trim().charAt(0).toUpperCase() || '?';
  return (
    <a className={cls} href={href} {...rest}>
      {r.photo ? (
        <img className="recipe-card-img" src={r.photo} alt="" loading="lazy" />
      ) : (
        <div className="recipe-card-img recipe-card-placeholder" aria-hidden="true">{firstLetter}</div>
      )}
      <div className="recipe-card-body">
        <h3 className="recipe-card-title">
          {r.title}
          {r.favourite ? <span className="fav-star" aria-label="favourite"> ★</span> : null}
        </h3>
        {r.subtitle ? <p className="recipe-card-sub">{r.subtitle}</p> : null}
        <p className="recipe-card-meta">
          {r.category ? <span>{r.category}</span> : null}
          {r.totalMinutes ? <span>· {r.totalMinutes} min</span> : null}
          {r.difficulty ? <span>· {r.difficulty}</span> : null}
        </p>
      </div>
    </a>
  );
}
