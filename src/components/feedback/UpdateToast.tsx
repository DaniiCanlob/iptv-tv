import { Download, LoaderCircle, RefreshCw, X } from 'lucide-react';
import type { UpdateToastProps } from '../../common/types';

/** Bottom-left notice for desktop updates: progress, "restart to update" or "download". */
export function UpdateToast({ status, onInstall, onDownload, onDismiss }: UpdateToastProps) {
  const buttonClass =
    'flex items-center gap-2 rounded-xl bg-tv-accent px-4 py-2 text-sm font-bold text-tv-bg transition hover:bg-tv-accent-strong focus:scale-105 focus:ring-4 focus:ring-white/60';

  return (
    <div className="fixed bottom-6 left-6 z-30 flex w-96 items-center gap-4 rounded-2xl bg-tv-surface-2 p-4 shadow-2xl shadow-black/60 ring-1 ring-white/10">
      {status.state === 'downloading' ? (
        <>
          <LoaderCircle className="size-6 shrink-0 animate-spin text-tv-accent" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Descargando versión {status.version}</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-tv-accent transition-all" style={{ width: `${status.percent}%` }} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">Nueva versión {status.version}</p>
            <p className="text-xs text-tv-muted">
              {status.state === 'ready' ? 'Lista para instalar.' : 'Descárgala desde GitHub.'}
            </p>
          </div>
          {status.state === 'ready' ? (
            <button type="button" data-nav="" onClick={onInstall} className={buttonClass}>
              <RefreshCw className="size-4" /> Reiniciar
            </button>
          ) : (
            <button type="button" data-nav="" onClick={onDownload} className={buttonClass}>
              <Download className="size-4" /> Descargar
            </button>
          )}
          <button
            type="button"
            data-nav=""
            aria-label="Más tarde"
            title="Más tarde"
            onClick={onDismiss}
            className="grid size-9 shrink-0 place-items-center rounded-full text-tv-muted transition hover:bg-white/10 focus:bg-white/15 focus:text-white"
          >
            <X className="size-4" />
          </button>
        </>
      )}
    </div>
  );
}
