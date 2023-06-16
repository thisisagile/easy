import { Get } from './Get';
import { isFunc } from './Func';
import { isDefined } from './Is';
import { isPrimitive } from './Primitive';
import { Optional } from './Types';

export type Constructor<T = unknown> = { new (...args: any[]): T };

// export type Construct<T> = Get<T> | Constructor<T>;
export type Construct<Out, In = any> = Get<Out, In> | Constructor<Out>;

export const isConstructor = <T>(c?: unknown): c is Constructor<T> => (isDefined(c) && isFunc<T, unknown>(c) && c.prototype && c.prototype.constructor) === c;

export const ofConstruct = <T>(c: Construct<T>, ...args: unknown[]): T => (isConstructor<T>(c) ? new c(...args) : isFunc<T, unknown>(c) ? c(...args) : c);

export const toName = (subject?: unknown, postfix = ''): string => (subject as any)?.constructor?.name?.replace(postfix, '').toLowerCase() ?? '';

export const on = <T>(t: T, f: (t: T) => unknown): T => {
  f(t);
  return t;
};

export const use = <T, Out>(t: T, f: (t: T) => Out): Out => f(t);

export const ifA = <T>(c: Constructor<T>, t?: unknown, alt?: unknown): Optional<T> => (!isPrimitive(t) && t instanceof c ? t : alt ? ifA(c, alt) : undefined);
