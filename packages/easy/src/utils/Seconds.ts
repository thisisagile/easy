import { ifTrue } from './If';
import { toList } from '../types/List';

export const seconds = {
  toDuration: (s: number = 0) => {
    const seconds = s % 60;
    const minutes = Math.floor(s / 60) % 60;
    const hours = Math.floor(s / 3600) % 24;
    const days = Math.floor(s / 86400);
    return { days, hours, minutes, seconds };
  },

  toText: (s: number = 0) => {
    const { days, hours, minutes, seconds: secs } = seconds.toDuration(s);
    return toList(ifTrue(days, `${days}d`), ifTrue(hours, `${hours}h`), ifTrue(minutes, `${minutes}m`), ifTrue(days + hours + minutes === 0, `${secs}s`))
      .mapDefined(s => s)
      .join(' ');
  },
};
