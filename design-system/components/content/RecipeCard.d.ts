import * as React from 'react';

/** The subset of a recipe a card renders (see docs/SCHEMA.md). */
export interface RecipeCardData {
  title: string;
  subtitle?: string;
  category?: string;
  /** Total minutes (prep + cook); shown only when > 0. */
  totalMinutes?: number;
  difficulty?: 'Easy' | 'Medium' | 'Involved' | string;
  favourite?: boolean;
  /** data: URL or path; falls back to a gradient initial placeholder. */
  photo?: string | null;
}

/**
 * The cookbook's signature recipe tile — photo (or gradient placeholder),
 * title with optional favourite star, subtitle, and a category · time ·
 * difficulty meta line. Lifts on hover. Used on the dashboard, the recipe
 * list, and "related recipes".
 */
export interface RecipeCardProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  recipe: RecipeCardData;
  /** Link target (a recipe detail route). */
  href?: string;
  className?: string;
}

export function RecipeCard(props: RecipeCardProps): JSX.Element;
