// Bundles the Electron main process (ESM) and preload (CommonJS, required by sandboxed preloads)
// into dist-electron/ using Vite's bundler, so no extra build tool is needed.
import { builtinModules } from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const external = [
  'electron',
  'electron-updater',
  ...builtinModules,
  ...builtinModules.map((name) => `node:${name}`),
];

const targets = [
  { entry: 'electron/main.ts', fileName: 'main.js', format: 'es' },
  { entry: 'electron/preload.ts', fileName: 'preload.cjs', format: 'cjs' },
];

export async function buildElectron({ mode = 'production' } = {}) {
  for (const [index, target] of targets.entries()) {
    await build({
      root,
      mode,
      configFile: false,
      publicDir: false,
      logLevel: 'warn',
      build: {
        ssr: target.entry,
        outDir: 'dist-electron',
        emptyOutDir: index === 0,
        target: 'node22',
        minify: false,
        sourcemap: mode !== 'production',
        rolldownOptions: {
          external,
          output: { format: target.format, entryFileNames: target.fileName },
        },
      },
    });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await buildElectron();
  console.log('✓ Electron main + preload → dist-electron/');
}
