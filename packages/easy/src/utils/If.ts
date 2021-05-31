import { Construct, isDefined, isNotEmpty, ofConstruct } from '../types';

export const ifDefined = <T>(o: unknown, f: Construct<T>, alt?: Construct<T>): T | undefined => isDefined(o) ? ofConstruct(f, o) : ofConstruct(alt, o);
export const ifNotEmpty = <T>(o: unknown, f: Construct<T>, alt?: Construct<T>): T | undefined => isNotEmpty(o) ? ofConstruct(f, o) : ofConstruct(alt, o);