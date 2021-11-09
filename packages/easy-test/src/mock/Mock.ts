import NonFunctionPropertyNames = jest.NonFunctionPropertyNames;
import SpyInstance = jest.SpyInstance;
import Mock = jest.Mock;
import { Id, Json } from '../utils/Types';
import { Req } from '../utils/Req';
import { HttpStatus, Response } from '../utils/Response';

const mockProperty = <T, P extends NonFunctionPropertyNames<Required<T>>>(object: T, getter: P, value: T[P]): SpyInstance =>
  jest.spyOn(object, getter, 'get').mockReturnValue(value);

// export type Mockes = {
//   clear: typeof jest,
//   impl: (f?: (...args: any[]) => any) => Mock,
//   property: <T, P extends NonFunctionPropertyNames<Required<T>>>(object: T, getter: P, value: T[P]) => SpyInstance,
//   reject: (value?: unknown) => Mock,
//   req: {
//     id: (id: Id) => Req,
//     q: (q: unknown) => Req,
//     with: (a: Json) => Req,
//     body: (body: unknown) => Req,
//     path: (path: Json) => Req,
//     query: (query: Json) => Req,
//   },
//   resp: {
//     items: (status: HttpStatus, items?: unknown[]) => Response,
//     errors: (status: HttpStatus, message: string, errors?: unknown[]) => Response
//   },
//   resolve: (value?: unknown) => Mock,
//   return: (value?: unknown) => Mock,
//   this: () => Mock,
//   provider: {
//     data: (...items: any[]) => { execute: Mock }
//   },
//   empty: <T = any>(props?: Partial<T>) => T,
//   date: (epoch?: number) => Date,
//   once: (...values: unknown[]) => Mock
// }

export class Mocks {
  clear = (): typeof jest => jest.clearAllMocks();
  impl = (f?: (...args: any[]) => any): Mock => jest.fn().mockImplementation(f);
  property = mockProperty;
  reject = (value?: unknown): Mock => jest.fn().mockRejectedValue(value);
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
  resolve = (value?: unknown): Mock => jest.fn().mockResolvedValue(value);
  return = (value?: unknown): Mock => jest.fn().mockReturnValue(value);
  this = (): Mock => jest.fn().mockReturnThis();
  provider = {
    data: (...items: any[]): { execute: Mock } => ({
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
  empty = <T = any>(props: Partial<T> = {}): T => props as T;
  date = (epoch = 1621347575): Date => {
    const date = new Date(epoch);
    date.toString = mock.return('Mon Jan 19 1970 19:22:27 GMT+0100 (Central European Standard Time)');
    date.toLocaleDateString = mock.return('19/01/1970');
    date.toDateString = mock.return('19/01/1970');
    return date;
  };
  once = (...values: unknown[]): Mock => values.reduce((m: Mock, v: unknown) => m.mockImplementationOnce(() => v), jest.fn());
}

export const mock = new Mocks();
