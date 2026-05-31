import { entries, ifTrue, OneOrMore, Optional, toArray } from '@thisisagile/easy';

export const toClasses = (styles: Record<string, string>, classes: OneOrMore<string>, props: Record<string, Optional<boolean>>): string =>
  [...toArray(classes).map(c => styles[c]), ...entries(props).map(([key, val]) => ifTrue(val, styles[key]))].filter(Boolean).join(' ');
