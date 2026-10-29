import { Enum as EasyEnum } from './Enum';
import { lazyRegistry, type Registry } from './Registry';

export class Enum extends EasyEnum {
  constructor(name: string, id: string) {
    super(name, id);
  }
}

export const create = (name: string, id: string): Enum => new Enum(name, id);

export const Dev = /* @__PURE__ */ new Enum('Development', 'dev');
export const Tst = /* @__PURE__ */ new Enum('Test', 'tst');
export const Acc = /* @__PURE__ */ new Enum('Acceptance', 'acc');
export const Prd = /* @__PURE__ */ new Enum('Production', 'prd');

const registry = /* @__PURE__ */ lazyRegistry(() => ({ Dev, Tst, Acc, Prd }));
export const all: Registry<Enum>['all'] = () => registry.all();
export const byId: Registry<Enum>['byId'] = (id, alt) => registry.byId(id, alt);
export const byIds: Registry<Enum>['byIds'] = ids => registry.byIds(ids);
export const filter: Registry<Enum>['filter'] = (predicate, params) => registry.filter(predicate, params);
export const first: Registry<Enum>['first'] = (predicate, params) => registry.first(predicate, params);
