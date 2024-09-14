import { ifTrue } from './If';
import { toList } from '../types/List';

export const seconds = {
  toDuration: (s: number) => {
    const seconds = s % 60;
    const minutes = Math.floor(s / 60) % 60;
    const hours = Math.floor(s / 3600) % 24;
    const days = Math.floor(s / 86400);
    return { days, hours, minutes, seconds };
  },

  toText: (s: number) => {
    const { days, hours, minutes, seconds: secs } = seconds.toDuration(s);
    return toList(
      ifTrue(days, d => `${d}d`),
      ifTrue(hours, h => `${h}h`),
      ifTrue(minutes, m => `${m}m`),
      ifTrue(days + hours + minutes === 0, `${secs}s`)
    )
      .mapDefined(s => s)
      .join(' ');
  },
};
