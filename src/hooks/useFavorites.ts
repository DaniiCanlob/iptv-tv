import { useCallback, useState } from 'react';
import { STORAGE_KEY_FAVORITES } from '../common/constants';
import { readStorage, writeStorage } from '../services/storage';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(
    () => new Set(readStorage<string[]>(STORAGE_KEY_FAVORITES, [])),
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      writeStorage(STORAGE_KEY_FAVORITES, [...next]);
      return next;
    });
  }, []);

  return { favorites, toggleFavorite };
}
