import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));

/** dist-electron/ → the Vite build lives next to it in dist/. */
export const RENDERER_DIR = join(here, '..', 'dist');
export const PRELOAD_PATH = join(here, 'preload.cjs');
