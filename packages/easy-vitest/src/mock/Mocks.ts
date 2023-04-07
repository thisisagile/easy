import { Id, Json, Properties } from '../utils/Types';
import { Req } from '../utils/Req';
import { HttpStatus, Response } from '../utils/Response';
import { Mock, vi } from 'vitest';

export class Mocks {
  clear = (): typeof vi => vi.clearAllMocks();
  impl = <A extends any[] = any, R = any>(f?: (...args: A) => R) => (f ? vi.fn<A, R>(f) : vi.fn<A, R>());
  property = <T, G extends Properties<Required<T>>>(object: T, getter: G, value: T[G]) => vi.spyOn(object, getter, 'get').mockReturnValue(value);
  reject = (value?: unknown) => vi.fn<any, any>().mockRejectedValue(value);
  rejectWith = <T = any>(props: Partial<T> = {}) => vi.fn<any, Promise<any>>().mockRejectedValue(mock.a(props));
  req = {
    id: (id: Id): Req => new Req({ id }),
    q: (q: unknown): Req => new Req({ q }),
    with: (a: Json): Req => new Req(a),
    body: (body: unknown): Req => new Req({ body }),
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
  resolve = <T = any>(value?: T): Mock<any, Promise<T>> => vi.fn().mockResolvedValue(value);
  resolveWith = <T = any>(props: Partial<T> = {}): Mock<any, Promise<T>> => vi.fn().mockResolvedValue(mock.a(props));
  return = <T = any>(value?: T): Mock<any, T> => vi.fn().mockReturnValue(value);
  returnWith = <T = any>(props: Partial<T> = {}) => vi.fn<any, T>().mockReturnValue(mock.a(props));
  this = () => vi.fn().mockReturnThis();
  provider = {
    data: (...items: any[]): { execute: Mock } => ({
      execute: this.resolve({
        body: {
          data: {
            itemCount: items.length,
            items,
          },
        },
      }),
    }),
  };
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
  once = <T = any>(...values: T[]) => values.reduce((m, v) => m.mockImplementationOnce(() => v), vi.fn<any, T>());
}

export const mock = new Mocks();
