import { Id, Json } from '../utils/Types';
import { Req } from '../utils/Req';
import { HttpStatus, Response } from '../utils/Response';

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
    data: (...items: any[]): { execute: jest.Mock } => ({
      execute: jest.fn().mockResolvedValue({
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

  impl = (f?: (...args: any[]) => any): jest.Mock => jest.fn().mockImplementation(f);

  property = <T extends object, P extends jest.NonFunctionPropertyNames<Required<T>>>(object: T, getter: P, value: T[P]): jest.SpyInstance =>
    jest.spyOn(object, getter, 'get' as jest.PropertyAccessors<P, T>).mockReturnValue(value as any);

  reject = (value?: unknown): jest.Mock => jest.fn().mockRejectedValue(value);

  rejectWith = <T = any>(props: Partial<T> = {}): jest.Mock => jest.fn().mockRejectedValue(mock.a(props));

  resolve = (value?: unknown): jest.Mock => jest.fn().mockResolvedValue(value);

  resolveWith = <T = any>(props: Partial<T> = {}): jest.Mock => jest.fn().mockResolvedValue(mock.a(props));

  return = (value?: unknown): jest.Mock => jest.fn().mockReturnValue(value);

  returnWith = <T = any>(props: Partial<T> = {}): jest.Mock => jest.fn().mockReturnValue(mock.a(props));

  this = (): jest.Mock => jest.fn().mockReturnThis();

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
  once = (...values: unknown[]): jest.Mock => values.reduce((m: jest.Mock, v: unknown) => m.mockImplementationOnce(() => v), jest.fn());
}

function isJestMock(fn: any): fn is jest.Mock {
  return typeof fn === 'function' && 'mock' in fn && Array.isArray(fn.mock?.calls);
}

export const mock = new Mocks();
