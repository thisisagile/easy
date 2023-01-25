import { Construct, isDefined, isNotEmpty, isTrue, ofConstruct, Optional } from '../types';

export const ifTrue = <T>(o: unknown, f: Construct<T>, alt?: Construct<T>): Optional<T> => (isTrue(o) ? ofConstruct(f, o) : ofConstruct(alt, o));
export const ifFalse = <T>(o: unknown, f: Construct<T>, alt?: Construct<T>): Optional<T> => (!isTrue(o) ? ofConstruct(f, o) : ofConstruct(alt, o));
export const ifDefined = <T>(o: unknown, f: Construct<T>, alt?: Construct<T>): Optional<T> => (isDefined(o) ? ofConstruct(f, o) : ofConstruct(alt, o));
export const ifNotEmpty = <T>(o: unknown, f: Construct<T> = o => o, alt?: Construct<T>): Optional<T> =>
  isNotEmpty(o) ? ofConstruct(f, o) : ofConstruct(alt, o);
