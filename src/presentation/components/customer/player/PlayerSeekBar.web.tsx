import type { PlayerSeekBarProps } from './PlayerSeekBar';
import { CustomerTheme as C } from '@/shared/constants/customerTheme.constants';

export function PlayerSeekBar({ position, duration, onSeek }: PlayerSeekBarProps) {
  const progress = duration ? Math.max(0, Math.min(position / duration * 100, 100)) : 0;
  return <input type="range" className="player-seek-bar" aria-label="Vị trí phát" min={0} max={duration} step={1}
    value={Math.floor(position)} onChange={(event) => onSeek(Number(event.target.value))}
    style={{ background: `linear-gradient(to right, ${C.accent} ${progress}%, ${C.border} ${progress}%)` }} />;
}
