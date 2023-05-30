import { Construct, isDefined, isNotEmpty, isTrue, ofConstruct, Optional } from '../types';

export const ifTrue = <T>(o: unknown, f: Construct<T>, alt?: Construct<T>): Optional<T> => (isTrue(o) ? ofConstruct(f, o) : ofConstruct(alt, o));
export const ifFalse = <T>(o: unknown, f: Construct<T>, alt?: Construct<T>): Optional<T> => (!isTrue(o) ? ofConstruct(f, o) : ofConstruct(alt, o));
export const ifDefined = <Out, In = unknown>(o: Optional<In>, f: Construct<Out, NonNullable<In>>, alt?: Construct<Out>): Optional<Out> =>
  isDefined(o) ? ofConstruct(f, o) : ofConstruct(alt);
export const ifNotEmpty = <T>(o: unknown, f: Construct<T> = o => o, alt?: Construct<T>): Optional<T> =>
  isNotEmpty(o) ? ofConstruct(f, o) : ofConstruct(alt, o);
