import { ctx, Func, Store } from '../types';
import { Response } from './Response';
import { Request } from './Request';

export class LocalRequestStore implements Store<Response, Request> {
  key = (_req: Request): string => '';

  execute(req: Request, f: Func<Promise<Response>, Request>): Promise<Response> {
    const key = this.key(req);
    return ctx.request.get(key) ?? ctx.request.set(key, f(req));
  }
}
