import { Constructor, List, meta, Uri } from '../types';
import { HttpVerb } from './HttpVerb';
import { Verb } from './Verb';
import { Req } from './Req';

export const route = (uri: Uri): ClassDecorator =>
  (subject: Function): void => { meta(subject).set('route', uri); };

export type Endpoint<T> = (re: Req) => Promise<T | List<T>>;

class Routes<T> {
  constructor(readonly resource: unknown) {}

  get route(): Uri { return meta(this.resource).get('route'); }

  get endpoints(): List<{ verb: HttpVerb, endpoint: Endpoint<T> }> {
    return meta(this.resource).properties('verb')
      .map(p => ({ verb: p.get<Verb>('verb').verb, endpoint: (this.resource as any)[p.property] }));
  }
}

export const routes = <T>(resource: Constructor<T>) => new Routes<T>(new resource());
