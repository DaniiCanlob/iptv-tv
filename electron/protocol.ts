import { net, protocol } from 'electron';
import { join, normalize, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { APP_SCHEME, CONTENT_SECURITY_POLICY } from './constants';

/** Must run before app 'ready'. `secure` gives the app a secure context (wake lock, media session…). */
export function registerAppScheme(): void {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: APP_SCHEME,
      privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true },
    },
  ]);
}

/** Serves the built React app from disk under app://tv/… */
export function serveRenderer(rendererDir: string): void {
  const root = normalize(rendererDir + sep);

  protocol.handle(APP_SCHEME, async (request) => {
    const { pathname } = new URL(request.url);
    const relative = decodeURIComponent(pathname === '/' ? '/index.html' : pathname);
    const filePath = normalize(join(root, relative));
    if (!filePath.startsWith(root)) return new Response('Forbidden', { status: 403 });

    try {
      const file = await net.fetch(pathToFileURL(filePath).toString());
      const headers = new Headers(file.headers);
      if (filePath.endsWith('.html')) headers.set('Content-Security-Policy', CONTENT_SECURITY_POLICY);
      return new Response(file.body, { status: file.status, headers });
    } catch {
      return new Response('Not found', { status: 404 });
    }
  });
}
