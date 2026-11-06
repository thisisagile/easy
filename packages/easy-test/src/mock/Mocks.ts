import { jest } from '@jest/globals';
import type { PropertyLikeKeys } from 'jest-mock';
import { Id, Json } from '../utils/Types';
import { Req } from '../utils/Req';
import { HttpStatus, Response } from '../utils/Response';

type AnyFunction = (...args: any[]) => any;
export type AnyMock = jest.Mock<AnyFunction>;

export class Mocks {
  req = {
    id: (id: Id): Req => new Req({ id }),
    q: (q: unknown): Req => new Req({ q }),
    with: (a: Json): Req => new Req(a),
    body: <B = unknown>(body: B): Req<B> => new Req<B>({ body }),
    path: (path: Json): Req => new Req({ path }),
    query: (query: Json): Req => new Req({ query }),
  };
  resp = {
    items: (status: HttpStatus, items: unknown[] = []): Response => ({
      status: status,
      body: {
        data: {
          code: status.id as number,
          itemCount: items.length,
          items,
        },
      },
    }),
    errors: (status: HttpStatus, message: string, errors: unknown[] = []): Response => ({
      status: status,
      body: {
        error: {
          code: status.id as number,
          message: message,
          errorCount: errors.length,
          errors,
        },
      },
    }),
  };
  provider = {
    data: (...items: any[]): { execute: AnyMock } => ({
      execute: jest.fn<AnyFunction>().mockResolvedValue({
        body: {
          data: {
            itemCount: items.length,
            items,
          },
        },
      }),
    }),
  };

  static readonly getArg = <T>(mock: unknown, call = 0, arg = 0): T | undefined => {
    if (!isJestMock(mock)) throw new Error('Function provided is not a Jest mock');
    return mock.mock.calls[call]?.[arg] as T;
  };

  clear = (): typeof jest => jest.clearAllMocks();

  impl = (f?: AnyFunction): AnyMock => jest.fn<AnyFunction>(f);

  property = <T extends object, P extends PropertyLikeKeys<T>>(object: T, getter: P, value: Required<T>[P]): jest.SpiedGetter<Required<T>[P]> =>
    jest.spyOn(object, getter, 'get').mockReturnValue(value);

  reject = (value?: unknown): AnyMock => jest.fn<AnyFunction>().mockRejectedValue(value);

  rejectWith = <T = any>(props: Partial<T> = {}): AnyMock => jest.fn<AnyFunction>().mockRejectedValue(mock.a(props));

  resolve = (value?: unknown): AnyMock => jest.fn<AnyFunction>().mockResolvedValue(value);

  resolveWith = <T = any>(props: Partial<T> = {}): AnyMock => jest.fn<AnyFunction>().mockResolvedValue(mock.a(props));

  return = (value?: unknown): AnyMock => jest.fn<AnyFunction>().mockReturnValue(value);

  returnWith = <T = any>(props: Partial<T> = {}): AnyMock => jest.fn<AnyFunction>().mockReturnValue(mock.a(props));

  this = (): AnyMock => jest.fn<AnyFunction>().mockReturnThis();

  empty = <T = any>(props: Partial<T> = {}): T => props as T;
  a = this.empty;
  an = this.empty;
  date = (epoch = 1621347575): Date => {
    const date = new Date(epoch);
    date.toString = mock.return('Mon Jan 19 1970 19:22:27 GMT+0100 (Central European Standard Time)');
    date.toLocaleDateString = mock.return('19/01/1970');
    date.toDateString = mock.return('19/01/1970');
    return date;
  };
  once = (...values: unknown[]): AnyMock => values.reduce((m: AnyMock, v: unknown) => m.mockImplementationOnce(() => v), jest.fn<AnyFunction>());
}

function isJestMock(fn: any): fn is AnyMock {
  return typeof fn === 'function' && 'mock' in fn && Array.isArray(fn.mock?.calls);
}

export const mock = new Mocks();
