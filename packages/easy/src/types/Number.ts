import { Get, ofGet } from './Get';
import { tryTo } from './Try';
import { isNumber } from './Is';
import { asString } from './Text';

export const asNumber = (n: unknown, alt?: Get<number>): number =>
  tryTo(() => asString(n))
    .map(s => parseInt(s))
    .filter(n => isNumber(n))
    .or(ofGet(alt) ?? NaN);
