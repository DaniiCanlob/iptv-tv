import { Menu } from 'electron';

/** No menu bar on Windows/Linux; macOS keeps the standard app/edit/window menus (Cmd+Q, copy/paste). */
export function configureMenu(): void {
  if (process.platform !== 'darwin') {
    Menu.setApplicationMenu(null);
    return;
  }
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([{ role: 'appMenu' }, { role: 'editMenu' }, { role: 'windowMenu' }]),
  );
}
