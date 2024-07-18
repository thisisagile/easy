import { asNumber } from './Number';
import { choose } from './Case';
import { asString } from './Text';

export type CacheAge = `${number}${'ms' | 's' | 'm' | 'h' | 'd'}` | number;

const ageNumber = (s: string): number => asNumber(s.replace(/[a-z]/g, ''));

export const cacheAge = {
  toMilliseconds: (ca: CacheAge): number =>
    choose(asString(ca))
      .case(
        c => c.endsWith('ms'),
        c => ageNumber(c)
      )
      .case(
        c => c.endsWith('s'),
        c => ageNumber(c) * 1000
      )
      .case(
        c => c.endsWith('m'),
        c => ageNumber(c) * 60 * 1000
      )
      .case(
        c => c.endsWith('h'),
        c => ageNumber(c) * 3600 * 1000
      )
      .case(
        c => c.endsWith('d'),
        c => ageNumber(c) * 24 * 3600 * 1000
      )
      .else(ca as number),

  toSeconds: (ca: CacheAge): number =>
    choose(asString(ca))
      .case(
        c => c.endsWith('ms'),
        c => ageNumber(c) / 1000
      )
      .case(
        c => c.endsWith('s'),
        c => ageNumber(c)
      )
      .case(
        c => c.endsWith('m'),
        c => ageNumber(c) * 60
      )
      .case(
        c => c.endsWith('h'),
        c => ageNumber(c) * 3600
      )
      .case(
        c => c.endsWith('d'),
        c => ageNumber(c) * 24 * 3600
      )
      .else(ca as number),
};
