import type { LucideIcon } from 'lucide-react';

export interface TvStream {
  url: string;
  title: string;
  quality: string | null;
  qualityValue: number;
  label: string | null;
  needsHeaders: boolean;
  /** Referer the server expects (only sent by the desktop app). */
  referrer: string | null;
  /** User-Agent the server expects (only sent by the desktop app). */
  userAgent: string | null;
}

export interface TvChannel {
  id: string;
  name: string;
  altNames: string[];
  network: string | null;
  owners: string[];
  country: string;
  categories: string[];
  /** ISO 639-3 codes from the channel's feeds (country languages as fallback). */
  languages: string[];
  website: string | null;
  launched: string | null;
  logo: string | null;
  streams: TvStream[];
  bestQuality: string | null;
  searchText: string;
}

export interface TvCountry {
  code: string;
  name: string;
  flag: string;
}

export interface TvLanguage {
  code: string;
  name: string;
}

export interface TvCategory {
  id: string;
  name: string;
}

export interface Catalog {
  channels: TvChannel[];
  byId: Map<string, TvChannel>;
  countries: Map<string, TvCountry>;
  languages: Map<string, TvLanguage>;
  categories: TvCategory[];
}

export interface CountryOption extends TvCountry {
  count: number;
}

export interface LanguageOption extends TvLanguage {
  count: number;
}

/** Generic row for the full-screen filter pickers (country, language…). */
export interface PickerOption {
  code: string;
  name: string;
  /** Emoji flag for countries; null falls back to the picker's icon. */
  flag: string | null;
  count: number;
}

export interface CategoryOption extends TvCategory {
  count: number;
  icon: LucideIcon;
}

export type CatalogState =
  | { status: 'loading'; loaded: number; total: number }
  | { status: 'error'; message: string }
  | { status: 'ready'; catalog: Catalog };
