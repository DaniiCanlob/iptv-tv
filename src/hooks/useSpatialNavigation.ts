import { ARROW_DIRECTIONS } from '../common/constants';
import {
  activeNavScope,
  defaultNavTarget,
  findNextFocusable,
  focusElement,
  navCandidates,
} from '../utils/spatialNavigation';
import { isTypingTarget } from '../utils/keys';
import { useKeyHandler } from './useKeyHandler';

/** D-pad / arrow-key focus movement across every [data-nav] element in the active scope. */
export function useSpatialNavigation(enabled: boolean): void {
  useKeyHandler((event) => {
    const direction = ARROW_DIRECTIONS[event.key];
    if (!direction || event.defaultPrevented) return;
    // Let the caret move inside text inputs.
    if (isTypingTarget(event.target) && (direction === 'left' || direction === 'right')) return;

    const scope = activeNavScope();
    const candidates = navCandidates(scope);
    const active = document.activeElement as HTMLElement | null;
    event.preventDefault();

    if (!active || !candidates.includes(active)) {
      const fallback = defaultNavTarget(scope);
      if (fallback) focusElement(fallback);
      return;
    }

    const next = findNextFocusable(active, direction, candidates);
    if (next) focusElement(next);
  }, enabled);
}
