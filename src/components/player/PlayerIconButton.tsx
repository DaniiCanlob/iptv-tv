import type { PlayerIconButtonProps } from '../../common/types';

export function PlayerIconButton({ icon: Icon, label, onClick, size = 'md' }: PlayerIconButtonProps) {
  const sizing = size === 'sm' ? 'size-9' : 'h-11 gap-2 px-4 text-sm';
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-black/60 font-semibold text-white backdrop-blur transition hover:bg-white/25 focus:bg-tv-accent focus:text-tv-bg ${sizing}`}
    >
      <Icon className={size === 'sm' ? 'size-4' : 'size-5'} />
      {size === 'md' && <span>{label}</span>}
    </button>
  );
}
