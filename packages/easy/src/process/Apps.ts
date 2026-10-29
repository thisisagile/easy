import { lazyRegistry, type Registry } from '../types/Registry';
import { Enum as Scope } from './Scope';

export class Enum extends Scope {
  constructor(name: string) {
    super(name);
  }
}

export const create = (name: string): Enum => new Enum(name);

export const Main = /* @__PURE__ */ create('Main');

const registry = /* @__PURE__ */ lazyRegistry(() => ({ Main }));
export const all: Registry<Enum>['all'] = () => registry.all();
export const byId: Registry<Enum>['byId'] = (id, alt) => registry.byId(id, alt);
export const byIds: Registry<Enum>['byIds'] = ids => registry.byIds(ids);
export const filter: Registry<Enum>['filter'] = (predicate, params) => registry.filter(predicate, params);
export const first: Registry<Enum>['first'] = (predicate, params) => registry.first(predicate, params);
