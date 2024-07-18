import { isDefined, isNotEmpty, isTrue } from '../types/Is';
import { Optional } from '../types/Types';
import { Construct, ofConstruct } from '../types/Constructor';

export function ifTrue<Out, In = unknown>(o: unknown, f: Construct<Out, NonNullable<In>>, alt: Construct<Out>): Out;
export function ifTrue<Out, In = unknown>(o: unknown, f: Construct<Out, NonNullable<In>>, alt?: Construct<Out>): Optional<Out>;
export function ifTrue<Out, In = unknown>(o: unknown, f: Construct<Out, NonNullable<In>>, alt?: Construct<Out>): Optional<Out> {
  return isTrue(o) ? ofConstruct(f, o) : ofConstruct(alt, o);
}

export function ifFalse<Out, In = unknown>(o: unknown, f: Construct<Out, NonNullable<In>>, alt: Construct<Out>): Out;
export function ifFalse<Out, In = unknown>(o: unknown, f: Construct<Out, NonNullable<In>>, alt?: Construct<Out>): Optional<Out>;
export function ifFalse<Out, In = unknown>(o: unknown, f: Construct<Out, NonNullable<In>>, alt?: Construct<Out>): Optional<Out> {
  return !isTrue(o) ? ofConstruct(f, o) : ofConstruct(alt, o);
}

export function ifDefined<Out, In = unknown>(o: Optional<In>, f: Construct<Out, NonNullable<In>>, alt: Construct<Out>): Out;
export function ifDefined<Out, In = unknown>(o: Optional<In>, f: Construct<Out, NonNullable<In>>, alt?: Construct<Out>): Optional<Out>;
export function ifDefined<Out, In = unknown>(o: Optional<In>, f: Construct<Out, NonNullable<In>>, alt?: Construct<Out>): Optional<Out> {
  return isDefined(o) ? ofConstruct(f, o) : ofConstruct(alt);
}

export function ifNotEmpty<Out, In = unknown>(o: In, f: Construct<Out, NonNullable<In>>, alt: Construct<Out>): Out;
export function ifNotEmpty<Out, In = unknown>(o: In, f?: Construct<Out, NonNullable<In>>, alt?: Construct<Out>): Optional<Out>;
export function ifNotEmpty<Out, In = unknown>(o: In, f: Construct<Out, NonNullable<In>>, alt?: Construct<Out>): Optional<Out>;
export function ifNotEmpty<Out, In = unknown>(o: In, f: Construct<Out, NonNullable<In>> = o => o as Out, alt?: Construct<Out>): Optional<Out> {
  return isNotEmpty(o) ? ofConstruct(f, o) : ofConstruct(alt, o);
}
