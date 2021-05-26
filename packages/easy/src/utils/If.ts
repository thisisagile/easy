import { Construct, isDefined, ofConstruct } from '../types';

export const ifDefined = <T>(o: unknown, f: Construct<T>): T | undefined => isDefined(o) ? ofConstruct(f, o) : undefined;