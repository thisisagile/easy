import { Constructor, List, meta, Uri } from '../types';
import { HttpVerb } from './HttpVerb';
import { Verb } from './Verb';
import { Req } from './Req';

export const route = (uri: Uri): ClassDecorator => (subject: unknown): void => {
  meta(subject).set('route', uri);
};

export type Endpoint<T = unknown> = (re: Req) => Promise<T | List<T>>;

class Routes {
  constructor(readonly resource: unknown) {}

  get route(): Uri {
    return meta(this.resource).get('route');
  }

  get endpoints(): List<{ verb: HttpVerb; endpoint: Endpoint }> {
    return meta(this.resource)
      .properties('verb')
      .map(p => ({ verb: p.get<Verb>('verb').verb, endpoint: (this.resource as any)[p.property] }));
  }
}

export const routes = (resource: Constructor): Routes => new Routes(new resource());
