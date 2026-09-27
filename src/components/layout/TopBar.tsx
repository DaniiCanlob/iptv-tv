import { Search } from 'lucide-react';
import { ALL_COUNTRIES_ICON, LANGUAGE_ICON } from '../../common/constants';
import type { TopBarProps } from '../../common/types';
import { formatNumber } from '../../utils/text';
import { FilterButton } from '../filters/FilterButton';

export function TopBar({
  filters,
  resultCount,
  country,
  language,
  onQueryChange,
  onOpenCountries,
  onOpenLanguages,
  onToggleLive,
}: TopBarProps) {
  return (
    <header className="flex shrink-0 items-center gap-4 px-8 pt-6">
      <label className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-tv-muted" />
        <input
          id="channel-search"
          data-nav=""
          type="search"
          value={filters.query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar canal, red o alias…"
          className="w-full rounded-2xl bg-tv-surface py-3 pr-4 pl-12 text-base ring-1 ring-white/10 transition placeholder:text-tv-muted focus:bg-tv-surface-2 focus:ring-4 focus:ring-tv-accent"
        />
      </label>
      <FilterButton
        icon={ALL_COUNTRIES_ICON}
        flag={country?.flag}
        label={country?.name ?? 'Todos los países'}
        onClick={onOpenCountries}
      />
      <FilterButton
        icon={LANGUAGE_ICON}
        label={language?.name ?? 'Todos los idiomas'}
        onClick={onOpenLanguages}
      />
      <button
        type="button"
        data-nav=""
        aria-pressed={filters.onlyLive}
        onClick={onToggleLive}
        className="flex items-center gap-3 rounded-2xl bg-tv-surface px-5 py-3 font-semibold ring-1 ring-white/10 transition focus:scale-105 focus:bg-tv-accent focus:text-tv-bg"
      >
        <span
          className={`relative h-6 w-11 rounded-full transition ${filters.onlyLive ? 'bg-tv-live' : 'bg-white/20'}`}
        >
          <span
            className={`absolute top-1 size-4 rounded-full bg-white transition-all ${filters.onlyLive ? 'left-6' : 'left-1'}`}
          />
        </span>
        Solo en vivo
      </button>
      <span className="w-32 shrink-0 text-right text-sm text-tv-muted tabular-nums">
        {formatNumber(resultCount)} canales
      </span>
    </header>
  );
}
