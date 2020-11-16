import { meta, Uri } from '../types';
import { HttpVerb } from './HttpVerb';
import { Verb } from './Verb';
import { List } from '../types/List';

export const route = (uri: Uri): ClassDecorator =>
  (subject: Function): void => { meta(subject).set('route', uri); };

class Router {
  constructor(readonly resource: unknown) {}

  get route(): Uri { return meta(this.resource).get('route'); }

  get verbs(): List<{ verb: HttpVerb, f: Function }> {
    return meta(this.resource).properties('verb')
      .map(p => ({ verb: p.get<Verb>('verb').verb, f: () => p.property }));
  }
}

export const router = (resource: unknown) => new Router(resource);
