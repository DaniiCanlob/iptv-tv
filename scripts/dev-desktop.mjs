// `pnpm dev:desktop`: Vite dev server (hot reload for the UI) + Electron window pointing at it.
// Changes under electron/ need a restart of this command.
import { spawn } from 'node:child_process';
import electronPath from 'electron';
import { createServer } from 'vite';
import { buildElectron } from './build-electron.mjs';

await buildElectron({ mode: 'development' });

const server = await createServer();
await server.listen();
const url = server.resolvedUrls?.local[0];
if (!url) throw new Error('Vite dev server did not report a URL');
server.printUrls();

// Extra CLI args go to Electron, e.g. `pnpm dev:desktop --no-sandbox` on Linux as root.
const child = spawn(electronPath, ['.', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, VITE_DEV_SERVER_URL: url.replace(/\/$/, '') },
});

const shutdown = async (code = 0) => {
  await server.close();
  process.exit(code);
};
child.on('exit', (code) => void shutdown(code ?? 0));
process.on('SIGINT', () => child.kill());
process.on('SIGTERM', () => child.kill());
