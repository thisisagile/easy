import { Constructor, List, meta, Uri } from '../types';
import { HttpVerb } from './HttpVerb';
import { Verb } from './Verb';
import { Req } from './Req';

export const route = (uri: Uri): ClassDecorator =>
  (subject: Function): void => { meta(subject).set('route', uri); };

export type Endpoint<T> = (re: Req) => Promise<T | List<T>>;

class Router<T> {
  constructor(readonly resource: unknown) {}

  get route(): Uri { return meta(this.resource).get('route'); }

  get endpoints(): List<{ verb: HttpVerb, f: Endpoint<T> }> {
    return meta(this.resource).properties('verb')
      .map(p => ({ verb: p.get<Verb>('verb').verb, f: (this.resource as any)[p.property] }));
  }
}

export const router = <T>(resource: Constructor<T>) => new Router<T>(new resource());
