import { ChevronDown } from 'lucide-react';
import type { FilterButtonProps } from '../../common/types';

export function FilterButton({ icon: Icon, flag, label, onClick }: FilterButtonProps) {
  return (
    <button
      type="button"
      data-nav=""
      onClick={onClick}
      className="flex items-center gap-2 rounded-2xl bg-tv-surface px-5 py-3 font-semibold ring-1 ring-white/10 transition focus:scale-105 focus:bg-tv-accent focus:text-tv-bg"
    >
      {flag ? <span className="text-xl leading-none">{flag}</span> : <Icon className="size-5" />}
      <span className="max-w-40 truncate">{label}</span>
      <ChevronDown className="size-4 opacity-60" />
    </button>
  );
}
