import { Globe, Languages, type LucideIcon } from 'lucide-react';
import type { ChannelFilters } from '../types';

export const FILTER_ALL = 'all';
export const FILTER_FAVORITES = 'favorites';
/** ISO 639-3 code the app always starts with (Spanish). */
export const DEFAULT_LANGUAGE = 'spa';

export const DEFAULT_FILTERS: ChannelFilters = {
  category: FILTER_ALL,
  country: FILTER_ALL,
  language: DEFAULT_LANGUAGE,
  query: '',
  onlyLive: true,
};

export const UI_LOCALE = 'es';

export const ALL_COUNTRIES_ICON: LucideIcon = Globe;
export const LANGUAGE_ICON: LucideIcon = Languages;
