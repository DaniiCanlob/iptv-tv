import type { NavDirection } from '../types';

export const NAV_ATTR = 'data-nav';
export const NAV_DEFAULT_ATTR = 'data-nav-default';
export const NAV_SCOPE_ATTR = 'data-nav-scope';
export const CHANNEL_ID_ATTR = 'data-channel-id';

/** Pixels an element may overlap the current one and still count as "in that direction". */
export const NAV_EDGE_TOLERANCE_PX = 4;
/** How much the perpendicular offset weighs against distance along the direction. */
export const NAV_SECONDARY_AXIS_WEIGHT = 2.5;

export const ARROW_DIRECTIONS: Record<string, NavDirection> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};
