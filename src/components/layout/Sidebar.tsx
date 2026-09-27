import { Globe, Star, Tv } from 'lucide-react';
import { FILTER_ALL, FILTER_FAVORITES } from '../../common/constants';
import type { SidebarProps } from '../../common/types';
import { SidebarItem } from './SidebarItem';

export function Sidebar({ categories, totalCount, favoritesCount, selected, onSelect }: SidebarProps) {
  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-tv-line bg-tv-surface/60">
      <div className="flex items-center gap-3 px-6 pt-7 pb-5">
        <span className="grid size-10 place-items-center rounded-xl bg-tv-accent text-tv-bg">
          <Tv className="size-5" strokeWidth={2.4} />
        </span>
        <div>
          <p className="text-lg leading-tight font-extrabold">IPTV TV</p>
          <p className="text-xs text-tv-muted">Canales del mundo</p>
        </div>
      </div>
      <nav className="no-scrollbar flex-1 space-y-1 overflow-y-auto px-3 pb-6">
        <SidebarItem
          icon={Globe}
          label="Todos"
          count={totalCount}
          active={selected === FILTER_ALL}
          onSelect={() => onSelect(FILTER_ALL)}
        />
        <SidebarItem
          icon={Star}
          label="Favoritos"
          count={favoritesCount}
          active={selected === FILTER_FAVORITES}
          onSelect={() => onSelect(FILTER_FAVORITES)}
        />
        <p className="px-3 pt-4 pb-2 text-xs font-semibold tracking-widest text-tv-muted uppercase">
          Categorías
        </p>
        {categories.map((category) => (
          <SidebarItem
            key={category.id}
            icon={category.icon}
            label={category.name}
            count={category.count}
            active={selected === category.id}
            onSelect={() => onSelect(category.id)}
          />
        ))}
      </nav>
    </aside>
  );
}
