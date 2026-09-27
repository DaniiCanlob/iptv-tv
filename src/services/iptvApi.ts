import { API_DATASET_KEYS, API_ENDPOINTS } from '../common/constants';
import type { ApiDataset, ApiDatasetKey } from '../common/types';

async function fetchJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Error ${response.status} al cargar ${url}`);
  }
  return (await response.json()) as T;
}

/** Downloads every dataset in parallel, reporting progress as each one arrives. */
export async function fetchApiDataset(
  signal: AbortSignal,
  onProgress: (loaded: number, total: number) => void,
): Promise<ApiDataset> {
  let loaded = 0;
  const total = API_DATASET_KEYS.length;
  onProgress(loaded, total);

  const entries = await Promise.all(
    API_DATASET_KEYS.map(async (key) => {
      const data = await fetchJson<ApiDataset[ApiDatasetKey]>(API_ENDPOINTS[key], signal);
      loaded += 1;
      onProgress(loaded, total);
      return [key, data] as const;
    }),
  );

  return Object.fromEntries(entries) as unknown as ApiDataset;
}
