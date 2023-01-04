import { Construct, isDefined, isNotEmpty, isTrue, ofConstruct } from '../types';

export const ifTrue = <T>(o: unknown, f: Construct<T>, alt?: Construct<T>): T | undefined => (isTrue(o) ? ofConstruct(f, o) : ofConstruct(alt, o));
export const ifFalse = <T>(o: unknown, f: Construct<T>, alt?: Construct<T>): T | undefined => (!isTrue(o) ? ofConstruct(f, o) : ofConstruct(alt, o));
export const ifDefined = <T>(o: unknown, f: Construct<T>, alt?: Construct<T>): T | undefined => (isDefined(o) ? ofConstruct(f, o) : ofConstruct(alt, o));
export const ifNotEmpty = <T>(o: unknown, f: Construct<T> = o => o, alt?: Construct<T>): T | undefined =>
  isNotEmpty(o) ? ofConstruct(f, o) : ofConstruct(alt, o);
