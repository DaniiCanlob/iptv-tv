import { app } from 'electron';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const GITHUB_PATTERN = /github(?:\.com[:/]|:)([^/]+)\/([^/.#]+)/;

/** "https://github.com/owner/repo/releases/latest" from package.json "repository", or null. */
export function latestReleaseUrl(): string | null {
  try {
    const pkg = JSON.parse(readFileSync(join(app.getAppPath(), 'package.json'), 'utf8')) as {
      repository?: string | { url?: string };
    };
    const raw = typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url;
    const match = raw ? GITHUB_PATTERN.exec(raw) : null;
    return match ? `https://github.com/${match[1]}/${match[2]}/releases/latest` : null;
  } catch {
    return null;
  }
}
