export interface ChannelFilters {
  /** 'all' | 'favorites' | category id */
  category: string;
  /** 'all' | ISO country code */
  country: string;
  /** 'all' | ISO 639-3 language code */
  language: string;
  query: string;
  onlyLive: boolean;
}
