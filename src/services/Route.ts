import { List, meta, Uri } from '../types';
import { HttpVerb } from './HttpVerb';
import { Verb } from './Verb';
import { Req } from './Req';

export type Endpoint = (re: Req) => Promise<unknown | List<unknown>>;

export const route = (uri: Uri): ClassDecorator =>
  (subject: Function): void => { meta(subject).set('route', uri); };

class Router {
  constructor(readonly resource: unknown) {}

  get route(): Uri { return meta(this.resource).get('route'); }

  get endpoints(): List<{ verb: HttpVerb, f: Endpoint }> {
    return meta(this.resource).properties('verb')
      .map(p => ({ verb: p.get<Verb>('verb').verb, f: (this.resource as any)[p.property] }));
  }
}

export const router = (resource: unknown) => new Router(resource);
