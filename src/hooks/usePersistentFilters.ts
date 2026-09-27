import { useEffect, useState } from 'react';
import { DEFAULT_FILTERS, STORAGE_KEY_FILTERS } from '../common/constants';
import type { ChannelFilters } from '../common/types';
import { readStorage, writeStorage } from '../services/storage';

/**
 * Remembers category, country and live toggle between visits.
 * Search text and language are not remembered: every visit starts in DEFAULT_LANGUAGE.
 */
export function usePersistentFilters() {
  const [filters, setFilters] = useState<ChannelFilters>(() => ({
    ...DEFAULT_FILTERS,
    ...readStorage<Partial<ChannelFilters>>(STORAGE_KEY_FILTERS, {}),
    query: DEFAULT_FILTERS.query,
    language: DEFAULT_FILTERS.language,
  }));

  useEffect(() => {
    const { category, country, onlyLive } = filters;
    writeStorage(STORAGE_KEY_FILTERS, { category, country, onlyLive });
  }, [filters]);

  return [filters, setFilters] as const;
}
