import { Maximize2, Pause, PictureInPicture2, Play, X } from 'lucide-react';
import type { PlayerMiniControlsProps } from '../../common/types';
import { volumeIcon } from '../../utils/volume';
import { CountryFlag } from '../feedback/CountryFlag';
import { PlayerIconButton } from './PlayerIconButton';

export function PlayerMiniControls({
  channel,
  country,
  pip,
  volume,
  pause,
  onExpand,
  onClose,
}: PlayerMiniControlsProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/90 to-transparent px-3 pt-8 pb-2.5">
      <CountryFlag flag={country?.flag} className="text-lg" />
      <span className="min-w-0 flex-1 truncate text-sm font-bold">{channel.name}</span>
      <PlayerIconButton
        icon={pause.paused ? Play : Pause}
        label={pause.paused ? 'Reproducir' : 'Pausar'}
        size="sm"
        onClick={pause.toggle}
      />
      <PlayerIconButton
        icon={volumeIcon(volume.volume, volume.muted)}
        label={volume.muted ? 'Activar sonido' : 'Silenciar'}
        size="sm"
        onClick={volume.toggleMute}
      />
      <PlayerIconButton icon={Maximize2} label="Expandir" size="sm" onClick={onExpand} />
      {pip.supported && (
        <PlayerIconButton icon={PictureInPicture2} label="Ventana flotante" size="sm" onClick={pip.toggle} />
      )}
      <PlayerIconButton icon={X} label="Cerrar" size="sm" onClick={onClose} />
    </div>
  );
}
