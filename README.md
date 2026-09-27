# IPTV TV

App de televisión (estilo "10-foot", navegable con control remoto / flechas) que consume la API pública de [iptv-org](https://github.com/iptv-org/api). Funciona como **app de escritorio** (Windows, macOS, Linux) con actualizaciones automáticas, y también como página web.

**Stack:** React 19.3 · Vite 8.3 · Tailwind CSS 4.3 · TypeScript · hls.js · [Lucide](https://lucide.dev/icons/) · Electron 44 · electron-builder · electron-updater

## Uso

```bash
pnpm install

pnpm dev:desktop   # app de escritorio con recarga en caliente (cambios en electron/ → reiniciar)
pnpm dev           # versión web en http://localhost:5173

pnpm dist          # instalador para TU sistema en release/ (sin publicar)
```

> `pnpm-workspace.yaml` (pnpm 11) usa `nodeLinker: hoisted`, porque electron-builder necesita un `node_modules` plano, y en `allowBuilds` autoriza que Electron descargue su binario al instalar.

## App de escritorio

La versión de escritorio reproduce señales que el navegador bloquea:

| Bloqueo | Navegador | Escritorio |
|---|---|---|
| CORS | Bloqueado | Se agrega `Access-Control-Allow-Origin` a las respuestas de las señales |
| Señales `http` | Bloqueadas en `https` | Permitidas |
| `Referer` / `User-Agent` exigidos | No se pueden enviar | Se envían los que indica iptv-org para cada señal |
| User-Agent "Electron" | — | Se muestra como Chrome normal |
| Pantalla siempre activa | Solo en `https` | Nativa del sistema |
| Bloqueo por país | — | Cada usuario ve desde su propia conexión |

Código en `electron/`:

```
electron/
  main.ts          ciclo de vida de la app
  window.ts        ventana principal, enlaces externos, F11
  protocol.ts      sirve la app desde app://tv (contexto seguro + CSP)
  network.ts       CORS, Referer/User-Agent por señal, User-Agent limpio
  power.ts         pantalla siempre activa
  updater.ts       actualizaciones automáticas (GitHub Releases)
  preload.ts       puente seguro → window.desktop (tipos en src/common/types/desktop.ts)
  ipc.ts, ipcChannels.ts, menu.ts, constants.ts, paths.ts, repository.ts
scripts/
  build-electron.mjs   compila main (ESM) y preload (CJS) con Vite
  dev-desktop.mjs      Vite + Electron en desarrollo
```

## Publicar una versión (actualizaciones automáticas)

**Una sola vez:**
1. Crea un repositorio **público** en GitHub (las apps instaladas descargan las actualizaciones de ahí sin credenciales).
2. `package.json` ya apunta a `"repository": "github:DaniiCanlob/iptv-tv"`.
3. Sube el proyecto (incluido `pnpm-lock.yaml`).

**Cada versión nueva:**
```bash
npm version patch           # 1.0.0 → 1.0.1 (crea el commit y la etiqueta v1.0.1)
git push --follow-tags
```

GitHub Actions (`.github/workflows/release.yml`) compila en Windows, macOS y Linux y publica en GitHub Releases:

| Sistema | Archivo | Actualización |
|---|---|---|
| Windows | `IPTV-TV-Setup-x.y.z.exe` | Automática: se descarga sola y se instala al reiniciar |
| Linux | `IPTV-TV-x.y.z-x86_64.AppImage` | Automática |
| Linux | `.deb` | Aviso con botón "Descargar" |
| macOS | `.dmg` (Intel + Apple Silicon) | Aviso con botón "Descargar" (auto-instalar exige firma de Apple, USD 99/año) |

La app busca actualizaciones 10 s después de abrir y luego cada 4 horas.

**Sin certificados de firma:**
- Windows muestra "Windows protegió su PC" → *Más información → Ejecutar de todas formas*.
- macOS: la primera vez, clic derecho sobre la app → *Abrir*.

## Endpoints que usa

| Endpoint | Para qué |
|---|---|
| `channels.json` | Catálogo (se excluyen canales NSFW y cerrados) |
| `streams.json` | URLs de reproducción (.m3u8), ordenadas: sin cabeceras especiales → https → mejor calidad |
| `feeds.json` | Idiomas de cada canal (se usa el feed principal primero; si no hay feed, los idiomas del país) |
| `languages.json` | Nombres de idiomas (traducidos con `Intl.DisplayNames`) |
| `logos.json` | Mejor logo por canal (en uso, sin feed, mayor ancho) |
| `countries.json` | Bandera y nombre del país (traducido con `Intl.DisplayNames`) |
| `categories.json` | Categorías del menú lateral (traducidas en `common/constants/categories.ts`) |

## Controles

| Tecla / botón del control | Guía | Reproductor | Mini reproductor |
|---|---|---|---|
| Flechas / D-pad | Mover el foco | ▲▼ cambiar canal · **◀▶ volumen** | (se navega la guía) |
| OK / Enter | Ver canal | Mostrar info | — |
| Atrás / Esc | Cerrar selector | **Minimizar** | Cerrar |
| I / Info | — | Mostrar info | Expandir |
| P | — | Ventana flotante | Ventana flotante |
| M / Silencio | — | Silenciar / activar sonido | Silenciar / activar sonido |
| + / − / Vol+ / Vol− / rueda del mouse | — | Subir / bajar volumen (5%) | — |
| X / Stop | — | Cerrar | Cerrar |
| F / botón rojo | Favorito | Favorito | — |
| / | Buscar | — | — |
| Z / doble clic | — | Pantalla completa | — |
| CH+ / CH− / PageUp / PageDown | — | Cambiar canal | — |

En celular: **desliza hacia abajo** el video para minimizarlo; toca el mini reproductor para expandirlo.

## Volumen

Barra deslizante con botón de silencio en la parte superior del reproductor, indicador vertical estilo TV al cambiarlo con el control o la rueda, y botón de silencio en el mini reproductor. El nivel se recuerda entre canales y visitas. Si el navegador silencia el video por la política de autoreproducción, la app lo muestra como silenciado pero no guarda ese silencio.

> En iPhone/iPad Safari no deja cambiar el volumen desde la página (solo silenciar); ahí se usan los botones físicos del teléfono.

## Reproducción en segundo plano

- **Mini reproductor:** al minimizar, el video sigue en una esquina mientras navegas la guía (el stream no se recarga).
- **Ventana flotante (Picture-in-Picture):** el video queda encima de cualquier otra app. Al abrirla, la app pasa sola al mini reproductor.
- **Automática al salir de la app:** se registra la acción `enterpictureinpicture` de Media Session (Chrome) y el atributo `autopictureinpicture` (Safari). Que se active sola depende del navegador y de su versión.
- **Pantalla siempre activa:** mientras un canal se reproduce se pide un Screen Wake Lock para que la pantalla no se apague.
- **Controles del sistema:** título, logo y botones siguiente/anterior (cambian de canal) en la notificación y la pantalla de bloqueo.

> Wake Lock solo funciona en contexto seguro (`https://` o `localhost`). Si abres la app en el celular por IP (`http://192.168.x.x:5173`), la ventana flotante funciona pero la pantalla puede apagarse.

## Estructura

```
src/
  common/types/        tipos (API, catálogo, filtros, props de componentes)
  common/constants/    endpoints, teclas, categorías, UI, storage
  services/            fetch de la API, construcción del catálogo, localStorage
  utils/               filtros, navegación espacial, texto, teclas
  hooks/               useCatalog, useSpatialNavigation, useHlsPlayer, useFavorites…
  components/          layout, channels, player, filters, feedback
  features/home/       pantalla principal (TvHome)
  features/updates/    aviso de actualización (solo escritorio)
```

## Notas

- Si una señal no arranca en 12 s o se congela, el reproductor intenta recuperarla y luego pasa a la siguiente del mismo canal; la pantalla "Sin señal" indica el motivo.
- En la **versión web** siguen aplicando los bloqueos del navegador (CORS, `http` en páginas `https`, cabeceras); la app de escritorio no los tiene.
- Las señales caídas (404) y los formatos que el equipo no puede decodificar no tienen solución desde la app.
- Favoritos y filtros se guardan en `localStorage`.
