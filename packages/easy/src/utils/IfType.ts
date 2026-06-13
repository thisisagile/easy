import { isArray, isBoolean, isNumber, isObject, isString } from '../types/Is';
import { Optional } from '../types/Types';
import { Construct, ofConstruct } from '../types/Constructor';

export function ifType<Out, T>(o: unknown, predicate: (o: unknown) => o is T, f: Construct<Out, T>, alt: Construct<Out>): Out;
export function ifType<Out, T>(o: unknown, predicate: (o: unknown) => o is T, f: Construct<Out, T>, alt?: Construct<Out>): Optional<Out>;
export function ifType<Out, T>(o: unknown, predicate: (o: unknown) => o is T, f: Construct<Out, T>, alt?: Construct<Out>): Optional<Out> {
  return predicate(o) ? ofConstruct(f, o) : ofConstruct(alt);
}

export function ifString<Out>(o: unknown, f: Construct<Out, string>, alt: Construct<Out>): Out;
export function ifString<Out>(o: unknown, f: Construct<Out, string>, alt?: Construct<Out>): Optional<Out>;
export function ifString<Out>(o: unknown, f: Construct<Out, string>, alt?: Construct<Out>): Optional<Out> {
  return ifType(o, isString, f, alt);
}

export function ifNumber<Out>(o: unknown, f: Construct<Out, number>, alt: Construct<Out>): Out;
export function ifNumber<Out>(o: unknown, f: Construct<Out, number>, alt?: Construct<Out>): Optional<Out>;
export function ifNumber<Out>(o: unknown, f: Construct<Out, number>, alt?: Construct<Out>): Optional<Out> {
  return ifType(o, isNumber, f, alt);
}

export function ifBoolean<Out>(o: unknown, f: Construct<Out, boolean>, alt: Construct<Out>): Out;
export function ifBoolean<Out>(o: unknown, f: Construct<Out, boolean>, alt?: Construct<Out>): Optional<Out>;
export function ifBoolean<Out>(o: unknown, f: Construct<Out, boolean>, alt?: Construct<Out>): Optional<Out> {
  return ifType(o, isBoolean, f, alt);
}

export function ifArray<Out, T = unknown>(o: unknown, f: Construct<Out, T[]>, alt: Construct<Out>): Out;
export function ifArray<Out, T = unknown>(o: unknown, f: Construct<Out, T[]>, alt?: Construct<Out>): Optional<Out>;
export function ifArray<Out, T = unknown>(o: unknown, f: Construct<Out, T[]>, alt?: Construct<Out>): Optional<Out> {
  return ifType(o, isArray, f, alt);
}

export function ifObject<Out>(o: unknown, f: Construct<Out, Record<string, unknown>>, alt: Construct<Out>): Out;
export function ifObject<Out>(o: unknown, f: Construct<Out, Record<string, unknown>>, alt?: Construct<Out>): Optional<Out>;
export function ifObject<Out>(o: unknown, f: Construct<Out, Record<string, unknown>>, alt?: Construct<Out>): Optional<Out> {
  return ifType(o, isObject, f, alt);
}
