import type { SidebarItemProps } from '../../common/types';
import { formatNumber } from '../../utils/text';

export function SidebarItem({ icon: Icon, label, count, active, onSelect }: SidebarItemProps) {
  return (
    <button
      type="button"
      data-nav=""
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[0.95rem] transition focus:scale-[1.03] focus:bg-tv-accent focus:text-tv-bg ${
        active ? 'bg-white/10 font-bold text-white' : 'text-white/70'
      }`}
    >
      <Icon className="size-5 shrink-0" strokeWidth={active ? 2.4 : 2} />
      <span className="flex-1 truncate">{label}</span>
      <span className="text-xs tabular-nums opacity-60">{formatNumber(count)}</span>
    </button>
  );
}
