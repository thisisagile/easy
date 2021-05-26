import { Construct, isDefined, ofConstruct } from '../types';

export const ifDefined = <T>(o: unknown, f: Construct<T>, alt?: Construct<T>): T | undefined => isDefined(o) ? ofConstruct(f, o) : ofConstruct(alt, o);