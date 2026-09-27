import { useCallback, useEffect, useState } from 'react';
import { API_DATASET_KEYS } from '../common/constants';
import type { CatalogState } from '../common/types';
import { buildCatalog } from '../services/catalogBuilder';
import { fetchApiDataset } from '../services/iptvApi';

export function useCatalog(): { state: CatalogState; retry: () => void } {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<CatalogState>({
    status: 'loading',
    loaded: 0,
    total: API_DATASET_KEYS.length,
  });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading', loaded: 0, total: API_DATASET_KEYS.length });

    fetchApiDataset(controller.signal, (loaded, total) => {
      if (!controller.signal.aborted) setState({ status: 'loading', loaded, total });
    })
      .then((dataset) => {
        if (!controller.signal.aborted) setState({ status: 'ready', catalog: buildCatalog(dataset) });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : 'Error desconocido';
        setState({ status: 'error', message });
      });

    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { state, retry };
}
