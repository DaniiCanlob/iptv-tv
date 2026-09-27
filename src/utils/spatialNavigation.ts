import {
  NAV_ATTR,
  NAV_DEFAULT_ATTR,
  NAV_EDGE_TOLERANCE_PX,
  NAV_SCOPE_ATTR,
  NAV_SECONDARY_AXIS_WEIGHT,
} from '../common/constants';
import type { NavDirection, Point } from '../common/types';

function center(rect: DOMRect): Point {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

/** The innermost open scope (e.g. a modal) or the whole document. */
export function activeNavScope(): ParentNode {
  const scopes = document.querySelectorAll<HTMLElement>(`[${NAV_SCOPE_ATTR}]`);
  return scopes.length > 0 ? scopes[scopes.length - 1] : document;
}

export function navCandidates(scope: ParentNode): HTMLElement[] {
  return Array.from(scope.querySelectorAll<HTMLElement>(`[${NAV_ATTR}]`)).filter(
    (el) => !el.hasAttribute('disabled') && el.getClientRects().length > 0,
  );
}

export function defaultNavTarget(scope: ParentNode): HTMLElement | null {
  return (
    scope.querySelector<HTMLElement>(`[${NAV_DEFAULT_ATTR}]`) ?? navCandidates(scope)[0] ?? null
  );
}

/** Picks the closest candidate in the given direction, favouring aligned elements. */
export function findNextFocusable(
  current: HTMLElement,
  direction: NavDirection,
  candidates: HTMLElement[],
): HTMLElement | null {
  const from = current.getBoundingClientRect();
  const origin = center(from);
  let best: HTMLElement | null = null;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const el of candidates) {
    if (el === current) continue;
    const rect = el.getBoundingClientRect();
    const target = center(rect);
    let primary: number;
    let secondary: number;

    switch (direction) {
      case 'right':
        if (rect.left < from.right - NAV_EDGE_TOLERANCE_PX) continue;
        primary = rect.left - from.right;
        secondary = Math.abs(target.y - origin.y);
        break;
      case 'left':
        if (rect.right > from.left + NAV_EDGE_TOLERANCE_PX) continue;
        primary = from.left - rect.right;
        secondary = Math.abs(target.y - origin.y);
        break;
      case 'down':
        if (rect.top < from.bottom - NAV_EDGE_TOLERANCE_PX) continue;
        primary = rect.top - from.bottom;
        secondary = Math.abs(target.x - origin.x);
        break;
      case 'up':
        if (rect.bottom > from.top + NAV_EDGE_TOLERANCE_PX) continue;
        primary = from.top - rect.bottom;
        secondary = Math.abs(target.x - origin.x);
        break;
    }

    const score = Math.max(primary, 0) + secondary * NAV_SECONDARY_AXIS_WEIGHT;
    if (score < bestScore) {
      bestScore = score;
      best = el;
    }
  }
  return best;
}

export function focusElement(el: HTMLElement): void {
  el.focus({ preventScroll: true });
  el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
}
