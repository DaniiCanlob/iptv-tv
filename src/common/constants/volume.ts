import type { VolumeState } from '../types';

export const DEFAULT_VOLUME: VolumeState = { volume: 0.8, muted: false };
/** Change per key press / wheel notch (5%). */
export const VOLUME_STEP = 0.05;
export const VOLUME_HUD_TIMEOUT_MS = 1800;
