import { powerSaveBlocker } from 'electron';

let blockerId: number | null = null;

/** Keeps the display on while a channel plays (works everywhere, unlike the web Wake Lock). */
export function setKeepAwake(keepAwake: boolean): void {
  if (keepAwake && blockerId === null) {
    blockerId = powerSaveBlocker.start('prevent-display-sleep');
  } else if (!keepAwake && blockerId !== null) {
    powerSaveBlocker.stop(blockerId);
    blockerId = null;
  }
}
