import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FILTER_ALL } from '../../common/constants';
import type { FilterPickerProps } from '../../common/types';
import { useKeyHandler } from '../../hooks/useKeyHandler';
import { isBackKey } from '../../utils/keys';
import { focusElement } from '../../utils/spatialNavigation';
import { formatNumber, normalizeText } from '../../utils/text';

export function FilterPicker({
  title,
  searchPlaceholder,
  allLabel,
  icon: Icon,
  options,
  selected,
  totalCount,
  onSelect,
  onClose,
}: FilterPickerProps) {
  const [query, setQuery] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => {
    const q = normalizeText(query);
    if (!q) return options;
    return options.filter((o) => normalizeText(`${o.name} ${o.code}`).includes(q));
  }, [options, query]);

  useEffect(() => {
    const target =
      panelRef.current?.querySelector<HTMLElement>(`[data-option="${CSS.escape(selected)}"]`) ??
      panelRef.current?.querySelector<HTMLElement>('[data-option]');
    if (target) focusElement(target);
    // Only on open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useKeyHandler((event) => {
    if (isBackKey(event)) {
      event.preventDefault();
      onClose();
    }
  });

  const itemClass =
    'flex items-center gap-3 rounded-xl px-4 py-3 text-left transition focus:scale-[1.04] focus:bg-tv-accent focus:text-tv-bg';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-10 backdrop-blur-sm">
      <div
        ref={panelRef}
        data-nav-scope=""
        className="flex max-h-full w-full max-w-6xl flex-col rounded-3xl bg-tv-surface p-8 ring-1 ring-white/10"
      >
        <div className="mb-6 flex items-center gap-4">
          <h2 className="flex-1 text-3xl font-extrabold">{title}</h2>
          <label className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-tv-muted" />
            <input
              data-nav=""
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-80 rounded-xl bg-tv-bg py-2.5 pr-4 pl-10 ring-1 ring-white/10 placeholder:text-tv-muted focus:ring-4 focus:ring-tv-accent"
            />
          </label>
          <button type="button" data-nav="" onClick={onClose} className={`${itemClass} bg-white/10`}>
            <X className="size-4" /> Cerrar
          </button>
        </div>
        <div className="no-scrollbar -m-2 grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-2 overflow-y-auto p-2">
          {!query && (
            <button
              type="button"
              data-nav=""
              data-option={FILTER_ALL}
              onClick={() => onSelect(FILTER_ALL)}
              className={`${itemClass} ${selected === FILTER_ALL ? 'bg-white/15 font-bold' : 'bg-white/5'}`}
            >
              <Icon className="size-6 shrink-0" />
              <span className="flex-1 truncate">{allLabel}</span>
              <span className="text-xs opacity-60">{formatNumber(totalCount)}</span>
            </button>
          )}
          {visible.map((option) => (
            <button
              key={option.code}
              type="button"
              data-nav=""
              data-option={option.code}
              onClick={() => onSelect(option.code)}
              className={`${itemClass} ${selected === option.code ? 'bg-white/15 font-bold' : 'bg-white/5'}`}
            >
              {option.flag ? (
                <span className="text-2xl leading-none">{option.flag}</span>
              ) : (
                <Icon className="size-6 shrink-0 opacity-70" />
              )}
              <span className="flex-1 truncate">{option.name}</span>
              <span className="text-xs opacity-60">{formatNumber(option.count)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
